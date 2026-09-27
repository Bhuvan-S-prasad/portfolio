export type ApproachStep = {
    title: string;
    body: string;
};

export const approach = {
    title: "How I Work",
    subTitle: "Find the bottleneck",
    text: "Every slow system has one step\nthat everything else waits on.\nI find it, measure it, and build\nthe AI that removes it.",
    stages: ["Intake", "Analysis", "Review", "Release"],
    /** Index of the stage that becomes the bottleneck. */
    bottleneck: 2,
    steps: [
        {
            title: "Observe",
            body: "Map the workflow end to end and watch where work actually goes — not where the process diagram says it goes.",
        },
        {
            title: "Measure",
            body: "Instrument every stage: throughput, wait time, utilisation. Opinions become numbers.",
        },
        {
            title: "Identify",
            body: "One stage runs past its capacity. Everything upstream queues behind it — that's the bottleneck.",
        },
        {
            title: "Architect",
            body: "Design a targeted AI or software tool for that stage — classify, route, auto-draft — and plug it in exactly where the time is lost.",
        },
        {
            title: "Result",
            body: "The queue drains and cycle time drops. Then measure again — the next bottleneck is always somewhere else.",
        },
    ] satisfies ApproachStep[],
    aiTrace: [
        { text: "classify request", status: "ok" },
        { text: "route to reviewer", status: "ok" },
        { text: "auto-draft review", status: "ok" },
    ],
    caption:
        "Patterns from my work improving engineering workflows in the aerospace industry — abstracted. Every figure here comes from the live simulation, not real data.",
};
