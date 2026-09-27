import SectionHeader from "./UI/SectionHeader"
import TorchEffect from "./UI/TorchEffect"
import { profile } from "../content/profile"

const About = () => {
    return (
        <section id="about" className="min-h-screen">
            <SectionHeader
                variant="indexed"
                tone="dark"
                index="02"
                label="About"
                title="Who I"
                accent="am"
                text={profile.about.heading}
            />
            <div className="block md:hidden px-6 sm:px-10 pb-16">
                <p className="text-lg sm:text-xl font-light tracking-wide text-white/90 leading-relaxed">
                    {profile.about.body}
                </p>
            </div>

            <div className="hidden md:block">
                <TorchEffect text={profile.about.body} />
            </div>
        </section>
    )
}

export default About
