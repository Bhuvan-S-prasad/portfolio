import { lazy, Suspense, useRef, useState } from "react"
import { useLenis } from "lenis/react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { projects } from "../content/projects"
import { socials } from "../content/profile"
import SectionHeader from "./UI/SectionHeader"
import DenoiseImage, { type DenoiseHandle } from "./projects/DenoiseImage"
import { gsap, useGSAP, prefersReducedMotion, type ScrollTrigger } from "../lib/motion"

// Only loaded once someone opens a case file.
const CaseFile = lazy(() => import("./projects/CaseFile"))

const DESKTOP = "(min-width: 768px)"
const NOISE = "01<>/\\|_-+=*"
const pad = (n: number) => String(n).padStart(2, "0")
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const github = socials.find((s) => s.name.toLowerCase() === "github")

/**
 * Selected work, rendered on scroll. On desktop the section pins and the
 * projects slide past horizontally; each screenshot "denoises" from coarse
 * blocks into the real image as it arrives, like a diffusion model.
 * On mobile the same frames stack vertically. Every frame opens a case file.
 */
const Projects = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const pinRef = useRef<HTMLDivElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const slideRefs = useRef<(HTMLElement | null)[]>([])
    const nameRefs = useRef<(HTMLHeadingElement | null)[]>([])
    const denoiseRefs = useRef<(DenoiseHandle | null)[]>([])
    const railFillRef = useRef<HTMLDivElement>(null)
    const pinST = useRef<ScrollTrigger | null>(null)
    const activeRef = useRef(0)

    const [active, setActive] = useState(0)
    const [ticks, setTicks] = useState<number[]>([])
    const [openCase, setOpenCase] = useState<number | null>(null)
    const lenis = useLenis()

    /** Width of the window the frames slide through (right of the index on desktop). */
    const stageWidth = () => stageRef.current?.clientWidth || window.innerWidth

    /** Horizontal distance a slide must travel to sit centred in the stage. */
    const centreOffset = (i: number) => {
        const slide = slideRefs.current[i]
        if (!slide) return 0
        return slide.offsetLeft + slide.offsetWidth / 2 - stageWidth() / 2
    }

    useGSAP(() => {
        const track = trackRef.current
        if (!track) return
        const reduced = prefersReducedMotion()
        const revealed = projects.map(() => false)
        const mm = gsap.matchMedia()

        mm.add(DESKTOP, () => {
            const distance = () => Math.max(0, track.scrollWidth - stageWidth())
            const measureTicks = () => setTicks(projects.map((_, i) => clamp01(centreOffset(i) / (distance() || 1))))

            const tween = gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                    trigger: pinRef.current,
                    start: "top top",
                    end: () => `+=${distance()}`,
                    pin: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onRefresh: measureTicks,
                },
            })
            pinST.current = tween.scrollTrigger ?? null
            measureTicks()

            return () => {
                pinST.current = null
                slideRefs.current.forEach((slide) => slide && gsap.set(slide, { clearProps: "opacity,scale,transformOrigin" }))
            }
        })

        // Each frame's render progress comes from where it sits on screen —
        // one rule that works for the horizontal track and the vertical stack.
        let visible = false
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: "200px 0px" })
        if (sectionRef.current) io.observe(sectionRef.current)

        const tick = () => {
            if (!visible) return
            const vh = window.innerHeight
            const horizontal = !!pinST.current
            // The stage: the whole viewport on mobile, the area right of the index on desktop.
            const stage = horizontal && stageRef.current
                ? stageRef.current.getBoundingClientRect()
                : { left: 0, right: window.innerWidth, width: window.innerWidth }
            let best = activeRef.current
            let bestDist = Infinity

            slideRefs.current.forEach((slide, i) => {
                if (!slide) return
                const r = slide.getBoundingClientRect()
                // Finishes as the frame reaches the centre (horizontal) or the top third (vertical).
                const across = clamp01((stage.right - r.left) / (stage.width * 0.75))
                const up = clamp01((vh - r.top) / (vh * (horizontal ? 0.85 : 0.6)))
                const p = reduced ? 1 : Math.min(across, up)
                denoiseRefs.current[i]?.set(p)

                if (p >= 1 && !revealed[i]) {
                    revealed[i] = true
                    const name = nameRefs.current[i]
                    if (name && !reduced) {
                        gsap.to(name, { duration: 1.1, ease: "none", scrambleText: { text: projects[i].name, chars: NOISE, speed: 0.5 } })
                    }
                }

                // Passing behind the index: sink back and fade, so no frame is ever cut in half.
                if (horizontal) {
                    const behind = clamp01((stage.left + stage.width * 0.04 - r.left) / (r.width * 0.55))
                    slide.style.opacity = String(1 - behind)
                    slide.style.scale = String(1 - behind * 0.08)
                    slide.style.transformOrigin = "100% 50%"
                }

                const d = horizontal
                    ? Math.abs(r.left + r.width / 2 - (stage.left + stage.width / 2))
                    : Math.abs(r.top + r.height / 2 - vh / 2)
                if (d < bestDist) { bestDist = d; best = i }
            })

            if (best !== activeRef.current) {
                activeRef.current = best
                setActive(best)
            }
            if (railFillRef.current && pinST.current) {
                railFillRef.current.style.transform = `scaleX(${pinST.current.progress})`
            }
        }
        gsap.ticker.add(tick)

        return () => {
            gsap.ticker.remove(tick)
            io.disconnect()
            mm.revert()
        }
    }, { scope: sectionRef })

    const jumpTo = (i: number) => {
        const st = pinST.current
        const slide = slideRefs.current[i]
        if (!slide) return
        if (!st) {
            lenis?.scrollTo(slide, { offset: -80, duration: 1.4 })
            return
        }
        const distance = st.end - st.start
        const x = Math.min(Math.max(0, centreOffset(i)), distance)
        lenis?.scrollTo(st.start + x, { duration: 1.6 })
    }

    return (
        <section ref={sectionRef} id="projects" className="relative pb-16 md:pb-0">
            <SectionHeader
                title="Projects"
                count={projects.length}
                label="Selected work"
                text="From agentic assistants and LLM-powered tools to deep learning and explainable AI. Each one renders as it arrives — open any for its case file and a working demo."
            />

            <div ref={pinRef} className="relative md:flex md:h-screen md:overflow-hidden">
                {/* ── Index: fixed on the left while the frames slide behind it ── */}
                <nav aria-label="Project index" className="relative z-10 hidden w-[32vw] max-w-lg shrink-0 flex-col justify-center gap-8 bg-background px-10 md:flex">
                    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-black/50">
                        <span className="text-gold">({pad(projects.length)})</span> index
                    </p>
                    <ol className="flex flex-col border-b border-black/10">
                        {projects.map((p, i) => {
                            const on = active === i
                            return (
                                <li key={p.id} className="border-t border-black/10">
                                    <button
                                        type="button"
                                        onClick={() => jumpTo(i)}
                                        aria-current={on ? "true" : undefined}
                                        data-cursor={on ? "in view" : "jump to"}
                                        className={`relative isolate flex w-full items-baseline gap-4 py-3 pl-4 pr-3 text-left transition-colors duration-500
                                            ${on ? "text-black" : "text-black/35 hover:text-black/70"}`}
                                    >
                                        {/* highlight + gold marker for the project in view */}
                                        <span aria-hidden className={`absolute inset-x-0 inset-y-1 -z-10 rounded-lg bg-black/[0.05] transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`} />
                                        <span aria-hidden className={`absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-gold transition-transform duration-500 ${on ? "scale-y-100" : "scale-y-0"}`} />
                                        <span className={`font-mono text-[11px] transition-colors duration-500 ${on ? "text-gold" : "text-gold/50"}`}>{pad(i + 1)}</span>
                                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span className="truncate text-lg font-light leading-tight tracking-[-0.01em] lg:text-xl">{p.name}</span>
                                            <span className={`font-mono text-[10px] uppercase tracking-[0.12em] transition-opacity duration-500 ${on ? "opacity-60" : "opacity-45"}`}>
                                                {p.category}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            )
                        })}
                    </ol>
                    <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-black/45">
                        scroll to render
                        <ArrowRight className="size-3.5 animate-[nudge_1.6s_ease-in-out_infinite]" aria-hidden />
                    </p>
                </nav>

                {/* ── Stage: a clipped window the frames slide through ── */}
                <div className="relative md:min-w-0 md:flex-1">
                    <div ref={stageRef} className="stage-mask md:h-full md:overflow-hidden">
                        <div
                            ref={trackRef}
                            className="relative flex flex-col gap-20 px-5 pt-10 sm:px-10
                                md:h-full md:w-max md:flex-row md:items-center md:gap-[4vw] md:pb-16 md:pl-[6vw] md:pr-[6vw] md:pt-0 will-change-transform"
                        >
                            {/* ── Frames ── */}
                            {projects.map((project, i) => (
                                <article
                                    key={project.id}
                                    ref={(el) => { slideRefs.current[i] = el }}
                                    className="group relative w-full shrink-0 md:w-[min(50vw,80vh)]"
                                >
                                    <div className="flex items-center justify-between pb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-black/50">
                                        <span><span className="text-gold">{pad(i + 1)}</span> — {project.category}</span>
                                        <span className="flex items-center gap-1.5 transition-colors duration-300 group-hover:text-black">
                                            case file <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                                        </span>
                                    </div>

                                    <div className="relative aspect-16/10 overflow-hidden rounded-2xl ring-1 ring-black/10 transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-30px_rgb(0_0_0/0.45)]">
                                        <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.025]">
                                            <DenoiseImage
                                                ref={(h) => { denoiseRefs.current[i] = h }}
                                                src={project.image}
                                                alt={`${project.name} screenshot`}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-8">
                                        <h3
                                            ref={(el) => { nameRefs.current[i] = el }}
                                            className="text-4xl sm:text-5xl lg:text-6xl font-extralight leading-[0.95] tracking-[-0.035em] text-black"
                                        >
                                            {project.name}
                                        </h3>
                                        <p className="max-w-[34ch] font-serif text-lg italic leading-snug text-black/60 lg:text-xl md:text-right">
                                            {project.caseFile.tagline}
                                        </p>
                                    </div>

                                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-black/45">
                                        {project.frameworks.map((f) => <li key={f}>{f}</li>)}
                                    </ul>

                                    {/* The whole frame opens the case file. */}
                                    <button
                                        type="button"
                                        onClick={() => setOpenCase(i)}
                                        aria-label={`Open case file: ${project.name}`}
                                        aria-haspopup="dialog"
                                        data-cursor="open case file"
                                        className="absolute inset-0 z-10 cursor-pointer rounded-2xl"
                                    />
                                </article>
                            ))}

                            {/* ── Outro ── */}
                            <div className="flex w-full shrink-0 flex-col gap-6 md:w-[26vw]">
                                <p className="font-serif text-3xl italic leading-tight text-black/80 lg:text-4xl">
                                    That's the selected work.
                                </p>
                                {github && (
                                    <a
                                        href={github.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-cursor="open"
                                        className="group inline-flex items-center gap-3 self-start rounded-full bg-black px-5 py-3 text-sm text-white transition-colors hover:bg-gold hover:text-ink"
                                    >
                                        More experiments on GitHub
                                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Progress rail (desktop) ── */}
                    <div className="absolute bottom-7 left-[6vw] right-10 hidden items-center gap-6 font-mono text-[11px] uppercase tracking-[0.14em] text-black/50 md:flex">
                        <span className="tabular-nums"><span className="text-black">{pad(active + 1)}</span> / {pad(projects.length)}</span>
                        <div className="relative h-px flex-1 bg-black/15">
                            <div ref={railFillRef} className="absolute inset-0 origin-left scale-x-0 bg-black" />
                            {ticks.map((t, i) => (
                                <button
                                    key={projects[i].id}
                                    type="button"
                                    onClick={() => jumpTo(i)}
                                    aria-label={`Go to ${projects[i].name}`}
                                    data-cursor={projects[i].name.toLowerCase()}
                                    className="absolute top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center"
                                    style={{ left: `${t * 100}%` }}
                                >
                                    <span className={`block rounded-full transition-all duration-300 ${active === i ? "size-2.5 bg-gold" : "size-1.5 bg-black/40"}`} />
                                </button>
                            ))}
                        </div>
                        <span className="hidden text-black/40 lg:inline">open a frame for its case file</span>
                    </div>
                </div>
            </div>

            {openCase !== null && (
                <Suspense fallback={null}>
                    <CaseFile index={openCase} onNavigate={setOpenCase} onClose={() => setOpenCase(null)} />
                </Suspense>
            )}
        </section>
    )
}

export default Projects
