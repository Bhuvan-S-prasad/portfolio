import { useRef, useState } from "react"
import AnimatedHeader from "./UI/AnimatedHeader"
import PipelineVisual from "./approach/PipelineVisual"
import { approach } from "../content/approach"
import { ScrollTrigger, useGSAP } from "../lib/motion"

/**
 * "How I Work" — a scroll story over a live pipeline simulation. The visual
 * stays sticky while the five steps scroll past; each step changes what the
 * simulation shows (metrics → bottleneck → AI tool → result).
 */
const Approach = () => {
    const stepsRef = useRef<HTMLDivElement>(null)
    const [step, setStep] = useState(0)

    useGSAP(() => {
        const articles = stepsRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? []
        articles.forEach((article, i) => {
            ScrollTrigger.create({
                trigger: article,
                start: "top 60%",
                end: "bottom 60%",
                onToggle: (self) => { if (self.isActive) setStep(i) },
            })
        })
    }, { scope: stepsRef })

    return (
        <section id="approach" className="relative pb-16 sm:pb-24">
            <AnimatedHeader
                title={approach.title}
                subTitle={approach.subTitle}
                text={approach.text}
                textColor="text-black"
                withScrollTrigger={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-x-12 lg:gap-x-20 px-6 sm:px-10 pt-8 md:pt-0">
                {/* Sticky live visual — right column on desktop. On mobile it fills the
                    screen, with the active step's text in a card below the visual. */}
                <div className="sticky top-0 z-10 self-start md:order-2 flex h-svh md:h-screen flex-col bg-background py-6 md:py-[14vh]">
                    <div className="relative min-h-0 flex-1">
                        <PipelineVisual step={step} />
                    </div>
                    <div key={step} aria-hidden className="md:hidden pt-6 animate-[fadeIn_0.5s_ease-out_both]">
                        <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-black/50">
                            <span className="text-gold">{String(step + 1).padStart(2, "0")}</span>
                            <span className="h-px w-8 bg-black/20" />
                            step {step + 1} of {approach.steps.length}
                        </p>
                        <h3 className="mt-3 text-3xl font-extralight tracking-[-0.03em] text-black">
                            {approach.steps[step].title}
                        </h3>
                        <p className="mt-3 text-base font-light leading-relaxed text-black/60">
                            {approach.steps[step].body}
                        </p>
                    </div>
                </div>

                {/* The story. On mobile these scroll hidden beneath the sticky panel
                    and only drive which step is active. */}
                <div ref={stepsRef} className="md:order-1 md:py-[20vh]">
                    {approach.steps.map((s, i) => (
                        <article
                            key={s.title}
                            data-step={i}
                            className={`flex min-h-[70svh] md:min-h-[80vh] flex-col justify-center transition-opacity duration-500
                                ${step === i ? "opacity-100" : "opacity-25"}`}
                        >
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-black/50">
                                <span className="text-gold">{String(i + 1).padStart(2, "0")}</span>
                                <span className="h-px w-8 bg-black/20" />
                                step {i + 1} of {approach.steps.length}
                            </p>
                            <h3 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-[-0.03em] text-black">
                                {s.title}
                            </h3>
                            <p className="mt-5 max-w-[40ch] text-base sm:text-lg font-light leading-relaxed text-black/60">
                                {s.body}
                            </p>
                        </article>
                    ))}
                </div>
            </div>

            <p className="px-6 sm:px-10 pt-10 max-w-[80ch] font-mono text-[11px] leading-relaxed tracking-[0.04em] text-black/45">
                {approach.caption}
            </p>
        </section>
    )
}

export default Approach
