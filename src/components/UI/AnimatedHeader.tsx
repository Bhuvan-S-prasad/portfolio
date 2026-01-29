import { useRef } from "react"
import AnimatedTextLine from "./AnimatedTextLine"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"


interface AnimatedHeaderProps {
    title: string;
    subTitle: string;
    text: string;
    textColor: string;
    withScrollTrigger?: boolean;
}

const AnimatedHeader = ({
    title,
    subTitle,
    text,
    textColor,
    withScrollTrigger = false
}: AnimatedHeaderProps) => {
    const contextRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: withScrollTrigger ? {
                trigger: contextRef.current
            } : undefined
        })
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
        <>
            <div ref={contextRef}>
                <div style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", }}>
                    <div ref={headerRef} className="flex flex-col justify-center gap-12 pt-16 sm:gap-16">
                        <p className={`text-sm tracking-[0.5rem] uppercase px-10 ${textColor}`}>{subTitle}</p>
                        <div className="px-10 pb-5 sm:pb-5 lg:pb-5">
                            <h1 className={`flex flex-col flex-wrap gap-12 uppercase ${textColor}
                            text-[46px] sm:text-[118px] md:text-[126px] lg:text-[152px] leading-9 sm:leading-16 lg:leading-20
                            sm:gap-16 md:block`}>
                                {title}
                            </h1>

                        </div>
                    </div>
                </div>

                <div className={`relative px-10 ${textColor}`}>
                    <div className="absolute inset-x-0 border-t-2" />
                    <div className="py-12 sm:py-16 text-end">
                        <div className="Uppercase text-2xl md:text-[26px] lg:text-[32px]">
                            <AnimatedTextLine
                                className="uppercase text-2xl md:text-[18px] lg:text-[28px];"
                                text={text} />
                        </div>
                    </div>

                </div>

            </div>
        </>

    )
}

export default AnimatedHeader