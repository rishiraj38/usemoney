"use client";

const stocks = [
  { sym: "NIFTY 50", price: "22,456.80", chg: "+0.85%", up: true },
  { sym: "SENSEX", price: "73,890.45", chg: "+0.92%", up: true },
  { sym: "RELIANCE", price: "2,845.30", chg: "+1.24%", up: true },
  { sym: "TCS", price: "3,560.15", chg: "-0.45%", up: false },
  { sym: "HDFC BANK", price: "1,678.90", chg: "+0.68%", up: true },
  { sym: "INFY", price: "1,432.55", chg: "+1.12%", up: true },
  { sym: "ITC", price: "428.75", chg: "-0.32%", up: false },
  { sym: "SBIN", price: "756.40", chg: "+2.15%", up: true },
  { sym: "TATASTEEL", price: "142.80", chg: "+0.95%", up: true },
  { sym: "WIPRO", price: "412.60", chg: "-0.78%", up: false },
  { sym: "ADANIENT", price: "2,890.35", chg: "+3.21%", up: true },
  { sym: "NIFTY BANK", price: "48,234.10", chg: "+1.05%", up: true },
];

export default function StockTicker() {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        borderBottom: "1px solid #1f2937",
        background: "#111827",
        padding: "10px 0",
      }}
    >
      <div className="animate-ticker" style={{ display: "flex", whiteSpace: "nowrap" }}>
        {[...stocks, ...stocks].map((s, i) => (
          <div
            key={`${s.sym}-${i}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "0 20px",
              borderRight: "1px solid #1f2937",
            }}
          >
            <span className="mono" style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>{s.sym}</span>
            <span className="mono" style={{ fontSize: 11, fontWeight: 600, color: "#f1f5f9" }}>{s.price}</span>
            <span className="mono" style={{ fontSize: 11, fontWeight: 500, color: s.up ? "#22c55e" : "#ef4444" }}>{s.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
