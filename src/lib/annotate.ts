import { gsap } from "./motion";

/** Stable pseudo-confidence for a label, so the same target always reads the same. */
export const confidenceFor = (label: string) => {
    let h = 0;
    for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0;
    return 0.9 + (h % 90) / 1000;
};

/** Tween a <Metric>'s number from its current value to `to`. */
export const countTo = (
    el: HTMLElement | null,
    to: number,
    { pad = 0, ...vars }: gsap.TweenVars & { pad?: number } = {},
) => {
    const state = { v: Number(el?.textContent ?? 0) || 0 };
    return gsap.to(state, {
        v: to,
        ease: "power2.inOut",
        ...vars,
        onUpdate: () => {
            if (el) el.textContent = String(Math.round(state.v)).padStart(pad, "0");
        },
    });
};
