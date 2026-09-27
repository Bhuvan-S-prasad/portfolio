import { useEffect, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import { projects, type DemoKind, type Project } from "../../content/projects";
import { gsap, useGSAP } from "../../lib/motion";
import { grainLayer } from "../../lib/grain";
import AgentDemo from "./demos/AgentDemo";
import EnsembleDemo from "./demos/EnsembleDemo";
import CitationDemo from "./demos/CitationDemo";
import MockupDemo from "./demos/MockupDemo";
import CellDemo from "./demos/CellDemo";
import FinetuneDemo from "./demos/FinetuneDemo";
import ThreadDemo from "./demos/ThreadDemo";

const DEMOS: Record<DemoKind, ComponentType> = {
    agent: AgentDemo,
    ensemble: EnsembleDemo,
    citations: CitationDemo,
    mockup: MockupDemo,
    cells: CellDemo,
    finetune: FinetuneDemo,
    thread: ThreadDemo,
};

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';
const pad = (n: number) => String(n).padStart(2, "0");

const linkLabel = (href: string) => (href.includes("github.com") ? "View the code" : "Visit the live site");

/** Demo / screenshot tabs. Keyed by project so each case file starts on its demo. */
const Stage = ({ project }: { project: Project }) => {
    const [tab, setTab] = useState<"demo" | "shot">("demo");
    const Demo = DEMOS[project.demo];

    return (
        <div className="flex h-full min-h-0 flex-col gap-3">
            <div role="tablist" aria-label="Case file view" className="flex items-center gap-1 self-start rounded-full border border-white/10 p-1">
                {([["demo", "Live demo"], ["shot", "Screenshot"]] as const).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={tab === id}
                        onClick={() => setTab(id)}
                        data-cursor={label.toLowerCase()}
                        className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors
                            ${tab === id ? "bg-white text-ink" : "text-white/55 hover:text-white"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div role="tabpanel" className="min-h-0 flex-1">
                {tab === "demo" ? (
                    <Demo />
                ) : (
                    <div className="grid h-full place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3 animate-[fadeIn_0.4s_ease-out_both]">
                        <img src={project.image} alt={`${project.name} screenshot`} className="max-h-full w-full object-contain" />
                    </div>
                )}
            </div>

            <p className="font-mono text-[10px] leading-relaxed tracking-[0.04em] text-white/35">
                {tab === "demo"
                    ? "Illustrative — built in code for this page to show how it works. Not live model output."
                    : "Screenshot of the project."}
            </p>
        </div>
    );
};

interface CaseFileProps {
    index: number;
    onNavigate: (index: number) => void;
    onClose: () => void;
}

/**
 * Full-screen case file for a project: problem → approach → outcome, with a
 * small interactive demo. Esc closes, ← / → move between projects.
 */
const CaseFile = ({ index, onNavigate, onClose }: CaseFileProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const closing = useRef(false);
    const lenis = useLenis();

    const project = projects[index];
    const count = projects.length;
    const go = (d: number) => onNavigate((index + d + count) % count);

    // Freeze the page behind, and hand focus back to whatever opened us.
    useEffect(() => {
        const opener = document.activeElement as HTMLElement | null;
        lenis?.stop();
        closeRef.current?.focus({ preventScroll: true });
        return () => {
            lenis?.start();
            opener?.focus({ preventScroll: true });
        };
    }, [lenis]);

    useGSAP(() => {
        gsap.timeline()
            .fromTo(rootRef.current, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8, ease: "expo.inOut" })
            .from("[data-reveal]", { y: 28, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power3.out" }, "-=0.3");
    }, { scope: rootRef });

    const close = () => {
        if (closing.current) return;
        closing.current = true;
        gsap.to(rootRef.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "expo.inOut", onComplete: onClose });
    };

    // New project: back to the top, content fades in again.
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0 });
    }, [index]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") return close();
        const tag = (e.target as HTMLElement).tagName;
        if (e.key === "ArrowRight" && tag !== "INPUT") return go(1);
        if (e.key === "ArrowLeft" && tag !== "INPUT") return go(-1);
        if (e.key !== "Tab") return;
        const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    const navButton = "grid size-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold/60 hover:text-white";

    return createPortal(
        <div
            ref={rootRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-file-title"
            onKeyDown={onKeyDown}
            className="fixed inset-0 z-100 bg-ink text-white"
            style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        >
            <div aria-hidden style={grainLayer(0.5)} />

            <div ref={scrollRef} data-lenis-prevent className="relative h-full overflow-y-auto overscroll-contain">
                {/* Top bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-ink/85 px-6 py-4 backdrop-blur-sm sm:px-10">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
                        <span className="text-gold">case file {pad(index + 1)}</span> / {pad(count)}
                    </p>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => go(-1)} aria-label="Previous project" data-cursor="previous" className={navButton}>
                            <ArrowLeft className="size-4" aria-hidden />
                        </button>
                        <button type="button" onClick={() => go(1)} aria-label="Next project" data-cursor="next" className={navButton}>
                            <ArrowRight className="size-4" aria-hidden />
                        </button>
                        <button ref={closeRef} type="button" onClick={close} aria-label="Close case file" data-cursor="close" className={`${navButton} ml-2`}>
                            <X className="size-4" aria-hidden />
                        </button>
                    </div>
                </div>

                <article
                    key={project.id}
                    className="grid grid-cols-1 gap-x-14 gap-y-10 px-6 pb-16 pt-6 sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:pt-10 xl:gap-x-20
                        animate-[fadeIn_0.5s_ease-out_both]"
                >
                    {/* Head */}
                    <header className="lg:col-start-1 lg:row-start-1">
                        <p data-reveal className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                            {project.frameworks.slice(0, 3).join(" · ")}
                        </p>
                        <h2 id="case-file-title" data-reveal className="mt-5 text-5xl sm:text-7xl xl:text-8xl font-extralight leading-[0.95] tracking-[-0.035em]">
                            {project.name}
                        </h2>
                        <p data-reveal className="mt-5 max-w-[30ch] font-serif text-2xl italic leading-snug text-white/70 sm:text-3xl">
                            {project.caseFile.tagline}
                        </p>
                    </header>

                    {/* Demo */}
                    <div data-reveal className="lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-[min(36rem,calc(100svh-8rem))]">
                        <Stage key={project.id} project={project} />
                    </div>

                    {/* Details */}
                    <div className="lg:col-start-1 lg:row-start-2">
                        <dl className="flex flex-col gap-7">
                            {(["problem", "approach", "outcome"] as const).map((k, i) => (
                                <div key={k} data-reveal className="border-t border-white/10 pt-5">
                                    <dt className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                                        <span className="text-gold">{pad(i + 1)}</span> {k}
                                    </dt>
                                    <dd className="mt-3 text-base font-light leading-relaxed text-white/70 lg:text-lg">{project.caseFile[k]}</dd>
                                </div>
                            ))}
                        </dl>

                        <ul data-reveal className="mt-8 flex flex-wrap gap-2">
                            {project.frameworks.map((f) => (
                                <li key={f} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-white/55">
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <div data-reveal className="mt-10">
                            {project.href ? (
                                <a
                                    href={project.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-cursor="open"
                                    className="group inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm text-ink transition-colors hover:bg-gold"
                                >
                                    {linkLabel(project.href)}
                                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                                </a>
                            ) : (
                                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/35">No public link yet</p>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </div>,
        document.body,
    );
};

export default CaseFile;
