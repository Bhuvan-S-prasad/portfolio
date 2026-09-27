import { useEffect, useRef } from "react";
import DetectionBox from "../annotate/DetectionBox";
import { confidenceFor } from "../../lib/annotate";
import { useMediaQuery, useReducedMotion } from "../../lib/motion";

const RETICLE = 22; // idle box size, px
const PAD = 8;      // gap between a snapped box and its target, px
const EDGE = 10;    // minimum distance from the viewport edge, px

/**
 * Site-wide cursor: a gold dot plus a detection-box reticle that snaps
 * around anything marked `data-cursor="label"` and shows that label with a
 * confidence score. Only on precise pointers without reduced motion.
 */
const Cursor = () => {
    const finePointer = useMediaQuery("(pointer: fine)");
    const reduced = useReducedMotion();
    const enabled = finePointer && !reduced;

    const rootRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const dot = dotRef.current;
        const box = boxRef.current;
        const label = labelRef.current;
        if (!enabled || !root || !dot || !box || !label) return;

        document.documentElement.classList.add("has-cursor");

        const pointer = { x: -100, y: -100 };
        const rect = { x: -100, y: -100, w: RETICLE, h: RETICLE };
        let target: HTMLElement | null = null;
        let pressed = false;
        let frame = 0;
        let tick = 0;

        const setTarget = (next: HTMLElement | null) => {
            if (next === target) return;
            target = next;
            const text = target?.dataset.cursor;
            if (text) label.textContent = `${text} ${confidenceFor(text).toFixed(2)}`;
            label.style.opacity = text ? "1" : "0";
        };

        const onMove = (e: PointerEvent) => {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            root.style.opacity = "1";
        };
        const onOver = (e: PointerEvent) => {
            setTarget((e.target as Element | null)?.closest<HTMLElement>("[data-cursor]") ?? null);
        };
        const onDown = () => { pressed = true; };
        const onUp = () => { pressed = false; };
        const onLeave = () => { root.style.opacity = "0"; };

        const loop = () => {
            // Scrolling moves content under a still pointer without firing
            // pointerover, so re-check what's underneath every few frames.
            if (++tick % 6 === 0) {
                const under = document.elementFromPoint(pointer.x, pointer.y);
                setTarget(under?.closest<HTMLElement>("[data-cursor]") ?? null);
            }

            let tx: number, ty: number, tw: number, th: number;
            if (target?.isConnected) {
                // Keep the box inside the viewport so full-width targets
                // (project rows) still show their corners and label.
                const r = target.getBoundingClientRect();
                tx = Math.max(r.left - PAD, EDGE);
                ty = Math.max(r.top - PAD, EDGE + 18);
                tw = Math.min(r.right + PAD, window.innerWidth - EDGE) - tx;
                th = Math.min(r.bottom + PAD, window.innerHeight - EDGE) - ty;
            } else {
                const size = pressed ? RETICLE * 0.7 : RETICLE;
                tx = pointer.x - size / 2; ty = pointer.y - size / 2;
                tw = size; th = size;
            }

            const k = target ? 0.25 : 0.2;
            rect.x += (tx - rect.x) * k;
            rect.y += (ty - rect.y) * k;
            rect.w += (tw - rect.w) * k;
            rect.h += (th - rect.h) * k;

            dot.style.transform = `translate(${pointer.x}px, ${pointer.y}px) translate(-50%, -50%)`;
            box.style.transform = `translate(${rect.x}px, ${rect.y}px)`;
            box.style.width = `${rect.w}px`;
            box.style.height = `${rect.h}px`;

            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);

        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerover", onOver, { passive: true });
        window.addEventListener("pointerdown", onDown);
        window.addEventListener("pointerup", onUp);
        document.documentElement.addEventListener("pointerleave", onLeave);

        return () => {
            cancelAnimationFrame(frame);
            document.documentElement.classList.remove("has-cursor");
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerover", onOver);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
            document.documentElement.removeEventListener("pointerleave", onLeave);
        };
    }, [enabled]);

    if (!enabled) return null;

    return (
        <div
            ref={rootRef}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-200 opacity-0 transition-opacity duration-300"
        >
            <div
                ref={dotRef}
                className="absolute left-0 top-0 size-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(207,163,85,0.8)]"
            />
            <DetectionBox
                ref={boxRef}
                labelRef={labelRef}
                label="·"
                className="left-0 top-0 [&>span:last-child]:opacity-0 [&>span:last-child]:transition-opacity"
                style={{ width: RETICLE, height: RETICLE }}
                corner={6}
            />
        </div>
    );
};

export default Cursor;
