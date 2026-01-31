import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);

interface AnimatedTextLineProps {
    text: string;
    className?: string;
}
const AnimatedTextLine = ({ text, className }: AnimatedTextLineProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    useGSAP(() => {
        if (lineRefs.current.length > 0) {
            gsap.from(lineRefs.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.3,
                ease: "back.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                },
            });
        }
    });

    return (
        <div ref={containerRef} className={className}>
            {lines.map((line, index) => (
                <span
                    key={index}
                    ref={(element) => { lineRefs.current[index] = element }}
                    className="block leading-relaxed tracking-wide text-pretty"
                >
                    {line}
                </span>
            ))}
        </div>
    );
};

export default AnimatedTextLine;