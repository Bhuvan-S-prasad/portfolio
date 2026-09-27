import { useState, type ReactNode } from "react";
import { Bar, DemoFrame, Tag } from "./kit";
import { usePhases } from "./usePhases";

const CLASSES = ["basophil", "eosinophil", "erythroblast", "immature gran.", "lymphocyte", "monocyte", "neutrophil", "platelet"];

type Sample = {
    probs: number[];
    /** Grad-CAM focus in SVG space. */
    heat: { x: number; y: number; r: number };
    shape: ReactNode;
};

// Stylised, illustrative samples — drawn in code, not real microscopy.
const SAMPLES: Sample[] = [
    {
        probs: [0.01, 0.03, 0.005, 0.025, 0.005, 0.01, 0.91, 0.005],
        heat: { x: 104, y: 98, r: 62 },
        shape: (
            <>
                <circle cx="100" cy="100" r="74" className="fill-white/5 stroke-white/25" />
                <g className="fill-white/35">
                    <circle cx="80" cy="92" r="19" />
                    <circle cx="104" cy="112" r="17" />
                    <circle cx="126" cy="90" r="18" />
                </g>
                <path d="M92 100 L100 108 M114 104 L120 98" className="stroke-white/35" strokeWidth="6" strokeLinecap="round" />
            </>
        ),
    },
    {
        probs: [0.02, 0.005, 0.05, 0.01, 0.88, 0.025, 0.005, 0.005],
        heat: { x: 98, y: 100, r: 58 },
        shape: (
            <>
                <circle cx="100" cy="100" r="62" className="fill-white/5 stroke-white/25" />
                <circle cx="96" cy="100" r="50" className="fill-white/35" />
            </>
        ),
    },
    {
        probs: [0.005, 0.005, 0.01, 0.005, 0.01, 0.005, 0.01, 0.95],
        heat: { x: 100, y: 100, r: 40 },
        shape: (
            <>
                <path d="M84 96 C86 80 108 78 116 90 C124 102 116 118 102 118 C88 118 82 108 84 96Z" className="fill-white/25 stroke-white/40" />
                <g className="fill-white/50">
                    <circle cx="96" cy="96" r="2.5" /><circle cx="106" cy="102" r="2" /><circle cx="100" cy="110" r="2.5" />
                </g>
            </>
        ),
    },
];

const argmax = (xs: number[]) => xs.indexOf(Math.max(...xs));
const DURATIONS = [350];

/** Blood cells: pick a sample, watch the class confidences settle, toggle the Grad-CAM map. */
const CellDemo = () => {
    const { phase, replay } = usePhases(DURATIONS);
    const [sample, setSample] = useState(0);
    const [cam, setCam] = useState(true);

    const s = SAMPLES[sample];
    const top = argmax(s.probs);
    const shown = phase >= 1;

    return (
        <DemoFrame
            title="blood cells · 8-class ensemble"
            status={shown ? `${CLASSES[top]} ${s.probs[top].toFixed(2)}` : "classifying"}
            busy={!shown}
            onReplay={() => { setSample(0); replay(); }}
        >
            <div className="grid h-full grid-cols-1 items-center gap-6 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative aspect-square w-full max-w-52 rounded-xl border border-white/10 bg-white/[0.02]">
                        <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={`Stylised ${CLASSES[top]}`}>
                            <defs>
                                <radialGradient id="cell-cam">
                                    <stop offset="0" stopColor="var(--color-ember)" stopOpacity="0.85" />
                                    <stop offset="0.45" stopColor="var(--color-gold)" stopOpacity="0.5" />
                                    <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
                                </radialGradient>
                            </defs>
                            {/* background red cells */}
                            <circle cx="22" cy="30" r="26" className="fill-none stroke-white/10" strokeDasharray="3 4" />
                            <circle cx="184" cy="176" r="30" className="fill-none stroke-white/10" strokeDasharray="3 4" />
                            <g key={sample} className="animate-[fadeIn_0.4s_ease-out_both]">{s.shape}</g>
                            <circle
                                cx={s.heat.x} cy={s.heat.y} r={s.heat.r}
                                fill="url(#cell-cam)"
                                className={`mix-blend-screen transition-opacity duration-500 ${cam && shown ? "opacity-100" : "opacity-0"}`}
                            />
                        </svg>
                        {shown && <span className="absolute left-2 top-2"><Tag>{CLASSES[top]}</Tag></span>}
                    </div>

                    <div className="flex w-full max-w-52 items-center justify-between gap-2">
                        <div className="flex gap-1.5" role="group" aria-label="Sample">
                            {SAMPLES.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSample(i)}
                                    aria-pressed={sample === i}
                                    data-cursor="sample"
                                    className={`grid size-7 place-items-center rounded-full border font-mono text-[10px] transition-colors
                                        ${sample === i ? "border-gold bg-gold text-ink" : "border-white/15 text-white/60 hover:border-gold/60"}`}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => setCam((v) => !v)}
                            aria-pressed={cam}
                            data-cursor="grad-cam"
                            className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors
                                ${cam ? "border-ember/60 text-white" : "border-white/15 text-white/50"}`}
                        >
                            grad-cam
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {CLASSES.map((c, k) => (
                        <Bar key={c} label={c} value={shown ? s.probs[k] : 0} top={shown && k === top} delay={k * 40} />
                    ))}
                </div>
            </div>
        </DemoFrame>
    );
};

export default CellDemo;
