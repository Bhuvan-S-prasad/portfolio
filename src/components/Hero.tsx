import AnimatedHeader from "./UI/AnimatedHeader"
import { profile } from "../content/profile"

const Hero = ({ ready }: { ready: boolean }) => {
    return (
        <section id="home" className="flex flex-col justify-end min-h-screen">
            <AnimatedHeader
                as="h1"
                title={profile.shortName}
                subTitle={`${profile.role} · ${profile.industry}`}
                text={profile.tagline}
                textColor="text-black"
                play={ready}
            />
        </section>
    )
}

export default Hero
