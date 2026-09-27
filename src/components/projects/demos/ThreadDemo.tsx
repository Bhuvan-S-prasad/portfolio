import { useState } from "react";
import { Repeat2 } from "lucide-react";
import { DemoFrame, Tag } from "./kit";
import { usePhases } from "./usePhases";

const ROOT = { user: "mira", text: "What's one habit that made you a better engineer?" };

const REPLIES = [
    { user: "arjun", depth: 1, text: "Writing the design doc before the code." },
    { user: "mira", depth: 2, text: "Even for small features?" },
    { user: "arjun", depth: 3, text: "Especially those. Small ones grow." },
    { user: "sam", depth: 1, text: "Reading other people's pull requests." },
    { user: "lee", depth: 2, text: "This. You learn a codebase twice as fast." },
];

const MEMBERS = ["mira", "arjun", "sam", "lee", "noor", "kai"];

// 0 wait · 1 echo posted · 2–6 replies · 7 rift forms
const DURATIONS = [400, 800, 800, 800, 800, 800, 900, 600];
const RIFT = 7;

const Avatar = ({ name, size = "size-6" }: { name: string; size?: string }) => (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-white/10 font-mono text-[10px] uppercase text-white/70`}>
        {name[0]}
    </span>
);

/** Rivora: an Echo grows into a threaded discussion, and the discussion becomes a Rift. */
const ThreadDemo = () => {
    const { phase, done, replay } = usePhases(DURATIONS);
    const [echoes, setEchoes] = useState(24);
    const [echoed, setEchoed] = useState(false);
    const [joined, setJoined] = useState(false);

    const restart = () => {
        setEchoed(false);
        setEchoes(24);
        setJoined(false);
        replay();
    };

    return (
        <DemoFrame
            title="rivora · echo → rift"
            status={phase >= RIFT ? "rift formed" : phase >= 2 ? "discussion" : "posting"}
            busy={!done}
            onReplay={restart}
        >
            <div className="flex h-full flex-col gap-4">
                {/* The Echo */}
                <div className={`rounded-xl border border-white/10 p-4 transition-all duration-500 ${phase >= 1 ? "opacity-100" : "translate-y-2 opacity-0"}`}>
                    <div className="flex items-center gap-3">
                        <Avatar name={ROOT.user} size="size-7" />
                        <span className="font-mono text-[11px] text-white/50">@{ROOT.user}</span>
                        <Tag tone="muted">echo</Tag>
                    </div>
                    <p className="mt-3 text-base font-light text-white/90">{ROOT.text}</p>
                    <div className="mt-3 flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">
                        <button
                            type="button"
                            onClick={() => { setEchoed((v) => !v); setEchoes((n) => n + (echoed ? -1 : 1)); }}
                            aria-pressed={echoed}
                            data-cursor="echo"
                            className={`flex items-center gap-1.5 transition-colors ${echoed ? "text-gold" : "hover:text-white"}`}
                        >
                            <Repeat2 className="size-3.5" aria-hidden /> {echoes}
                        </button>
                        <span>{Math.max(0, Math.min(phase - 1, REPLIES.length))} replies</span>
                    </div>
                </div>

                {/* Threaded replies */}
                <ol className="flex flex-col gap-2.5">
                    {REPLIES.map((r, i) =>
                        phase >= i + 2 ? (
                            <li
                                key={i}
                                className="flex items-start gap-2.5 border-l border-white/10 pl-3 animate-[fadeIn_0.4s_ease-out_both]"
                                style={{ marginLeft: `${(r.depth - 1) * 1.25}rem` }}
                            >
                                <Avatar name={r.user} />
                                <p className="text-sm font-light leading-relaxed text-white/70">
                                    <span className="mr-2 font-mono text-[11px] text-white/40">@{r.user}</span>
                                    {r.text}
                                </p>
                            </li>
                        ) : null,
                    )}
                </ol>

                {/* The Rift */}
                {phase >= RIFT && (
                    <div className="mt-auto flex flex-wrap items-center gap-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 animate-[fadeIn_0.5s_ease-out_both]">
                        <span className="flex -space-x-1.5">
                            {MEMBERS.map((m) => <span key={m} className="rounded-full ring-2 ring-ink"><Avatar name={m} /></span>)}
                        </span>
                        <p className="mr-auto text-sm font-light text-white/85">
                            This became a Rift · <span className="text-gold">Better Engineers</span>
                            <span className="ml-2 font-mono text-[10px] text-white/45">{MEMBERS.length + (joined ? 1 : 0)} members</span>
                        </p>
                        <button
                            type="button"
                            onClick={() => setJoined((v) => !v)}
                            aria-pressed={joined}
                            data-cursor={joined ? "leave" : "join"}
                            className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors
                                ${joined ? "border border-gold/60 text-gold" : "bg-gold text-ink hover:opacity-85"}`}
                        >
                            {joined ? "joined" : "join rift"}
                        </button>
                    </div>
                )}
            </div>
        </DemoFrame>
    );
};

export default ThreadDemo;
