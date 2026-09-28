import { useRef } from "react"
import AnimatedHeader from "./UI/AnimatedHeader"
import Plane from "./UI/Plane"
import { trajectory } from "../content/trajectory"
import { gsap, useGSAP, prefersReducedMotion } from "../lib/motion"

// Chart space. The SVG stretches to its box (preserveAspectRatio="none"), so
// round things — markers, the tip dot — are HTML placed by percentage.
const W = 1000
const H = 360
const PAD = 28
const SAMPLES = 180
const LIFT_FROM = 0.74

/** Capability over training: fast learning, a plateau, then a gentle lift. */
const capability = (x: number) => {
    const learn = 0.6 * (1 - Math.exp(-3.4 * x))
    const lift = x > LIFT_FROM ? Math.pow((x - LIFT_FROM) / (1 - LIFT_FROM), 2.2) * 0.32 : 0
    return 0.05 + learn + lift
}

/** Deterministic "training noise" that settles as the run goes on. */
const noise = (x: number) =>
    (Math.sin(x * 97) * 0.5 + Math.sin(x * 213 + 1.3) * 0.3 + Math.sin(x * 431 + 2.1) * 0.2) * 0.055 * (1 - x * 0.75)

const toY = (v: number) => H - PAD - v * (H - PAD * 2)

const path = (fn: (x: number) => number) =>
    Array.from({ length: SAMPLES + 1 }, (_, i) => {
        const x = i / SAMPLES
        return `${i ? "L" : "M"}${(x * W).toFixed(1)} ${toY(fn(x)).toFixed(1)}`
    }).join("")

const SMOOTH = path(capability)
const RAW = path((x) => capability(x) + noise(x))

const pct = (x: number) => `${x * 100}%`
const topPct = (x: number) => `${(toY(capability(x)) / H) * 100}%`

/**
 * "Trajectory" — degree → projects → AI Engineer, told as a training run.
 * The curve draws with scroll, flown by a small plane whose contrail is the
 * curve itself; each checkpoint lights up as the run passes it, and the plane
 * pitches up and climbs out at the end — the section's nod to aerospace.
 */
const Trajectory = () => {
    const blockRef = useRef<HTMLDivElement>(null)
    const clipRef = useRef<SVGRectElement>(null)
    const tipRef = useRef<HTMLDivElement>(null)
    const readoutRef = useRef<HTMLSpanElement>(null)
    const planeRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const block = blockRef.current
        if (!block) return
        const q = gsap.utils.selector(block)
        const ckpts = trajectory.checkpoints

        const render = (x: number) => {
            clipRef.current?.setAttribute("width", String(x * W))
            if (tipRef.current) {
                tipRef.current.style.left = pct(x)
                tipRef.current.style.top = topPct(x)
                tipRef.current.style.opacity = x > 0.005 ? "1" : "0"
            }
            // Pitch the plane to the curve's slope as drawn (the chart is stretched to its box).
            if (planeRef.current && chartRef.current) {
                const e = 0.004
                const a = Math.max(0, x - e)
                const b = Math.min(1, x + e)
                const dy = (capability(b) - capability(a)) * ((H - PAD * 2) / H) * chartRef.current.clientHeight
                const dx = (b - a) * chartRef.current.clientWidth
                const pitch = Math.min(32, (Math.atan2(dy, dx) * 180) / Math.PI)
                planeRef.current.style.transform = `rotate(${-pitch}deg)`
            }
            if (readoutRef.current) {
                readoutRef.current.style.opacity = x < 0.995 ? "1" : "0"
                const step = String(Math.round(x * 24000)).padStart(5, "0")
                readoutRef.current.textContent = `step ${step} · ${capability(x).toFixed(2)}`
                // Keep the readout inside the chart: right of the tip early on, left of it later.
                const early = x < 0.3
                readoutRef.current.style.left = early ? "12px" : "auto"
                readoutRef.current.style.right = early ? "auto" : "12px"
            }
            ckpts.forEach((c, i) => {
                const on = String(x >= c.at)
                q(`[data-ckpt="${i}"]`).forEach((el) => { el.dataset.on = on })
            })
        }

        if (prefersReducedMotion()) {
            render(1)
            return
        }

        const state = { x: 0 }
        render(0)
        gsap.to(state, {
            x: 1,
            ease: "none",
            onUpdate: () => render(state.x),
            // Fly the whole run while the chart is on screen, so the climb-out is seen.
            scrollTrigger: {
                trigger: chartRef.current,
                start: "top 85%",
                end: "bottom 40%",
                scrub: 0.8,
            },
        })
    }, { scope: blockRef })

    return (
        <section id="trajectory" className="relative pb-16 sm:pb-20 text-white">
            <AnimatedHeader
                title={trajectory.title}
                subTitle={trajectory.subTitle}
                text={trajectory.text}
                textColor="text-white"
                withScrollTrigger={true}
            />

            <div ref={blockRef} className="px-6 sm:px-10 pt-6 sm:pt-10">
                {/* ── Chart ── */}
                <div className="relative">
                    <div className="flex items-end justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                        <span className="flex items-center gap-2">
                            <span className="h-px w-5 bg-gold" /> capability
                            <span className="ml-3 h-px w-5 bg-white/25" /> raw
                        </span>
                        <span className="hidden sm:inline">one training run · illustrative</span>
                    </div>

                    <div ref={chartRef} className="relative h-50 sm:h-70 lg:h-85">
                        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
                            <defs>
                                <clipPath id="trajectory-reveal">
                                    <rect ref={clipRef} x="0" y="-40" width="0" height={H + 80} />
                                </clipPath>
                                <linearGradient id="trajectory-fill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0" stopColor="var(--color-gold)" stopOpacity="0.16" />
                                    <stop offset="1" stopColor="var(--color-gold)" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {[0.25, 0.5, 0.75].map((v) => (
                                <line key={v} x1="0" x2={W} y1={toY(v)} y2={toY(v)}
                                    stroke="white" strokeOpacity="0.06" strokeDasharray="2 6" vectorEffect="non-scaling-stroke" />
                            ))}
                            <line x1="0" x2={W} y1={H - PAD} y2={H - PAD} stroke="white" strokeOpacity="0.18" vectorEffect="non-scaling-stroke" />

                            {trajectory.checkpoints.map((c) => (
                                <line key={c.at} x1={c.at * W} x2={c.at * W} y1={toY(capability(c.at))} y2={H - PAD}
                                    stroke="var(--color-gold)" strokeOpacity="0.35" strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
                            ))}

                            <g clipPath="url(#trajectory-reveal)">
                                <path d={`${SMOOTH}L${W} ${H - PAD}L0 ${H - PAD}Z`} fill="url(#trajectory-fill)" />
                                <path d={RAW} fill="none" stroke="white" strokeOpacity="0.28" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                                <path d={SMOOTH} fill="none" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                            </g>
                        </svg>

                        {/* Checkpoint markers */}
                        {trajectory.checkpoints.map((c, i) => (
                            <div
                                key={c.at}
                                data-ckpt={i}
                                aria-hidden
                                className="group absolute -translate-x-1/2 -translate-y-1/2"
                                style={{ left: pct(c.at), top: topPct(c.at) }}
                            >
                                <span className="block size-3 rounded-full border border-gold bg-black transition-all duration-500
                                    group-data-[on=true]:scale-125 group-data-[on=true]:bg-gold" />
                                <span className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 font-mono text-[10px] tracking-widest text-white/30
                                    transition-colors duration-500 group-data-[on=true]:text-gold">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                            </div>
                        ))}

                        {/* The run's tip: a plane flying the curve (the gold line is its contrail) */}
                        <div ref={tipRef} aria-hidden className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 opacity-0">
                            <div ref={planeRef} className="origin-center will-change-transform" style={{ translate: "-30% 0" }}>
                                <Plane className="h-6 w-16 drop-shadow-[0_0_12px_rgb(207_163_85/0.5)] sm:h-7.5 sm:w-20" />
                            </div>
                            <span
                                ref={readoutRef}
                                className="absolute bottom-6 whitespace-nowrap sm:bottom-7 transition-opacity duration-300 bg-gold px-1.5 py-px font-mono text-[10px] leading-3.5 tracking-[0.06em] text-ink"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                        training steps →
                    </div>
                </div>

                {/* ── Checkpoint notes: stacked on mobile, pinned under their markers on desktop ── */}
                <ol className="relative mt-10 grid gap-10 md:mt-6 md:block md:h-56 lg:h-52">
                    {trajectory.checkpoints.map((c, i) => (
                        <li
                            key={c.at}
                            data-ckpt={i}
                            className="transition-[opacity,translate] duration-700 ease-out opacity-25 translate-y-2
                                data-[on=true]:opacity-100 data-[on=true]:translate-y-0
                                md:absolute md:top-0 md:w-[22%] md:-ml-1.5"
                            style={{ left: pct(c.at) }}
                        >
                            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">{c.tag}</p>
                            <h3 className="mt-3 text-2xl lg:text-3xl font-extralight tracking-[-0.02em]">{c.title}</h3>
                            <p className="mt-3 text-sm lg:text-base font-light leading-relaxed text-white/55">{c.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}

export default Trajectory
