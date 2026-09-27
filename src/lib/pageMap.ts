/** One band of the page, as fractions of the full document height. */
export type PageSegment = {
    top: number;
    height: number;
    /** A black section (vs. the bone background). */
    dark: boolean;
    /** Index into the nav items this band belongs to, if any. */
    nav: number | null;
};

export type PageMap = {
    segments: PageSegment[];
    /** The visible window, as fractions of the document. */
    view: { top: number; height: number };
};

const isDarkColour = (colour: string) => {
    const m = colour.match(/[\d.]+/g);
    if (!m || m.length < 3) return null;
    if (m.length >= 4 && Number(m[3]) < 0.5) return null; // transparent-ish: keep looking
    const [r, g, b] = m.map(Number);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.35;
};

/** Is this block drawn on a dark surface? Looks at it and a few descendants. */
const surfaceOf = (el: Element): boolean => {
    const queue: { el: Element; depth: number }[] = [{ el, depth: 0 }];
    while (queue.length) {
        const { el: node, depth } = queue.shift()!;
        const dark = isDarkColour(getComputedStyle(node).backgroundColor);
        if (dark !== null) return dark;
        if (depth < 3) Array.from(node.children).forEach((c) => queue.push({ el: c, depth: depth + 1 }));
    }
    return false;
};

/**
 * Measures the page as a strip of bands — one per top-level block in <main>,
 * split where a block holds more than one nav section — so the menu can draw
 * a true-to-scale map of the site with a "you are here" window.
 */
export const measurePage = (navIds: string[]): PageMap => {
    const doc = document.documentElement.scrollHeight || 1;
    const main = document.querySelector("main");
    const segments: PageSegment[] = [];

    Array.from(main?.children ?? []).forEach((block) => {
        const rect = block.getBoundingClientRect();
        if (rect.height < 2) return;
        const top = rect.top + window.scrollY;
        const dark = surfaceOf(block);

        // Nav sections inside this block, in page order.
        const inside = navIds
            .map((id, nav) => ({ nav, el: block.id === id ? block : block.querySelector(`#${id}`) }))
            .filter((x): x is { nav: number; el: Element } => !!x.el)
            .map(({ nav, el }) => ({ nav, top: el === block ? top : el.getBoundingClientRect().top + window.scrollY }))
            .sort((a, b) => a.top - b.top);

        if (inside.length <= 1) {
            segments.push({ top: top / doc, height: rect.height / doc, dark, nav: inside[0]?.nav ?? null });
            return;
        }
        inside.forEach((s, i) => {
            const start = i === 0 ? top : s.top;
            const end = inside[i + 1]?.top ?? top + rect.height;
            segments.push({ top: start / doc, height: (end - start) / doc, dark, nav: s.nav });
        });
    });

    return {
        segments,
        view: { top: window.scrollY / doc, height: window.innerHeight / doc },
    };
};
