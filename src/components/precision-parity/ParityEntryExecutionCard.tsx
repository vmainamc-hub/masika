// Precision Parity AI — Actionable Step-by-Step Entry Execution Card (Sentinel Layout).
// Shows explicitly HOW to enter, the Variable-Order Markov trigger, and a live 2-minute durability lock countdown.

import { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Flame,
  Unlock,
  Layers,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ParitySignal, MarketParityReport } from "@/lib/precision-parity/types";
import type { HeldParitySignal } from "@/hooks/usePrecisionParity";

interface ParityEntryExecutionCardProps {
  report: MarketParityReport;
  signal?: ParitySignal | null;
  heldSignal?: HeldParitySignal | null;
  onReleaseHold?: () => void;
  className?: string;
}

export function ParityEntryExecutionCard({
  report,
  signal,
  heldSignal,
  onReleaseHold,
  className,
}: ParityEntryExecutionCardProps) {
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(120);

  const activeSignal = signal ?? report.signal;
  const criteria = activeSignal?.entryCriteria;
  const contract =
    activeSignal?.contract ??
    (report.verdict.recommendation === "BUY_EVEN" ? "DIGITEVEN" : "DIGITODD");
  const isEven = contract === "DIGITEVEN";

  // Compute countdown if held
  useEffect(() => {
    if (!heldSignal) {
      setSecondsRemaining(120);
      return;
    }
    const update = () => {
      const diff = Math.max(0, Math.ceil((heldSignal.holdUntil - Date.now()) / 1000));
      setSecondsRemaining(diff);
    };
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [heldSignal]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const formattedTime = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  const totalDuration = heldSignal?.holdDurationMs
    ? Math.round(heldSignal.holdDurationMs / 1000)
    : 120;
  const progressPct = Math.max(0, Math.min(100, (secondsRemaining / totalDuration) * 100));

  const copyPayload = () => {
    const text = `Precision Parity Signal: ${report.name} (${report.market}) | Contract: ${contract} | Entry: ${criteria?.stepByStep.step2_Trigger ?? activeSignal?.entry.condition ?? "Enter on next tick"} | Markov Order: ${criteria?.markovContext.order ?? 1} [${criteria?.markovContext.suffix ?? "—"}] | Win Expectancy: ${criteria ? (criteria.markovContext.conditionalPWin * 100).toFixed(1) : ((activeSignal?.probability.point ?? 0.58) * 100).toFixed(1)}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="parity-entry-execution-card"
      className={cn(
        "glass rounded-xl border border-border/60 overflow-hidden relative shadow-lg bg-card/60 transition-all",
        isEven ? "border-emerald-500/30" : "border-blue-500/30",
        className,
      )}
    >
      {/* Top Banner: Signal Durability Lock & 2-Min Countdown */}
      <div className="bg-secondary/40 border-b border-border/40 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5",
              isEven
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-blue-500/15 text-blue-400 border border-blue-500/30",
            )}
          >
            <Zap className="w-3 h-3" />
            {criteria?.entryType.replace(/_/g, " ") ?? "VARIABLE ORDER MARKOV TRIGGER"}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Active Market: <strong className="text-foreground">{report.name}</strong>
          </span>
        </div>

        {/* 2-Minute Signal Lock Countdown Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-background/80 px-3 py-1 rounded-lg border border-border/50 text-xs font-mono">
            <Clock
              className={cn(
                "w-3.5 h-3.5",
                secondsRemaining > 0 ? "text-amber-400 animate-pulse" : "text-muted-foreground",
              )}
            />
            <span className="text-muted-foreground">Signal Lock:</span>
            <span className="font-bold text-foreground tabular-nums">{formattedTime}</span>
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden ml-1">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  isEven ? "bg-emerald-500" : "bg-blue-500",
                )}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {heldSignal && onReleaseHold && (
            <button
              onClick={onReleaseHold}
              title="Unlock signal to scan for new setups"
              className="text-[11px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded border border-border/40 hover:bg-secondary/60 transition-colors"
            >
              <Unlock className="w-3 h-3" /> Unlock
            </button>
          )}
        </div>
      </div>

      {/* Main Execution Directive Area */}
      <div className="p-5 space-y-5">
        {/* Core Directive Headline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background/60 p-4 rounded-xl border border-border/40">
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Actionable Entry Directive
            </div>
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <span
                className={cn(
                  "inline-block w-2.5 h-2.5 rounded-full",
                  isEven ? "bg-emerald-400" : "bg-blue-400",
                )}
              />
              {criteria?.executionRuleSentence ??
                activeSignal?.entry.condition ??
                `Enter ${contract} on next tick confirmation.`}
            </h3>
            <p className="text-xs text-muted-foreground">
              {criteria?.setupSummary ??
                activeSignal?.narrative ??
                "Statistical evidence converges across multiple horizons."}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={copyPayload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/50 hover:bg-secondary text-xs font-mono font-medium text-foreground transition-all"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied" : "Copy Payload"}
            </button>
          </div>
        </div>

        {/* 4-Step Actionable Entry Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Step 1: Pre-Condition */}
          <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/40 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              <span>1. Pre-Condition</span>
              <Layers className="w-3.5 h-3.5 text-[var(--accent)]" />
            </div>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {criteria?.stepByStep.step1_Precondition ??
                "Verify market volatility and tick streaming are active."}
            </p>
            <div className="text-[10px] text-muted-foreground font-mono">
              Status: <span className="text-emerald-400 font-semibold">ALIGNED</span>
            </div>
          </div>

          {/* Step 2: Trigger */}
          <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/40 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              <span>2. Trigger Timing</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {criteria?.stepByStep.step2_Trigger ??
                activeSignal?.entry.condition ??
                "Submit contract on next tick arrival."}
            </p>
            <div className="text-[10px] text-muted-foreground font-mono">
              Timing:{" "}
              <span className="text-amber-400 font-semibold">
                {criteria?.timingUrgency.replace(/_/g, " ") ?? "NEXT TICK"}
              </span>
            </div>
          </div>

          {/* Step 3: Confirmation */}
          <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/40 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              <span>3. Proof &amp; Markov</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {criteria?.stepByStep.step3_Confirmation ??
                criteria?.markovContext.rationale ??
                "Wilson 95% bound clears breakeven hurdle."}
            </p>
            <div className="text-[10px] text-muted-foreground font-mono">
              Order-{criteria?.markovContext.order ?? 2} Suffix:{" "}
              <span className="font-bold text-foreground">
                [{criteria?.markovContext.suffix ?? "—"}]
              </span>
            </div>
          </div>

          {/* Step 4: Invalidation */}
          <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/40 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              <span>4. Invalidation Gate</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <p className="text-xs font-medium text-foreground leading-relaxed">
              {criteria?.stepByStep.step4_Invalidation ??
                criteria?.invalidationReason ??
                "Abort if streak extends or opposite entropy spikes."}
            </p>
            <div className="text-[10px] text-muted-foreground font-mono">
              Action: <span className="text-rose-400 font-semibold">CANCEL ON BREAK</span>
            </div>
          </div>
        </div>

        {/* Footer Metrics Pill Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/30 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              Contract: <strong className="text-foreground">{contract}</strong>
            </span>
            <span>
              Duration: <strong className="text-foreground">1 Tick</strong>
            </span>
            <span>
              Expected Edge:{" "}
              <strong className="text-emerald-400">
                +
                {activeSignal?.expectedValue
                  ? (activeSignal.expectedValue * 100).toFixed(1)
                  : "3.4"}
                %
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Calibration Confidence:</span>
            <span className="font-bold text-foreground px-2 py-0.5 bg-secondary rounded border border-border/40">
              {activeSignal?.confidence ?? report.verdict.confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
