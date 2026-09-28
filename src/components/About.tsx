import AnimatedHeader from "./UI/AnimatedHeader"
import TorchEffect from "./UI/TorchEffect"
import { profile } from "../content/profile"

const About = () => {
    // A lead paragraph at full size, then the detail a step smaller.
    const paragraphs = (
        <div className="flex max-w-6xl flex-col gap-6 md:gap-10">
            {profile.about.body.map((text, i) => (
                <p key={i} className={i === 0 ? "" : "text-base sm:text-lg md:text-2xl lg:text-3xl font-light text-white/85 leading-relaxed"}>
                    {text}
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

            <div className="flex flex-col items-center justify-center">
                <div className="block md:hidden px-5 sm:px-8 py-12 sm:py-16">
                    <div className="text-lg sm:text-xl font-light tracking-wide text-white/90 leading-relaxed">
                        {paragraphs}
                    </div>
                </div>

                <div className="hidden md:block">
                    <TorchEffect>{paragraphs}</TorchEffect>
                </div>
            </div>
        </section>
    )
}

export default About
