import { useMemo, useRef, useState } from "react"
import { skills } from "../../content/skills"
import { related } from "../../content/skillSpace"
import { gsap, useGSAP } from "../../lib/motion"

type Link = { key: string; d: string }

/** Related skills for one skill, from the curated pairs. */
const neighboursOf = (skill: string) => {
    const set = new Set<string>()
    related.forEach(([a, b]) => {
        if (a === skill) set.add(b)
        if (b === skill) set.add(a)
    })
    return set
}

interface SkillAtlasProps {
    matches: Map<string, number>
    querying: boolean
    focus: string | null
    onFocus: (skill: string | null) => void
}

/**
 * The skills as a calm, readable grid — one cell per cluster. The "graph" only
 * appears on interaction: focusing a skill draws links to related skills in
 * other clusters. Search highlights matches with their relevance.
 */
const SkillAtlas = ({ matches, querying, focus, onFocus }: SkillAtlasProps) => {
    const gridRef = useRef<HTMLDivElement>(null)
    const dotRefs = useRef(new Map<string, HTMLSpanElement>())
    // Links are measured when a skill gains focus, and shown only while it keeps it.
    const [drawn, setDrawn] = useState<{ source: string; links: Link[] } | null>(null)

    const neighbours = useMemo(() => (focus ? neighboursOf(focus) : new Set<string>()), [focus])
    const links = drawn && drawn.source === focus ? drawn.links : []

    /** Curved links from a skill's dot to each related skill's dot. */
    const measureLinks = (skill: string): Link[] => {
        const grid = gridRef.current
        const from = dotRefs.current.get(skill)
        if (!grid || !from) return []
        const box = grid.getBoundingClientRect()
        const centre = (el: HTMLElement) => {
            const r = el.getBoundingClientRect()
            return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top }
        }
        const a = centre(from)
        return [...neighboursOf(skill)].flatMap((other) => {
            const el = dotRefs.current.get(other)
            if (!el) return []
            const b = centre(el)
            const bow = Math.min(90, Math.hypot(b.x - a.x, b.y - a.y) * 0.25)
            return [{ key: other, d: `M${a.x} ${a.y} Q${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - bow} ${b.x} ${b.y}` }]
        })
    }

    const focusSkill = (skill: string | null) => {
        if (skill) setDrawn({ source: skill, links: measureLinks(skill) })
        onFocus(skill)
    }

    // Cells rise in, then their skills.
    useGSAP(() => {
        gsap.utils.toArray<HTMLElement>("[data-cell]").forEach((cell, i) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: cell, start: "top 90%" }, delay: (i % 4) * 0.08 })
            tl.fromTo(cell.querySelector("[data-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.inOut", transformOrigin: "left center" })
                .fromTo(cell.querySelectorAll("[data-reveal]"), { opacity: 0, y: 10 }, {
                    opacity: 1, y: 0, duration: 0.45, stagger: 0.035, ease: "power2.out", clearProps: "opacity,transform",
                }, "-=0.45")
        })
    }, { scope: gridRef })

    return (
        <div ref={gridRef} className="relative">
            <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-14">
                {skills.map((group, gi) => {
                    const cellHits = querying && group.items.some((s) => matches.has(s))
                    const cellDim = querying && !cellHits
                    return (
                        <div key={group.category} data-cell className={`relative pb-12 pt-6 transition-opacity duration-500 ${cellDim ? "opacity-40" : "opacity-100"}`}>
                            <div data-rule className="absolute inset-x-0 top-0 h-px bg-white/12" />

                            <div data-reveal className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em]">
                                <span className="text-gold">
                                    <span className="text-gold/55">{String(gi + 1).padStart(2, "0")}</span> {group.category}
                                </span>
                                <span className="text-white/30">{String(group.items.length).padStart(2, "0")}</span>
                            </div>
                            {gi === 0 && (
                                <p data-reveal className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">what I do day to day</p>
                            )}

                            <ul className="mt-5 flex flex-col gap-1">
                                {group.items.map((skill) => {
                                    const score = matches.get(skill)
                                    const hit = score !== undefined
                                    const isFocus = focus === skill
                                    const isNeighbour = neighbours.has(skill)
                                    const dim = (querying && !hit) || (focus !== null && !isFocus && !isNeighbour)
                                    return (
                                        <li key={skill} data-reveal>
                                            <button
                                                type="button"
                                                onMouseEnter={() => focusSkill(skill)}
                                                onMouseLeave={() => focusSkill(null)}
                                                onFocus={() => focusSkill(skill)}
                                                onBlur={() => focusSkill(null)}
                                                onClick={() => focusSkill(isFocus ? null : skill)}
                                                aria-pressed={isFocus}
                                                data-cursor="used in"
                                                className={`group flex w-full items-center gap-3 py-1.5 text-left transition-opacity duration-300 ${dim ? "opacity-30" : "opacity-100"}`}
                                            >
                                                <span
                                                    ref={(el) => { if (el) dotRefs.current.set(skill, el); else dotRefs.current.delete(skill) }}
                                                    className={`size-1.5 shrink-0 rounded-full transition-colors duration-300
                                                        ${isFocus || hit ? "bg-gold" : isNeighbour ? "bg-gold/80" : "bg-white/25 group-hover:bg-white/60"}`}
                                                />
                                                <span
                                                    className={`text-base font-light leading-snug tracking-[-0.005em] transition-colors duration-300 lg:text-[17px]
                                                        ${isFocus || hit ? "text-white" : isNeighbour ? "text-gold" : "text-white/75 group-hover:text-white"}`}
                                                >
                                                    {skill}
                                                </span>
                                                {hit && (
                                                    <span className="ml-auto shrink-0 bg-gold px-1 font-mono text-[9px] leading-3.5 text-ink animate-[fadeIn_0.3s_ease-out_both]">
                                                        {score.toFixed(2)}
                                                    </span>
                                                )}
                                                {isNeighbour && !hit && (
                                                    <span className="ml-auto shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-gold/70 animate-[fadeIn_0.3s_ease-out_both]">
                                                        related
                                                    </span>
                                                )}
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </div>

            {/* Links — only while a skill is focused */}
            <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
                {links.map((l) => (
                    <path
                        key={`${focus}-${l.key}`}
                        d={l.d}
                        pathLength={1}
                        fill="none"
                        stroke="var(--color-gold)"
                        strokeOpacity="0.7"
                        strokeWidth="1"
                        className="animate-[drawLine_0.6s_cubic-bezier(0.65,0,0.35,1)_both]"
                    />
                ))}
            </svg>
        </div>
    )
}

export default SkillAtlas
