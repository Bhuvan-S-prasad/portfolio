import { useEffect, useRef, useState } from "react";
import type { Artwork } from "../../content/artworks";
import DetectionBox from "../annotate/DetectionBox";

/** The SVG filter the model view uses: grayscale → soften grain → Laplacian edges → gold. */
export const ModelFilterDefs = () => (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
        <filter id="model-edges" colorInterpolationFilters="sRGB">
            <feColorMatrix type="saturate" values="0" />
            <feGaussianBlur stdDeviation="0.7" />
            <feConvolveMatrix order="3" kernelMatrix="-1 -1 -1 -1 8 -1 -1 -1 -1" preserveAlpha="true" />
            <feColorMatrix
                type="matrix"
                values="4.9 0 0 0 0
                        3.9 0 0 0 0
                        2.0 0 0 0 0
                        0   0 0 1 0"
            />
        </filter>
    </svg>
);

type Rect = { left: number; top: number; width: number; height: number };

interface ModelLayerProps {
    art: Artwork;
    /** Model view on/off. */
    on: boolean;
    /** Dim when the card isn't the focused one. */
    active?: boolean;
    /** The drawing this layer annotates (object-fit: contain). */
    imgRef: React.RefObject<HTMLImageElement | null>;
}

/**
 * "Seen by a model": an edge map of the drawing with attention heat and
 * labelled regions, swept in by a scan line. Hand-labelled and illustrative.
 * Sits over the drawing, aligned to where the image actually renders.
 */
const ModelLayer = ({ art, on, active = true, imgRef }: ModelLayerProps) => {
    const [rect, setRect] = useState<Rect | null>(null);
    // Mount the edge image only once the model view has been asked for.
    const [armed, setArmed] = useState(on);
    const [sweeps, setSweeps] = useState(0);
    const first = useRef(true);

    if (on && !armed) setArmed(true);

    // Each toggle after the first render plays the scan line.
    useEffect(() => {
        if (first.current) { first.current = false; return; }
        const id = requestAnimationFrame(() => setSweeps((n) => n + 1));
        return () => cancelAnimationFrame(id);
    }, [on]);

    // Track where the contained image actually renders inside its box.
    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;
        const measure = () => {
            const cw = img.clientWidth;
            const ch = img.clientHeight;
            const ratio = img.naturalWidth / img.naturalHeight;
            if (!cw || !ch || !ratio) return;
            const wide = cw / ch > ratio;
            const width = wide ? ch * ratio : cw;
            const height = wide ? ch : cw / ratio;
            setRect({ left: img.offsetLeft + (cw - width) / 2, top: img.offsetTop + (ch - height) / 2, width, height });
        };
        const ro = new ResizeObserver(measure);
        ro.observe(img);
        img.addEventListener("load", measure);
        if (img.complete) measure();
        return () => { ro.disconnect(); img.removeEventListener("load", measure); };
    }, [imgRef]);

    if (!rect || !armed) return null;

    const heat = art.model.focus
        .map((f) => `radial-gradient(circle at ${f.x}% ${f.y}%, rgb(200 85 61 / 0.55), rgb(207 163 85 / 0.22) ${f.r}%, transparent ${f.r * 2}%)`)
        .join(", ");

    return (
        <>
            <div
                aria-hidden
                className="pointer-events-none absolute z-2 bg-ink"
                style={{
                    ...rect,
                    clipPath: on ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
                    transition: "clip-path 1.2s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.6s",
                    opacity: active ? 1 : 0.35,
                }}
            >
                <img src={art.image} alt="" className="absolute inset-0 h-full w-full" style={{ filter: "url(#model-edges)" }} />
                <div className="absolute inset-0 mix-blend-screen" style={{ background: heat }} />
                {art.model.regions.map((r, i) => (
                    <DetectionBox
                        key={r.label}
                        label={r.label}
                        confidence={r.score}
                        labelInside={r.y < 4}
                        labelRight={r.x + r.w > 82}
                        corner={9}
                        className="transition-opacity duration-500"
                        style={{
                            left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%`,
                            opacity: on ? 1 : 0,
                            transitionDelay: on ? `${900 + i * 140}ms` : "0ms",
                        }}
                    />
                ))}
            </div>

            {sweeps > 0 && (
                <span
                    key={sweeps}
                    aria-hidden
                    className="pointer-events-none absolute z-3 block h-px bg-gold shadow-[0_0_14px_2px_rgb(207_163_85/0.7)]"
                    style={{
                        left: rect.left,
                        width: rect.width,
                        top: rect.top,
                        ["--scan" as string]: `${rect.height}px`,
                        animation: `${on ? "scanDown" : "scanUp"} 1.2s cubic-bezier(0.65, 0, 0.35, 1) both`,
                    }}
                />
            )}
        </>
    );
};

export default ModelLayer;
