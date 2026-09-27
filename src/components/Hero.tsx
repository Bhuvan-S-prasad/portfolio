import SectionHeader from "./UI/SectionHeader"
import { profile } from "../content/profile"

const Hero = ({ ready }: { ready: boolean }) => {
    return (
        <section id="home" className="flex flex-col justify-end min-h-screen">
            <SectionHeader
                as="h1"
                title={profile.shortName}
                label={`${profile.role} · ${profile.industry}`}
                text={profile.tagline}
                withScrollTrigger={false}
                play={ready}
            />
        </section>
    )
}

export default Hero
