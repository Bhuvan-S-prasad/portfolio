import { useRef } from "react"
import { focusAreas } from "../constants/Index"
import AnimatedHeader from "./UI/AnimatedHeader"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const FocusArea = () => {
    const rowRefs = useRef<(HTMLDivElement | null)[]>([])
    const lineRefs = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        focusAreas.forEach((_, index) => {
            const row = rowRefs.current[index]
            const line = lineRefs.current[index]
            if (!row || !line) return

            const number = row.querySelector(".area-number")
            const title = row.querySelector(".area-title")
            const desc = row.querySelector(".area-desc")
            const tags = row.querySelectorAll(".area-tag")

            // Set initial states — everything hidden
            gsap.set(line, { scaleX: 0, transformOrigin: "left center" })
            if (number) gsap.set(number, { opacity: 0, y: 10 })
            if (title) gsap.set(title, { opacity: 0, y: 30 })
            if (desc) gsap.set(desc, { opacity: 0, y: 20 })
            if (tags.length) gsap.set(tags, { opacity: 0, y: 10 })

            // Per-row choreographed timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: line,
                    start: "top 85%",
                },
            })

            // 1 — Divider line draws from left
            tl.to(line, {
                scaleX: 1,
                duration: 0.9,
                ease: "power3.inOut",
            })

            // 2 — Number appears
            if (number) {
                tl.to(number, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: "power2.out",
                }, "-=0.4")
            }

            // 3 — Title slides up
            if (title) {
                tl.to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: "power3.out",
                }, "-=0.3")
            }

            // 4 — Description fades in
            if (desc) {
                tl.to(desc, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out",
                }, "-=0.4")
            }

            // 5 — Tags stagger in
            if (tags.length) {
                tl.to(tags, {
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    stagger: 0.07,
                    ease: "power2.out",
                }, "-=0.2")
            }
        })

        // Final divider line
        const finalLine = lineRefs.current[focusAreas.length]
        if (finalLine) {
            gsap.set(finalLine, { scaleX: 0, transformOrigin: "left center" })
            gsap.to(finalLine, {
                scaleX: 1,
                duration: 0.9,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: finalLine,
                    start: "top 90%",
                },
            })
        }
    }, [])

    return (
        <section id="expertise" className="min-h-screen bg-black rounded-t-4xl">
            <AnimatedHeader
                title="Expertise"
                subTitle="What drives my work"
                text={"My work spans deep learning, explainable AI, and LLM-powered applications —built with a focus on reliability, interpretability, and real-world impact."}
                textColor="text-white"
                withScrollTrigger={true}
            />

            {/* Editorial numbered list */}
            <div className="px-6 sm:px-10 pb-16 sm:pb-24 lg:pb-32">
                {focusAreas.map((area, index) => (
                    <div key={index}>
                        {/* Divider — draws from left on scroll */}
                        <div
                            ref={(el) => { lineRefs.current[index] = el }}
                            className="h-px bg-white/10"
                        />

                        {/* Content row — 3-column grid on desktop */}
                        <div
                            ref={(el) => { rowRefs.current[index] = el }}
                            className="grid grid-cols-1 md:grid-cols-[3.5rem_1fr_1fr]
                                gap-3 md:gap-x-10 lg:gap-x-16
                                py-10 sm:py-12 lg:py-14"
                        >
                            {/* Index number */}
                            <span className="area-number text-sm text-white/20 font-light tabular-nums">
                                {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Area title */}
                            <h2 className="area-title text-2xl sm:text-3xl lg:text-4xl font-light text-white leading-tight tracking-tight">
                                {area.title}
                            </h2>

                            {/* Description + sub-item tags */}
                            <div className="flex flex-col gap-5 md:gap-6">
                                <p className="area-desc text-sm sm:text-base lg:text-lg font-light text-white/50 leading-relaxed">
                                    {area.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-2">
                                    {area.items.map((item, i) => (
                                        <span key={i} className="area-tag flex items-center gap-3 sm:gap-4">
                                            <span className="text-[10px] sm:text-xs uppercase tracking-[0.15rem] sm:tracking-widest text-white/30 font-light">
                                                {item.title}
                                            </span>
                                            {i < area.items.length - 1 && (
                                                <span className="text-gold text-[6px] sm:text-[8px]">●</span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Final divider */}
                <div
                    ref={(el) => { lineRefs.current[focusAreas.length] = el }}
                    className="h-px bg-white/10"
                />
            </div>
        </section>
    )
}

export default FocusArea