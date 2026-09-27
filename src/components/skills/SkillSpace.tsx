import { useEffect, useMemo, useRef, useState } from "react"
import { skills } from "../../content/skills"
import { clusterCentres, related } from "../../content/skillSpace"
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/motion"

type Node = { id: string; label: string; group: number; cluster: boolean }
type Point = { x: number; y: number }

const NODES: Node[] = skills.flatMap((g, gi) => [
    { id: `cluster:${g.category}`, label: g.category, group: gi, cluster: true },
    ...g.items.map((item) => ({ id: item, label: item, group: gi, cluster: false })),
])
const INDEX = new Map(NODES.map((n, i) => [n.id, i]))
const CLUSTER_OF = NODES.map((n) => NODES.findIndex((c) => c.cluster && c.group === n.group))

const PAD_X = 18
const PAD_Y = 8

/**
 * Seeds each label around its cluster centre, then relaxes overlaps so no two
 * labels collide — a hand-placed "embedding" that stays legible at any width.
 */
const layout = (w: number, h: number, sizes: { w: number; h: number }[]): Point[] => {
    const counts = new Map<number, number>()
    const target = NODES.map((n) => {
        const c = clusterCentres[skills[n.group].category]
        const cx = c.x * w
        const cy = c.y * h
        if (n.cluster) return { x: cx, y: cy }
        const k = counts.get(n.group) ?? 0
        counts.set(n.group, k + 1)
        const angle = k * 2.39996 + n.group
        const r = 30 + 24 * Math.sqrt(k + 1)
        return { x: cx + Math.cos(angle) * r * 1.9, y: cy + Math.sin(angle) * r * 0.9 }
    })
    const p = target.map((t) => ({ ...t }))

    const ITERS = 320
    const SETTLE = 80 // final passes without the pull back to the seed, so nothing is left touching
    for (let iter = 0; iter < ITERS + SETTLE; iter++) {
        const spring = iter < ITERS ? 0.03 : 0
        for (let i = 0; i < p.length; i++) {
            for (let j = i + 1; j < p.length; j++) {
                const ox = (sizes[i].w + sizes[j].w) / 2 + PAD_X - Math.abs(p[i].x - p[j].x)
                const oy = (sizes[i].h + sizes[j].h) / 2 + PAD_Y - Math.abs(p[i].y - p[j].y)
                if (ox <= 0 || oy <= 0) continue
                // Push apart along the axis of least overlap; cluster labels are heavier.
                const wi = NODES[i].cluster ? 0.2 : 0.5
                const wj = NODES[j].cluster ? 0.2 : 0.5
                if (ox / sizes[i].w < oy / sizes[i].h) {
                    const s = p[i].x < p[j].x ? -1 : 1
                    p[i].x += s * ox * wi
                    p[j].x -= s * ox * wj
                } else {
                    const s = p[i].y < p[j].y ? -1 : 1
                    p[i].y += s * oy * wi
                    p[j].y -= s * oy * wj
                }
            }
        }
        for (let i = 0; i < p.length; i++) {
            p[i].x += (target[i].x - p[i].x) * spring
            p[i].y += (target[i].y - p[i].y) * spring
            p[i].x = Math.min(w - sizes[i].w / 2 - 4, Math.max(sizes[i].w / 2 + 4, p[i].x))
            p[i].y = Math.min(h - sizes[i].h / 2 - 4, Math.max(sizes[i].h / 2 + 4, p[i].y))
        }
    }
    return p
}

interface SkillSpaceProps {
    matches: Map<string, number>
    querying: boolean
    focus: string | null
    onFocus: (skill: string | null) => void
}

/** The desktop Skills map: clusters, relations, search highlights. */
const SkillSpace = ({ matches, querying, focus, onFocus }: SkillSpaceProps) => {
    const boxRef = useRef<HTMLDivElement>(null)
    const nodeRefs = useRef<(HTMLElement | null)[]>([])
    const [pos, setPos] = useState<Point[] | null>(null)
    const [sizes, setSizes] = useState<{ w: number; h: number }[]>([])
    const [size, setSize] = useState({ w: 1, h: 1 })

    // Measure labels, lay them out, and redo it whenever the map resizes.
    useEffect(() => {
        const box = boxRef.current
        if (!box) return
        const ro = new ResizeObserver(() => {
            const w = box.clientWidth
            const h = box.clientHeight
            const measured = nodeRefs.current.map((el) => ({ w: el?.offsetWidth ?? 60, h: el?.offsetHeight ?? 20 }))
            setSize({ w, h })
            setSizes(measured)
            setPos(layout(w, h, measured))
        })
        ro.observe(box)
        return () => ro.disconnect()
    }, [])

    // Reveal cluster by cluster once the layout exists.
    useGSAP(() => {
        if (!pos || !boxRef.current) return
        const q = gsap.utils.selector(boxRef)
        if (prefersReducedMotion()) return
        // Explicit end values: the nodes carry CSS opacity transitions, so reading
        // the "current" value here could capture a mid-transition 0.
        gsap.fromTo(q("[data-node]"), { opacity: 0, y: 10 }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: { each: 0.018, from: "start" },
            clearProps: "opacity,transform,translate,rotate,scale",
            scrollTrigger: { trigger: boxRef.current, start: "top 75%" },
        })
        gsap.from(q("[data-edge]"), {
            opacity: 0,
            duration: 1.2,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: { trigger: boxRef.current, start: "top 75%" },
        })
    }, { scope: boxRef, dependencies: [pos === null] })

    const focusIndex = focus ? INDEX.get(focus) ?? -1 : -1
    const relatedTo = useMemo(() => {
        const set = new Set<string>()
        if (!focus) return set
        related.forEach(([a, b]) => {
            if (a === focus) set.add(b)
            if (b === focus) set.add(a)
        })
        return set
    }, [focus])

    // Labels are anchored by their left edge (so a score chip can grow to the
    // right without moving the dot); edges attach to the dot.
    const leftOf = (i: number) => (pos ? pos[i].x - (sizes[i]?.w ?? 0) / 2 : 0)
    const dotOf = (i: number): Point | null => {
        if (!pos) return null
        return NODES[i].cluster ? pos[i] : { x: leftOf(i) + 3, y: pos[i].y }
    }

    return (
        <div ref={boxRef} className="relative h-[min(40rem,68vh)] w-full">
            {/* ── Edges ── */}
            {pos && (
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${size.w} ${size.h}`} aria-hidden>
                    {NODES.map((n, i) => {
                        if (n.cluster) return null
                        const a = dotOf(i)
                        const b = pos[CLUSTER_OF[i]]
                        if (!a || !b) return null
                        const on = focusIndex === i || (querying && matches.has(n.id))
                        return (
                            <line
                                key={n.id}
                                data-edge
                                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                                stroke={on ? "var(--color-gold)" : "white"}
                                strokeOpacity={on ? 0.5 : querying ? 0.03 : 0.07}
                                className="transition-[stroke-opacity] duration-500"
                            />
                        )
                    })}
                    {related.map(([from, to]) => {
                        const i = INDEX.get(from)
                        const j = INDEX.get(to)
                        if (i === undefined || j === undefined) return null
                        const a = dotOf(i)
                        const b = dotOf(j)
                        if (!a || !b) return null
                        const mx = (a.x + b.x) / 2
                        const my = (a.y + b.y) / 2 - Math.abs(a.x - b.x) * 0.12
                        const on = focus === from || focus === to || (querying && matches.has(from) && matches.has(to))
                        return (
                            <path
                                key={`${from}-${to}`}
                                data-edge
                                d={`M${a.x} ${a.y} Q${mx} ${my} ${b.x} ${b.y}`}
                                fill="none"
                                stroke="var(--color-gold)"
                                strokeOpacity={on ? 0.75 : querying ? 0.04 : 0.14}
                                strokeDasharray={on ? "0" : "2 5"}
                                className="transition-[stroke-opacity] duration-500"
                            />
                        )
                    })}
                </svg>
            )}

            {/* ── Nodes ── */}
            {NODES.map((n, i) => {
                const p = pos?.[i]
                const style = p
                    ? { left: leftOf(i), top: p.y }
                    : { left: `${clusterCentres[skills[n.group].category].x * 100}%`, top: `${clusterCentres[skills[n.group].category].y * 100}%`, opacity: 0 }

                if (n.cluster) {
                    return (
                        <p
                            key={n.id}
                            ref={(el) => { nodeRefs.current[i] = el }}
                            data-node
                            className={`absolute -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-gold transition-opacity duration-500
                                ${querying ? "opacity-40" : "opacity-90"}`}
                            style={style}
                        >
                            {n.label}
                        </p>
                    )
                }

                const score = matches.get(n.id)
                const hit = score !== undefined
                const isFocus = focus === n.id
                const dim = (querying && !hit) || (focus !== null && !isFocus && !relatedTo.has(n.id) && !(querying && hit))
                return (
                    <button
                        key={n.id}
                        ref={(el) => { nodeRefs.current[i] = el }}
                        type="button"
                        data-node
                        data-cursor="used in"
                        onMouseEnter={() => onFocus(n.id)}
                        onMouseLeave={() => onFocus(null)}
                        onFocus={() => onFocus(n.id)}
                        onBlur={() => onFocus(null)}
                        className={`absolute flex -translate-y-1/2 items-center gap-2 whitespace-nowrap py-0.5 text-left transition-opacity duration-500
                            ${dim ? "opacity-20" : "opacity-100"}`}
                        style={style}
                    >
                        <span className={`size-1.5 shrink-0 rounded-full transition-colors duration-300 ${hit || isFocus ? "bg-gold" : relatedTo.has(n.id) ? "bg-gold/70" : "bg-white/40"}`} />
                        <span className={`text-sm lg:text-[15px] font-light transition-colors duration-300 ${hit || isFocus ? "text-white" : relatedTo.has(n.id) ? "text-gold" : "text-white/65"}`}>
                            {n.label}
                        </span>
                        {hit && (
                            <span className="bg-gold px-1 font-mono text-[9px] leading-3.5 text-ink animate-[fadeIn_0.3s_ease-out_both]">
                                {score.toFixed(2)}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}

export default SkillSpace
