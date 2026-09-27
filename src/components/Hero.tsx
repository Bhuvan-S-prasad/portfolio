import { lazy, Suspense } from "react"
import SectionHeader from "./UI/SectionHeader"
import { profile } from "../content/profile"

// Loaded as its own chunk after the preloader, so it never delays first paint.
const FlowField = lazy(() => import("./UI/FlowField"))

const Hero = ({ ready }: { ready: boolean }) => {
    return (
        <section id="home" className="relative flex flex-col justify-end min-h-screen">
            {ready && (
                <Suspense fallback={null}>
                    <div className="absolute inset-0 animate-[fadeIn_1.6s_ease-out_both]">
                        <FlowField />
                    </div>
                </Suspense>
            )}
            <div className="relative">
                <SectionHeader
                    as="h1"
                    title={profile.shortName}
                    label={`${profile.role} · ${profile.industry}`}
                    text={profile.tagline}
                    withScrollTrigger={false}
                    play={ready}
                />
            </div>
        </section>
    )
}

export default Hero
