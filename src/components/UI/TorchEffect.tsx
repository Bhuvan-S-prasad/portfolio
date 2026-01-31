import { useEffect, useRef, useCallback } from "react";

interface TorchEffectProps {
    text: string;
}

const TorchEffect = ({ text }: TorchEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    const updateSpotlight = useCallback(() => {
        if (overlayRef.current && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = mousePos.current.x - rect.left;
            const y = mousePos.current.y - rect.top;

            overlayRef.current.style.background = `radial-gradient(
                circle 250px at ${x}px ${y}px,
                transparent 0%,
                rgba(0, 0, 0, 0.85) 80%,
                rgba(0, 0, 0, 0.95) 100%
            )`;
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            updateSpotlight();
        };

        const handleScroll = () => {
            updateSpotlight();
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("scroll", handleScroll, true);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [updateSpotlight]);

    return (
        <div ref={containerRef} className="relative overflow-hidden rounded-b-4xl">
            <div className="flex relative px-10 md:px-20 py-20">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-wide text-justify text-white leading-relaxed">
                    {text}
                </h2>
            </div>
            <div
                ref={overlayRef}
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(
                        circle 250px at -1000px -1000px,
                        transparent 0%,
                        rgba(0, 0, 0, 0.85) 80%,
                        rgba(0, 0, 0, 0.95) 100%
                    )`
                }}
            />
        </div>
    );
};

export default TorchEffect;