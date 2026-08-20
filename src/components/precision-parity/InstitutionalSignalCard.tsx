// Precision Parity AI — Institutional Parity Signal Card.
// Displays the institutional ParitySignal contract, probability intervals, EV hurdle, entry timing, and stake tier.

import { useState } from "react";
import type { ParitySignal } from "@/lib/precision-parity/types";
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  TrendingUp,
  Target,
  Sparkles,
  Layers,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  signal: ParitySignal;
}

export function InstitutionalSignalCard({ signal }: Props) {
  const [copied, setCopied] = useState(false);

  const isTrade = signal.verdict === "TRADE";
  const isWait = signal.verdict === "WAIT";
  const isNoTrade = signal.verdict === "NO_TRADE";

  const isEven = signal.contract === "DIGITEVEN";
  const isOdd = signal.contract === "DIGITODD";

  const themeColor = isTrade
    ? isEven
      ? "var(--bull, #10b981)"
      : "var(--accent, #6366f1)"
    : isWait
      ? "#f59e0b"
      : "#64748b";

  const handleCopy = () => {
    const text = `[PRECISION PARITY SIGNAL]\nSymbol: ${signal.symbol}\nVerdict: ${signal.verdict}\nContract: ${signal.contract}${signal.barrier !== undefined ? ` (Barrier ${signal.barrier})` : ""}\nTiming: ${signal.entry.timing} (${signal.entry.condition})\nProbability: ${(signal.probability.point * 100).toFixed(1)}% [95% CI: ${(signal.probability.lower * 100).toFixed(1)}% - ${(signal.probability.upper * 100).toFixed(1)}%, N=${signal.probability.sampleSize}]\nExpected Value: +${(signal.expectedValue * 100).toFixed(1)}%\nConfidence: ${signal.confidence}%\nStake Tier: Tier ${signal.stake.tier} (${signal.stake.suggested.toFixed(2)} units)`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="institutional-parity-signal-card"
      className={cn(
        "rounded-2xl border p-5 sm:p-6 transition-all relative overflow-hidden backdrop-blur-md",
        isTrade
          ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-900/90 shadow-lg shadow-emerald-500/5"
          : isWait
            ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-slate-900/90"
            : "border-slate-800 bg-slate-900/60",
      )}
    >
      {/* Top Bar: Verdict Badge, Symbol, Contract, Timing Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "px-3.5 py-1.5 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-sm",
              isTrade
                ? "bg-emerald-500 text-slate-950 shadow-emerald-500/30"
                : isWait
                  ? "bg-amber-500 text-slate-950 shadow-amber-500/30"
                  : "bg-slate-800 text-slate-400 border border-slate-700",
            )}
          >
            {isTrade && <Sparkles className="w-3.5 h-3.5 fill-current" />}
            {isWait && <Clock className="w-3.5 h-3.5" />}
            {isNoTrade && <ShieldAlert className="w-3.5 h-3.5" />}
            <span>{signal.verdict}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white tracking-wide">{signal.symbol}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
              {signal.contract}
              {signal.barrier !== undefined ? ` [${signal.barrier}]` : ""}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Timing condition badge */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border",
              signal.entry.timing === "NOW"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                : signal.entry.timing === "NEXT_TICK"
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                  : "bg-amber-500/20 text-amber-300 border-amber-500/40",
            )}
          >
            <Clock className="w-3 h-3" />
            <span>Entry: {signal.entry.timing}</span>
            <span className="text-[10px] opacity-70">({signal.entry.expiresInTicks}t exp)</span>
          </div>

          <button
            onClick={handleCopy}
            title="Copy Signal Payload"
            className="p-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Actionable English Timing Condition */}
      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-white/10 flex items-start gap-2.5">
        <Target className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-200 leading-relaxed font-sans">
          <span className="font-semibold text-white">Actionable Rule: </span>
          {signal.entry.condition}
        </div>
      </div>

      {/* Core Quantitative Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Wilson Confidence Interval */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Wilson 95% Bound
          </div>
          <div className="text-base font-bold text-white font-mono mt-0.5 flex items-baseline gap-1">
            <span>{(signal.probability.lower * 100).toFixed(1)}%</span>
            <span className="text-xs text-slate-400 font-normal">LB</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Point: {(signal.probability.point * 100).toFixed(1)}% (N={signal.probability.sampleSize}
            )
          </div>
        </div>

        {/* Expected Value per Unit */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Expected Value (EV)
          </div>
          <div
            className={cn(
              "text-base font-bold font-mono mt-0.5",
              signal.expectedValue > 0 ? "text-emerald-400" : "text-slate-400",
            )}
          >
            {signal.expectedValue > 0 ? "+" : ""}
            {(signal.expectedValue * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Payout: {signal.payout.toFixed(2)}:1 (Breakeven{" "}
            {((1 / (1 + signal.payout)) * 100).toFixed(1)}%)
          </div>
        </div>

        {/* Calibrated Confidence */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Calibrated Conf.
          </div>
          <div className="text-base font-bold text-indigo-300 font-mono mt-0.5 flex items-baseline gap-1">
            <span>{signal.confidence}%</span>
            <span className="text-xs text-slate-400 font-normal">Isotonic</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Shrinkage calibrated</div>
        </div>

        {/* Stake Sizing Tier */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Stake Sizing
          </div>
          <div className="text-base font-bold text-amber-300 font-mono mt-0.5 flex items-baseline gap-1">
            <span>Tier {signal.stake.tier}</span>
            <span className="text-xs text-slate-400 font-normal">
              ({signal.stake.suggested.toFixed(2)}u)
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate">
            {signal.stake.capReason ?? "1/4-Kelly fraction"}
          </div>
        </div>
      </div>

      {/* Analytical Narrative */}
      {signal.narrative && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-slate-300 leading-relaxed italic">{signal.narrative}</p>
        </div>
      )}
    </div>
  );
}
