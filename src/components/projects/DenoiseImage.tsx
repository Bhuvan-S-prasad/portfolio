import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { GRAIN } from "../../lib/grain";

export type DenoiseHandle = {
    /** 0 = pure noise, 1 = the finished image. */
    set: (progress: number) => void;
};

interface DenoiseImageProps {
    src: string;
    alt: string;
    ref?: Ref<DenoiseHandle>;
    className?: string;
}

// Canvas widths for each "denoising step"; the canvas is stretched with
// pixelated scaling, so small widths read as coarse blocks.
const STEPS = [5, 8, 13, 21, 34, 55, 89, 144, 233];
const TOTAL = 50;

const stepFor = (p: number) => (p >= 1 ? STEPS.length : Math.floor(Math.max(0, p) * STEPS.length));

/**
 * An image that renders like a diffusion model: coarse colour blocks that
 * sharpen step by step into the real screenshot. Driven from outside via `set`.
 */
const DenoiseImage = ({ src, alt, ref, className = "" }: DenoiseImageProps) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const grainRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const progress = useRef(0);
    const drawn = useRef(-1);

    const draw = (step: number) => {
        const img = imgRef.current;
        const canvas = canvasRef.current;
        if (!img || !canvas) return;

        const done = step >= STEPS.length;
        img.style.opacity = done ? "1" : "0";
        canvas.style.opacity = done ? "0" : "1";
        if (done || !img.complete || !img.naturalWidth) return;

        // Cover-fit the source into the frame, anchored to the top (UI screenshots).
        const box = canvas.clientWidth / Math.max(1, canvas.clientHeight);
        const { naturalWidth: nw, naturalHeight: nh } = img;
        const sw = nw / nh > box ? nh * box : nw;
        const sh = nw / nh > box ? nh : nw / box;
        const sx = (nw - sw) / 2;

        const w = STEPS[step];
        const h = Math.max(1, Math.round(w / box));
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, sx, 0, sw, sh, 0, 0, w, h);
        drawn.current = step;
    };

    const render = () => {
        const p = progress.current;
        const step = stepFor(p);
        if (step !== drawn.current) draw(step);
        if (grainRef.current) grainRef.current.style.opacity = String((1 - p) * 0.9);
        if (labelRef.current) {
            labelRef.current.textContent = p >= 1
                ? "ready"
                : `denoising · step ${String(Math.round(p * TOTAL)).padStart(2, "0")}/${TOTAL}`;
            labelRef.current.dataset.ready = String(p >= 1);
        }
    };

    useImperativeHandle(ref, () => ({
        set: (p: number) => {
            if (Math.abs(p - progress.current) < 0.002) return;
            progress.current = p;
            render();
        },
    }));

    // Redraw when the image arrives or the frame changes size.
    useEffect(() => {
        const img = imgRef.current;
        const canvas = canvasRef.current;
        if (!img || !canvas) return;
        const redraw = () => { drawn.current = -1; render(); };
        img.addEventListener("load", redraw);
        const ro = new ResizeObserver(redraw);
        ro.observe(canvas);
        redraw();
        return () => {
            img.removeEventListener("load", redraw);
            ro.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- render only reads refs
    }, [src]);

    return (
        <div className={`relative h-full w-full overflow-hidden bg-black/10 ${className}`}>
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top opacity-0"
            />
            <canvas
                ref={canvasRef}
                aria-hidden
                className="absolute inset-0 h-full w-full"
                style={{ imageRendering: "pixelated" }}
            />
            <div
                ref={grainRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{ backgroundImage: GRAIN, backgroundSize: "180px 180px" }}
            />
            <span
                ref={labelRef}
                aria-hidden
                className="absolute left-3 top-3 bg-gold px-1.5 py-px font-mono text-[10px] leading-3.5 tracking-[0.06em] text-ink
                    transition-colors duration-500 data-[ready=true]:bg-ink data-[ready=true]:text-white/80"
            >
                denoising · step 00/{TOTAL}
            </span>
        </div>
    );
};

export default DenoiseImage;
