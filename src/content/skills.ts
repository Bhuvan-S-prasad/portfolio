export type SkillGroup = {
    category: string;
    items: string[];
};

export const skills: SkillGroup[] = [
    {
        category: "Engineering & Architecture",
        items: ["Solution Architecture", "Bottleneck Analysis", "Internal Tooling", "Workflow Automation"],
    },
    {
        category: "AI Expertise",
        items: [
            "Machine Learning",
            "Deep Learning",
            "NLP",
            "Generative AI",
            "Explainable AI",
            "Agentic AI",
            "Context Engineering",
            "Retrieval-Augmented Generation",
        ],
    },
    {
        category: "Modeling & Systems",
        items: ["Model Training", "Fine-Tuning", "Multi-Agent Systems"],
    },
    {
        category: "Machine Learning",
        items: [
            "Regression",
            "Classification",
            "Clustering",
            "Ensemble Learning",
            "Feature Engineering",
            "Evaluation & Optimization",
        ],
    },
    {
        category: "Frameworks & Libraries",
        items: ["PyTorch", "TensorFlow", "Scikit-learn", "LangChain", "LangGraph", "NumPy", "Pandas", "Matplotlib", "Seaborn"],
    },
    {
        category: "Languages",
        items: ["Python", "JavaScript", "TypeScript"],
    },
    {
        category: "Data & Databases",
        items: ["SQL", "PostgreSQL (pgvector)", "NoSQL"],
    },
    {
        category: "Web & Cloud",
        items: ["React", "Next.js", "Flask", "AWS", "Docker", "CI / CD"],
    },
];
