import type { CSSProperties, Ref } from "react";

interface DetectionBoxProps {
    label?: string;
    /** 0–1; rendered as a two-decimal score next to the label. */
    confidence?: number;
    className?: string;
    style?: CSSProperties;
    ref?: Ref<HTMLDivElement>;
    labelRef?: Ref<HTMLSpanElement>;
    /** Corner bracket length in px. */
    corner?: number;
}

const CORNERS = [
    "top-0 left-0 border-t border-l",
    "top-0 right-0 border-t border-r",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
];

/**
 * Computer-vision style bounding box: four corner brackets with a small
 * mono label and confidence score. Position it absolutely over a target.
 */
const DetectionBox = ({
    label,
    confidence,
    className = "",
    style,
    ref,
    labelRef,
    corner = 10,
}: DetectionBoxProps) => (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute ${className}`} style={style}>
        {CORNERS.map((pos) => (
            <span
                key={pos}
                className={`absolute border-gold ${pos}`}
                style={{ width: corner, height: corner }}
            />
        ))}
        {label && (
            <span
                ref={labelRef}
                className="absolute -top-4.5 left-0 whitespace-nowrap bg-gold px-1.5 py-px font-mono text-[10px] leading-3.5 tracking-[0.06em] text-ink"
            >
                {label}
                {confidence !== undefined && <span className="opacity-60"> {confidence.toFixed(2)}</span>}
            </span>
        )}
    </div>
);

export default DetectionBox;
