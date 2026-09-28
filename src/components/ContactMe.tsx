import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "../lib/motion";
import Plane from "./UI/Plane";

const TOW_GAP = 40;     // px between the plane's tail and the banner
const CLIMB_FROM = 0.42; // start climbing when the plane is this far across (from the left)
const CLIMB_HEIGHT = 240;

interface SplitResult {
    chars: HTMLElement[];
    revert: () => void;
}

const ContactMe = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const mobileTextRef = useRef<HTMLHeadingElement>(null);
    const planeRef = useRef<HTMLDivElement>(null);
    const ropeRef = useRef<HTMLDivElement>(null);
    const mPlaneRef = useRef<HTMLDivElement>(null);
    const mTrailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();
            const flying = !prefersReducedMotion();

            /**
             * The plane tows the "Contact Me" banner in on a line, then pitches
             * up and climbs away, dropping the line as the banner settles.
             */
            const tow = (title: HTMLElement, heading: HTMLElement) => {
                const plane = planeRef.current;
                const rope = ropeRef.current;
                if (!plane || !rope) return;
                const box = title.getBoundingClientRect();
                const text = heading.getBoundingClientRect();
                const pw = plane.offsetWidth;
                const ph = plane.offsetHeight;

                const textLeft = text.left - box.left;
                const cy = text.top - box.top + text.height * 0.42;
                const px = textLeft - TOW_GAP - pw;
                const across = (px + pw / 2) / box.width;
                const climb = across < CLIMB_FROM ? Math.pow((CLIMB_FROM - across) / CLIMB_FROM, 1.6) : 0;
                const py = cy - ph / 2 - climb * CLIMB_HEIGHT;
                const rot = climb * 20; // nose (on the left) up

                gsap.set(plane, { x: px, y: py, rotation: rot });

                // Line from the tail (right end, rotated about the centre) to the banner.
                const r = (rot * Math.PI) / 180;
                const tx = px + pw / 2 + Math.cos(r) * (pw * 0.46);
                const ty = py + ph / 2 + Math.sin(r) * (pw * 0.46);
                const ex = textLeft - 6;
                const len = Math.max(0, Math.hypot(ex - tx, cy - ty));
                const angle = (Math.atan2(cy - ty, ex - tx) * 180) / Math.PI;
                gsap.set(rope, { x: tx, y: ty, width: len, rotation: angle, opacity: climb > 0.5 ? 0 : 1 });
            };

            mm.add("(min-width: 768px)", () => {
                const titleHeadings = gsap.utils.toArray<HTMLElement>(".contact-title h2");
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
                    const heading = titleHeadings[index];
                    if (flying && index === 0) tow(title, heading);

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
                            if (flying && index === 0) tow(title, heading);

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
                // A plane crosses above the line, leaving a contrail, as the section scrolls by.
                const plane = mPlaneRef.current;
                const trail = mTrailRef.current;
                if (flying && plane && trail) {
                    ScrollTrigger.create({
                        trigger: sectionRef.current,
                        start: "top 85%",
                        end: "bottom 25%",
                        scrub: 1,
                        onUpdate: (self) => {
                            const w = sectionRef.current?.clientWidth ?? window.innerWidth;
                            const pw = plane.offsetWidth;
                            const x = -pw + self.progress * (w + pw * 1.2);
                            const y = -self.progress * 46;
                            gsap.set(plane, { x, y, rotation: -7 });
                            gsap.set(trail, { width: Math.max(0, x + pw * 0.1), y: y * 0.5, rotation: -3.5 });
                        },
                    });
                }

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
            <div className="relative hidden md:flex contact-title h-[85svh] items-center">
                {/* The tow plane and its line (positioned from JS) */}
                <div ref={ropeRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 h-px origin-left bg-black/45" style={{ width: 0 }} />
                <div ref={planeRef} aria-hidden className="pointer-events-none absolute left-0 top-0 z-10 will-change-transform">
                    <div style={{ transform: "scaleX(-1)" }}>
                        <Plane className="h-15 w-40 lg:h-19.5 lg:w-52" body="var(--color-ink)" windows="var(--color-bone)" />
                    </div>
                </div>

                <div className="contact-title-container relative w-full flex items-center will-change-transform">
                    <h2 className="text-6xl lg:text-8xl xl:text-[10rem] font-medium leading-none tracking-[-0.15rem] lg:tracking-[-0.25rem]">
                        Contact Me
                    </h2>
                </div>
            </div>

            <div className="relative flex md:hidden h-[50svh] items-center justify-center">
                <div ref={mTrailRef} aria-hidden className="pointer-events-none absolute left-0 top-[22%] h-px origin-left bg-linear-to-r from-transparent to-black/35" style={{ width: 0 }} />
                <div ref={mPlaneRef} aria-hidden className="pointer-events-none absolute left-0 top-[22%] -translate-y-1/2 will-change-transform">
                    <Plane className="h-7.5 w-20" body="var(--color-ink)" windows="var(--color-bone)" />
                </div>

                <h2
                    ref={mobileTextRef}
                    className="text-4xl sm:text-5xl font-medium leading-tight tracking-tight text-center"
                >
                    Let's Work<br />
                    <span className="text-black/60">Together</span>
                </h2>
            </div>
        </section>
    );
};

export default ContactMe;