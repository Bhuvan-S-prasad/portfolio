import { useEffect, useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import DetectionBox from "../../annotate/DetectionBox";
import { DemoFrame, Tag } from "./kit";
import { usePhases } from "./usePhases";

const PROMPT = "A landing page for a small coffee roastery";

// 0 wait · 1 typing (holds) · 2 generating · 3–6 blocks appear · then editable
const DURATIONS = [400, -1, 700, 450, 450, 450, 450];
const TYPING = 1;
const FIRST_BLOCK = 3;

/** A generated block, boxed and labelled while it's the newest thing on the page. */
const Block = ({ label, shown, fresh, children }: { label: string; shown: boolean; fresh: boolean; children: ReactNode }) => (
    <div className={`relative transition-all duration-500 ${shown ? "opacity-100" : "translate-y-2 opacity-0"}`}>
        {children}
        {fresh && <DetectionBox label={label} className="-inset-1.5 animate-[fadeIn_0.3s_ease-out_both]" corner={8} />}
    </div>
);

const Line = ({ w, dark = false }: { w: string; dark?: boolean }) => (
    <span className={`block h-1.5 rounded-full ${dark ? "bg-white/40" : "bg-white/15"}`} style={{ width: w }} />
);

/** Rotom: a prompt becomes a wireframe, block by block; then you edit and publish it. */
const MockupDemo = () => {
    const { phase, advance, replay } = usePhases(DURATIONS);
    const [typed, setTyped] = useState(0);
    const [darkHero, setDarkHero] = useState(false);
    const [pricing, setPricing] = useState(false);
    const [published, setPublished] = useState(false);
    const [lastEdit, setLastEdit] = useState<string | null>(null);

    useEffect(() => {
        if (phase !== TYPING) return;
        let n = 0;
        const id = window.setInterval(() => {
            n += 1;
            setTyped(n);
            if (n >= PROMPT.length) {
                window.clearInterval(id);
                advance();
            }
        }, 32);
        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- advance is stable in behaviour
    }, [phase]);

    const restart = () => {
        setTyped(0);
        setDarkHero(false);
        setPricing(false);
        setPublished(false);
        setLastEdit(null);
        replay();
    };

    const built = phase >= DURATIONS.length;
    const at = (i: number) => phase >= FIRST_BLOCK + i;
    const fresh = (i: number, name: string) => (phase === FIRST_BLOCK + i) || lastEdit === name;
    const edit = (name: string, apply: () => void) => {
        apply();
        setPublished(false);
        setLastEdit(name);
    };

    return (
        <DemoFrame
            title="rotom · prompt to prototype"
            status={published ? "published" : built ? "try an edit" : phase === 2 ? "generating" : phase >= FIRST_BLOCK ? "building" : "prompt"}
            busy={!built && phase > 0}
            onReplay={restart}
        >
            <div className="flex h-full flex-col gap-4">
                <div className="flex items-center gap-3 rounded-full border border-white/15 px-4 py-2.5">
                    <Sparkles className="size-3.5 shrink-0 text-gold" aria-hidden />
                    <p className="truncate text-sm font-light text-white/85">
                        {PROMPT.slice(0, phase > TYPING ? PROMPT.length : typed)}
                        {phase === TYPING && <span className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-gold" />}
                    </p>
                </div>

                {/* Browser */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10">
                    <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
                        {[0, 1, 2].map((d) => <span key={d} className="size-1.5 rounded-full bg-white/20" />)}
                        <span className="ml-3 font-mono text-[10px] text-white/35">{published ? "live · roastery" : "preview"}</span>
                    </div>
                    <div className="flex flex-col gap-3 p-3.5">
                        {phase === 2 && <p className="font-mono text-[11px] text-white/40 animate-pulse">generating layout…</p>}

                        <Block label="<Navbar/>" shown={at(0)} fresh={fresh(0, "")}>
                            <div className="flex items-center justify-between">
                                <Line w="18%" dark />
                                <span className="flex w-2/5 gap-2"><Line w="30%" /><Line w="30%" /><Line w="30%" /></span>
                            </div>
                        </Block>

                        <Block label="<Hero/>" shown={at(1)} fresh={fresh(1, "hero")}>
                            <div className={`grid grid-cols-[1.2fr_1fr] gap-4 rounded-lg p-2.5 transition-colors duration-500 ${darkHero ? "bg-ink ring-1 ring-white/10" : "bg-white/[0.06]"}`}>
                                <div className="flex flex-col justify-center gap-2">
                                    <Line w="90%" dark /><Line w="70%" dark /><Line w="80%" />
                                    <span className={`mt-1 block h-4 w-16 rounded-full ${darkHero ? "bg-gold" : "bg-white/30"}`} />
                                </div>
                                <div className={`h-12 rounded-md ${darkHero ? "bg-gold/25" : "bg-white/10"}`} />
                            </div>
                        </Block>

                        <Block label="<FeatureGrid/>" shown={at(2)} fresh={fresh(2, "")}>
                            <div className="grid grid-cols-3 gap-2">
                                {[0, 1, 2].map((c) => (
                                    <div key={c} className="flex flex-col gap-1 rounded-md border border-white/10 p-1.5">
                                        <span className="size-3 rounded-sm bg-white/20" /><Line w="80%" /><Line w="60%" />
                                    </div>
                                ))}
                            </div>
                        </Block>

                        {pricing && (
                            <Block label="<Pricing/>" shown fresh={lastEdit === "pricing"}>
                                <div className="grid grid-cols-3 gap-2">
                                    {[0, 1, 2].map((c) => (
                                        <div key={c} className={`flex flex-col items-center gap-1 rounded-md p-1.5 ${c === 1 ? "bg-gold/15 ring-1 ring-gold/40" : "bg-white/[0.04]"}`}>
                                            <Line w="40%" dark /><Line w="60%" /><Line w="50%" />
                                        </div>
                                    ))}
                                </div>
                            </Block>
                        )}

                        <Block label="<Footer/>" shown={at(3)} fresh={fresh(3, "")}>
                            <div className="flex justify-between border-t border-white/10 pt-2"><Line w="25%" /><Line w="15%" /></div>
                        </Block>
                    </div>
                </div>

                {/* Conversational edits */}
                <div className={`flex flex-wrap items-center gap-2 transition-opacity duration-500 ${built ? "opacity-100" : "pointer-events-none opacity-0"}`}>
                    <button
                        type="button"
                        onClick={() => edit("hero", () => setDarkHero((v) => !v))}
                        data-cursor="edit"
                        className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-gold/60 hover:text-white"
                    >
                        {darkHero ? "lighter hero" : "make the hero darker"}
                    </button>
                    <button
                        type="button"
                        onClick={() => edit("pricing", () => setPricing((v) => !v))}
                        data-cursor="edit"
                        className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-gold/60 hover:text-white"
                    >
                        {pricing ? "remove pricing" : "add a pricing section"}
                    </button>
                    <span className="ml-auto">
                        {published ? (
                            <Tag>published</Tag>
                        ) : (
                            <button
                                type="button"
                                onClick={() => { setPublished(true); setLastEdit(null); }}
                                data-cursor="publish"
                                className="rounded-full bg-gold px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink transition-opacity hover:opacity-85"
                            >
                                Publish
                            </button>
                        )}
                    </span>
                </div>
            </div>
        </DemoFrame>
    );
};

export default MockupDemo;
