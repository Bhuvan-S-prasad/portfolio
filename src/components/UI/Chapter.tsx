import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "../../lib/motion";

interface ChapterProps {
    children: ReactNode;
    className?: string;
    /** Open like an aperture as the chapter scrolls in over the previous one. */
    enter?: boolean;
    /** Shrink away at the end, revealing the light page behind the next section. */
    exit?: boolean;
}

const RADIUS = 32; // matches rounded-4xl

/**
 * Groups consecutive sections that share a surface (e.g. About + Expertise,
 * both dark) so transitions run once at the chapter's edges instead of
 * between two sections of the same colour.
 */
const Chapter = ({ children, className = "", enter = false, exit = false }: ChapterProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion()) return;

        const bottom = exit ? RADIUS : 0;

        if (enter) {
            gsap.fromTo(el,
                { clipPath: `inset(0% 4% 0% 4% round ${RADIUS * 1.5}px ${RADIUS * 1.5}px ${bottom}px ${bottom}px)` },
                {
                    clipPath: `inset(0% 0% 0% 0% round 0px 0px ${bottom}px ${bottom}px)`,
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top bottom",
                        end: "top top",
                        scrub: true,
                    },
                },
            );
        }

        if (exit) {
            gsap.to(el, {
                scale: 0.95,
                transformOrigin: "50% 100%",
                ease: "power1.out",
                scrollTrigger: {
                    trigger: el,
                    start: "bottom 80%",
                    end: "bottom 20%",
                    scrub: true,
                },
            });
        }
    }, { scope: ref });

    return (
        <div ref={ref} className={`relative ${exit ? "rounded-b-4xl" : ""} ${className}`}>
            {children}
        </div>
    );
};

export default Chapter;
