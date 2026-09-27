import { useEffect, useRef, useState } from "react";
import { PipelineSim, MAX_SLOTS, type Item } from "../../lib/pipelineSim";
import { prefersReducedMotion } from "../../lib/motion";
import { approach } from "../../content/approach";
import DetectionBox from "../annotate/DetectionBox";
import TraceLog from "../annotate/TraceLog";

/** Horizontal position of each station, as a fraction of the visual's width. */
const STATION_X = [0.12, 0.37, 0.63, 0.88];
/** Vertical position of the lane, as a fraction of the visual's height. */
const LANE_Y = 0.56;
const ITEM = 7;         // work-item square size, px
const CELL = 11;        // queue grid pitch, px
const ROWS = 3;         // queue rows
const ARRIVAL_EVERY = 12;
const BOTTLENECK = approach.bottleneck;
const AI_CAPACITY = 3;

const BASE_STAGES = [
    { capacity: 2, service: 18, queueMax: 24 },
    { capacity: 3, service: 30, queueMax: 24 },
    { capacity: 1, service: 24, queueMax: 24 }, // the bottleneck until the AI tool lands
    { capacity: 2, service: 18, queueMax: 24 },
];

const INK = [8, 8, 8];
const GOLD = [207, 163, 85];
const EMBER = [200, 85, 61];
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const heatColor = (h: number) => (h < 0.5 ? mix(INK, GOLD, h / 0.5) : mix(GOLD, EMBER, (h - 0.5) / 0.5));

interface PipelineVisualProps {
    /** Active story step, 0–4 (observe, measure, identify, architect, result). */
    step: number;
}

const PipelineVisual = ({ step }: PipelineVisualProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stationRefs = useRef<(HTMLDivElement | null)[]>([]);
    const waitRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const utilRefs = useRef<(HTMLDivElement | null)[]>([]);
    const throughputRef = useRef<HTMLSpanElement>(null);
    const cycleRef = useRef<HTMLSpanElement>(null);
    const backlogRef = useRef<HTMLSpanElement>(null);
    const deltaRef = useRef<HTMLSpanElement>(null);
    const detectionRef = useRef<HTMLDivElement>(null);

    const [capacity, setCapacity] = useState(AI_CAPACITY);
    const stepRef = useRef(step);
    const capacityRef = useRef(capacity);
    useEffect(() => { stepRef.current = step; }, [step]);
    useEffect(() => { capacityRef.current = capacity; }, [capacity]);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!root || !canvas || !ctx) return;

        const reduced = prefersReducedMotion();
        const sim = new PipelineSim(BASE_STAGES.map((s) => ({ ...s })), ARRIVAL_EVERY);

        let w = 0, h = 0, laneY = 0, stationW = 60, stationH = 76;
        let xs: number[] = [];
        let cols: number[] = [];

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = root.clientWidth;
            h = root.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const station = stationRefs.current[0];
            stationW = station?.offsetWidth ?? 60;
            stationH = station?.offsetHeight ?? 76;
            laneY = h * LANE_Y;
            xs = STATION_X.map((f) => f * w);

            // Each queue fills the gap between its station and the previous one.
            cols = xs.map((x, s) => {
                const left = s === 0 ? 4 : xs[s - 1] + stationW / 2 + 12;
                const right = x - stationW / 2 - 12;
                return Math.max(2, Math.min(12, Math.floor((right - left) / CELL)));
            });
            sim.stages.forEach((stage, s) => { stage.queueMax = cols[s] * ROWS; });

            // Frame the bottleneck station together with its queue.
            const det = detectionRef.current;
            if (det) {
                const queueW = cols[BOTTLENECK] * CELL + 12;
                const left = xs[BOTTLENECK] - stationW / 2 - queueW - 10;
                det.style.left = `${left}px`;
                // Tall enough to take in the station's label, so its own label clears the row.
                det.style.top = `${laneY - stationH / 2 - 40}px`;
                det.style.width = `${xs[BOTTLENECK] + stationW / 2 + 10 - left}px`;
                det.style.height = `${stationH + 56}px`;
            }
        };

        const slotY = (slot: number) =>
            laneY + (slot - (MAX_SLOTS - 1) / 2) * ((stationH - 16) / (MAX_SLOTS - 1));

        // Warm up so the pipeline is already busy when it scrolls into view.
        resize();
        for (let i = 0; i < 360; i++) sim.tick();
        let snap = true;

        let baseline = 0;
        let frame = 0;
        let running = false;

        const updateTargets = () => {
            const ease = reduced || snap ? 1 : 0.2;
            const place = (item: Item, tx: number, ty: number) => {
                if (Number.isNaN(item.x)) {
                    item.x = snap ? tx : -10;
                    item.y = snap ? ty : laneY;
                }
                item.x += (tx - item.x) * ease;
                item.y += (ty - item.y) * ease;
            };

            sim.queues.forEach((queue, s) => {
                queue.forEach((item, k) => {
                    const col = Math.floor(k / ROWS);
                    const row = k % ROWS;
                    place(item,
                        xs[s] - stationW / 2 - 12 - col * CELL,
                        laneY + (row - (ROWS - 1) / 2) * CELL);
                });
            });
            sim.slots.forEach((slots, s) => {
                slots.forEach((item) => { if (item) place(item, xs[s], slotY(item.slot)); });
            });
            for (const item of sim.items) {
                if (item.phase === "done") place(item, w + 30, laneY);
            }
            sim.prune((item) => item.x > w + 8);
            snap = false;
        };

        const draw = () => {
            const current = stepRef.current;
            ctx.clearRect(0, 0, w, h);

            // Lane
            ctx.strokeStyle = "rgba(8, 8, 8, 0.12)";
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 5]);
            ctx.beginPath();
            ctx.moveTo(0, laneY);
            ctx.lineTo(w, laneY);
            ctx.stroke();
            ctx.setLineDash([]);

            const half = ITEM / 2;
            for (const item of sim.items) {
                let color = "rgba(8, 8, 8, 0.8)";
                if (item.phase === "queue" && item.stage === BOTTLENECK && current >= 2) {
                    const [r, g, b] = heatColor(Math.min(1, (sim.time - item.queuedAt) / 240));
                    color = `rgb(${r}, ${g}, ${b})`;
                } else if (item.phase === "service" && item.stage === BOTTLENECK && current >= 3 && item.slot > 0) {
                    color = "rgb(207, 163, 85)"; // handled by the AI tool
                } else if (item.phase === "done") {
                    color = "rgba(8, 8, 8, 0.35)";
                }
                ctx.fillStyle = color;
                ctx.fillRect(item.x - half, item.y - half, ITEM, ITEM);
            }
        };

        const writeMetrics = () => {
            sim.stages.forEach((_, s) => {
                const wait = waitRefs.current[s];
                const util = utilRefs.current[s];
                if (wait) wait.textContent = sim.waitEma[s].toFixed(1);
                if (util) util.style.width = `${Math.round(sim.utilEma[s] * 100)}%`;
            });
            if (throughputRef.current) throughputRef.current.textContent = sim.throughput.toFixed(1);
            if (cycleRef.current) cycleRef.current.textContent = sim.cycleEma.toFixed(1);
            if (backlogRef.current) backlogRef.current.textContent = String(sim.backlog);
            if (deltaRef.current) {
                const delta = baseline ? Math.max(0, 1 - sim.cycleEma / baseline) : 0;
                deltaRef.current.textContent = `−${Math.round(delta * 100)}`;
            }
        };

        let tick = 0;
        const loop = () => {
            const current = stepRef.current;
            // The AI tool lands at "Architect"; at "Result" the visitor controls capacity.
            sim.stages[BOTTLENECK].capacity =
                current >= 4 ? capacityRef.current : current >= 3 ? AI_CAPACITY : 1;
            // Measure the improvement against the cycle time just before the fix.
            if (current >= 3 && !baseline) baseline = sim.cycleEma;
            if (current < 3) baseline = 0;

            sim.tick();
            updateTargets();
            draw();
            if (++tick % 6 === 0) writeMetrics();
            frame = requestAnimationFrame(loop);
        };

        const start = () => {
            if (running) return;
            running = true;
            frame = requestAnimationFrame(loop);
        };
        const stop = () => {
            running = false;
            cancelAnimationFrame(frame);
        };

        // Simulate only while visible.
        const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
        observer.observe(root);
        const resizeObserver = new ResizeObserver(() => { resize(); snap = true; });
        resizeObserver.observe(root);
        writeMetrics();

        return () => {
            stop();
            observer.disconnect();
            resizeObserver.disconnect();
        };
    }, []);

    const muted = "font-mono text-[10px] uppercase tracking-[0.14em] text-black/50";

    return (
        <div ref={rootRef} className="relative size-full select-none">
            {/* Global metrics */}
            <dl className={`absolute left-0 top-0 grid grid-cols-[auto_auto] gap-x-6 gap-y-1.5 ${muted}
                transition-opacity duration-500 ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
                <dt>Throughput</dt>
                <dd className="text-black tabular-nums"><span ref={throughputRef}>0.0</span> / h</dd>
                <dt>Cycle time</dt>
                <dd className="text-black tabular-nums"><span ref={cycleRef}>0.0</span> h</dd>
                <dt>Backlog</dt>
                <dd className="text-black tabular-nums"><span ref={backlogRef}>0</span></dd>
            </dl>

            {/* AI tool, plugged in above the bottleneck at "Architect" */}
            <div
                className={`absolute -translate-x-1/2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${step >= 3 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
                style={{ left: `${STATION_X[BOTTLENECK] * 100}%`, bottom: `calc(${(1 - LANE_Y) * 100}% + 76px)` }}
            >
                <div className="w-36 sm:w-52 rounded-md border border-gold bg-bone px-3 py-2.5">
                    <p className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black">
                        <span className="size-1.5 rounded-full bg-gold" /> AI tool
                    </p>
                    <TraceLog
                        lines={approach.aiTrace}
                        className={`trace-reveal hidden sm:block text-[10px] leading-[1.7] text-black/60 ${step >= 3 ? "is-on" : ""}`}
                    />
                    <p className="sm:hidden font-mono text-[10px] text-black/60">classify · route · draft</p>
                </div>
                <div className="mx-auto h-4 w-px border-l border-dashed border-gold" />
            </div>

            {/* Stations */}
            {approach.stages.map((name, s) => {
                const isBottleneck = s === BOTTLENECK;
                const hot = isBottleneck && step === 2;
                const fixed = isBottleneck && step >= 3;
                return (
                    <div
                        key={name}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${STATION_X[s] * 100}%`, top: `${LANE_Y * 100}%` }}
                    >
                        <p className={`absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap ${muted}`}>
                            {name}
                            {fixed && <span className="text-gold"> + AI</span>}
                        </p>
                        <div
                            ref={(el) => { stationRefs.current[s] = el; }}
                            className={`h-15 w-10 sm:h-19 sm:w-15 rounded-md border transition-colors duration-500
                                ${hot ? "border-ember bg-ember/5" : fixed ? "border-gold bg-gold/5" : "border-black/25"}`}
                        />
                        <div className={`absolute left-1/2 top-full mt-3 w-16 sm:w-20 -translate-x-1/2 text-center transition-opacity duration-500
                            ${step >= 1 ? "opacity-100" : "opacity-0"}`}>
                            <p className={muted}>
                                wait <span ref={(el) => { waitRefs.current[s] = el; }} className="text-black tabular-nums">0.0</span>h
                            </p>
                            <div className="mt-1.5 h-0.5 w-full bg-black/10">
                                <div
                                    ref={(el) => { utilRefs.current[s] = el; }}
                                    className={`h-full transition-[width] duration-300 ${hot ? "bg-ember" : "bg-black/60"}`}
                                    style={{ width: 0 }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* The bottleneck, detected */}
            <DetectionBox
                ref={detectionRef}
                label="bottleneck"
                confidence={0.97}
                className={`transition-opacity duration-500 ${step === 2 ? "opacity-100" : "opacity-0"}`}
            />

            {/* Moving work items */}
            <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />

            {/* Result + try-it control (wraps onto two rows on narrow screens) */}
            <div className={`absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 transition-all duration-700
                ${step >= 4 ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"}`}>
                <div>
                    <p className="text-5xl sm:text-7xl font-extralight tracking-[-0.04em] tabular-nums text-black">
                        <span ref={deltaRef}>−0</span>%
                    </p>
                    <p className={`mt-2 ${muted}`}>cycle time vs. before the fix</p>
                </div>

                <label className="flex flex-col items-start sm:items-end gap-2">
                    <span className={muted}>Try it — review capacity</span>
                    <span className="flex items-center gap-3">
                        <input
                            type="range"
                            min={1}
                            max={MAX_SLOTS}
                            step={1}
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            data-cursor="drag"
                            className="w-32 sm:w-40 accent-gold"
                            tabIndex={step >= 4 ? 0 : -1}
                        />
                        <span className="w-4 font-mono text-sm tabular-nums text-black">{capacity}</span>
                    </span>
                </label>
            </div>
        </div>
    );
};

export default PipelineVisual;
