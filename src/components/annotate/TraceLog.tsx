export type TraceLine = {
    text: string;
    status?: string;
};

interface TraceLogProps {
    lines: TraceLine[];
    className?: string;
}

/**
 * A model/agent style log. Lines are rendered visible; animate them in by
 * targeting `[data-trace-line]` (and `[data-trace-status]`) from a timeline.
 */
const TraceLog = ({ lines, className = "" }: TraceLogProps) => (
    <ol className={`font-mono text-[11px] leading-[1.9] tracking-[0.04em] ${className}`}>
        {lines.map((line) => (
            <li key={line.text} data-trace-line className="flex gap-3">
                <span className="text-gold">›</span>
                <span className="flex-1">{line.text}</span>
                {line.status && (
                    <span data-trace-status className="text-gold">
                        {line.status}
                    </span>
                )}
            </li>
        ))}
    </ol>
);

export default TraceLog;
