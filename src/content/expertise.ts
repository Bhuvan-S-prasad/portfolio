export type FocusArea = {
    title: string;
    description: string;
    items: { title: string; description: string }[];
};

export const focusAreas: FocusArea[] = [
    {
        title: "AI for Efficiency & Solution Architecture",
        description:
            "Finding the bottlenecks in complex engineering workflows and architecting AI and software tools that remove them.",
        items: [
            { title: "Bottleneck Analysis", description: "Measuring where time, effort and data get stuck" },
            { title: "Tooling & Automation", description: "Software tools that replace slow, manual steps" },
            { title: "Solution Architecture", description: "Designing systems that scale with the team using them" },
        ],
    },
    {
        title: "Agentic AI & Multi-Agent Systems",
        description:
            "Designing autonomous AI systems that collaborate, reason, and execute complex workflows across multiple tools and agents.",
        items: [
            { title: "Agentic AI", description: "Autonomous task planning, execution, and tool usage" },
            { title: "Multi-Agent Systems", description: "Collaborative AI agents for complex problem solving" },
            { title: "Workflow Automation", description: "End-to-end intelligent automation and orchestration" },
        ],
    },
    {
        title: "Generative AI, RAG & Context Engineering",
        description:
            "Creating LLM-powered applications with advanced retrieval systems, contextual grounding, and knowledge integration.",
        items: [
            { title: "Generative AI", description: "LLM-powered applications and AI assistants" },
            { title: "Retrieval-Augmented Generation", description: "Knowledge-grounded AI systems with reduced hallucinations" },
            { title: "Context Engineering", description: "Optimizing prompts, memory, and contextual workflows for LLMs" },
        ],
    },
    {
        title: "Deep Learning & Explainable AI",
        description:
            "Building deep learning systems for vision and language that expose why they decide, not just what they decide.",
        items: [
            { title: "Deep Learning", description: "CNNs, Transformers, transfer learning, and model optimization" },
            { title: "Explainable AI", description: "Grad-CAM and SHAP for interpretable, accountable predictions" },
            { title: "Medical Imaging & NLP", description: "MRI analysis, text understanding and summarization" },
        ],
    },
];
