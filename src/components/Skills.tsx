import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skills = {
    languages: ['Python', 'JavaScript', 'TypeScript', 'HTML', 'CSS'],
    frameworks: ['React', 'Next.js', 'PyTorch', 'TensorFlow', 'MongoDB'],
    domains: [
        'Machine Learning',
        'Deep Learning',
        'Computer Vision',
        'Generative AI',
        'Agentic AI',
        'Web Development'
    ]
}

const Skills = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const row1Ref = useRef<HTMLDivElement>(null)
    const row2Ref = useRef<HTMLDivElement>(null)
    const row3Ref = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const mobileRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        gsap.from(headerRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            }
        })

        const mm = gsap.matchMedia()

        mm.add("(min-width: 768px)", () => {
            gsap.to(row1Ref.current, {
                xPercent: 15,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            })

            gsap.to(row2Ref.current, {
                xPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                }
            })

            gsap.to(row3Ref.current, {
                xPercent: 10,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 0.5,
                }
            })

            const skillItems = gsap.utils.toArray('.skill-item') as HTMLElement[]
            skillItems.forEach((item) => {
                gsap.from(item, {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse',
                    }
                })
            })
        })

        mm.add("(max-width: 767px)", () => {
            const mobileItems = gsap.utils.toArray('.mobile-skill-item') as HTMLElement[]
            gsap.from(mobileItems, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.05,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: mobileRef.current,
                    start: 'top 85%',
                }
            })
        })

    }, [])

    return (
        <section
            ref={sectionRef}
            id="skills"
            className="relative py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden bg-neutral-950"
        >
            <div ref={headerRef} className="px-5 sm:px-8 md:px-16 lg:px-24 mb-10 sm:mb-16 md:mb-24">
                <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2rem] sm:tracking-[0.3rem] md:tracking-[0.5rem] uppercase text-white/40 mb-3 sm:mb-4">
                    What I Work With
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white uppercase tracking-tight">
                    Skills & Technologies
                </h2>
            </div>

            {/* Mobile Layout - Vertical Grid */}
            <div ref={mobileRef} className="block md:hidden px-5 sm:px-8">
                <div className="space-y-8">
                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.15rem] text-gold mb-4">Languages</p>
                        <div className="flex flex-wrap gap-3">
                            {skills.languages.map((skill, index) => (
                                <span
                                    key={index}
                                    className="mobile-skill-item text-lg sm:text-xl font-extralight text-white/90 uppercase tracking-wide"
                                >
                                    {skill}
                                    {index < skills.languages.length - 1 && <span className="ml-3 text-gold">•</span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.15rem] text-gold mb-4">Frameworks & Tools</p>
                        <div className="flex flex-wrap gap-3">
                            {skills.frameworks.map((skill, index) => (
                                <span
                                    key={index}
                                    className="mobile-skill-item text-lg sm:text-xl font-light text-white/70 uppercase tracking-wide italic"
                                >
                                    {skill}
                                    {index < skills.frameworks.length - 1 && <span className="ml-3 text-white/30">—</span>}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.15rem] text-gold mb-4">Domains</p>
                        <div className="flex flex-col gap-2">
                            {skills.domains.map((skill, index) => (
                                <div
                                    key={index}
                                    className="mobile-skill-item flex items-center gap-2"
                                >
                                    <span className="text-gold text-sm">✦</span>
                                    <span className="text-base sm:text-lg font-extralight text-white/60 uppercase tracking-widest">
                                        {skill}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Layout - Horizontal Scrolling Rows */}
            <div className="hidden md:block space-y-8 sm:space-y-12 lg:space-y-16">
                <div
                    ref={row1Ref}
                    className="flex items-center gap-4 sm:gap-6 lg:gap-8 -translate-x-20 whitespace-nowrap"
                >
                    {[...skills.languages, ...skills.languages].map((skill, index) => (
                        <div
                            key={index}
                            className="skill-item flex items-center gap-4 sm:gap-6 lg:gap-8"
                        >
                            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white/90 uppercase tracking-wider">
                                {skill}
                            </span>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gold" />
                        </div>
                    ))}
                </div>

                <div
                    ref={row2Ref}
                    className="flex items-center gap-4 sm:gap-6 lg:gap-8 translate-x-20 whitespace-nowrap"
                >
                    {[...skills.frameworks, ...skills.frameworks].map((skill, index) => (
                        <div
                            key={index}
                            className="skill-item flex items-center gap-4 sm:gap-6 lg:gap-8"
                        >
                            <div className="w-8 sm:w-12 md:w-16 h-[2px] bg-linear-to-r from-transparent via-gold to-transparent" />
                            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white/70 uppercase tracking-wider italic">
                                {skill}
                            </span>
                        </div>
                    ))}
                </div>

                <div
                    ref={row3Ref}
                    className="flex items-center gap-6 sm:gap-8 lg:gap-12 -translate-x-32 whitespace-nowrap"
                >
                    {[...skills.domains, ...skills.domains].map((skill, index) => (
                        <div
                            key={index}
                            className="skill-item group flex items-center gap-4 sm:gap-6"
                        >
                            <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight text-white/50 uppercase tracking-widest 
                                           transition-colors duration-500 group-hover:text-gold">
                                {skill}
                            </span>
                            <span className="text-gold text-2xl sm:text-3xl opacity-50">✦</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute top-0 left-0 w-16 sm:w-24 md:w-32 lg:w-48 h-full bg-linear-to-r from-neutral-950 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-16 sm:w-24 md:w-32 lg:w-48 h-full bg-linear-to-l from-neutral-950 to-transparent pointer-events-none z-10" />

            <div className="absolute bottom-8 sm:bottom-12 right-5 sm:right-8 md:right-16 lg:right-24 text-right">
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