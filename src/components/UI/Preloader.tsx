import { useRef, useEffect } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "../../lib/motion";

interface PreloaderProps {
    onComplete?: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const doneRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    const lenis = useLenis();

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    // Lenis is created a frame after mount, so lock scrolling whenever it
    // appears while the preloader is still running.
    useEffect(() => {
        if (lenis && !doneRef.current) lenis.stop();
    }, [lenis]);

    const lenisRef = useRef(lenis);
    useEffect(() => {
        lenisRef.current = lenis;
    }, [lenis]);

    useGSAP(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                doneRef.current = true;
                lenisRef.current?.start();
                gsap.set(containerRef.current, { display: "none" });
                onCompleteRef.current?.();
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
            aria-hidden
            className="fixed inset-0 z-100 flex items-center justify-center bg-black"
        >
            <p
                ref={textRef}
                className="text-3xl font-bold tracking-widest text-white uppercase md:text-5xl lg:text-7xl"
            >
                Welcome to my portfolio
            </p>
        </div>
    );
};

export default Preloader;
