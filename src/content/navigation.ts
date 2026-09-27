import type { Link } from "./profile";
import { profile } from "./profile";
import { projects } from "./projects";
import { artworks } from "./artworks";
import { focusAreas } from "./expertise";
import { skills } from "./skills";

export type NavItem = Link & {
    /** Shown in the fullscreen menu while the link is hovered or focused. */
    preview: {
        line: string;
        meta: string;
        image?: string;
    };
};

const skillCount = new Set(skills.flatMap((g) => g.items)).size;

export const navItems: NavItem[] = [
    {
        name: "Home",
        href: "#home",
        preview: { line: profile.shortName, meta: `${profile.role} · ${profile.industry}` },
    },
    {
        name: "About",
        href: "#about",
        preview: { line: "Accurate is the baseline.", meta: "who i am · how i work" },
    },
    {
        name: "Expertise",
        href: "#expertise",
        preview: { line: focusAreas[0].title, meta: `${focusAreas.length} focus areas` },
    },
    {
        name: "Approach",
        href: "#approach",
        preview: { line: "Find the bottleneck.", meta: "observe · measure · identify · architect" },
    },
    {
        name: "Projects",
        href: "#projects",
        preview: { line: projects[0].name, meta: `${projects.length} projects`, image: projects[0].image },
    },
    {
        name: "Skills",
        href: "#skills",
        preview: { line: "Skills & tools", meta: `${skills.length} groups · ${skillCount} skills` },
    },
    {
        name: "Artworks",
        href: "#artworks",
        preview: { line: artworks[0].name, meta: `${artworks.length} drawings`, image: artworks[0].image },
    },
    {
        name: "Contact",
        href: "#contact",
        preview: { line: "Let's build something.", meta: profile.email },
    },
];
