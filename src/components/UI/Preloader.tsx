import { useRef, useEffect } from "react";
import { useLenis } from "lenis/react";
import { gsap, useGSAP } from "../../lib/motion";
import { countTo } from "../../lib/annotate";
import { grainLayer } from "../../lib/grain";
import { profile } from "../../content/profile";
import TraceLog, { type TraceLine } from "../annotate/TraceLog";
import Metric from "../annotate/Metric";

interface PreloaderProps {
    onComplete?: () => void;
}

const BOOT_LOG: TraceLine[] = [
    { text: "loading weights", status: "ok" },
    { text: "building attention maps", status: "ok" },
    { text: "compiling graph", status: "ok" },
    { text: "ready", status: "100%" },
];

const NOISE = "01<>/\\|_-+=*";

const Preloader = ({ onComplete }: PreloaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLParagraphElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const doneRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    const lenis = useLenis();
    const lenisRef = useRef(lenis);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    // Lenis is created a frame after mount, so lock scrolling whenever it
    // appears while the preloader is still running.
    useEffect(() => {
        lenisRef.current = lenis;
        if (lenis && !doneRef.current) lenis.stop();
    }, [lenis]);

    useGSAP(() => {
        const q = gsap.utils.selector(containerRef);
        const BOOT = 1.9;

        gsap.set(q("[data-trace-line]"), { opacity: 0, x: -8 });
        gsap.set(q("[data-trace-status]"), { opacity: 0 });
        gsap.set(nameRef.current, { opacity: 0, filter: "blur(14px)" });

        const tl = gsap.timeline({
            onComplete: () => {
                doneRef.current = true;
                lenisRef.current?.start();
                gsap.set(containerRef.current, { display: "none" });
                onCompleteRef.current?.();
            },
        });

        // Boot: counter, progress hairline and log run together.
        tl.add(countTo(counterRef.current, 100, { pad: 3, duration: BOOT }), 0)
            .fromTo(q(".boot-progress"), { scaleX: 0 }, { scaleX: 1, duration: BOOT, ease: "power2.inOut" }, 0);

        q("[data-trace-line]").forEach((line, i) => {
            const at = (i / BOOT_LOG.length) * BOOT;
            tl.to(line, { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" }, at)
                .to(line.querySelector("[data-trace-status]"), { opacity: 1, duration: 0.2 }, at + 0.3);
        });

        // The name denoises: scrambled glyphs resolve while the blur clears.
        tl.to(nameRef.current, {
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.5,
            ease: "power2.out",
            scrambleText: { text: profile.shortName, chars: NOISE, revealDelay: 0.4, speed: 0.5 },
        }, 0.25);

        // Exit: content fades, then the panel lifts off the page.
        tl.to(q(".boot-content"), { opacity: 0, y: -24, duration: 0.4, ease: "power2.in" }, BOOT + 0.25)
            .to(containerRef.current, { yPercent: -100, duration: 0.8, ease: "power3.inOut" }, "-=0.1");
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden
            className="fixed inset-0 z-100 overflow-hidden bg-ink text-white"
        >
            <div style={grainLayer(0.5)} />

            <div className="boot-content absolute inset-0 flex flex-col justify-between px-6 sm:px-10 py-6 sm:py-10">
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
                    <span>{profile.name} — Portfolio</span>
                    <span>{profile.role}</span>
                </div>

                <p
                    ref={nameRef}
                    className="uppercase font-extralight leading-none tracking-[-0.02em]
                        text-[42px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[152px]"
                >
                    {profile.shortName}
                </p>

                <div className="flex items-end justify-between gap-8">
                    <TraceLog lines={BOOT_LOG} className="w-56 sm:w-72 text-white/60" />
                    <Metric
                        ref={counterRef}
                        pad={3}
                        suffix="%"
                        className="text-4xl sm:text-6xl font-extralight tracking-[-0.04em] text-white"
                    />
                </div>
            </div>

            <div className="boot-progress absolute bottom-0 left-0 h-px w-full origin-left bg-gold" />
        </div>
    );
};

export default Preloader;
