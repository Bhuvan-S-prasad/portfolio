import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(ScrollTrigger, SplitText)

interface AnimatedHeaderProps {
    title: string;
    subTitle: string;
    text: string;
    textColor: string;
    withScrollTrigger?: boolean;
}

interface SplitResult {
    chars: HTMLElement[];
    revert: () => void;
}

const AnimatedHeader = ({
    title,
    subTitle,
    text,
    textColor,
    withScrollTrigger = false
}: AnimatedHeaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const subtitleRef = useRef<HTMLParagraphElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const lineRef = useRef<HTMLDivElement>(null)
    const descRef = useRef<HTMLDivElement>(null)

    const lines = text.split("\n").filter((line) => line.trim() !== "")

    useEffect(() => {
        const ctx = gsap.context(() => {
            const split = SplitText.create(titleRef.current!, {
                type: "chars",
            }) as unknown as SplitResult

            const charInners: HTMLSpanElement[] = []
            split.chars.forEach((char) => {
                const inner = document.createElement("span")
                inner.style.display = "inline-block"
                inner.style.willChange = "transform"
                inner.innerHTML = char.innerHTML
                char.innerHTML = ""
                char.style.overflow = "hidden"
                char.style.display = "inline-block"
                char.appendChild(inner)
                charInners.push(inner)
            })

            const descLines = descRef.current?.querySelectorAll(".desc-line")

            // Initial states — everything hidden
            gsap.set(charInners, { yPercent: 120, rotation: 4 })
            gsap.set(lineRef.current, { scaleX: 0, transformOrigin: "left center" })
            gsap.set(subtitleRef.current, { opacity: 0, y: 15 })
            if (descLines?.length) {
                gsap.set(descLines, { opacity: 0, y: 25 })
            }

            // Choreographed timeline — flows top to bottom matching layout
            const tl = gsap.timeline({
                scrollTrigger: withScrollTrigger ? {
                    trigger: containerRef.current,
                    start: "top 78%",
                } : undefined,
            })

            // 1 — Title characters reveal upward (the hero moment)
            tl.to(charInners, {
                yPercent: 0,
                rotation: 0,
                duration: 1.3,
                stagger: 0.025,
                ease: "expo.out",
            })

            // 2 — Divider line draws from left to right
            tl.to(lineRef.current, {
                scaleX: 1,
                duration: 1.1,
                ease: "power3.inOut",
            }, "-=0.8")

            // 3 — Subtitle fades up in the left column
            tl.to(subtitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
            }, "-=0.5")

            // 4 — Description lines stagger in on the right
            if (descLines?.length) {
                tl.to(descLines, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                }, "-=0.3")
            }
        }, containerRef)

        return () => ctx.revert()
    }, [withScrollTrigger])

    const isDark = textColor.includes("white")

    return (
        <div ref={containerRef} className="pt-14 sm:pt-20">

            {/* ── Title — massive, full-width, the hero moment ── */}
            <div className="px-6 sm:px-10 pb-8 sm:pb-12">
                <h1
                    ref={titleRef}
                    className={`uppercase ${textColor}
                        text-[42px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[152px]
                        leading-[0.85] sm:leading-[0.9]
                        font-extralight tracking-[-0.02em]`}
                >
                    {title}
                </h1>
            </div>

            {/* ── Animated divider — draws left to right ── */}
            <div className="px-6 sm:px-10">
                <div
                    ref={lineRef}
                    className={`h-px ${isDark ? "bg-white/20" : "bg-black/15"}`}
                />
            </div>

            {/* ── Metadata zone: subtitle (left) + description (right) ── */}
            <div className={`px-6 sm:px-10 pt-8 sm:pt-10 pb-4 sm:pb-6 ${textColor}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-16 lg:gap-24">

                    {/* Subtitle — left column, label/tagline */}
                    <p
                        ref={subtitleRef}
                        className={`flex items-start gap-3 shrink-0
                            md:max-w-xs lg:max-w-sm
                            text-[10px] sm:text-xs
                            tracking-[0.3rem] sm:tracking-[0.5rem]
                            uppercase
                            ${isDark ? "opacity-50" : "opacity-45"}`}
                    >
                        <span className="inline-block w-1.5 h-1.5 mt-[5px] rounded-full bg-gold shrink-0" />
                        {subTitle}
                    </p>

                    {/* Description — right column, readable body text */}
                    <div
                        ref={descRef}
                        className="md:max-w-sm lg:max-w-md xl:max-w-lg"
                    >
                        {lines.map((line, index) => (
                            <span
                                key={index}
                                className={`desc-line block
                                    text-sm sm:text-base lg:text-lg
                                    font-light leading-relaxed tracking-wide
                                    ${isDark ? "opacity-60" : "opacity-50"}`}
                            >
                                {line.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AnimatedHeader