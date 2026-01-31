export type NavItem = {
    name: string;
    href: string;
};

export const Items: NavItem[] = [
    {
        name: "Home",
        href: "#home"
    },
    {
        name: "Focus Areas",
        href: "#focusArea"
    },
    {
        name: "About",
        href: "#about"
    },
    {
        name: "Projects",
        href: "#projects"
    },
    {
        name: "Artworks",
        href: "#artworks"
    },
    {
        name: "Contact",
        href: "#contact"
    },
];


export const Socials: NavItem[] = [
    {
        name: "Github",
        href: "https://github.com/Bhuvan-S-prasad"
    },
    {
        name: "Linkedin",
        href: "https://www.linkedin.com/in/bhuvan-s-prasad/"
    },
    {
        name: "Instagram",
        href: "https://www.instagram.com/bhuvan_s_prasad/"
    },
];


export const focusAreas = [
    {
        title: "Deep Learning & Medical Imaging",
        description:
            "Designing and deploying deep learning models for image-based diagnosis and classification with a focus on real-world reliability.",
        items: [
            { title: "Medical Imaging", description: "Brain tumor detection using MRI scans" },
            { title: "Image Classification", description: "Custom datasets, ResNet & EfficientNet models" },
            { title: "Model Optimization", description: "Fine-tuning, augmentation, regularization" },
        ],
    },
    {
        title: "Explainable & Trustworthy AI",
        description:
            "Building interpretable AI systems that provide transparency, confidence, and insight into model decisions.",
        items: [
            { title: "Grad-CAM", description: "Visual explanations for CNN predictions" },
            { title: "SHAP", description: "Feature-level interpretability and impact analysis" },
            { title: "Clinical Interpretability", description: "Trust-focused AI for healthcare use cases" },
        ],
    },
    {
        title: "Generative AI & RAG Systems",
        description:
            "Developing LLM-powered applications with retrieval pipelines for accurate, contextual, and grounded responses.",
        items: [
            { title: "Retrieval-Augmented Generation", description: "Context-aware LLM systems" },
            { title: "LLM Integration", description: "Hospital & domain-specific chatbots" },
            { title: "Knowledge Grounding", description: "Reducing hallucinations using RAG" },
        ],
    },
    {
        title: "Agentic AI & End-to-End ML Systems",
        description:
            "Engineering intelligent systems that combine models, tools, and workflows into production-ready applications.",
        items: [
            { title: "Agentic AI", description: "Autonomous task execution with LLMs" },
            { title: "Model Serving", description: "Flask-based ML APIs & deployment" },
            { title: "Experiment Tracking", description: "Metrics logging & reproducibility" },
        ],
    },
];

export const projects = [
    {
        id: 1,
        name: "BrainScan AI",
        description:
            "This project implements an ensemble of deep learning models (EfficientNet, DenseNet, and ResNet) for detecting and classifying brain tumors from MRI scans. The approach combines the strengths of multiple architectures and incorporates explainable AI techniques to provide interpretable results. Additionally, the system incorporates a RAG (Retrieval-Augmented Generation) module to answer hospital-based queries, including contact details, medical protocols, procedures, and brain tumor awareness information.",
        href: "https://github.com/Bhuvan-S-prasad/BrainScan-org",
        image: "projects/brainTumor.png",
        bgImage: "projects/brainTumor.png",
        frameworks: [
            { id: 1, name: "DeepLearning" },
            { id: 2, name: "PyTorch" },
            { id: 3, name: "ExplainableAI" },
            { id: 4, name: "Retreival Augmented Generation" },
            { id: 5, name: "Flask" },
        ],
    },
    {
        id: 2,
        name: "Rivora",
        description: `a modern, full-stack social media application designed to foster meaningful connections through conversations and community-driven interactions. Built with performance and user experience at its core, Rivora allows users to share "Echoes", engage in deep discussions, and form communities known as "Rifts".`,
        href: "https://rivora-psi.vercel.app/",
        image: "projects/rivora.png",
        bgImage: "projects/rivora.png",
        frameworks: [
            { id: 1, name: "React" },
            { id: 2, name: "Next.js" },
            { id: 3, name: "MongoDB" },
            { id: 4, name: "Node.js" },
            { id: 5, name: "clerk" },
        ],
    },
    {
        id: 3,
        name: "Rotom",
        description: `Rotom is an AI-powered mockups generator agent that allows users to generate, edit, and publish web prototypes using natural language prompts. Built with Next.js 15, it leverages advanced AI to streamline the design prototyping process.`,
        href: "https://rotom-five.vercel.app/",
        image: "projects/rotom.png",
        bgImage: "projects/rotom.png",
        frameworks: [
            { id: 1, name: "React" },
            { id: 2, name: "Next.js" },
            { id: 3, name: "postgresql" },
            { id: 4, name: "Node.js" },
            { id: 5, name: "betterAuth" },
            { id: 6, name: "TailwindCSS" },
            { id: 7, name: "MistralAI" },
        ],
    },
    {
        id: 4,
        name: "Bird Image Classification",
        description: " a sophisticated bird species classification system using CNN ResNet50 architecture. The model can identify various bird species with high accuracy, leveraging transfer learning and fine-tuning techniques.",
        href: "",
        image: "projects/bird.png",
        bgImage: "projects/bird.png",
        frameworks: [
            { id: 1, name: "DeepLearning" },
            { id: 2, name: "PyTorch" },
            { id: 3, name: "ResNet50" },
            { id: 4, name: "Transfer Learning" },
            { id: 5, name: "Flask" },
        ],
    },
    {
        id: 5,
        name: "NOMI",
        description: "An ongoing project—an AI-powered web search assistant that synthesizes answers with inline citations, curates personalized content feeds, and delivers real-time insights including news, markets, and weather.",
        href: "",
        image: "projects/Nomi.png",
        bgImage: "projects/Nomi.png",
        frameworks: [
            { id: 1, name: "React" },
            { id: 2, name: "Next.js" },
            { id: 3, name: "postgresql" },
            { id: 4, name: "Node.js" },
            { id: 5, name: "clerk" },
            { id: 6, name: "TailwindCSS" },
            { id: 7, name: "Gemini" },
        ],
    },
    {
        id: 6,
        name: "Human Peripheral Blood Cell Classification",
        description: "A blood cell classification system using ensemble CNN models (DenseNet121, EfficientNet-B0, ResNet50, MobileNetV2) to classify 8 cell types with GradCAM visualizations for explainable AI predictions.",
        href: "",
        image: "projects/blood.png",
        bgImage: "projects/blood.png",
        frameworks: [
            { id: 1, name: "Deep Learning" },
            { id: 2, name: "PyTorch" },
            { id: 3, name: "DenseNet121" },
            { id: 4, name: "ResNet50" },
            { id: 5, name: "GradCAM" },
            { id: 6, name: "Flask" },
        ],
    }
]


export const Artworks = [
    {
        name: "Boa Hancock",
        image: "artworks/boa.png",
    },
    {
        name: "cilian",
        image: "artworks/cilian.png",
    },
    {
        name: "kurapika",
        image: "artworks/kurapika.png",
    },
    {
        name: "naruto",
        image: "artworks/naruto.png",
    },
    {
        name: "oni",
        image: "artworks/oni.png",
    },
    {
        name: "radahn",
        image: "artworks/radahn.png",
    },
]