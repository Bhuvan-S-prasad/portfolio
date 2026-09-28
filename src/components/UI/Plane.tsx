interface PlaneProps {
    className?: string;
    /** Fuselage, wing and tail colour. */
    body?: string;
    /** Cabin windows and cockpit colour. */
    windows?: string;
}

/** Side-view airliner, nose to the right, drawn in a 48×18 box. Size it with `className`. */
const Plane = ({ className = "", body = "var(--color-gold)", windows = "var(--color-ink)" }: PlaneProps) => (
    <svg viewBox="0 0 48 18" className={`block overflow-visible ${className}`} aria-hidden>
        <g fill={body}>
            {/* tail fin + tailplane */}
            <path d="M3.2 8.6 L1.4 2.2 Q1.3 1.6 2 1.6 L4.6 1.6 Q5.2 1.6 5.6 2.1 L10.4 8.2 Z" />
            <path d="M3.6 10.6 L0.9 13.1 Q0.6 13.6 1.2 13.6 L3.3 13.6 L8.6 10.6 Z" />
            {/* fuselage */}
            <path d="M2.4 10 C2.4 8.7 4 8.1 7.8 8.1 L38.5 8.1 C43.2 8.1 46.1 9 47.3 10 C46.1 11 43.2 11.9 38.5 11.9 L7.8 11.9 C4 11.9 2.4 11.3 2.4 10 Z" />
            {/* wing */}
            <path d="M19.2 10.6 L13.6 16.4 Q13.3 16.9 13.9 16.9 L17.2 16.9 Q17.9 16.9 18.3 16.4 L27.8 10.6 Z" />
        </g>
        {/* cabin windows + cockpit */}
        <g fill={windows} opacity="0.55">
            {[12, 15, 18, 21, 24, 27, 30, 33, 36].map((x) => <rect key={x} x={x} y="9" width="1.3" height="1.1" rx="0.4" />)}
            <path d="M41.6 9.1 L44.4 9.4 L43.6 10.1 L41.6 10.1 Z" />
        </g>
    </svg>
);

export default Plane;
