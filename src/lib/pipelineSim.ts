/**
 * A tiny discrete-time queueing simulation of a multi-stage workflow.
 *
 * One tick = one simulated minute. Work items arrive at the first stage, wait
 * in a FIFO queue, occupy one of the stage's parallel slots for its service
 * time, then move on. When the next stage's queue is full the item stays in
 * its slot (blocked), so congestion genuinely propagates upstream.
 */

export type Stage = {
    /** Parallel slots that can serve at once. */
    capacity: number;
    /** Ticks each item spends in a slot. */
    service: number;
    /** Max items the queue in front of this stage can hold. */
    queueMax: number;
};

export type Item = {
    id: number;
    stage: number;
    phase: "queue" | "service" | "done";
    arrivedAt: number;
    queuedAt: number;
    remaining: number;
    slot: number;
    /** Render position, eased toward the item's target by the renderer. */
    x: number;
    y: number;
};

export const MAX_SLOTS = 5;
const TICKS_PER_HOUR = 60;
const EMA = 0.08;

export class PipelineSim {
    stages: Stage[];
    /** Ticks between arrivals (fractional values allowed). */
    arrivalEvery: number;
    time = 0;
    items: Item[] = [];
    queues: Item[][];
    slots: (Item | null)[][];
    waitEma: number[];
    utilEma: number[];
    cycleEma = 0;
    private completions: number[] = [];
    private arrivalAcc = 0;
    private nextId = 0;

    constructor(stages: Stage[], arrivalEvery: number) {
        this.stages = stages;
        this.arrivalEvery = arrivalEvery;
        this.queues = stages.map(() => []);
        this.slots = stages.map(() => Array(MAX_SLOTS).fill(null));
        this.waitEma = stages.map(() => 0);
        this.utilEma = stages.map(() => 0);
    }

    tick() {
        const t = ++this.time;
        const last = this.stages.length - 1;

        // Arrivals (dropped if the intake queue is full).
        this.arrivalAcc += 1 / this.arrivalEvery;
        while (this.arrivalAcc >= 1) {
            this.arrivalAcc -= 1;
            if (this.queues[0].length < this.stages[0].queueMax) {
                const item: Item = {
                    id: this.nextId++, stage: 0, phase: "queue",
                    arrivedAt: t, queuedAt: t, remaining: 0, slot: -1, x: NaN, y: NaN,
                };
                this.queues[0].push(item);
                this.items.push(item);
            }
        }

        // Downstream first, so a stage frees queue space before upstream hands over.
        for (let s = last; s >= 0; s--) {
            const stage = this.stages[s];
            const slots = this.slots[s];

            for (let i = 0; i < MAX_SLOTS; i++) {
                const item = slots[i];
                if (!item) continue;
                if (item.remaining > 0) item.remaining--;
                if (item.remaining > 0) continue;

                if (s === last) {
                    item.phase = "done";
                    slots[i] = null;
                    this.completions.push(t);
                    const cycle = (t - item.arrivedAt) / TICKS_PER_HOUR;
                    this.cycleEma = this.cycleEma ? this.cycleEma + (cycle - this.cycleEma) * EMA : cycle;
                } else if (this.queues[s + 1].length < this.stages[s + 1].queueMax) {
                    item.stage = s + 1;
                    item.phase = "queue";
                    item.queuedAt = t;
                    slots[i] = null;
                    this.queues[s + 1].push(item);
                }
                // else: blocked — stays in its slot until space opens downstream.
            }

            // Fill free slots up to the current capacity.
            let busy = 0;
            for (let i = 0; i < MAX_SLOTS; i++) {
                if (!slots[i] && i < stage.capacity && this.queues[s].length) {
                    const item = this.queues[s].shift()!;
                    const wait = (t - item.queuedAt) / TICKS_PER_HOUR;
                    this.waitEma[s] += (wait - this.waitEma[s]) * EMA;
                    item.phase = "service";
                    item.remaining = stage.service;
                    item.slot = i;
                    slots[i] = item;
                }
                if (slots[i]) busy++;
            }
            this.utilEma[s] += (Math.min(1, busy / stage.capacity) - this.utilEma[s]) * EMA;
        }

        // Keep only recent completions for the throughput window.
        const windowStart = t - 10 * TICKS_PER_HOUR;
        while (this.completions.length && this.completions[0] < windowStart) this.completions.shift();
    }

    /** Completed items per simulated hour over the last 10 hours. */
    get throughput() {
        return this.completions.length / 10;
    }

    get backlog() {
        return this.queues.reduce((n, q) => n + q.length, 0);
    }

    /** Drop finished items once the renderer has animated them out. */
    prune(isGone: (item: Item) => boolean) {
        this.items = this.items.filter((item) => item.phase !== "done" || !isGone(item));
    }
}
