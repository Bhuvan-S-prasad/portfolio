import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "../lib/motion";
import Plane from "./UI/Plane";

/*
 * "Let's talk." — the closing sequence. A cloud of points converges into the
 * words as the page scrolls (a model reaching its final checkpoint), then a
 * plane flies through the finished letters and scatters them in its wake.
 * On desktop the cursor pushes the points around too; they always spring back.
 */

// Phases, in section progress (0 → 1 while the stage is pinned, before the footer covers it).
const CONVERGE_END = 0.62;
const FLIGHT_FROM = 0.46;
const FLIGHT_TO = 0.94;
const SUBLINE_FROM = 0.6;

const SPREAD = 0.5; // how staggered the particles' arrival is (0 = all at once)
const SPRING = 0.045;
const DAMPING = 0.88;
const STEPS = 1000;

const FONT = '"Geist Variable", ui-sans-serif, system-ui, sans-serif';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Small seeded PRNG, so the cloud looks the same after a resize. */
const mulberry32 = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Field = {
    n: number;
    w: number;
    h: number;
    dot: number;
    /** Vertical extent of the lettering, for the plane's path. */
    top: number;
    bottom: number;
    tx: Float32Array; ty: Float32Array; // target (in the letters)
    sx: Float32Array; sy: Float32Array; // start (in the cloud)
    ox: Float32Array; oy: Float32Array; // displacement from pushes
    vx: Float32Array; vy: Float32Array;
    px: Float32Array; py: Float32Array; // last drawn position
    delay: Float32Array;
    phase: Float32Array;
    curl: Float32Array;
    gold: Uint8Array;
};

/** Sample the lettering into target points and scatter matching start points. */
const buildField = (w: number, h: number): Field => {
    const mobile = w < 768;
    const lines = mobile ? ["Let's", "talk."] : ["Let's talk."];
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const g = off.getContext("2d", { willReadFrequently: true })!;
    if ("letterSpacing" in g) g.letterSpacing = "-2px";

    g.font = `500 100px ${FONT}`;
    const widest = Math.max(...lines.map((l) => g.measureText(l).width));
    const lineH = 0.92;
    const size = Math.min(
        ((w * (mobile ? 0.86 : 0.8)) / widest) * 100,
        (h * (mobile ? 0.4 : 0.46)) / (lines.length * lineH),
    );
    g.font = `500 ${size}px ${FONT}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const cy = h * 0.46;
    lines.forEach((l, i) => g.fillText(l, w / 2, cy + (i - (lines.length - 1) / 2) * size * lineH));

    const step = mobile ? 4 : Math.max(4, Math.round(w / 290));
    const data = g.getImageData(0, 0, w, h).data;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
            if (data[(y * w + x) * 4 + 3] > 140) { xs.push(x); ys.push(y); }
        }
    }

    const n = xs.length;
    const rand = mulberry32(7);
    const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-6)) * Math.cos(2 * Math.PI * rand());
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const f: Field = {
        n, w, h,
        dot: step * 0.62,
        top: Math.min(...ys),
        bottom: Math.max(...ys),
        tx: Float32Array.from(xs), ty: Float32Array.from(ys),
        sx: new Float32Array(n), sy: new Float32Array(n),
        ox: new Float32Array(n), oy: new Float32Array(n),
        vx: new Float32Array(n), vy: new Float32Array(n),
        px: new Float32Array(n), py: new Float32Array(n),
        delay: new Float32Array(n), phase: new Float32Array(n),
        curl: new Float32Array(n), gold: new Uint8Array(n),
    };
    for (let i = 0; i < n; i++) {
        f.sx[i] = w / 2 + gauss() * w * 0.3;
        f.sy[i] = cy + gauss() * h * 0.26;
        // Resolves roughly left to right, with some noise.
        f.delay[i] = SPREAD * (0.7 * ((xs[i] - minX) / (maxX - minX || 1)) + 0.3 * rand());
        f.phase[i] = rand() * Math.PI * 2;
        f.curl[i] = (rand() - 0.5) * (mobile ? 90 : 220);
        f.gold[i] = rand() < 0.045 ? 1 : 0;
    }
    return f;
};

/** Where the plane is at flight progress `t` (enters low-left, climbs out top-right through the words). */
const flightPath = (f: Field, t: number, pad: number) => {
    const span = f.bottom - f.top;
    const y0 = f.bottom + span * 0.1;
    const y1 = f.top - span * 0.9;
    return {
        x: -pad + t * (f.w + pad * 2),
        y: y0 + (y1 - y0) * Math.pow(t, 1.5),
    };
};

const ContactMe = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const planeRef = useRef<HTMLDivElement>(null);
    const statusRef = useRef<HTMLSpanElement>(null);
    const stepRef = useRef<HTMLSpanElement>(null);
    const lossRef = useRef<HTMLSpanElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);
    const hintRef = useRef<HTMLSpanElement>(null);

    useGSAP(() => {
        const section = sectionRef.current;
        const stage = stageRef.current;
        const canvas = canvasRef.current;
        const plane = planeRef.current;
        const ctx = canvas?.getContext("2d");
        if (!section || !stage || !canvas || !plane || !ctx) return;

        const reduced = prefersReducedMotion();
        let field: Field | null = null;
        let dpr = 1;
        let progress = reduced ? 1 : 0;
        let visible = false;
        const pointer = { x: 0, y: 0, on: false };
        const last = { status: "", step: "", loss: "" };

        const resize = () => {
            const w = stage.clientWidth;
            const h = stage.clientHeight;
            if (!w || !h) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            field = buildField(w, h);
            render(0);
        };

        const render = (time: number) => {
            const f = field;
            if (!f) return;
            const P = progress;
            const C = clamp01(P / CONVERGE_END);

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, f.w, f.h);

            // Things that push the points: the plane, and the cursor once the words exist.
            const pushers: [number, number, number, number][] = [];
            const pw = plane.offsetWidth;
            const ft = clamp01((P - FLIGHT_FROM) / (FLIGHT_TO - FLIGHT_FROM));
            const flying = !reduced && ft > 0 && ft < 1;
            if (flying) {
                const a = flightPath(f, ft, pw);
                const b = flightPath(f, Math.min(1, ft + 0.01), pw);
                const angle = Math.atan2(b.y - a.y, b.x - a.x);
                plane.style.transform = `translate(${a.x - pw / 2}px, ${a.y - plane.offsetHeight / 2}px) rotate(${angle}rad)`;
                plane.style.opacity = "1";
                pushers.push([a.x, a.y, f.w < 768 ? 60 : 120, 3.4]);

                // Contrail: the path behind the plane, fading out.
                ctx.lineWidth = 1;
                const tail = 0.32;
                const from = Math.max(0, ft - tail);
                let prev = flightPath(f, from, pw);
                for (let k = 1; k <= 24; k++) {
                    const t = from + ((ft - from) * k) / 24;
                    const p = flightPath(f, t, pw);
                    ctx.strokeStyle = `rgb(8 8 8 / ${0.28 * (k / 24)})`;
                    ctx.beginPath();
                    ctx.moveTo(prev.x, prev.y);
                    ctx.lineTo(p.x - Math.cos(angle) * pw * 0.45, p.y - Math.sin(angle) * pw * 0.45);
                    ctx.stroke();
                    prev = p;
                }
            } else {
                plane.style.opacity = "0";
            }
            if (pointer.on && !reduced) {
                const r = canvas.getBoundingClientRect();
                pushers.push([pointer.x - r.left, pointer.y - r.top, 100, 2.2]);
            }

            for (let i = 0; i < f.n; i++) {
                const t = clamp01((C - f.delay[i]) / (1 - SPREAD));
                const e = easeInOut(t);
                // Travel along a curved path, not a straight line.
                const dx = f.tx[i] - f.sx[i];
                const dy = f.ty[i] - f.sy[i];
                const len = Math.hypot(dx, dy) || 1;
                const bend = Math.sin(Math.PI * e) * f.curl[i];
                let x = f.sx[i] + dx * e + (-dy / len) * bend;
                let y = f.sy[i] + dy * e + (dx / len) * bend;
                if (!reduced && e < 1) {
                    // Unsettled points drift gently.
                    x += Math.sin(time * 0.7 + f.phase[i]) * 5 * (1 - e);
                    y += Math.cos(time * 0.6 + f.phase[i] * 1.3) * 5 * (1 - e);
                }

                let vx = f.vx[i], vy = f.vy[i];
                for (const [rx, ry, R, S] of pushers) {
                    const qx = x + f.ox[i] - rx;
                    const qy = y + f.oy[i] - ry;
                    const d2 = qx * qx + qy * qy;
                    if (d2 < R * R) {
                        const d = Math.sqrt(d2) || 1;
                        const k = (1 - d / R) * (1 - d / R) * S;
                        vx += (qx / d) * k;
                        vy += (qy / d) * k;
                    }
                }
                vx = (vx - f.ox[i] * SPRING) * DAMPING;
                vy = (vy - f.oy[i] * SPRING) * DAMPING;
                f.vx[i] = vx; f.vy[i] = vy;
                f.ox[i] += vx; f.oy[i] += vy;

                f.px[i] = x + f.ox[i];
                f.py[i] = y + f.oy[i];
            }

            // Ink first, then the few gold points on top.
            for (const gold of [0, 1]) {
                ctx.fillStyle = gold ? "#cfa355" : "#080808";
                for (let i = 0; i < f.n; i++) {
                    if (f.gold[i] !== gold) continue;
                    const e = easeInOut(clamp01((C - f.delay[i]) / (1 - SPREAD)));
                    const s = f.dot * (0.45 + 0.55 * e);
                    ctx.globalAlpha = 0.16 + 0.84 * e;
                    ctx.fillRect(f.px[i] - s / 2, f.py[i] - s / 2, s, s);
                }
            }
            ctx.globalAlpha = 1;

            // Readout
            const done = C >= 1;
            const status = done ? "converged" : "converging";
            const step = `step ${String(Math.round(C * STEPS)).padStart(4, "0")}/${STEPS}`;
            const loss = `loss ${(2.304 * Math.exp(-4.2 * C) * (1 - C)).toFixed(3)}`;
            if (status !== last.status && statusRef.current) {
                statusRef.current.textContent = status;
                statusRef.current.dataset.done = String(done);
                last.status = status;
            }
            if (step !== last.step && stepRef.current) { stepRef.current.textContent = step; last.step = step; }
            if (loss !== last.loss && lossRef.current) { lossRef.current.textContent = loss; last.loss = loss; }

            const sub = clamp01((P - SUBLINE_FROM) / 0.12);
            if (sublineRef.current) {
                sublineRef.current.style.opacity = String(sub);
                sublineRef.current.style.transform = `translateY(${(1 - sub) * 16}px)`;
            }
            if (hintRef.current) hintRef.current.style.opacity = String(done ? 1 : 0);
        };

        const tick = (time: number) => { if (visible) render(time); };

        // Progress runs while the stage is pinned and uncovered; the footer then slides over it.
        const st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: () => `+=${Math.max(1, section.offsetHeight - 2 * window.innerHeight)}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => { if (!reduced) progress = self.progress; },
        });

        // As the footer covers it, the stage sinks back.
        if (!reduced) {
            gsap.fromTo(stage.firstElementChild,
                { scale: 1, opacity: 1 },
                {
                    scale: 0.93,
                    opacity: 0.35,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: () => `bottom ${window.innerHeight * 2}px`,
                        end: "bottom bottom",
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                },
            );
        }

        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
        io.observe(stage);

        let resizeTimer = 0;
        const ro = new ResizeObserver(() => {
            window.clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(resize, 120);
        });
        ro.observe(stage);

        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const onMove = (e: MouseEvent) => {
            const r = stage.getBoundingClientRect();
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.on = e.clientY >= r.top && e.clientY <= r.bottom;
        };
        const onLeave = () => { pointer.on = false; };
        if (fine) {
            window.addEventListener("mousemove", onMove, { passive: true });
            document.documentElement.addEventListener("mouseleave", onLeave);
        }

        // Canvas text needs the web font before it can be sampled.
        let cancelled = false;
        document.fonts.load(`500 100px ${FONT}`).catch(() => undefined).then(() => { if (!cancelled) resize(); });
        gsap.ticker.add(tick);

        return () => {
            cancelled = true;
            gsap.ticker.remove(tick);
            st.kill();
            io.disconnect();
            ro.disconnect();
            window.clearTimeout(resizeTimer);
            window.removeEventListener("mousemove", onMove);
            document.documentElement.removeEventListener("mouseleave", onLeave);
        };
    }, { scope: sectionRef });

    return (
        // Tall wrapper: 100svh of stage + the scroll that drives it + 100svh the footer takes to cover it.
        <section ref={sectionRef} aria-labelledby="lets-talk" className="relative h-[330svh] md:h-[360svh]">
            <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden">
                <div className="absolute inset-0 origin-[50%_30%] will-change-transform">
                    <h2 id="lets-talk" className="sr-only">Let's talk.</h2>
                    <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

                    <div ref={planeRef} aria-hidden className="pointer-events-none absolute left-0 top-0 opacity-0 will-change-transform">
                        <Plane className="h-7.5 w-20 md:h-10.5 md:w-28" body="var(--color-ink)" windows="var(--color-bone)" />
                    </div>

                    {/* Labels */}
                    <div className="absolute inset-x-5 top-24 flex flex-col gap-2 font-mono sm:flex-row sm:items-start sm:justify-between text-[10px] uppercase tracking-[0.14em] text-black/50 sm:inset-x-8 md:inset-x-15 md:top-28 md:text-[11px]">
                        <span><span className="text-gold">ckpt 04</span> · collaboration</span>
                        <span className="flex items-center gap-2">
                            <span className="relative flex size-1.5">
                                <span className="absolute inset-0 animate-ping rounded-full bg-gold opacity-70" />
                                <span className="relative size-1.5 rounded-full bg-gold" />
                            </span>
                            open to opportunities
                        </span>
                    </div>

                    <p
                        ref={sublineRef}
                        className="absolute inset-x-5 top-[70%] text-center font-serif text-2xl italic leading-snug text-black/70 opacity-0 sm:text-3xl md:top-[72%] lg:text-4xl"
                    >
                        Have a problem worth solving?
                    </p>

                    {/* Training readout */}
                    <div className="absolute inset-x-5 bottom-8 flex items-end justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.14em] text-black/50 sm:inset-x-8 md:inset-x-15 md:bottom-10 md:text-[11px]">
                        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 tabular-nums">
                            <span
                                ref={statusRef}
                                className="bg-gold px-1.5 py-px leading-3.5 text-ink transition-colors duration-500 data-[done=true]:bg-ink data-[done=true]:text-white/80"
                            >
                                converging
                            </span>
                            <span ref={stepRef}>step 0000/{STEPS}</span>
                            <span ref={lossRef} className="hidden sm:inline">loss 2.304</span>
                        </p>
                        <span ref={hintRef} className="hidden opacity-0 transition-opacity duration-700 md:inline">
                            move the cursor through it
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactMe;
