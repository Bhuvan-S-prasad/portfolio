import { useRef } from "react"
import AnimatedHeader from "./UI/AnimatedHeader"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import TorchEffect from "./UI/TorchEffect"

const About = () => {
    const profileRef = useRef<HTMLImageElement>(null)

    useGSAP(() => {
        gsap.to("#about", {
            scale: 0.95,
            scrollTrigger: {
                trigger: "#about",
                start: "bottom 80%",
                end: "bottom 20%",
                scrub: true,
            },
            ease: "power1.out",
        });

        gsap.set(profileRef.current, {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
        });

        gsap.to(profileRef.current, {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 2,
            ease: "power4.out",
            scrollTrigger: {
                trigger: profileRef.current,
            },
        })

    })
    return (
        <section id="about"
            className="min-h-screen bg-black rounded-b-4xl"
        >
            <AnimatedHeader
                title="About Me"
                subTitle="Who Am I?"
                text={`passionate about building AI systems that are not only accurate,\n but also explainable, reliable, and impactful in real-world\n applications—especially in healthcare and LLM-powered systems.`}
                textColor="text-white"
                withScrollTrigger={true}
            />
            <div className="flex flex-col items-center justify-center rounded-b-4xl">
                {/* <img ref={profileRef} src="/bhuvan-port.png" alt="profile image" className="w-md rounded-3xl" />  */}
                <div>
                    <TorchEffect text="I'm a final-year Computer Science (AI) student focused on deep learning, computer vision, and LLM-based systems. I build practical, explainable AI solutions—ranging from medical imaging models to RAG-powered applications—using PyTorch, with an emphasis on reliability, interpretability, and real-world impact." />
                </div>

            </div>

        </section>
    )
}

export default About