import { skills } from "./skills";
import { projects } from "./projects";

/**
 * Hand-placed "embedding" layout for the Skills map: where each cluster sits
 * (0–1 of the map), which skills relate across clusters, and the keyword
 * aliases the search understands. No model involved — just curated data.
 */
export const clusterCentres: Record<string, { x: number; y: number }> = {
    "Engineering & Architecture": { x: 0.5, y: 0.13 },
    "AI Expertise": { x: 0.25, y: 0.34 },
    "Modeling & Systems": { x: 0.5, y: 0.47 },
    "Machine Learning": { x: 0.2, y: 0.78 },
    "Frameworks & Libraries": { x: 0.77, y: 0.3 },
    "Languages": { x: 0.9, y: 0.6 },
    "Data & Databases": { x: 0.5, y: 0.83 },
    "Web & Cloud": { x: 0.76, y: 0.82 },
};

/** Cross-cluster relations drawn as faint arcs. */
export const related: [string, string][] = [
    ["PyTorch", "Deep Learning"],
    ["TensorFlow", "Deep Learning"],
    ["LangChain", "Retrieval-Augmented Generation"],
    ["LangGraph", "Multi-Agent Systems"],
    ["Agentic AI", "Workflow Automation"],
    ["Multi-Agent Systems", "Agentic AI"],
    ["PostgreSQL (pgvector)", "Retrieval-Augmented Generation"],
    ["Scikit-learn", "Classification"],
    ["Python", "PyTorch"],
    ["TypeScript", "Next.js"],
    ["Fine-Tuning", "Deep Learning"],
    ["Explainable AI", "Evaluation & Optimization"],
    ["Bottleneck Analysis", "Evaluation & Optimization"],
    ["Internal Tooling", "React"],
    ["Docker", "CI / CD"],
    ["Pandas", "Feature Engineering"],
];

/** Search aliases → skills, most relevant first. */
export const aliases: Record<string, string[]> = {
    agents: ["Agentic AI", "Multi-Agent Systems", "LangGraph", "LangChain", "Context Engineering", "Workflow Automation"],
    llm: ["Generative AI", "Retrieval-Augmented Generation", "Context Engineering", "NLP", "LangChain", "Fine-Tuning"],
    rag: ["Retrieval-Augmented Generation", "PostgreSQL (pgvector)", "LangChain", "Context Engineering"],
    vision: ["Deep Learning", "Classification", "PyTorch", "Explainable AI", "TensorFlow", "Fine-Tuning"],
    xai: ["Explainable AI", "Evaluation & Optimization", "Deep Learning"],
    data: ["Pandas", "NumPy", "SQL", "PostgreSQL (pgvector)", "NoSQL", "Feature Engineering", "Matplotlib", "Seaborn"],
    deploy: ["Docker", "AWS", "CI / CD", "Flask", "Next.js"],
    web: ["React", "Next.js", "TypeScript", "JavaScript", "Flask"],
    efficiency: ["Bottleneck Analysis", "Workflow Automation", "Internal Tooling", "Solution Architecture", "Agentic AI"],
    architecture: ["Solution Architecture", "Multi-Agent Systems", "Internal Tooling", "Docker"],
    ml: ["Machine Learning", "Classification", "Regression", "Clustering", "Ensemble Learning", "Scikit-learn", "Feature Engineering"],
    training: ["Model Training", "Fine-Tuning", "PyTorch", "Evaluation & Optimization", "Deep Learning"],
};

export const suggestions = ["agents", "llm", "vision", "data", "deploy", "efficiency"];

// Where a skill shows up, beyond an exact match in a project's tech list.
const extraUsage: Record<string, string[]> = {
    "Retrieval-Augmented Generation": ["Auto-Mate", "BrainScan AI", "NOMI"],
    "Generative AI": ["NOMI", "Rotom", "Auto-Mate"],
    NLP: ["NOMI", "Auto-Mate"],
    "Explainable AI": ["Blood Cell Classification"],
    Classification: ["BrainScan AI", "Blood Cell Classification", "Bird Species Classification"],
    "Ensemble Learning": ["BrainScan AI", "Blood Cell Classification"],
    "Fine-Tuning": ["Bird Species Classification"],
    "Model Training": ["BrainScan AI", "Blood Cell Classification", "Bird Species Classification"],
    "Machine Learning": ["BrainScan AI", "Blood Cell Classification", "Bird Species Classification"],
    Python: ["BrainScan AI", "Blood Cell Classification", "Bird Species Classification"],
    "PostgreSQL (pgvector)": ["NOMI", "Rotom"],
    JavaScript: ["NOMI", "Rotom", "Rivora"],
};

const WORK = "AI engineering work · aerospace industry";

/** Projects (or work) that use a skill. */
export const usageFor = (skill: string): string[] => {
    const category = skills.find((g) => g.items.includes(skill))?.category;
    if (category === "Engineering & Architecture") return [WORK];
    const key = skill.toLowerCase();
    const direct = projects.filter((p) => p.frameworks.some((f) => f.toLowerCase() === key)).map((p) => p.name);
    return [...new Set([...direct, ...(extraUsage[skill] ?? [])])];
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9+#]+/g, " ").trim();

/**
 * Keyword + alias search over the skills. Returns skill → relevance (0–1).
 * Deterministic and explainable: exact/partial name hits score highest,
 * then curated aliases (in order), then a category match.
 */
export const searchSkills = (query: string): Map<string, number> => {
    const q = norm(query);
    const out = new Map<string, number>();
    if (q.length < 2) return out;

    const bump = (skill: string, score: number) => out.set(skill, Math.max(out.get(skill) ?? 0, score));

    for (const group of skills) {
        const cat = norm(group.category);
        for (const skill of group.items) {
            const s = norm(skill);
            if (s === q) bump(skill, 0.99);
            else if (s.includes(q) || s.split(" ").some((w) => w.startsWith(q))) bump(skill, 0.94);
            else if (cat.includes(q)) bump(skill, 0.72);
        }
    }
    for (const [key, list] of Object.entries(aliases)) {
        if (key === q || (q.length >= 3 && key.startsWith(q))) {
            list.forEach((skill, i) => bump(skill, 0.91 - i * 0.03));
        }
    }
    return out;
};
