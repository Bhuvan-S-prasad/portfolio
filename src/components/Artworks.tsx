import { useState, useEffect, useRef, useCallback } from "react";
import { artworks as artworkData, type Artwork } from "../content/artworks";
import { ScrollTrigger } from "../lib/motion";
import { grainLayer } from "../lib/grain";
import ModelLayer, { ModelFilterDefs } from "./artworks/ModelLayer";

/* ─── Human / model view switch ─── */
const ViewToggle = ({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) => (
    <div
        role="group"
        aria-label="Artwork view"
        className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1 font-mono text-[10px] uppercase tracking-[0.12em] backdrop-blur-sm"
    >
        {([["Human view", false], ["Model view", true]] as const).map(([label, value]) => (
            <button
                key={label}
                type="button"
                aria-pressed={on === value}
                onClick={() => onChange(value)}
                data-cursor={value ? "see what a model sees" : "back to the drawing"}
                className={`rounded-full px-3 py-1.5 transition-colors duration-300
                    ${on === value ? (value ? "bg-gold text-ink" : "bg-white text-ink") : "text-white/55 hover:text-white"}`}
            >
                {label}
            </button>
        ))}
    </div>
);

const MODEL_NOTE = "Edge filter + hand-labelled regions — how a vision model might parse the drawing. Illustrative.";

const clamp = (v: number, min: number, max: number) =>
    Math.min(Math.max(v, min), max);

/* ──────────────────────────────────────────────────────────────────────────
   DESKTOP GALLERY

   Scroll strategy:
   - Outer wrapper height = 100vh (just the viewport) + scroll travel needed
   - Scroll travel = exact pixel distance from first card center to last card
     center, so card[0] is centered at scroll=0 and card[last] is centered
     at scroll=max.
   - Users can freely scroll past the section at any point — the sticky panel
     just shows whatever progress they've reached.
   ────────────────────────────────────────────────────────────────────────── */
const DesktopGallery = ({ artworks, modelView, onModelView }: { artworks: Artwork[]; modelView: boolean; onModelView: (on: boolean) => void }) => {
    const outerRef        = useRef<HTMLDivElement>(null);
    const trackRef        = useRef<HTMLDivElement>(null);
    const rafRef          = useRef<number>(0);
    const renderXRef      = useRef(0);
    const targetXRef      = useRef(0);
    const outerHeightRef  = useRef(0); // set after first render + measure

    // Per-frame values are written straight to the DOM; React only re-renders
    // when the active card changes or the end of the gallery is reached.
    const activeRef       = useRef(0);
    const spotlightRef    = useRef<HTMLDivElement>(null);
    const progressBarRef  = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isReady, setIsReady]         = useState(false);
    const [nearEnd, setNearEnd]         = useState(false);

    /* ── Measure & set outer height after paint ── */
    useEffect(() => {
        const measure = () => {
            const track = trackRef.current;
            const outer = outerRef.current;
            if (!track || !outer) return;

            const cards   = Array.from(track.children) as HTMLElement[];
            if (cards.length < 2) return;

            // Distance from center of first card to center of last card
            const first   = cards[0];
            const last    = cards[cards.length - 1];
            const firstCx = first.offsetLeft + first.offsetWidth / 2;
            const lastCx  = last.offsetLeft  + last.offsetWidth  / 2;
            const travel  = lastCx - firstCx; // exact px to scroll horizontally

            // Outer height = viewport + travel so sticky has exactly that much room
            outerHeightRef.current = window.innerHeight + travel;
            outer.style.height = `${outerHeightRef.current}px`;

            // Initialize: first card should be centered → start translateX
            // = firstCx - halfViewport (i.e. how much we must shift left so card[0] is centered)
            const initX = firstCx - window.innerWidth / 2;
            renderXRef.current = initX;
            targetXRef.current = initX;
            track.style.transform = `translateX(${-initX}px)`;

            // After mutating the outer div height, every ScrollTrigger on the page
            // (including ContactMe char animations below) must recalculate their
            // trigger positions against the updated document height.
            ScrollTrigger.refresh();
        };

        // Measure after images may have loaded & layout is stable
        setTimeout(measure, 120);
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [artworks.length]);

    /* ── Scroll listener + RAF ── */
    useEffect(() => {
        const onScroll = () => {
            const outer = outerRef.current;
            const track = trackRef.current;
            if (!outer || !track) return;

            const cards   = Array.from(track.children) as HTMLElement[];
            if (cards.length < 2) return;

            const first   = cards[0];
            const last    = cards[cards.length - 1];
            const firstCx = first.offsetLeft + first.offsetWidth / 2;
            const lastCx  = last.offsetLeft  + last.offsetWidth  / 2;

            // Scroll progress through the outer element
            const outerTop    = outer.getBoundingClientRect().top + window.scrollY;
            const scrolled    = clamp(window.scrollY - outerTop, 0, outerHeightRef.current - window.innerHeight);
            const scrollRange = outerHeightRef.current - window.innerHeight;
            const p           = scrollRange > 0 ? scrolled / scrollRange : 0;

            // Map 0→1 progress to firstCx-center → lastCx-center
            const minX = firstCx - window.innerWidth / 2;
            const maxX = lastCx  - window.innerWidth / 2;
            targetXRef.current = minX + p * (maxX - minX);
            if (progressBarRef.current) progressBarRef.current.style.width = `${p * 100}%`;
            setNearEnd(p >= 0.97);
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        const tick = () => {
            const track = trackRef.current;
            if (track) {
                renderXRef.current += (targetXRef.current - renderXRef.current) * 0.09;
                track.style.transform = `translateX(${-renderXRef.current}px)`;

                const cards    = Array.from(track.children) as HTMLElement[];
                const screenCx = window.innerWidth / 2 + renderXRef.current;
                let best = 0, bestDist = Infinity;
                cards.forEach((c, i) => {
                    const cx = c.offsetLeft + c.offsetWidth / 2;
                    const d  = Math.abs(cx - screenCx);
                    if (d < bestDist) { bestDist = d; best = i; }
                });
                if (best !== activeRef.current) {
                    activeRef.current = best;
                    setActiveIndex(best);
                }
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        setTimeout(() => setIsReady(true), 150);

        return () => {
            window.removeEventListener("scroll", onScroll);
            cancelAnimationFrame(rafRef.current);
        };
    }, [artworks.length]);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        const at = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        if (spotlightRef.current) spotlightRef.current.style.transform = at;
    }, []);

    return (
        /* Outer: height set dynamically via JS after measure */
        <div ref={outerRef} id="artworks" style={{ position: "relative" }}>

            {/* Sticky viewport panel */}
            <div
                onMouseMove={onMouseMove}
                style={{
                    position: "sticky",
                    top: 0,
                    width: "100%",
                    height: "100vh",
                    background: "#080808",
                    overflow: "hidden",
                }}
            >
                {/* grain */}
                <div aria-hidden style={{ ...grainLayer(0.55), zIndex: 10 }} />

                {/* spotlight */}
                <div ref={spotlightRef} aria-hidden style={{
                    position: "fixed",
                    left: 0, top: 0,
                    width: 420, height: 420,
                    transform: "translate(-999px, -999px)",
                    background: "radial-gradient(circle, rgba(207,163,85,0.12) 0%, rgba(207,163,85,0.04) 40%, transparent 68%)",
                    pointerEvents: "none", zIndex: 9, mixBlendMode: "screen",
                }} />

                {/* header — fixed to top-left, clear of image area */}
                <div style={{
                    position: "absolute", top: 36, left: 52, zIndex: 15,
                    opacity: isReady ? 1 : 0, transition: "opacity 0.8s 0.3s",
                }}>
                    <p style={{
                        color: "rgba(255,255,255,0.32)", fontSize: 10,
                        letterSpacing: "0.45em", textTransform: "uppercase",
                        margin: 0, fontFamily: "inherit",
                    }}>Beyond Code</p>
                    <h2 style={{
                        color: "#fff", fontSize: 13, letterSpacing: "0.3em",
                        textTransform: "uppercase", fontWeight: 500,
                        margin: "6px 0 0", fontFamily: "inherit",
                    }}>Artworks</h2>
                </div>

                {/* view toggle */}
                <div style={{
                    position: "absolute", top: 30, right: 52, zIndex: 15,
                    opacity: isReady ? 1 : 0, transition: "opacity 0.8s 0.3s",
                }}>
                    <ViewToggle on={modelView} onChange={onModelView} />
                </div>

                {/* progress bar */}
                <div ref={progressBarRef} style={{
                    position: "absolute", top: 0, left: 0,
                    width: 0, height: 1,
                    background: "linear-gradient(to right, transparent, #cfa355 60%)",
                    zIndex: 15, opacity: isReady ? 1 : 0,
                    transition: "width 0.06s linear",
                }} />

                {/* counter */}
                <div style={{
                    position: "absolute", bottom: 36, left: 52, zIndex: 15,
                    opacity: isReady ? 0.55 : 0, transition: "opacity 0.8s 0.6s",
                    fontVariantNumeric: "tabular-nums",
                }}>
                    <span style={{ color: "#cfa355", fontSize: 14, fontWeight: 500 }}>
                        {String(activeIndex + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 13 }}>
                        {" "}/ {String(artworks.length).padStart(2, "0")}
                    </span>
                </div>

                {/* scroll hint */}
                <div style={{
                    position: "absolute", bottom: 36, right: 52, zIndex: 15,
                    display: "flex", alignItems: "center", gap: 10,
                    opacity: isReady && !nearEnd && !modelView ? 0.38 : 0,
                    transition: "opacity 0.5s",
                }}>
                    <span style={{
                        color: "#fff", fontSize: 9,
                        letterSpacing: "0.4em", textTransform: "uppercase",
                    }}>Scroll to explore</span>
                    <svg width="32" height="8" viewBox="0 0 32 8" fill="none">
                        <line x1="0" y1="4" x2="26" y2="4" stroke="white" strokeWidth="0.8" />
                        <polyline points="22,1 28,4 22,7" stroke="white" strokeWidth="0.8" fill="none" />
                    </svg>
                </div>

                {/* model-view note */}
                <p style={{
                    position: "absolute", bottom: 34, right: 52, zIndex: 15, maxWidth: 420, margin: 0,
                    textAlign: "right", opacity: modelView ? 0.5 : 0, transition: "opacity 0.5s",
                }} className="font-mono text-[10px] leading-relaxed tracking-[0.04em] text-white">
                    {MODEL_NOTE}
                </p>

                {/* ── Track: no paddingLeft/Right — centering handled via JS ── */}
                <div
                    ref={trackRef}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        paddingTop: 110,    /* clear the header */
                        paddingBottom: 80,  /* clear counter */
                        gap: "8vw",
                        willChange: "transform",
                        boxSizing: "border-box",
                        /* No left/right padding — JS centers card[0] exactly */
                    }}
                >
                    {artworks.map((art, i) => (
                        <ArtCard
                            key={art.name}
                            art={art}
                            index={i}
                            isActive={i === activeIndex}
                            modelView={modelView}
                        />
                    ))}
                </div>

                <style>{`
                    @keyframes revealLine {
                        from { transform: scaleX(0); }
                        to   { transform: scaleX(1); }
                    }
                `}</style>
            </div>
        </div>
    );
};

/* ─── Art Card ─── */
const ArtCard = ({
    art, index, isActive, modelView,
}: {
    art: Artwork; index: number; isActive: boolean; modelView: boolean;
}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    return (
    <div style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        transform: `translateY(${index % 2 === 0 ? "-2vh" : "2vh"})`,
        transition: "opacity 0.65s cubic-bezier(0.16,1,0.3,1)",
        opacity: isActive ? 1 : 0.28,
    }}>
        <div style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 2,
            lineHeight: 0,
            maxHeight: "calc(100vh - 220px)",
            maxWidth: "min(52vw, 800px)",
            boxShadow: isActive
                ? "0 28px 72px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(255,255,255,0.06)"
                : "0 12px 36px rgba(0,0,0,0.5)",
            transition: "box-shadow 0.8s",
        }}>
            <img
                ref={imgRef}
                src={art.image}
                alt={art.name}
                loading="lazy"
                style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    maxHeight: "calc(100vh - 220px)",
                    objectFit: "contain",
                    objectPosition: "center",
                    transition: "transform 1.1s cubic-bezier(0.16,1,0.3,1), filter 0.75s",
                    transform: isActive ? "scale(1)" : "scale(1.03)",
                    filter: isActive
                        ? "brightness(1) contrast(1.04)"
                        : "brightness(0.35) saturate(0.45)",
                }}
            />
            <div aria-hidden style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, transparent 65%, rgba(0,0,0,0.38) 100%)",
                pointerEvents: "none",
            }} />
            <ModelLayer art={art} on={modelView} active={isActive} imgRef={imgRef} />
            <span style={{
                position: "absolute", top: 14, right: 14, zIndex: 4,
                fontSize: 9, letterSpacing: "0.35em",
                color: "rgba(255,255,255,0.4)",
                fontVariantNumeric: "tabular-nums",
            }}>
                {String(index + 1).padStart(2, "0")}
            </span>
        </div>

        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.5s 0.12s, transform 0.5s 0.12s",
        }}>
            <div style={{
                width: 22, height: 1, background: "#cfa355", flexShrink: 0,
                transformOrigin: "left",
                animation: isActive ? "revealLine 0.4s 0.18s both" : "none",
            }} />
            <p style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 10, letterSpacing: "0.34em",
                textTransform: "uppercase", margin: 0, fontWeight: 400,
            }}>
                {art.name}
            </p>
            {modelView && (
                <span className="bg-gold px-1.5 py-px font-mono text-[10px] leading-3.5 tracking-[0.06em] text-ink animate-[fadeIn_0.4s_ease-out_both]">
                    {art.model.subject} {art.model.score.toFixed(2)}
                </span>
            )}
        </div>
    </div>
    );
};

/* ──────────────────────────────────────────
   MOBILE
   ────────────────────────────────────────── */
const MobileGallery = ({ artworks, modelView, onModelView }: { artworks: Artwork[]; modelView: boolean; onModelView: (on: boolean) => void }) => (
    <section id="artworks" style={{
        background: "#080808", padding: "80px 0 100px",
        position: "relative", overflow: "hidden",
    }}>
        <div aria-hidden style={grainLayer(0.5)} />

        <div style={{ textAlign: "center", marginBottom: 64, position: "relative", zIndex: 2 }}>
            <p style={{
                color: "rgba(255,255,255,0.32)", fontSize: 9,
                letterSpacing: "0.45em", textTransform: "uppercase", margin: "0 0 10px",
            }}>Beyond Code</p>
            <h2 style={{
                color: "#fff", fontSize: 22, letterSpacing: "0.25em",
                textTransform: "uppercase", fontWeight: 500, margin: 0,
            }}>Artworks</h2>
            <div style={{ width: 28, height: 1, background: "#cfa355", margin: "14px auto 0" }} />
            <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
                <ViewToggle on={modelView} onChange={onModelView} />
            </div>
            <p
                className="font-mono text-[10px] leading-relaxed tracking-[0.04em] text-white/45"
                style={{ margin: "14px auto 0", maxWidth: 300, opacity: modelView ? 1 : 0, transition: "opacity 0.5s" }}
            >
                {MODEL_NOTE}
            </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative", zIndex: 2 }}>
            {artworks.map((art, i) => <MobileCard key={art.name} art={art} index={i} modelView={modelView} />)}
        </div>

        <style>{`
            .mc-enter   { opacity: 0; transform: translateY(36px); }
            .mc-visible {
                opacity: 1 !important; transform: translateY(0) !important;
                transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1),
                            transform 0.85s cubic-bezier(0.16,1,0.3,1) !important;
            }
        `}</style>
    </section>
);

const MobileCard = ({ art, index, modelView }: { art: Artwork; index: number; modelView: boolean }) => {
    const ref = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [visible, setVisible] = useState(false);
    const isOdd = index % 2 !== 0;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={visible ? "mc-visible" : "mc-enter"}
            style={{
                display: "flex", flexDirection: "column",
                padding: "0 24px 60px",
                alignItems: isOdd ? "flex-end" : "flex-start",
                opacity: 0,
            }}
        >
            <span style={{
                fontSize: 9, letterSpacing: "0.35em", color: "#cfa355",
                marginBottom: 10, display: "block",
                fontVariantNumeric: "tabular-nums", opacity: 0.65,
            }}>
                {String(index + 1).padStart(2, "0")}
            </span>

            <div style={{
                width: isOdd ? "86%" : "91%",
                position: "relative", overflow: "hidden",
                borderRadius: 2, lineHeight: 0, background: "#111",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}>
                <img
                    ref={imgRef}
                    src={art.image}
                    alt={art.name}
                    loading="lazy"
                    style={{
                        display: "block", width: "100%", height: "auto",
                        objectFit: "contain",
                        transition: "transform 7s ease",
                        transform: visible ? "scale(1.0)" : "scale(1.05)",
                    }}
                />
                <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.45) 100%)",
                }} />
                <ModelLayer art={art} on={modelView} imgRef={imgRef} />
            </div>

            <div style={{
                display: "flex", alignItems: "center", gap: 10, marginTop: 12,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.6s 0.3s, transform 0.6s 0.3s",
                flexDirection: isOdd ? "row-reverse" : "row",
            }}>
                <div style={{ width: 18, height: 1, background: "#cfa355", flexShrink: 0 }} />
                <p style={{
                    color: "rgba(255,255,255,0.65)", fontSize: 9,
                    letterSpacing: "0.32em", textTransform: "uppercase",
                    margin: 0, fontWeight: 400,
                }}>
                    {art.name}
                </p>
            </div>
        </div>
    );
};

/* ─── Root ─── */
const Artworks = () => {
    const [modelView, setModelView] = useState(false);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.innerWidth < 768
    );

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <>
            <ModelFilterDefs />
            {isMobile
                ? <MobileGallery artworks={artworkData} modelView={modelView} onModelView={setModelView} />
                : <DesktopGallery artworks={artworkData} modelView={modelView} onModelView={setModelView} />}
        </>
    );
};

export default Artworks;