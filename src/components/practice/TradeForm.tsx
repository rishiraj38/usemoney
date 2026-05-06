"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  sector: string;
}

const popularStocks: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2845.3, change: 1.24, sector: "Energy" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 3560.15, change: -0.45, sector: "IT" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1678.9, change: 0.68, sector: "Banking" },
  { symbol: "INFY", name: "Infosys", price: 1432.55, change: 1.12, sector: "IT" },
  { symbol: "ITC", name: "ITC Ltd", price: 428.75, change: -0.32, sector: "FMCG" },
  { symbol: "SBIN", name: "State Bank of India", price: 756.4, change: 2.15, sector: "Banking" },
  { symbol: "TATASTEEL", name: "Tata Steel", price: 142.8, change: 0.95, sector: "Metals" },
  { symbol: "ADANIENT", name: "Adani Enterprises", price: 2890.35, change: 3.21, sector: "Infra" },
];

export default function TradeForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [target, setTarget] = useState("");
  const [notes, setNotes] = useState("");

  const filteredStocks = popularStocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    // In production, this would call the API
    alert(
      `Paper trade placed!\n${tradeType} ${quantity} shares of ${selectedStock?.symbol} at ₹${selectedStock?.price}`
    );
    handleReset();
  };

  const handleReset = () => {
    setSelectedStock(null);
    setQuantity("");
    setStopLoss("");
    setTarget("");
    setNotes("");
    setIsOpen(false);
  };

  const estimatedValue =
    selectedStock && quantity
      ? selectedStock.price * parseInt(quantity || "0")
      : 0;

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="btn-primary cursor-pointer"
        id="new-trade-btn"
      >
        <Plus size={18} />
        New Paper Trade
      </motion.button>

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={handleReset}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">
                Place Paper Trade
              </h3>
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Stock Search */}
              {!selectedStock ? (
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                    Search Stock
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or symbol..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-800/60 border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-brand-500/30"
                      autoFocus
                      id="stock-search-input"
                    />
                  </div>
                  <div className="mt-3 space-y-1 max-h-60 overflow-y-auto">
                    {filteredStocks.map((stock) => (
                      <button
                        key={stock.symbol}
                        onClick={() => {
                          setSelectedStock(stock);
                          setSearchQuery("");
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center text-xs font-bold text-brand-400">
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-white group-hover:text-brand-400 transition-colors">
                              {stock.symbol}
                            </div>
                            <div className="text-xs text-slate-500">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono text-white">
                            ₹{stock.price.toLocaleString("en-IN")}
                          </div>
                          <div
                            className={`text-xs font-mono ${
                              stock.change >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)}%
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Selected Stock */}
                  <div className="flex items-center justify-between bg-navy-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-sm font-bold text-brand-400">
                        {selectedStock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {selectedStock.symbol}
                        </div>
                        <div className="text-xs text-slate-500">
                          {selectedStock.name}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-2">
                        <div className="text-sm font-mono font-semibold text-white">
                          ₹{selectedStock.price.toLocaleString("en-IN")}
                        </div>
                        <div
                          className={`text-xs font-mono ${
                            selectedStock.change >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {selectedStock.change >= 0 ? "+" : ""}
                          {selectedStock.change.toFixed(2)}%
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedStock(null)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* BUY / SELL Toggle */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                      Trade Type
                    </label>
                    <div className="flex gap-2">
                      {(["BUY", "SELL"] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setTradeType(type)}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                            tradeType === type
                              ? type === "BUY"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-navy-800/50 text-slate-400 border border-white/5 hover:border-white/10"
                          }`}
                        >
                          {type === "BUY" ? (
                            <ArrowUpRight size={16} />
                          ) : (
                            <ArrowDownRight size={16} />
                          )}
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter number of shares"
                      className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-brand-500/30 font-mono"
                      min="1"
                      id="quantity-input"
                    />
                    {quantity && (
                      <div className="text-xs text-slate-500 mt-1.5">
                        Estimated Value:{" "}
                        <span className="text-white font-mono">
                          ₹{estimatedValue.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SL & Target */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                        Stop Loss
                      </label>
                      <input
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(e.target.value)}
                        placeholder="₹ Price"
                        className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-white/5 text-red-400 text-sm placeholder:text-slate-600 focus:outline-none focus:border-red-500/30 font-mono"
                        id="stop-loss-input"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                        Target
                      </label>
                      <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="₹ Price"
                        className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-white/5 text-green-400 text-sm placeholder:text-slate-600 focus:outline-none focus:border-green-500/30 font-mono"
                        id="target-input"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-xs text-slate-500 uppercase tracking-wider mb-2 block">
                      Trade Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Why are you taking this trade?"
                      className="w-full px-4 py-3 rounded-xl bg-navy-800/60 border border-white/5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-brand-500/30 resize-none h-20"
                      id="trade-notes-input"
                    />
                  </div>

                  {/* Info Banner */}
                  <div className="flex items-start gap-2 bg-accent-500/5 border border-accent-500/10 rounded-xl p-3">
                    <AlertCircle
                      size={16}
                      className="text-accent-400 mt-0.5 flex-shrink-0"
                    />
                    <p className="text-xs text-slate-400">
                      This is a paper trade — no real money will be used. Prices
                      are based on live market data.
                    </p>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={!quantity || parseInt(quantity) < 1}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      tradeType === "BUY"
                        ? "bg-green-500 hover:bg-green-600 text-white disabled:bg-green-500/30 disabled:text-green-400/50"
                        : "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-500/30 disabled:text-red-400/50"
                    } disabled:cursor-not-allowed`}
                    id="submit-trade-btn"
                  >
                    {tradeType === "BUY" ? "Buy" : "Sell"}{" "}
                    {quantity || "0"} shares of {selectedStock.symbol}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
