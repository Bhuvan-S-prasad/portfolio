import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import { useEffect, useState } from "react";

// Register every plugin once, here, instead of in each component.
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export const prefersReducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;

// Reveal timelines still run (so content ends up visible), but near-instantly.
if (prefersReducedMotion()) gsap.globalTimeline.timeScale(20);

export const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(
        () => typeof window !== "undefined" && window.matchMedia(query).matches,
    );

    useEffect(() => {
        const mq = window.matchMedia(query);
        const onChange = () => setMatches(mq.matches);
        onChange();
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, [query]);

    return matches;
};

export const useReducedMotion = () => useMediaQuery(REDUCED_QUERY);

export { gsap, ScrollTrigger, SplitText, useGSAP };
