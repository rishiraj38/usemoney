# Proactive Tracking & User Notification System

## The Problem

Users on a trading app like UseMoney shouldn't need to sit glued to their screen watching prices. The platform should do that for them, keep an eye on their positions, watchlist, portfolio health, and ping them when something actually needs their attention.

So basically: track stuff in the background, figure out what matters, and tell the user at the right time through the right channel.

## What do we track?

I broke this down into three buckets based on how urgently the user needs to know.

**Urgent stuff (notify immediately):**
- Price hitting stop loss or target
- Stop loss getting close (like within 2% of triggering)
- An order getting filled by the broker
- Margin running low

These need to reach the user in seconds. We use push notifications + in-app alerts for these.

**Somewhat urgent (within a few minutes is fine):**
- A stock on the watchlist hitting a price the user set
- Portfolio getting too concentrated in one stock or sector (like 45% in banking, that's risky)
- Big volume spike on a stock the user holds

For these, in-app notification is enough. Push if the user opted in.

**Not urgent (can batch these):**
- Daily P&L summary after market closes
- Weekly performance report
- Market open/close reminders
- Dividend dates coming up

These go in email digests or just sit in the notification inbox.

## High-Level Architecture

The system has three main pieces:

```
[Market Data Feed] → [Tracking Engine] → [Notification Dispatcher]
```

**Market Data Feed**, we get live price data via WebSocket from a market data provider. This is a stream of price ticks coming in continuously during market hours.

**Tracking Engine**, this is the brain. It takes each price tick (or periodic portfolio snapshot) and checks it against all the rules users have set up. If any rule matches, it creates a notification.

**Notification Dispatcher**, takes the notification and delivers it through the right channels (in-app, push, email, SMS). Uses a queue so delivery doesn't block the tracking engine.

### Why separate these three?

If push notification delivery is slow (FCM having a bad day), I don't want it to slow down price checking. By putting a queue between tracking and delivery, they work independently. Also, adding a new notification channel (say Telegram) later doesn't require touching the tracking logic at all.

## How the Tracking Engine works

### Price monitoring (the fast path)

This runs on every price tick. Has to be really fast.

When a user creates a rule like "alert me if RELIANCE goes below ₹2,700", we store that rule in Redis (not Postgres; too slow for this). The key is structured so we can quickly look up all rules for a given stock symbol.

On each price tick:
1. Get the symbol (e.g., RELIANCE) and current price from the tick
2. Look up Redis: are there any active rules for RELIANCE?
3. For each rule, check if the condition is met
4. If yes, create a notification and push it to the dispatch queue
5. Also set a cooldown so we don't spam the same alert

The cooldown part is important. If RELIANCE is hovering around ₹2,700, bouncing between ₹2,698 and ₹2,702, without a cooldown the user would get dozens of alerts in a minute. I default the cooldown to 5 minutes. After firing once, the rule won't fire again for 5 minutes.

### Portfolio checks (runs every few minutes)

Some things don't need real-time checking. Like portfolio concentration; if one stock slowly becomes 40% of your portfolio, it doesn't matter if we catch it on the exact tick. Checking every 5 minutes is plenty.

So a cron job runs every 5 minutes:
1. For each user with open positions, calculate current allocation per stock/sector
2. Compare against thresholds (e.g., single stock > 35% = warning)
3. If any threshold crossed, create a notification

### Scheduled reports (just cron jobs)

Daily summary at 3:30 PM (after market close), weekly report on Sunday morning. Nothing fancy, just scheduled jobs that gather data, render a template, and send.

## Notification Delivery

Each notification has a priority: critical, important, or info.

Critical goes through immediately. Important gets processed within 30 seconds. Info gets batched every 5 minutes.

I'd use BullMQ (a Redis-backed job queue) for this because:
- It supports priority natively
- Has retry with backoff built in, so if FCM fails, try again in 30s, then 60s, then 120s
- Dead letter queue for stuff that keeps failing; we can look at these later
- There's a dashboard (Bull Board) to see queue health

### Picking the right channel

Not every notification should go everywhere.

- **In-app**: basically everything goes here
- **Push notification**: critical + important stuff, if user enabled it
- **Email**: only for digests and reports
- **SMS**: only for truly critical stuff (SL hit, margin call) because SMS costs money

Also, quiet hours. If a user says "don't disturb me between 10 PM and 8 AM", we still store the notification in-app but we don't buzz their phone.

```
function pickChannels(notification, userPrefs) {
  channels = ['in_app']  // always

  if (notification.priority != 'info' && userPrefs.pushEnabled)
    channels.add('push')

  if (notification.type is digest/report && userPrefs.emailEnabled)
    channels.add('email')

  if (notification.priority == 'critical' && userPrefs.smsEnabled)
    channels.add('sms')

  if (isQuietHours(userPrefs))
    return ['in_app']  // downgrade everything to silent

  return channels
}
```

## Database Design

Three main tables:

### tracking_rules
Stores what each user wants to track.

| Column | Type | What it is |
|--------|------|-----------|
| id | UUID | primary key |
| user_id | UUID | who created this rule |
| rule_type | string | PRICE_ALERT, STOP_LOSS, CONCENTRATION, etc. |
| symbol | string | which stock (null for portfolio-level rules) |
| condition | JSON | e.g. { "operator": "<=", "value": 2700 } |
| priority | string | critical / important / info |
| channels | array | which channels to use |
| cooldown_sec | int | seconds to wait before re-firing (default 300) |
| is_active | boolean | can be paused |
| last_fired_at | timestamp | when it last triggered |
| fire_count | int | how many times it has triggered |

Index on (symbol, is_active) because the hot path queries by symbol.

### notifications
Every notification that was created.

| Column | Type | What it is |
|--------|------|-----------|
| id | UUID | primary key |
| user_id | UUID | who gets this |
| rule_id | UUID | which rule triggered it (nullable) |
| type | string | STOP_LOSS, PRICE_ALERT, etc. |
| title | string | "Stop Loss Warning: RELIANCE" |
| message | text | the full message |
| priority | string | critical / important / info |
| read | boolean | has the user seen it |
| status | string | CREATED, QUEUED, DELIVERED, or FAILED |
| delivery_log | JSON | per-channel delivery status |
| created_at | timestamp | when |

Index on (user_id, read) for the "show unread" query, and (user_id, created_at DESC) for the notification feed.

### notification_preferences
One row per user. Toggles for each channel and notification type, quiet hours config, digest preferences.

## API Endpoints

```
POST   /api/tracking/rules         → create a new rule
GET    /api/tracking/rules         → list my rules
PATCH  /api/tracking/rules/:id     → edit or pause a rule
DELETE /api/tracking/rules/:id     → remove a rule

GET    /api/notifications          → list my notifications (paginated)
PATCH  /api/notifications/:id/read → mark one as read
POST   /api/notifications/read-all → mark all as read
GET    /api/notifications/unread-count → for the badge

GET    /api/notifications/preferences → get my settings
PUT    /api/notifications/preferences → update settings
```

## Real-time delivery

For in-app notifications, we use WebSocket. When the user has the app open, they maintain a WS connection. When a notification is created for them, the server pushes it down the socket immediately. No polling needed.

If the user is offline, the notification just sits in the database and they see it next time they open the app (plus they might get a push notification on their phone).

## Things I thought about

**Why Redis for rule lookup?**
Price ticks come in fast. During market hours, we might process hundreds of ticks per second across all symbols. Hitting Postgres for each one would be way too slow. Redis gives near-instant lookups. Postgres is still the source of truth; when a user creates/edits a rule, it goes to Postgres first, then gets synced to Redis.

**Why not check portfolio stuff in real-time too?**
Because it's wasteful. Portfolio concentration only changes when prices move significantly or when a trade happens. Checking every 5 minutes catches everything important without burning CPU on every price tick.

**Why BullMQ over something like Kafka?**
At our scale, Kafka is overkill. BullMQ gives us everything we need (priorities, retries, dead letter queue) and it runs on Redis which we already have. If we ever need to handle millions of users, that's when we'd consider Kafka.

**What about abuse?**
Need to limit how many rules a user can create. Free tier maybe 10 rules, premium maybe 100. Otherwise someone could create thousands of rules and tank the system.

**Scaling later**
The current design works fine for a few thousand users on a single server. If we grow significantly:
- Shard price monitoring by symbol across multiple workers
- Add read replicas for the notification feed queries
- The queue-based architecture means we can scale workers independently

But honestly, this design handles way more than an early-stage startup needs. No point over-engineering it.
