import type { Link } from "./profile";
import { profile } from "./profile";
import { projects } from "./projects";
import { artworks } from "./artworks";
import { focusAreas } from "./expertise";
import { skills } from "./skills";

export type NavItem = Link & {
    /** Shown beside the page map in the fullscreen menu while the link is hovered or focused. */
    preview: {
        line: string;
        meta: string;
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
        preview: { line: "Rendered on scroll.", meta: `${projects.length} projects · case files & demos` },
    },
    {
        name: "Skills",
        href: "#skills",
        preview: { line: "Skills & tools", meta: `${skills.length} groups · ${skillCount} skills` },
    },
    {
        name: "Artworks",
        href: "#artworks",
        preview: { line: "Beyond code.", meta: `${artworks.length} drawings · human & model view` },
    },
    {
        name: "Contact",
        href: "#contact",
        preview: { line: "Let's build something.", meta: profile.email },
    },
];
