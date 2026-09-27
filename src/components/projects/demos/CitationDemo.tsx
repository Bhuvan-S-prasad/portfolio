import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { DemoFrame } from "./kit";
import { usePhases } from "./usePhases";

const QUESTION = "How do AI assistants answer questions about long documents?";

const SOURCES = [
    { kind: "docs", title: "Chunking and embedding long documents" },
    { kind: "arxiv", title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks" },
    { kind: "blog", title: "Long context windows vs. retrieval" },
];

// The answer as text runs, each closed by the source it came from.
const ANSWER: [string, number | null][] = [
    ["Long documents rarely fit in one pass, so they're split into chunks and embedded as vectors", 1],
    [". At question time only the most relevant chunks are retrieved and handed to the model", 2],
    [", which grounds the answer in the source and keeps it checkable. Longer context windows help too, but retrieval stays cheaper and easier to verify", 3],
    [".", null],
];

type Token = { word: string } | { cite: number };
const TOKENS: Token[] = ANSWER.flatMap(([text, cite]) => [
    ...text.split(/(?<= )/).map((word) => ({ word })),
    ...(cite ? [{ cite }] : []),
]);

// 0 wait · 1 searching · 2 streaming (holds until the stream ends)
const DURATIONS = [500, 1300, -1];
const STREAM = 2;

/** NOMI: an answer streams in with inline citations; hover one to find its source. */
const CitationDemo = () => {
    const { phase, done, advance, replay } = usePhases(DURATIONS);
    const [count, setCount] = useState(0);
    const [focus, setFocus] = useState<number | null>(null);

    useEffect(() => {
        if (phase !== STREAM) return;
        let n = 0;
        const id = window.setInterval(() => {
            n += 1;
            setCount(n);
            if (n >= TOKENS.length) {
                window.clearInterval(id);
                advance();
            }
        }, 55);
        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- advance is stable in behaviour
    }, [phase]);

    const restart = () => {
        setCount(0);
        setFocus(null);
        replay();
    };

    const shown = phase >= STREAM ? TOKENS.slice(0, count) : [];
    const cited = new Set(shown.flatMap((t) => ("cite" in t ? [t.cite] : [])));

    return (
        <DemoFrame
            title="nomi · cited answer"
            status={done ? "hover a citation" : phase === 1 ? "searching sources" : phase === STREAM ? "writing" : "ready"}
            busy={!done && phase > 0}
            onReplay={restart}
        >
            <div className="flex h-full flex-col gap-5">
                <div className="flex items-center gap-3 rounded-full border border-white/15 px-4 py-2.5">
                    <Search className="size-3.5 shrink-0 text-gold" aria-hidden />
                    <p className="truncate text-sm font-light text-white/85">{QUESTION}</p>
                </div>

                <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {SOURCES.map((s, i) => {
                        const n = i + 1;
                        const on = focus === n;
                        return (
                            <li key={s.title}>
                                <button
                                    type="button"
                                    onMouseEnter={() => setFocus(n)}
                                    onMouseLeave={() => setFocus(null)}
                                    onFocus={() => setFocus(n)}
                                    onBlur={() => setFocus(null)}
                                    data-cursor={`source ${n}`}
                                    className={`h-full w-full rounded-xl border p-3 text-left transition-all duration-300
                                        ${phase >= 1 ? "opacity-100" : "translate-y-1 opacity-0"}
                                        ${on ? "border-gold bg-gold/10" : cited.has(n) ? "border-white/20" : "border-white/10"}`}
                                    style={{ transitionDelay: phase === 1 ? `${i * 180}ms` : "0ms" }}
                                >
                                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em]">
                                        <span className={`grid size-4 place-items-center rounded-sm ${on ? "bg-gold text-ink" : "bg-white/10 text-white/60"}`}>{n}</span>
                                        <span className="text-white/40">{s.kind}</span>
                                    </span>
                                    <span className="mt-2 block text-xs font-light leading-snug text-white/70 line-clamp-2">{s.title}</span>
                                </button>
                            </li>
                        );
                    })}
                </ol>

                <p className="text-sm sm:text-base font-light leading-relaxed text-white/80" aria-live="off">
                    {shown.map((t, i) =>
                        "word" in t ? (
                            <span key={i}>{t.word}</span>
                        ) : (
                            <button
                                key={i}
                                type="button"
                                onMouseEnter={() => setFocus(t.cite)}
                                onMouseLeave={() => setFocus(null)}
                                onFocus={() => setFocus(t.cite)}
                                onBlur={() => setFocus(null)}
                                data-cursor={`source ${t.cite}`}
                                aria-label={`Source ${t.cite}: ${SOURCES[t.cite - 1].title}`}
                                className={`mx-0.5 inline-grid size-4 translate-y-[-0.35em] place-items-center rounded-sm font-mono text-[9px] transition-colors
                                    ${focus === t.cite ? "bg-gold text-ink" : "bg-white/15 text-white/70"}`}
                            >
                                {t.cite}
                            </button>
                        ),
                    )}
                    {phase === STREAM && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-gold" />}
                </p>
            </div>
        </DemoFrame>
    );
};

export default CitationDemo;
