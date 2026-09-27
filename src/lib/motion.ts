import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useEffect, useState } from "react";

// Register every plugin once, here, instead of in each component.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;

// Reveal timelines still run (so content ends up visible), but near-instantly.
if (prefersReducedMotion()) gsap.globalTimeline.timeScale(20);

export const useReducedMotion = () => {
    const [reduced, setReduced] = useState(prefersReducedMotion);

    useEffect(() => {
        const mq = window.matchMedia(REDUCED_QUERY);
        const onChange = () => setReduced(mq.matches);
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    return reduced;
};

export { gsap, ScrollTrigger, SplitText, useGSAP };
