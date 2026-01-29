import { useRef } from "react";
import { focusAreas } from "../constants/Index";
import AnimatedHeader from "./UI/AnimatedHeader"
import { useMediaQuery } from "react-responsive";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


const FocusArea = () => {
    const focusRefs = useRef<HTMLDivElement[]>([])

    const isDesktop = useMediaQuery({ minWidth: "48rem" })

    useGSAP(() => {
        focusRefs.current.forEach((el) => {
            if (!el) return;

            gsap.from(el, {
                y: 200,
                scrollTrigger: {
                    trigger: el,
                    start: "top 80%",
                },
                duration: 1,
                ease: "circ.out",
            });

        })
    }, [])
    return (
        <section id="focusArea" className="min-h-screen bg-black rounded-4xl">
            <AnimatedHeader
                title="Focus Areas"
                subTitle="Where I build, experiment, and push AI into real-world systems"
                text={"My work spans deep learning, explainable AI, and LLM-powered applications —\nwith a strong emphasis on building reliable, interpretable,\nand production-ready solutions rather than just models in isolation."}
                textColor="text-white"
                withScrollTrigger={true}
            />

            {focusAreas.map((area, index) => (
                <div
                    ref={(el) => { if (el) focusRefs.current[index] = el }}
                    key={index}
                    className="sticky px-10 pt-6 pb-12 text-white bg-black border-t-2 border-white/30"
                    style={isDesktop ?
                        {
                            top: `calc(10vh + ${index * 5}em)`,
                            marginBottom: `${(focusAreas.length - index - 1) * 5}em`,
                        } : { top: 0 }}
                >
                    <div className="flex items-center justify-between gap-4 font-light">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-4xl lg:text-5xl">{area.title}</h2>
                            <p className="text-xl leading-relaxed tracking-widest lg:text-2xl text-white/60">{area.description}</p>
                            <div className="flex flex-col gap-2 text-2xl sm:gap-4 lg:text-3xl text-white/80">
                                {area.items.map((item, itemIndex) => (
                                    <div key={`item-${index}-${itemIndex}`}>
                                        <h3 className="flex">
                                            <span className="mr-12 text-lg text-white/30">
                                                0{itemIndex + 1}
                                            </span>
                                            {item.title}
                                        </h3>
                                        {itemIndex < area.items.length - 1 && (
                                            <div className="w-full h-px my-2 bg-white/30" />
                                        )}
                                    </div>

                                ))}

                            </div>
                        </div>

                    </div>


                </div>
            ))}
        </section>
    )
}

export default FocusArea;