import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/motion";

/**
 * Hero background: calm horizontal flow lines drifting like a contour map.
 * The pointer is a bottleneck — held still, it pinches the nearby lines into a
 * narrow neck that heats from ink to gold to ember; moved away, they relax.
 *
 * Canvas 2D: one ink stroke per line, plus short coloured segments only where
 * the lines are under pressure.
 */

const LINE_GAP = 22;        // vertical spacing between lines, css px
const STEP = 12;            // horizontal sample spacing, css px
const NECK_WIDTH = 150;     // horizontal spread of the pinch, css px
const NECK_REACH = 210;     // how far above/below the pointer lines are pulled, css px
const SQUEEZE = 0.82;       // max compression toward the pointer's line (0–1)

const INK = [8, 8, 8];
const GOLD = [207, 163, 85];
const EMBER = [200, 85, 61];

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

const heatColor = (h: number) =>
    h < 0.5 ? mix(INK, GOLD, h / 0.5) : mix(GOLD, EMBER, (h - 0.5) / 0.5);

const FlowField = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const readoutRef = useRef<HTMLDivElement>(null);
    const readoutValueRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const readout = readoutRef.current;
        const readoutValue = readoutValueRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !readout || !readoutValue) return;

        const coarse = window.matchMedia("(pointer: coarse)").matches;
        const reduced = prefersReducedMotion();

        let width = 0, height = 0, lines = 0, points = 0;
        let ys = new Float32Array(0);    // current y per (line, point)
        let heat = new Float32Array(0);  // heat per (line, point)

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            lines = Math.ceil(height / LINE_GAP) + 2;
            points = Math.ceil(width / STEP) + 2;
            ys = new Float32Array(lines * points);
            heat = new Float32Array(lines * points);
        };

        const pointer = { x: -9999, y: -9999, inside: false, speed: 0 };
        let lastMove = { x: 0, y: 0 };
        const onMove = (e: PointerEvent) => {
            const r = canvas.getBoundingClientRect();
            pointer.x = e.clientX - r.left;
            pointer.y = e.clientY - r.top;
            pointer.inside = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
            pointer.speed = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y);
            lastMove = { x: e.clientX, y: e.clientY };
        };
        const onLeave = () => { pointer.inside = false; };

        // Pinch strength builds while the pointer rests and releases when it moves on.
        let pinch = 0;
        let neckX = 0, neckY = 0;
        let t = 0;

        const step = (dt: number) => {
            t += dt * 0.016;
            pointer.speed *= 0.85;
            const target = pointer.inside && !coarse ? Math.max(0.25, 1 - pointer.speed / 40) : 0;
            pinch += (target - pinch) * (target > pinch ? 0.035 : 0.06) * dt;
            // The neck eases after the pointer rather than jumping with it.
            if (pointer.inside) {
                neckX += (pointer.x - neckX) * 0.15 * dt;
                neckY += (pointer.y - neckY) * 0.15 * dt;
            }

            for (let l = 0; l < lines; l++) {
                const y0 = (l - 1) * LINE_GAP;
                const phase = l * 0.55;
                const dy = y0 - neckY;
                const vertical = Math.exp(-(dy * dy) / (NECK_REACH * NECK_REACH));
                for (let p = 0; p < points; p++) {
                    const x = (p - 1) * STEP;
                    // Calm drift: two slow waves, so lines never look ruled.
                    let y = y0
                        + Math.sin(x * 0.006 + t * 0.35 + phase) * 3.5
                        + Math.sin(x * 0.0021 - t * 0.2 + phase * 0.4) * 5;

                    const dx = x - neckX;
                    const horizontal = Math.exp(-(dx * dx) / (NECK_WIDTH * NECK_WIDTH));
                    const k = pinch * horizontal * vertical;
                    // Compress toward the neck's line: lines crowd through a narrow gap.
                    y = neckY + (y - neckY) * (1 - SQUEEZE * k);

                    const i = l * points + p;
                    ys[i] = y;
                    heat[i] = Math.min(1, k * 1.25);
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1;

            // Base ink lines, fading toward the name and tagline at the bottom.
            for (let l = 0; l < lines; l++) {
                const y0 = (l - 1) * LINE_GAP;
                const fade = 1 - 0.7 * Math.min(1, Math.max(0, (y0 / height - 0.45) / 0.5));
                ctx.strokeStyle = `rgba(8, 8, 8, ${0.11 * fade})`;
                ctx.beginPath();
                const row = l * points;
                ctx.moveTo(-STEP, ys[row]);
                for (let p = 1; p < points; p++) ctx.lineTo((p - 1) * STEP, ys[row + p]);
                ctx.stroke();
            }

            // Heat overlay: only the segments under pressure.
            if (pinch < 0.02) return;
            ctx.lineWidth = 1.4;
            for (let l = 0; l < lines; l++) {
                const row = l * points;
                for (let p = 1; p < points; p++) {
                    const h = (heat[row + p] + heat[row + p - 1]) * 0.5;
                    if (h < 0.06) continue;
                    const [r, g, b] = heatColor(h);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, h * 1.4)})`;
                    ctx.beginPath();
                    ctx.moveTo((p - 2) * STEP, ys[row + p - 1]);
                    ctx.lineTo((p - 1) * STEP, ys[row + p]);
                    ctx.stroke();
                }
            }
        };

        // Readout that follows the pointer once the neck has formed.
        const showReadout = () => {
            const on = !coarse && pinch > 0.2;
            readout.style.opacity = on ? String(Math.min(1, (pinch - 0.2) * 3)) : "0";
            if (!on) return;
            // Flip to the left of the pointer near the right edge.
            const flip = pointer.x + 18 + readout.offsetWidth > width - 8;
            const x = flip ? pointer.x - 18 - readout.offsetWidth : pointer.x + 18;
            readout.style.transform = `translate(${x}px, ${pointer.y + 22}px)`;
            readoutValue.textContent = pinch.toFixed(2);
        };

        resize();

        // Reduced motion: one still frame.
        if (reduced) {
            step(0);
            draw();
            return;
        }

        let frame = 0;
        let last = performance.now();
        let visible = true;
        const loop = (now: number) => {
            const dt = Math.min((now - last) / 16.67, 3);
            last = now;
            step(dt);
            draw();
            showReadout();
            frame = requestAnimationFrame(loop);
        };
        const start = () => {
            if (frame || !visible || document.hidden) return;
            last = performance.now();
            frame = requestAnimationFrame(loop);
        };
        const stop = () => {
            cancelAnimationFrame(frame);
            frame = 0;
        };

        // Only animate while the hero is on screen and the tab is visible.
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) start(); else stop();
        });
        observer.observe(canvas);
        const onVisibility = () => (document.hidden ? stop() : start());

        const resizeObserver = new ResizeObserver(() => resize());
        resizeObserver.observe(canvas);

        window.addEventListener("pointermove", onMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        document.addEventListener("visibilitychange", onVisibility);
        start();

        return () => {
            stop();
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener("pointermove", onMove);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 size-full" />
            <div
                ref={readoutRef}
                className="absolute left-0 top-0 whitespace-nowrap bg-ember px-1.5 py-px font-mono text-[10px] leading-3.5 tracking-[0.06em] text-bone opacity-0"
            >
                bottleneck <span ref={readoutValueRef} className="opacity-70">0.00</span>
            </div>
        </div>
    );
};

export default FlowField;
