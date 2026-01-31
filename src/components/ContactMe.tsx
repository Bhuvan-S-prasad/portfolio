import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);

interface SplitResult {
    chars: HTMLElement[];
    revert: () => void;
}

const ContactMe = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const mobileTextRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                const titleHeadings = gsap.utils.toArray<HTMLElement>(".contact-title h1");
                const splits: SplitResult[] = [];

                titleHeadings.forEach((heading) => {
                    const split = SplitText.create(heading, {
                        type: "chars",
                        charsClass: "contact-char",
                    }) as unknown as SplitResult;
                    splits.push(split);

                    split.chars.forEach((char, i) => {
                        const charInitialY = i % 2 === 0 ? -150 : 150;
                        gsap.set(char, { y: charInitialY });
                    });
                });

                const titles = gsap.utils.toArray<HTMLElement>(".contact-title");

                titles.forEach((title, index) => {
                    const titleContainer = title.querySelector<HTMLElement>(".contact-title-container");
                    if (!titleContainer) return;

                    const titleContainerInitialX = index === 1 ? -100 : 100;
                    const split = splits[index];
                    if (!split) return;

                    const charCount = split.chars.length;

                    ScrollTrigger.create({
                        trigger: title,
                        start: "top bottom",
                        end: "top -25%",
                        scrub: 1,
                        onUpdate: (self) => {
                            const titleContainerX =
                                titleContainerInitialX - self.progress * titleContainerInitialX;
                            gsap.set(titleContainer, {
                                x: `${titleContainerX}%`,
                            });

                            split.chars.forEach((char, i) => {
                                let charStaggerIndex: number;
                                if (index === 1) {
                                    charStaggerIndex = charCount - 1 - i;
                                } else {
                                    charStaggerIndex = i;
                                }

                                const charStartDelay = 0.1;
                                const charTimelineSpan = 1 - charStartDelay;
                                const staggerFactor = Math.min(0.75, charTimelineSpan * 0.75);
                                const delay =
                                    charStartDelay + (charStaggerIndex / charCount) * staggerFactor;
                                const duration =
                                    charTimelineSpan - (staggerFactor * (charCount - 1)) / charCount;
                                const start = delay;

                                let charProgress = 0;
                                if (self.progress >= start) {
                                    charProgress = Math.min(1, (self.progress - start) / duration);
                                }

                                const charInitialY = i % 2 === 0 ? -150 : 150;
                                const charY = charInitialY - charProgress * charInitialY;
                                gsap.set(char, { y: charY });
                            });
                        },
                    });
                });
            });

            mm.add("(max-width: 767px)", () => {
                gsap.from(mobileTextRef.current, {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        toggleActions: "play none none reverse",
                    }
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden px-5 sm:px-8 md:px-15 py-12 sm:py-16 md:p-15"
        >
            <div className="hidden md:flex contact-title h-[85svh] items-center">
                <div className="contact-title-container relative w-full flex items-center will-change-transform">
                    <h1 className="text-6xl lg:text-8xl xl:text-[10rem] font-medium leading-none tracking-[-0.15rem] lg:tracking-[-0.25rem]">
                        Contact Me
                    </h1>
                </div>
            </div>

            <div className="flex md:hidden h-[50svh] items-center justify-center">
                <h1
                    ref={mobileTextRef}
                    className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight text-center"
                >
                    Let's Work<br />
                    <span className="text-black/60">Together</span>
                </h1>
            </div>
        </section>
    );
};

export default ContactMe;