import { useRef } from "react"
import AnimatedHeader from "./UI/AnimatedHeader"
import TorchEffect from "./UI/TorchEffect"
import { gsap, useGSAP } from "../lib/motion"
import { profile } from "../content/profile"

const About = () => {
    const sectionRef = useRef<HTMLElement>(null)

    useGSAP(() => {
        gsap.to(sectionRef.current, {
            scale: 0.95,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "bottom 80%",
                end: "bottom 20%",
                scrub: true,
            },
            ease: "power1.out",
        });
    }, { scope: sectionRef })

    return (
        <section id="about" ref={sectionRef}
            className="min-h-screen bg-black rounded-b-4xl"
        >
            <AnimatedHeader
                title="About Me"
                subTitle="Who Am I?"
                text={profile.about.heading}
                textColor="text-white"
                withScrollTrigger={true}
            />
            <div className="flex flex-col items-center justify-center rounded-b-4xl">
                <div className="block md:hidden px-5 sm:px-8 py-12 sm:py-16">
                    <p className="text-lg sm:text-xl font-light tracking-wide text-white/90 leading-relaxed">
                        {profile.about.body}
                    </p>
                </div>

                <div className="hidden md:block">
                    <TorchEffect text={profile.about.body} />
                </div>
            </div>
        </section>
    )
}

export default About
