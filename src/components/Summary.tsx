import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"

gsap.registerPlugin(ScrollTrigger)

const Summary = () => {

    useGSAP(() => {
        gsap.to("#about-1", {
            xPercent: 20,
            scrollTrigger: {
                trigger: "#about-1",
                scrub: true
            }
        });
        gsap.to("#about-2", {
            xPercent: -30,
            scrollTrigger: {
                trigger: "#about-2",
                scrub: true
            }
        });
        gsap.to("#about-3", {
            xPercent: 30,
            scrollTrigger: {
                trigger: "#about-3",
                scrub: true
            }
        });
        gsap.to("#about-4", {
            xPercent: -30,
            scrollTrigger: {
                trigger: "#about-4",
                scrub: true
            }
        });
    })
    return (
        <section className="mt-20 overflow-hidden font-light leading-snug text-center mb-42 
        text-[42px] sm:text-[52px] md:text-[62px] lg:text-[62px]">
            <div id="about-1">
                <p className="text-gray-500">Machine Learning</p>
            </div>
            <div id="about-2" className="flex items-center justify-center gap-3 translate-x-16">
                <p className="font-normal">Deep Learning</p>
                <div className="w-10 h-1 md:w-32 bg-gold" />
                <p>AI systems</p>
            </div>

            <div id="about-3" className="flex items-center justify-center gap-3 -translate-x-48">
                <p className="text-gray-500">Computer Vision</p>
                <div className="w-10 h-1 md:w-32 bg-gold" />
                <p className="text-black">Generative Ai</p>
                <div className="w-10 h-1 md:w-32 bg-gold" />
                <p>Agentic AI</p>
            </div>

            <div id="about-4" className="translate-x-48">
                <p className="italic text-gray-600">Web Development</p>
            </div>



        </section>
    )
}

export default Summary