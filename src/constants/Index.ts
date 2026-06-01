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
        name: "Expertise",
        href: "#expertise"
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
        title: "Deep Learning, NLP & Medical AI",
        description:
            "Building intelligent AI systems for medical imaging, natural language processing, and real-world machine learning applications.",
        items: [
            { title: "Medical Imaging", description: "Brain tumor detection and analysis using MRI scans" },
            { title: "Natural Language Processing", description: "Text understanding, summarization, and language modeling" },
            { title: "Deep Learning", description: "CNNs, Transformers, transfer learning, and model optimization" },
        ],
    },
    {
        title: "Explainable & Trustworthy AI",
        description:
            "Developing transparent AI systems that provide interpretable insights and trustworthy decision-making.",
        items: [
            { title: "Explainable AI (XAI)", description: "Building interpretable and accountable AI solutions" },
            { title: "Grad-CAM", description: "Visual explanations for deep learning predictions" },
            { title: "SHAP", description: "Feature attribution and model behavior analysis" },
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
        title: "Agentic AI & Multi-Agent Systems",
        description:
            "Designing autonomous AI systems that collaborate, reason, and execute complex workflows across multiple tools and agents.",
        items: [
            { title: "Agentic AI", description: "Autonomous task planning, execution, and tool usage" },
            { title: "Multi-Agent Systems", description: "Collaborative AI agents for complex problem solving" },
            { title: "Workflow Automation", description: "End-to-end intelligent automation and orchestration" },
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
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/brainTumor.png",
        bgImage: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/brainTumor.png",
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
    name: "Auto-Mate",
    description:
        "An autonomous human-in-the-loop AI assistant that combines Agentic AI, Context Engineering, Retrieval-Augmented Generation (RAG), and multi-agent architectures to automate daily productivity workflows. Built on the ReAct paradigm, Auto-Mate intelligently reasons, retrieves contextual memories, interacts with external tools such as Gmail and Google Calendar, and executes multi-step tasks through specialized agents. The system incorporates long-term episodic and semantic memory using vector embeddings, intelligent task orchestration, approval-based autonomous actions, and conversational interfaces via Telegram, enabling reliable and context-aware personal assistance.",
    href: "https://github.com/Bhuvan-S-prasad/Auto-Mat",
    image: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/Screenshot%202026-06-01%20104509.png",
    bgImage: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/Screenshot%202026-06-01%20104509.png",
    frameworks: [
        { id: 1, name: "Agentic AI" },
        { id: 2, name: "Generative AI" },
        { id: 3, name: "Context Engineering" },
        { id: 4, name: "Multi-Agent Systems" },
        { id: 5, name: "Retrieval-Augmented Generation" },
        { id: 6, name: "Vector Databases" },
        { id: 7, name: "Next.js" },
        { id: 8, name: "TypeScript" },
    ],
    },
        {
        id: 3,
        name: "NOMI",
        description: "An ongoing project—an AI-powered web search assistant that synthesizes answers with inline citations, curates personalized content feeds, and delivers real-time insights including news, markets, and weather.",
        href: "",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/Nomi.png",
        bgImage: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/Nomi.png",
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
        id: 4,
        name: "Rivora",
        description: `a modern, full-stack social media application designed to foster meaningful connections through conversations and community-driven interactions. Built with performance and user experience at its core, Rivora allows users to share "Echoes", engage in deep discussions, and form communities known as "Rifts".`,
        href: "https://rivora-psi.vercel.app/",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/rivora.png",
        bgImage: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/rivora.png",
        frameworks: [
            { id: 1, name: "React" },
            { id: 2, name: "Next.js" },
            { id: 3, name: "MongoDB" },
            { id: 4, name: "Node.js" },
            { id: 5, name: "clerk" },
        ],
    },
    {
        id: 5,
        name: "Rotom",
        description: `Rotom is an AI-powered mockups generator agent that allows users to generate, edit, and publish web prototypes using natural language prompts. Built with Next.js 15, it leverages advanced AI to streamline the design prototyping process.`,
        href: "https://rotom-five.vercel.app/",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/rotom.png",
        bgImage: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/rotom.png",
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
        id: 6,
        name: "Bird Image Classification",
        description: " a sophisticated bird species classification system using CNN ResNet50 architecture. The model can identify various bird species with high accuracy, leveraging transfer learning and fine-tuning techniques.",
        href: "",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/bird.png",
        bgImage: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/bird.png",
        frameworks: [
            { id: 1, name: "DeepLearning" },
            { id: 2, name: "PyTorch" },
            { id: 3, name: "ResNet50" },
            { id: 4, name: "Transfer Learning" },
            { id: 5, name: "Flask" },
        ],
    },
    {
        id: 7,
        name: "Human Peripheral Blood Cell Classification",
        description: "A blood cell classification system using ensemble CNN models (DenseNet121, EfficientNet-B0, ResNet50, MobileNetV2) to classify 8 cell types with GradCAM visualizations for explainable AI predictions.",
        href: "",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/blood.png",
        bgImage: "https://ik.imagekit.io/wq68aygdr/portfolio/projects/blood.png",
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
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/artworks/boa.png",
    },
    {
        name: "cilian",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/artworks/cilian.png",
    },
    {
        name: "kurapika",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/artworks/kurapika.png",
    },
    {
        name: "naruto",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/artworks/naruto.png",
    },
    {
        name: "oni",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/artworks/oni.png",
    },
    {
        name: "radahn",
        image: "https://ik.imagekit.io/wq68aygdr/portfolio/artworks/radahn.png",
    },
]