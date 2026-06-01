import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skills = [
    {
        category: 'Languages',
        items: ['Python', 'JavaScript'],
    },
    {
        category: 'Data & Databases',
        items: ['SQL', 'PostgreSQL (pgvector)', 'NoSQL'],
    },
    {
        category: 'Modeling & Systems',
        items: ['Model Training', 'Fine-Tuning', 'Multi-Agent Systems'],
    },
    {
        category: 'AI Expertise',
        items: [
            'Machine Learning',
            'Deep Learning',
            'NLP',
            'Generative AI',
            'Explainable AI',
            'Agentic AI',
            'Context Engineering',
            'Retrieval-Augmented Generation',
        ],
    },
    {
        category: 'Web Development',
        items: ['React', 'Next.js', 'Flask'],
    },
    {
        category: 'Cloud & DevOps',
        items: ['AWS', 'Docker', 'CI / CD'],
    },
    {
        category: 'Machine Learning',
        items: [
            'Regression',
            'Classification',
            'Clustering',
            'Ensemble Learning',
            'Feature Engineering',
            'Model Training',
            'Evaluation & Optimization',
        ],
    },
    {
        category: 'Frameworks & Libraries',
        items: [
            'NumPy',
            'Pandas',
            'Matplotlib',
            'Seaborn',
            'PyTorch',
            'Scikit-learn',
            'TensorFlow',
            'LangChain',
            'LangGraph',
        ],
    },
]

const Skills = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const blockRefs = useRef<(HTMLDivElement | null)[]>([])

    useGSAP(() => {
        // Header reveal
        gsap.from(headerRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
        })

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
            className="relative py-20 sm:py-28 md:py-36 lg:py-44 overflow-hidden bg-neutral-950"
        >
            {/* Header */}
            <div ref={headerRef} className="px-6 sm:px-10 md:px-16 lg:px-24 mb-14 sm:mb-20 md:mb-28">
                <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.2rem] sm:tracking-[0.3rem] md:tracking-[0.5rem] uppercase text-white/40 mb-3 sm:mb-4">
                    What I Work With
                </p>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white uppercase tracking-tight">
                    Skills & Technologies
                </h2>
            </div>

            {/* Skills Grid */}
            <div className="px-6 sm:px-10 md:px-16 lg:px-24">
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

            {/* Edge gradient fades */}
            <div className="absolute top-0 left-0 w-8 sm:w-16 md:w-24 h-full bg-linear-to-r from-neutral-950 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 right-0 w-8 sm:w-16 md:w-24 h-full bg-linear-to-l from-neutral-950 to-transparent pointer-events-none z-10" />

            {/* Footer tagline */}
            <div className="absolute bottom-8 sm:bottom-12 right-6 sm:right-10 md:right-16 lg:right-24 text-right">
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