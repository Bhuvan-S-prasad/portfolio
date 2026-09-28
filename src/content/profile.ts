export type Link = {
    name: string;
    href: string;
};

export const profile = {
    name: "Bhuvan S Prasad",
    shortName: "Bhuvan S",
    role: "AI Engineer",
    industry: "Aerospace industry",
    location: "India",
    email: "bhuvansbhuvans113@gmail.com",
    tagline: "I find where systems slow down — and build the AI and software tools that move them forward.",
    about: {
        heading: "I build systems at the intersection\nof AI and engineering.",
        /** First paragraph is the lead; the rest read smaller. */
        body: [
            "As an AI Engineer in aerospace, I work from problem to production — analyzing complex workflows, designing solution architectures, identifying bottlenecks, and building the AI, software, and automation that remove them.",
            "My capabilities span machine learning and deep learning, NLP, computer vision, generative AI, RAG, context engineering, explainable AI, agentic and multi-agent systems, model training and fine-tuning, and evaluation. I pair that with hands-on software engineering across Python and TypeScript, building applications and infrastructure with PyTorch, LangGraph, LangChain, PostgreSQL/pgvector, React, Next.js, Flask, Docker, AWS, and CI/CD.",
            "I’m particularly interested in the layer beyond the model — where intelligence becomes a dependable system: connected to data, equipped with context, integrated into workflows, measurable in performance, and built to solve problems that actually matter.",
        ],
    },
};

/**
 * Hand-set, illustrative attribution weights (0–1) for the About text's
 * "Explain this text" view — how much each word carries the message.
 * Unlisted words get a small baseline; stop words get none.
 */
export const aboutAttribution: Record<string, number> = {
    ai: 0.72,
    engineer: 0.9,
    aerospace: 0.7,
    problem: 0.5,
    production: 0.78,
    analyzing: 0.4,
    complex: 0.35,
    workflows: 0.55,
    designing: 0.45,
    solution: 0.4,
    architectures: 0.84,
    identifying: 0.45,
    bottlenecks: 0.96,
    automation: 0.62,
    remove: 0.58,
    machine: 0.45,
    learning: 0.5,
    deep: 0.5,
    nlp: 0.5,
    vision: 0.5,
    generative: 0.55,
    rag: 0.62,
    context: 0.66,
    engineering: 0.6,
    explainable: 0.88,
    agentic: 0.8,
    "multi-agent": 0.74,
    training: 0.5,
    "fine-tuning": 0.6,
    evaluation: 0.72,
    software: 0.45,
    "hands-on": 0.4,
    python: 0.55,
    typescript: 0.5,
    applications: 0.35,
    infrastructure: 0.5,
    pytorch: 0.6,
    langgraph: 0.62,
    langchain: 0.5,
    postgresqlpgvector: 0.45,
    react: 0.4,
    nextjs: 0.4,
    flask: 0.3,
    docker: 0.45,
    aws: 0.5,
    cicd: 0.45,
    beyond: 0.4,
    model: 0.55,
    intelligence: 0.6,
    dependable: 0.9,
    data: 0.5,
    integrated: 0.55,
    measurable: 0.84,
    performance: 0.6,
    matter: 0.66,
};

export const socials: Link[] = [
    { name: "Github", href: "https://github.com/Bhuvan-S-prasad" },
    { name: "Linkedin", href: "https://www.linkedin.com/in/bhuvan-s-prasad/" },
    { name: "Instagram", href: "https://www.instagram.com/bhuvan_s_prasad/" },
];
