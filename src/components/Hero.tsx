import { useRef } from "react"
import AnimatedTextLine from "./UI/AnimatedTextLine"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import AnimatedHeader from "./UI/AnimatedHeader"

const Hero = () => {
    const contextRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline()
        tl.from(contextRef.current, {
            y: "50vh",
            duration: 1,
            ease: "circ.out",
        });
        tl.from(headerRef.current, {
            opacity: 0,
            y: "200",
            duration: 1,
            ease: "circ.out",
        }, "<+0.2");
    }, []);
    return (
        <section id="home" className="flex flex-col justify-end min-h-screen">
            <AnimatedHeader
                title="Bhuvan S"
                subTitle="THOUGHTFUL SYSTEMS, CLEAN EXECUTION"
                text={`A passionate Computer Science and Artificial Intelligence\nstudent with a knack for solving complex\nproblems using technology`}
                textColor="text-black"
            />

        </section>
    )
}

export default Hero