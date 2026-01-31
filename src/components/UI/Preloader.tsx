import { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

interface PreloaderProps {
    onComplete?: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLHeadingElement>(null);
    const lenis = useLenis();
    const lenisRef = useRef(lenis);

    useEffect(() => {
        lenisRef.current = lenis;
    }, [lenis]);

    useGSAP(() => {
        lenisRef.current?.stop();

        const tl = gsap.timeline({
            onComplete: () => {
                lenisRef.current?.start();
                onComplete?.();
            },
        });

        tl.from(textRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: "power2.out",
        });

        tl.to({}, { duration: 1 });

        tl.to(textRef.current, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: "power2.in",
        });

        tl.to(containerRef.current, {
            yPercent: -100,
            duration: 0.5,
            ease: "power3.inOut",
        });

    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black"
        >
            <h1
                ref={textRef}
                className="text-3xl font-bold tracking-widest text-white uppercase md:text-5xl lg:text-7xl"
            >
                Welcome to my portfolio
            </h1>
        </div>
    );
};

export default Preloader;
