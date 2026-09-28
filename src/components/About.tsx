import { useState } from "react"
import AnimatedHeader from "./UI/AnimatedHeader"
import TorchEffect from "./UI/TorchEffect"
import AttributedText from "./annotate/AttributedText"
import { profile, aboutAttribution } from "../content/profile"

const About = () => {
    const [explaining, setExplaining] = useState(false)

    // A lead paragraph at full size, then the detail a step smaller.
    const paragraphs = (
        <div className="flex max-w-6xl flex-col gap-6 md:gap-10">
            {profile.about.body.map((text, i) => (
                <p key={i} className={i === 0 ? "" : "text-base sm:text-lg md:text-2xl lg:text-3xl font-light text-white/85 leading-relaxed"}>
                    <AttributedText text={text} weights={aboutAttribution} active={explaining} />
                </p>
            ))}
        </div>
    )

    return (
        <section id="about" className="min-h-screen">
            <AnimatedHeader
                title="About Me"
                subTitle="Who Am I?"
                text={profile.about.heading}
                textColor="text-white"
                withScrollTrigger={true}
            />

            {/* Explain toggle + legend */}
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 sm:px-8 md:px-20 pt-10 md:pt-14">
                <button
                    type="button"
                    aria-pressed={explaining}
                    onClick={() => setExplaining((v) => !v)}
                    data-cursor={explaining ? "hide" : "explain"}
                    className="flex items-center gap-2.5 rounded-full border border-white/15 px-4 py-2
                        font-mono text-[11px] uppercase tracking-[0.14em] text-white/60
                        transition-colors duration-300 hover:border-gold/60 hover:text-white"
                >
                    <span className={`size-1.5 rounded-full transition-colors duration-300 ${explaining ? "bg-ember" : "bg-gold"}`} />
                    {explaining ? "Hide attribution" : "Explain this text"}
                </button>

                <div
                    aria-hidden={!explaining}
                    className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40
                        transition-opacity duration-500 ${explaining ? "opacity-100" : "opacity-0"}`}
                >
                    <span>low</span>
                    <span
                        className="h-1.5 w-24 rounded-full"
                        style={{ background: "linear-gradient(90deg, rgb(207 163 85 / 0.15), var(--color-gold), var(--color-ember))" }}
                    />
                    <span>high</span>
                    <span className="text-white/25">· illustrative weights</span>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="block md:hidden px-5 sm:px-8 py-12 sm:py-16">
                    <div className="text-lg sm:text-xl font-light tracking-wide text-white/90 leading-relaxed">
                        {paragraphs}
                    </div>
                </div>

                <div className="hidden md:block">
                    <TorchEffect revealed={explaining}>{paragraphs}</TorchEffect>
                </div>
            </div>
        </section>
    )
}

export default About
