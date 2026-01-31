import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ArtworkPreloaderProps {
    onRevealComplete?: () => void;
}

const ArtworkPreloader = ({ onRevealComplete }: ArtworkPreloaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const leftPanelRef = useRef<HTMLDivElement>(null);
    const rightPanelRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const textLinesRef = useRef<HTMLParagraphElement[]>([]);

    const textLines = [
        "Art has always been a parallel practice for me.",
        "A space to slow down, explore ideas visually,",
        "and create without constraints or metrics."
    ];

    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        gsap.set(titleRef.current, { y: 100, opacity: 0, scale: 0.8 });
        gsap.set(subtitleRef.current, { y: 50, opacity: 0, letterSpacing: "0.1rem" });
        gsap.set(textLinesRef.current, { y: 40, opacity: 0, rotateX: -15 });
        gsap.set([leftPanelRef.current, rightPanelRef.current], { scaleY: 1 });

        const entranceTl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });

        entranceTl
            .to(subtitleRef.current, {
                y: 0,
                opacity: 1,
                letterSpacing: "0.5rem",
                duration: 0.8,
                ease: "power3.out"
            })
            .to(titleRef.current, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "back.out(1.7)"
            }, "-=0.5")
            .to(textLinesRef.current, {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power2.out"
            }, "-=0.4");

        const exitTl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top top",
                end: "+=100%",
                scrub: 0.5,
                pin: true,
                pinSpacing: true,
                onLeave: () => onRevealComplete?.()
            }
        });

        exitTl
            .to(textLinesRef.current, {
                y: -30,
                opacity: 0,
                stagger: 0.05,
                duration: 0.3
            })
            .to(titleRef.current, {
                y: -80,
                opacity: 0,
                scale: 1.1,
                duration: 0.3
            }, "-=0.2")
            .to(subtitleRef.current, {
                y: -40,
                opacity: 0,
                duration: 0.3
            }, "-=0.3")
            .to(leftPanelRef.current, {
                xPercent: -100,
                duration: 0.6,
                ease: "power3.inOut"
            }, "-=0.1")
            .to(rightPanelRef.current, {
                xPercent: 100,
                duration: 0.6,
                ease: "power3.inOut"
            }, "-=0.6");

    }, []);

    return (
        <div
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-black"
        >
            <div className="absolute inset-0 bg-black z-0" />

            <div
                ref={leftPanelRef}
                className="absolute inset-y-0 left-0 w-1/2 bg-background z-10"
            />

            <div
                ref={rightPanelRef}
                className="absolute inset-y-0 right-0 w-1/2 bg-background z-10"
            />

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-5 sm:px-8 md:px-16">
                <p
                    ref={subtitleRef}
                    className="text-[10px] sm:text-xs md:text-sm uppercase text-black/50 tracking-[0.3rem] sm:tracking-[0.4rem] md:tracking-[0.5rem] mb-6 sm:mb-8 md:mb-10"
                >
                    A creative outlet beyond algorithms
                </p>

                <h2
                    ref={titleRef}
                    className="text-[clamp(2.5rem,10vw,10rem)] font-extralight uppercase text-black tracking-tighter sm:tracking-tight mb-8 sm:mb-12 md:mb-16 text-center leading-[0.9]"
                >
                    Beyond Code
                </h2>

                <div
                    className="flex flex-col items-center gap-1 sm:gap-2 md:gap-3 text-center max-w-3xl"
                    style={{ perspective: "600px" }}
                >
                    {textLines.map((line, index) => (
                        <p
                            key={index}
                            ref={(el) => {
                                if (el) textLinesRef.current[index] = el;
                            }}
                            className="text-sm sm:text-base md:text-lg lg:text-xl font-light text-black/60 tracking-wide leading-relaxed"
                        >
                            {line}
                        </p>
                    ))}
                </div>

                <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                    <div className="w-px h-8 sm:h-12 bg-black/20" />
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.2rem] text-black/30">Scroll</p>
                </div>
            </div>
        </div>
    );
};

export default ArtworkPreloader;
