import { useEffect, useRef, type ReactNode } from "react";

interface TorchEffectProps {
    children: ReactNode;
}

const TorchEffect = ({ children }: TorchEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const overlay = overlayRef.current;
        if (!container || !overlay) return;

        const mouse = { x: -1000, y: -1000 };
        let frame = 0;

        // Batch pointer and scroll updates into one write per frame.
        const render = () => {
            frame = 0;
            const rect = container.getBoundingClientRect();
            overlay.style.setProperty("--torch-x", `${mouse.x - rect.left}px`);
            overlay.style.setProperty("--torch-y", `${mouse.y - rect.top}px`);
        };
        const schedule = () => {
            if (!frame) frame = requestAnimationFrame(render);
        };
        const onMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            schedule();
        };

        let listening = false;
        const listen = (on: boolean) => {
            if (on === listening) return;
            listening = on;
            if (on) {
                window.addEventListener("mousemove", onMove);
                window.addEventListener("scroll", schedule, { passive: true });
            } else {
                window.removeEventListener("mousemove", onMove);
                window.removeEventListener("scroll", schedule);
            }
        };

        // Only track the pointer while the paragraph is on screen.
        const observer = new IntersectionObserver(([entry]) => listen(entry.isIntersecting));
        observer.observe(container);

        return () => {
            observer.disconnect();
            listen(false);
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <div ref={containerRef} className="relative overflow-hidden">
            <div className="flex relative px-10 md:px-20 py-20">
                <div className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-wide text-white leading-relaxed">
                    {children}
                </div>
            </div>
            <div
                ref={overlayRef}
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    background: `radial-gradient(
                        circle 250px at var(--torch-x, -1000px) var(--torch-y, -1000px),
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
