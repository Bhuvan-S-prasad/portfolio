export type Checkpoint = {
    /** Position along the curve, 0–1. */
    at: number;
    tag: string;
    title: string;
    /** Short line under the title, e.g. "CS × AI". */
    subtitle: string;
    body: string;
};

export const trajectory = {
    title: "Trajectory",
    subTitle: "How I got here",
    text: "Pretrained on computer science,\nfine-tuned by building real projects,\nnow deployed in the aerospace industry.",
    checkpoints: [
        {
            at: 0.08,
            tag: "ckpt 01 · pretraining",
            title: "Foundations",
            subtitle: "CS × AI",
            body: "Started with the fundamentals. Learned to understand what happens beneath the abstraction — from algorithms and ML to vision and language.",
        },
        {
            at: 0.42,
            tag: "ckpt 02 · fine-tuning",
            title: "Building",
            subtitle: "Ideas → Intelligence",
            body: "Built agentic systems, retrieval pipelines, and explainable vision models. Every project was a training loop: build, fail, refine, ship.",
        },
        {
            at: 0.76,
            tag: "ckpt 03 · deployment",
            title: "Real World",
            subtitle: "AI Engineer · Aerospace",
            body: "Taking AI out of the notebook and into engineering. Building systems that eliminate friction, automate complexity, and augment how aerospace teams work.",
        },
    ] satisfies Checkpoint[],
};
