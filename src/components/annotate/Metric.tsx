import type { Ref } from "react";

interface MetricProps {
    ref?: Ref<HTMLSpanElement>;
    /** Digits to pad to, e.g. 3 renders 7 as "007". */
    pad?: number;
    suffix?: string;
    className?: string;
}

/** A tabular mono number. Drive it with `countTo` from lib/annotate. */
const Metric = ({ ref, pad = 0, suffix = "", className = "" }: MetricProps) => (
    <span className={`font-mono tabular-nums ${className}`}>
        <span ref={ref}>{"0".padStart(pad, "0")}</span>
        {suffix}
    </span>
);

export default Metric;
