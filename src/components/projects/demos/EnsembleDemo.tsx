import { useState } from "react";
import { Bar, DemoFrame, Tag } from "./kit";
import { usePhases } from "./usePhases";

const CLASSES = ["glioma", "meningioma", "pituitary", "no tumor"];

// Illustrative outputs for one scan. ResNet disagrees, so dropping the other
// two flips the verdict — which is exactly why the ensemble exists.
const MODELS = [
    { name: "EfficientNet", probs: [0.08, 0.81, 0.07, 0.04] },
    { name: "DenseNet", probs: [0.12, 0.72, 0.1, 0.06] },
    { name: "ResNet", probs: [0.46, 0.38, 0.09, 0.07] },
];

const argmax = (xs: number[]) => xs.indexOf(Math.max(...xs));

// 0 wait · 1–3 each model predicts · 4 ensemble votes
const DURATIONS = [400, 900, 900, 900, 600];

/** BrainScan AI: three models vote; click one to drop it from the ensemble. */
const EnsembleDemo = () => {
    const { phase, done, replay } = usePhases(DURATIONS);
    const [active, setActive] = useState([true, true, true]);

    const toggle = (i: number) =>
        setActive((a) => {
            const next = a.map((v, j) => (j === i ? !v : v));
            return next.some(Boolean) ? next : a; // keep at least one model voting
        });

    const voters = MODELS.filter((_, i) => active[i]);
    const soft = CLASSES.map((_, c) => voters.reduce((s, m) => s + m.probs[c], 0) / voters.length);
    const verdict = argmax(soft);
    const agree = voters.filter((m) => argmax(m.probs) === verdict).length;
    const voted = phase >= 5;
    const fullVerdict = argmax(CLASSES.map((_, c) => MODELS.reduce((s, m) => s + m.probs[c], 0)));
    const flipped = voted && verdict !== fullVerdict;

    return (
        <DemoFrame
            title="brainscan · ensemble vote"
            status={done ? "click a model to drop it" : "classifying scan"}
            busy={!done}
            onReplay={() => { setActive([true, true, true]); replay(); }}
        >
            <div className="flex h-full flex-col gap-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {MODELS.map((m, i) => {
                        const shown = phase >= i + 2;
                        const top = argmax(m.probs);
                        return (
                            <button
                                key={m.name}
                                type="button"
                                onClick={() => toggle(i)}
                                disabled={!done}
                                aria-pressed={active[i]}
                                data-cursor={active[i] ? "drop model" : "add model"}
                                className={`rounded-xl border p-3 text-left transition-all duration-300
                                    ${active[i] ? "border-white/15 bg-white/[0.03]" : "border-dashed border-white/10 opacity-35"}
                                    ${done ? "hover:border-gold/50" : ""}`}
                            >
                                <span className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em]">
                                    <span className="text-white/70">{m.name}</span>
                                    <span className={active[i] ? "text-gold" : "text-white/40"}>
                                        {!shown ? "···" : active[i] ? `→ ${CLASSES[top]}` : "dropped"}
                                    </span>
                                </span>
                                <span className="flex flex-col gap-1.5">
                                    {CLASSES.map((c, k) => (
                                        <Bar
                                            key={c}
                                            label={c}
                                            value={shown ? m.probs[k] : 0}
                                            top={shown && k === top}
                                            delay={k * 60}
                                            className="grid-cols-[minmax(0,5.25rem)_minmax(0,1fr)_2.25rem]! text-[10px]"
                                        />
                                    ))}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className={`rounded-xl border border-gold/30 p-4 transition-opacity duration-500 ${voted ? "opacity-100" : "opacity-30"}`}>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                        <span className="text-white/60">ensemble · soft vote · {voters.length} model{voters.length > 1 ? "s" : ""}</span>
                        {voted && (
                            <span className="flex items-center gap-2">
                                <span className="text-white/40">agreement {agree}/{voters.length}</span>
                                <Tag tone={flipped ? "ember" : "gold"}>{CLASSES[verdict]} {soft[verdict].toFixed(2)}</Tag>
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {CLASSES.map((c, k) => (
                            <Bar key={c} label={c} value={voted ? soft[k] : 0} top={voted && k === verdict} delay={k * 60} />
                        ))}
                    </div>
                    {flipped && (
                        <p className="mt-3 text-xs font-light text-white/60 animate-[fadeIn_0.4s_ease-out_both]">
                            <span className="text-ember">Verdict flipped.</span> Without the other models, one network's mistake becomes the answer.
                        </p>
                    )}
                </div>
            </div>
        </DemoFrame>
    );
};

export default EnsembleDemo;
