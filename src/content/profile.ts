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
        heading: "Accurate is the baseline.\nI build AI that is explainable, reliable\nand measurably improves how teams work.",
        body: "I'm an AI engineer working in the aerospace industry, where I identify bottlenecks in complex workflows and architect AI and software tools that make them faster and more reliable. My background spans deep learning, explainable AI and LLM-based systems — from medical imaging models to agentic, retrieval-augmented assistants — built with a focus on interpretability and real-world impact.",
    },
};

/**
 * Hand-set, illustrative attribution weights (0–1) for the About paragraph's
 * "Explain this paragraph" view — how much each word carries the message.
 * Unlisted words get a small baseline; stop words get none.
 */
export const aboutAttribution: Record<string, number> = {
    ai: 0.72,
    engineer: 0.9,
    aerospace: 0.7,
    industry: 0.3,
    identify: 0.45,
    bottlenecks: 0.96,
    complex: 0.35,
    workflows: 0.55,
    architect: 0.86,
    software: 0.45,
    tools: 0.6,
    faster: 0.66,
    reliable: 0.68,
    deep: 0.55,
    learning: 0.5,
    explainable: 0.88,
    "llm-based": 0.6,
    medical: 0.45,
    imaging: 0.45,
    agentic: 0.76,
    "retrieval-augmented": 0.58,
    assistants: 0.4,
    interpretability: 0.82,
    "real-world": 0.52,
    impact: 0.74,
};

export const socials: Link[] = [
    { name: "Github", href: "https://github.com/Bhuvan-S-prasad" },
    { name: "Linkedin", href: "https://www.linkedin.com/in/bhuvan-s-prasad/" },
    { name: "Instagram", href: "https://www.instagram.com/bhuvan_s_prasad/" },
];
