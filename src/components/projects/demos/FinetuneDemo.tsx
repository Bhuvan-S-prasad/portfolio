import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { Bar, DemoFrame, Tag } from "./kit";
import { usePhases } from "./usePhases";

const SPECIES = ["Indian Roller", "Common Kingfisher", "Blue-tailed Bee-eater", "White-throated Kingfisher", "Asian Green Bee-eater"];
// Illustrative top-5 for one test image: ImageNet features alone vs. after fine-tuning.
const BEFORE = [0.29, 0.25, 0.18, 0.16, 0.12];
const AFTER = [0.93, 0.03, 0.02, 0.01, 0.01];

const LAYERS = [
    { name: "conv1", frozen: true },
    { name: "layer1", frozen: true },
    { name: "layer2", frozen: true },
    { name: "layer3", frozen: true },
    { name: "layer4", frozen: false },
    { name: "fc · new", frozen: false },
];

const EPOCHS = 12;
const loss = (e: number) => 2.2 * Math.exp(-0.32 * e) + 0.14 + Math.sin(e * 2.3) * 0.04 * Math.exp(-0.15 * e);
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// 0 wait · 1 training (holds until the last epoch)
const DURATIONS = [900, -1];
const TRAINING = 1;

// Loss chart space
const CW = 300;
const CH = 110;
const lx = (e: number) => (e / EPOCHS) * CW;
const ly = (v: number) => CH - 8 - (v / 2.4) * (CH - 16);

/** Bird species: fine-tune the last layers of a pretrained ResNet50 and watch the top-5 sharpen. */
const FinetuneDemo = () => {
    const { phase, done, advance, replay } = usePhases(DURATIONS);
    const [epoch, setEpoch] = useState(0);

    useEffect(() => {
        if (phase !== TRAINING) return;
        let e = 0;
        const id = window.setInterval(() => {
            e += 1;
            setEpoch(e);
            if (e >= EPOCHS) {
                window.clearInterval(id);
                advance();
            }
        }, 260);
        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- advance is stable in behaviour
    }, [phase]);

    const t = ease(epoch / EPOCHS);
    const probs = BEFORE.map((b, i) => b + (AFTER[i] - b) * t);
    const training = phase === TRAINING;
    const curve = Array.from({ length: epoch + 1 }, (_, e) => `${e ? "L" : "M"}${lx(e).toFixed(1)} ${ly(loss(e)).toFixed(1)}`).join("");

    return (
        <DemoFrame
            title="birds · resnet50 transfer learning"
            status={done ? "fine-tuned" : training ? `epoch ${epoch}/${EPOCHS}` : "pretrained only"}
            busy={training}
            onReplay={() => { setEpoch(0); replay(); }}
        >
            <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-5">
                    {/* Which layers learn */}
                    <div>
                        <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">resnet50 · frozen vs. trained</p>
                        <div className="grid grid-cols-6 gap-1.5">
                            {LAYERS.map((l) => (
                                <div
                                    key={l.name}
                                    className={`flex h-14 flex-col items-center justify-between rounded-md border px-1 py-1.5 font-mono text-[9px]
                                        ${l.frozen ? "border-white/10 bg-white/[0.03] text-white/35" : `border-gold/60 text-gold ${training ? "animate-pulse bg-gold/15" : "bg-gold/5"}`}`}
                                >
                                    {l.frozen ? <Lock className="size-2.5" aria-hidden /> : <span className="size-1.5 rounded-full bg-gold" />}
                                    <span className="truncate">{l.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Loss */}
                    <div className="rounded-xl border border-white/10 p-3">
                        <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                            <span>training loss</span>
                            <span className="tabular-nums text-white/60">{loss(epoch).toFixed(2)}</span>
                        </div>
                        <svg viewBox={`0 0 ${CW} ${CH}`} className="h-24 w-full" aria-hidden>
                            <line x1="0" x2={CW} y1={CH - 8} y2={CH - 8} className="stroke-white/15" />
                            <path d={curve} fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeLinejoin="round" />
                            <circle cx={lx(epoch)} cy={ly(loss(epoch))} r="3" fill="var(--color-gold)" />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col justify-center gap-3">
                    <p className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                        <span>top-5 · test image</span>
                        {done && <Tag>{SPECIES[0]} {probs[0].toFixed(2)}</Tag>}
                    </p>
                    {SPECIES.map((s, i) => (
                        <Bar key={s} label={s} value={probs[i]} top={i === 0 && t > 0.5} className="grid-cols-[minmax(0,10rem)_minmax(0,1fr)_2.75rem]!" />
                    ))}
                    <p className="pt-2 text-xs font-light leading-relaxed text-white/45">
                        {done
                            ? "Only layer4 and the new head trained — ImageNet features did the rest."
                            : "Before fine-tuning, similar-looking species split the vote."}
                    </p>
                </div>
            </div>
        </DemoFrame>
    );
};

export default FinetuneDemo;
