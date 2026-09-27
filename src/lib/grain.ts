import type { CSSProperties } from "react";

/** Film-grain noise tile shared by every dark surface. */
export const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")";

/** Absolutely-positioned, animated grain overlay (uses the `navGrain` keyframes in index.css). */
export const grainLayer = (opacity = 0.6): CSSProperties => ({
    position: "absolute",
    inset: 0,
    backgroundImage: GRAIN,
    backgroundSize: "256px 256px",
    opacity,
    pointerEvents: "none",
    animation: "navGrain 0.13s steps(1) infinite",
});
