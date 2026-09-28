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

export const socials: Link[] = [
    { name: "Github", href: "https://github.com/Bhuvan-S-prasad" },
    { name: "Linkedin", href: "https://www.linkedin.com/in/bhuvan-s-prasad/" },
    { name: "Instagram", href: "https://www.instagram.com/bhuvan_s_prasad/" },
];
