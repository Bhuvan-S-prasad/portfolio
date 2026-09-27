import { useRef } from "react"
import { skills } from "../../content/skills"
import { gsap, useGSAP } from "../../lib/motion"

interface SkillGridProps {
    matches: Map<string, number>
    querying: boolean
}

/** Phones and tablets: the skills as a grouped list, with the same search highlights. */
const SkillGrid = ({ matches, querying }: SkillGridProps) => {
    const gridRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.utils.toArray<HTMLElement>("[data-block]").forEach((block) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: block, start: "top 88%" } })
            tl.from(block.querySelector("[data-line]"), { scaleX: 0, transformOrigin: "left center", duration: 0.7, ease: "power3.inOut" })
                .from(block.querySelector("[data-label]"), { opacity: 0, y: 12, duration: 0.5, ease: "power2.out" }, "-=0.3")
                .from(block.querySelectorAll("[data-tag]"), { opacity: 0, y: 10, duration: 0.35, stagger: 0.04, ease: "power2.out" }, "-=0.2")
        })
    }, { scope: gridRef })

    return (
        <div ref={gridRef} className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {skills.map((group) => (
                <div key={group.category} data-block className="py-7 sm:py-9">
                    <div data-line className="mb-5 h-px bg-white/10 sm:mb-6" />
                    <p data-label className="mb-4 text-[10px] font-light uppercase tracking-[0.2rem] text-gold sm:mb-5 sm:text-xs sm:tracking-[0.3rem]">
                        {group.category}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2.5 sm:gap-x-3 sm:gap-y-3">
                        {group.items.map((item, i) => {
                            const score = matches.get(item)
                            const hit = score !== undefined
                            return (
                                <span key={item} data-tag className="flex items-center gap-2.5 sm:gap-3">
                                    <span
                                        className={`flex items-center gap-1.5 text-sm font-extralight tracking-wide transition-[color,opacity] duration-500 sm:text-base
                                            ${hit ? "text-white" : "text-white/70"} ${querying && !hit ? "opacity-25" : "opacity-100"}`}
                                    >
                                        {item}
                                        {hit && <span className="bg-gold px-1 font-mono text-[9px] leading-3.5 text-ink">{score.toFixed(2)}</span>}
                                    </span>
                                    {i < group.items.length - 1 && <span className="text-[5px] text-gold sm:text-[6px]">●</span>}
                                </span>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SkillGrid
