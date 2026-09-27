export type DemoKind = "agent" | "ensemble" | "citations" | "mockup" | "cells" | "finetune" | "thread";

export type Project = {
    id: number;
    name: string;
    description: string;
    /** Empty when the project has no public link. */
    href: string;
    image: string;
    frameworks: string[];
    /** Which code-built demo the case file shows. */
    demo: DemoKind;
    caseFile: {
        tagline: string;
        problem: string;
        approach: string;
        outcome: string;
    };
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
        demo: "agent",
        caseFile: {
            tagline: "An agent that does the busywork — and asks before it acts.",
            problem: "Everyday admin — email, calendar, follow-ups — arrives as a stream of small multi-step tasks that interrupt real work.",
            approach: "A ReAct planner delegates to specialised agents for mail, calendar and memory. Episodic and semantic memory give it context, and every action that changes something waits for approval over Telegram.",
            outcome: "Multi-step tasks run end to end from a single message, with a human approving anything irreversible.",
        },
    },
    {
        id: 2,
        name: "BrainScan AI",
        description:
            "An ensemble of deep learning models (EfficientNet, DenseNet and ResNet) that detects and classifies brain tumors from MRI scans, with explainable AI techniques for interpretable results. A RAG module answers hospital queries — contact details, medical protocols, procedures and brain tumor awareness.",
        href: "https://github.com/Bhuvan-S-prasad/BrainScan-org",
        image: `${IMG}/brainTumor.png`,
        frameworks: ["Deep Learning", "PyTorch", "Explainable AI", "RAG", "Flask"],
        demo: "ensemble",
        caseFile: {
            tagline: "Three models, one explainable verdict.",
            problem: "A single network can be confidently wrong on an MRI scan, and a bare label gives a clinician nothing to check.",
            approach: "EfficientNet, DenseNet and ResNet each classify the scan and the ensemble votes, with explainability maps showing what drove the call. A RAG module answers hospital questions — contacts, protocols, procedures.",
            outcome: "Predictions that don't hinge on a single model, each paired with an explanation a person can inspect.",
        },
    },
    {
        id: 3,
        name: "NOMI",
        description:
            "An ongoing project — an AI-powered web search assistant that synthesizes answers with inline citations, curates personalized content feeds, and delivers real-time insights including news, markets and weather.",
        href: "",
        image: `${IMG}/Nomi.png`,
        frameworks: ["React", "Next.js", "PostgreSQL", "Node.js", "Clerk", "TailwindCSS", "Gemini"],
        demo: "citations",
        caseFile: {
            tagline: "Search that shows its sources.",
            problem: "AI answers are fast, but hard to trust when you can't see where a claim came from.",
            approach: "A search assistant that retrieves live sources, synthesises an answer with inline citations, and curates personalised feeds for news, markets and weather.",
            outcome: "In progress — answers where every claim links back to where it came from.",
        },
    },
    {
        id: 4,
        name: "Rotom",
        description:
            "An AI-powered mockup generator agent that lets users generate, edit and publish web prototypes from natural-language prompts. Built with Next.js 15 to streamline the design prototyping process.",
        href: "https://rotom-five.vercel.app/",
        image: `${IMG}/rotom.png`,
        frameworks: ["React", "Next.js", "PostgreSQL", "Node.js", "Better Auth", "TailwindCSS", "Mistral AI"],
        demo: "mockup",
        caseFile: {
            tagline: "From a sentence to a published prototype.",
            problem: "Early design ideas stall in the gap between describing a page and actually seeing one.",
            approach: "An agent turns natural-language prompts into editable web mockups, applies follow-up edits conversationally, and publishes the result. Built on Next.js 15 with Mistral AI.",
            outcome: "Prototypes go from a prompt to a shareable page in one flow.",
        },
    },
    {
        id: 5,
        name: "Blood Cell Classification",
        description:
            "Classifies 8 types of human peripheral blood cells with an ensemble of CNNs (DenseNet121, EfficientNet-B0, ResNet50, MobileNetV2), with Grad-CAM visualizations to explain each prediction.",
        href: "",
        image: `${IMG}/blood.png`,
        frameworks: ["Deep Learning", "PyTorch", "DenseNet121", "ResNet50", "Grad-CAM", "Flask"],
        demo: "cells",
        caseFile: {
            tagline: "Eight cell types, and the reason for each call.",
            problem: "Classifying peripheral blood cells by eye is slow, and in a medical setting a label alone isn't enough to trust.",
            approach: "An ensemble of DenseNet121, EfficientNet-B0, ResNet50 and MobileNetV2 classifies 8 cell types, and Grad-CAM highlights the regions each prediction relied on.",
            outcome: "Every prediction comes with a heatmap showing where the model looked.",
        },
    },
    {
        id: 6,
        name: "Bird Species Classification",
        description:
            "A bird species classifier built on a ResNet50 CNN, using transfer learning and fine-tuning to identify species with high accuracy.",
        href: "",
        image: `${IMG}/bird.png`,
        frameworks: ["Deep Learning", "PyTorch", "ResNet50", "Transfer Learning", "Flask"],
        demo: "finetune",
        caseFile: {
            tagline: "Transfer learning, tuned down to the species.",
            problem: "Many species look alike, and there's rarely enough labelled data to train a deep network from scratch.",
            approach: "A ResNet50 pretrained on ImageNet, with a new classification head and its later layers fine-tuned on bird species.",
            outcome: "Confident species-level predictions from a modest dataset.",
        },
    },
    {
        id: 7,
        name: "Rivora",
        description:
            `A full-stack social media application built around meaningful conversations and communities. Users share "Echoes", hold deep discussions and form communities called "Rifts".`,
        href: "https://rivora-psi.vercel.app/",
        image: `${IMG}/rivora.png`,
        frameworks: ["React", "Next.js", "MongoDB", "Node.js", "Clerk"],
        demo: "thread",
        caseFile: {
            tagline: "A social app built for conversations, not scrolling.",
            problem: "Most social feeds reward quick reactions over real discussion.",
            approach: "A full-stack Next.js app where posts — Echoes — open into deep threaded discussions, and communities form as Rifts. MongoDB, Node.js and Clerk for auth.",
            outcome: "Live and deployed, with threads and communities as first-class features.",
        },
    },
];
