import type { ReactNode } from "react";
import { RotateCcw } from "lucide-react";

interface DemoFrameProps {
    title: string;
    /** Short live status, e.g. "running" / "awaiting approval". */
    status: string;
    busy?: boolean;
    onReplay?: () => void;
    children: ReactNode;
}

/** The window every case-file demo lives in: mono title bar, status, replay. */
export const DemoFrame = ({ title, status, busy = false, onReplay, children }: DemoFrameProps) => (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="truncate text-white/50">{title}</span>
            <span className="flex shrink-0 items-center gap-3">
                <span className="flex items-center gap-2 text-white/40" aria-live="polite">
                    <span className={`size-1.5 rounded-full ${busy ? "animate-pulse bg-gold" : "bg-white/30"}`} />
                    {status}
                </span>
                {onReplay && (
                    <button
                        type="button"
                        onClick={onReplay}
                        data-cursor="replay"
                        aria-label="Replay demo"
                        className="rounded-full border border-white/15 p-1.5 text-white/50 transition-colors hover:border-gold/60 hover:text-white"
                    >
                        <RotateCcw className="size-3" aria-hidden />
                    </button>
                )}
            </span>
        </div>
        <div className="relative min-h-0 flex-1 overflow-hidden p-4 sm:p-6">{children}</div>
    </div>
);

interface BarProps {
    label: string;
    value: number;
    /** Stronger colour for the winning class. */
    top?: boolean;
    delay?: number;
    className?: string;
}

/** A labelled probability bar; width transitions when `value` changes. */
export const Bar = ({ label, value, top = false, delay = 0, className = "" }: BarProps) => (
    <span className={`grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_2.75rem] items-center gap-3 font-mono text-[11px] ${className}`}>
        <span className={`truncate transition-colors duration-500 ${top ? "text-white" : "text-white/45"}`}>{label}</span>
        <span className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <span
                className={`block h-full rounded-full transition-[width,background-color] duration-700 ease-out ${top ? "bg-gold" : "bg-white/30"}`}
                style={{ width: `${Math.round(value * 100)}%`, transitionDelay: `${delay}ms` }}
            />
        </span>
        <span className={`text-right tabular-nums transition-colors duration-500 ${top ? "text-gold" : "text-white/40"}`}>
            {value.toFixed(2)}
        </span>
    </span>
);

/** The small gold tag used for verdicts, matching DetectionBox labels. */
export const Tag = ({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "ember" | "muted" }) => (
    <span
        className={`inline-block whitespace-nowrap px-1.5 py-px font-mono text-[10px] leading-3.5 tracking-[0.06em]
            ${tone === "gold" ? "bg-gold text-ink" : tone === "ember" ? "bg-ember text-white" : "bg-white/10 text-white/60"}`}
    >
        {children}
    </span>
);
