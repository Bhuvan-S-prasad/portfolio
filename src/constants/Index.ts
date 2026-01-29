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
        href: "#"
    },
    {
        name: "Projects",
        href: "#"
    },
    {
        name: "Contact",
        href: "#"
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
