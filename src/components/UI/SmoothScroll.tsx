import { useEffect, type ReactNode } from "react";
import ReactLenis, { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, useReducedMotion } from "../../lib/motion";

/**
 * Drives Lenis from GSAP's ticker, so smooth scroll and every ScrollTrigger
 * update on the same frame instead of drifting apart.
 */
const LenisGsapBridge = () => {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const update = (time: number) => lenis.raf(time * 1000);
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
            lenis.off("scroll", ScrollTrigger.update);
        };
    }, [lenis]);

    return null;
};

const SmoothScroll = ({ children }: { children: ReactNode }) => {
    const reduced = useReducedMotion();

    return (
        <ReactLenis root options={{ autoRaf: false, lerp: reduced ? 1 : 0.1 }}>
            <LenisGsapBridge />
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
