export type Checkpoint = {
    /** Position along the curve, 0–1. */
    at: number;
    tag: string;
    title: string;
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
            body: "BE in Computer Science Engineering (Artificial Intelligence). Machine learning, deep learning, vision and language — the fundamentals, learned properly.",
        },
        {
            at: 0.42,
            tag: "ckpt 02 · fine-tuning",
            title: "Building",
            body: "Independent projects: agentic assistants, cited search, explainable medical imaging. Learning by shipping things that work.",
        },
        {
            at: 0.76,
            tag: "ckpt 03 · deployment",
            title: "Deploying",
            body: "AI Engineer in the aerospace industry — finding the bottlenecks in engineering workflows and building the AI that removes them.",
        },
    ] satisfies Checkpoint[],
};
