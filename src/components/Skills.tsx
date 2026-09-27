import { useRef } from 'react'
import { gsap, useGSAP } from '../lib/motion'
import { skills } from '../content/skills'
import AnimatedHeader from './UI/AnimatedHeader'

const Skills = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const blockRefs = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        // Per-block choreographed animation
        skills.forEach((_, index) => {
            const block = blockRefs.current[index]
            if (!block) return

            const line = block.querySelector('.skill-line')
            const label = block.querySelector('.skill-label')
            const tags = block.querySelectorAll('.skill-tag')

            gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
            if (label) gsap.set(label, { opacity: 0, y: 12 })
            if (tags.length) gsap.set(tags, { opacity: 0, y: 10 })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: block,
                    start: 'top 88%',
                },
            })

            tl.to(line, {
                scaleX: 1,
                duration: 0.7,
                ease: 'power3.inOut',
            })

            if (label) {
                tl.to(label, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out',
                }, '-=0.3')
            }

            if (tags.length) {
                tl.to(tags, {
                    opacity: 1,
                    y: 0,
                    duration: 0.35,
                    stagger: 0.04,
                    ease: 'power2.out',
                }, '-=0.2')
            }
        })
    }, [])

    return (
        <section
            ref={sectionRef}
            id="skills"
            className="relative pb-20 sm:pb-28 md:pb-36 lg:pb-44 overflow-hidden bg-neutral-950 rounded-t-4xl"
        >
            <AnimatedHeader
                title="Skills"
                subTitle="What I work with"
                text={"The languages, frameworks and platforms\nI use to take an idea from a notebook\nto a working tool."}
                textColor="text-white"
                withScrollTrigger={true}
            />

            {/* Skills Grid */}
            <div className="px-6 sm:px-10 pt-6 sm:pt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 xl:gap-x-28">
                    {skills.map((group, index) => (
                        <div
                            key={index}
                            ref={(el) => { blockRefs.current[index] = el }}
                            className="py-7 sm:py-9"
                        >
                            {/* Animated divider line */}
                            <div className="skill-line h-px bg-white/10 mb-5 sm:mb-6" />

                            {/* Category label */}
                            <p className="skill-label text-[10px] sm:text-xs uppercase tracking-[0.2rem] sm:tracking-[0.3rem] text-gold font-light mb-4 sm:mb-5">
                                {group.category}
                            </p>

                            {/* Skill tags */}
                            <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-2.5 sm:gap-y-3">
                                {group.items.map((item, i) => (
                                    <span
                                        key={i}
                                        className="skill-tag flex items-center gap-2.5 sm:gap-3"
                                    >
                                        <span className="text-sm sm:text-base lg:text-lg font-extralight text-white/70 tracking-wide">
                                            {item}
                                        </span>
                                        {i < group.items.length - 1 && (
                                            <span className="text-gold text-[5px] sm:text-[6px]">●</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer tagline */}
            <div className="absolute bottom-8 sm:bottom-12 right-6 sm:right-10 text-right">
                <p className="text-[10px] sm:text-xs md:text-sm text-white/20 tracking-widest uppercase">
                    Always Learning
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm text-white/20 tracking-widest uppercase">
                    Always Building
                </p>
            </div>
        </section>
    )
}

export default Skills