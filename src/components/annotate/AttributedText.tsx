import { useMemo, useRef } from "react";
import { gsap, useGSAP } from "../../lib/motion";

interface AttributedTextProps {
    text: string;
    /** Weight per lower-cased word (punctuation stripped), 0–1. */
    weights: Record<string, number>;
    /** Show the attribution highlights. */
    active: boolean;
}

const STOP_WORDS = new Set([
    "i'm", "an", "a", "the", "in", "where", "i", "and", "that", "make", "them",
    "more", "my", "from", "to", "with", "on", "of", "built", "focus", "spans",
    "background", "working", "systems", "models",
]);

// Small, stable baseline so unlisted words still read as "considered".
const baseline = (word: string) => {
    if (STOP_WORDS.has(word)) return 0;
    let h = 0;
    for (let i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) >>> 0;
    return 0.05 + (h % 100) / 1000;
};

/**
 * Renders text word by word with a SHAP-style highlight behind each word,
 * scaled by its weight. Strong words (≥ 0.8) read ember, the rest gold.
 * While active, meaningful words expose their weight to the custom cursor.
 */
const AttributedText = ({ text, weights, active }: AttributedTextProps) => {
    const ref = useRef<HTMLSpanElement>(null);

    const tokens = useMemo(() => text.split(/(\s+)/).map((token) => {
        if (!token.trim()) return { token, weight: -1 };
        const key = token.toLowerCase().replace(/[^a-z'-]/g, "");
        // Punctuation-only tokens (e.g. "—") carry no attribution.
        if (!/[a-z]/.test(key)) return { token, weight: 0 };
        return { token, weight: weights[key] ?? baseline(key) };
    }), [text, weights]);

    useGSAP(() => {
        const words = ref.current?.querySelectorAll("[data-w]");
        if (!words?.length) return;
        gsap.to(words, {
            "--a": active ? 1 : 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: { each: 0.006, from: active ? "start" : "end" },
        });
    }, { dependencies: [active], scope: ref });

    return (
        <span ref={ref}>
            {tokens.map(({ token, weight }, i) => {
                if (weight < 0) return token;
                const rgb = weight >= 0.8 ? "200 85 61" : "207 163 85";
                const scored = active && weight >= 0.3;
                return (
                    <span
                        key={i}
                        data-w={weight}
                        {...(scored ? { "data-cursor": "attribution", "data-cursor-score": `+${weight.toFixed(2)}` } : {})}
                        className="rounded-[0.12em] box-decoration-clone"
                        style={{
                            backgroundColor: `rgb(${rgb} / calc(${weight * 0.7} * var(--a, 0)))`,
                        }}
                    >
                        {token}
                    </span>
                );
            })}
        </span>
    );
};

export default AttributedText;
