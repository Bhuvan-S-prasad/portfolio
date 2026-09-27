export type Project = {
    id: number;
    name: string;
    description: string;
    /** Empty when the project has no public link. */
    href: string;
    image: string;
    frameworks: string[];
};

const IMG = "https://ik.imagekit.io/wq68aygdr/portfolio/projects";

export const projects: Project[] = [
    {
        id: 1,
        name: "Auto-Mate",
        description:
            "An autonomous, human-in-the-loop AI assistant that combines agentic AI, context engineering, retrieval-augmented generation and a multi-agent architecture to automate daily productivity workflows. Built on the ReAct paradigm, it reasons, retrieves contextual memories, works with tools such as Gmail and Google Calendar, and executes multi-step tasks through specialized agents — with long-term episodic and semantic memory, approval-based actions and a Telegram interface.",
        href: "https://github.com/Bhuvan-S-prasad/Auto-Mat",
        image: `${IMG}/Screenshot%202026-06-01%20104509.png`,
        frameworks: ["Agentic AI", "Multi-Agent Systems", "Context Engineering", "RAG", "Vector Databases", "Next.js", "TypeScript"],
    },
    {
        id: 2,
        name: "BrainScan AI",
        description:
            "An ensemble of deep learning models (EfficientNet, DenseNet and ResNet) that detects and classifies brain tumors from MRI scans, with explainable AI techniques for interpretable results. A RAG module answers hospital queries — contact details, medical protocols, procedures and brain tumor awareness.",
        href: "https://github.com/Bhuvan-S-prasad/BrainScan-org",
        image: `${IMG}/brainTumor.png`,
        frameworks: ["Deep Learning", "PyTorch", "Explainable AI", "RAG", "Flask"],
    },
    {
        id: 3,
        name: "NOMI",
        description:
            "An ongoing project — an AI-powered web search assistant that synthesizes answers with inline citations, curates personalized content feeds, and delivers real-time insights including news, markets and weather.",
        href: "",
        image: `${IMG}/Nomi.png`,
        frameworks: ["React", "Next.js", "PostgreSQL", "Node.js", "Clerk", "TailwindCSS", "Gemini"],
    },
    {
        id: 4,
        name: "Rotom",
        description:
            "An AI-powered mockup generator agent that lets users generate, edit and publish web prototypes from natural-language prompts. Built with Next.js 15 to streamline the design prototyping process.",
        href: "https://rotom-five.vercel.app/",
        image: `${IMG}/rotom.png`,
        frameworks: ["React", "Next.js", "PostgreSQL", "Node.js", "Better Auth", "TailwindCSS", "Mistral AI"],
    },
    {
        id: 5,
        name: "Blood Cell Classification",
        description:
            "Classifies 8 types of human peripheral blood cells with an ensemble of CNNs (DenseNet121, EfficientNet-B0, ResNet50, MobileNetV2), with Grad-CAM visualizations to explain each prediction.",
        href: "",
        image: `${IMG}/blood.png`,
        frameworks: ["Deep Learning", "PyTorch", "DenseNet121", "ResNet50", "Grad-CAM", "Flask"],
    },
    {
        id: 6,
        name: "Bird Species Classification",
        description:
            "A bird species classifier built on a ResNet50 CNN, using transfer learning and fine-tuning to identify species with high accuracy.",
        href: "",
        image: `${IMG}/bird.png`,
        frameworks: ["Deep Learning", "PyTorch", "ResNet50", "Transfer Learning", "Flask"],
    },
    {
        id: 7,
        name: "Rivora",
        description:
            `A full-stack social media application built around meaningful conversations and communities. Users share "Echoes", hold deep discussions and form communities called "Rifts".`,
        href: "https://rivora-psi.vercel.app/",
        image: `${IMG}/rivora.png`,
        frameworks: ["React", "Next.js", "MongoDB", "Node.js", "Clerk"],
    },
];
