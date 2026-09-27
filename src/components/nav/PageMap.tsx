import { navItems } from "../../content/navigation";
import type { PageMap as PageMapData } from "../../lib/pageMap";

interface PageMapProps {
    map: PageMapData | null;
    open: boolean;
    /** Nav item currently described (hovered, focused, or where you are). */
    active: number;
    onHover: (index: number) => void;
    onGo: (href: string) => void;
}

const pct = (v: number) => `${v * 100}%`;

/**
 * A true-to-scale strip of the whole site for the fullscreen menu: bone and
 * black bands in the order you'll scroll them, a gold window for where you
 * are, and the hovered section called out beside it.
 */
const PageMap = ({ map, open, active, onHover, onGo }: PageMapProps) => {
    if (!map) return null;
    const { segments, view } = map;

    // Where to pin the caption: the middle of the active section's band(s).
    const bands = segments.filter((s) => s.nav === active);
    const centre = bands.length
        ? (bands[0].top + (bands[bands.length - 1].top + bands[bands.length - 1].height)) / 2
        : view.top + view.height / 2;
    const read = Math.round(Math.min(1, view.top / Math.max(0.0001, 1 - view.height)) * 100);
    const item = navItems[active];

    return (
        <div className="pointer-events-none absolute right-0 top-1/2 hidden h-[min(64vh,580px)] -translate-y-1/2 items-stretch gap-6 md:flex">
            {/* ── Caption for the active section ── */}
            <div className="relative w-[clamp(220px,24vw,360px)]">
                <div
                    className={`absolute right-0 flex -translate-y-1/2 items-center gap-4 transition-[top,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${open ? "opacity-100" : "opacity-0"}`}
                    style={{ top: pct(centre) }}
                >
                    <div key={active} className="text-right animate-[fadeIn_0.4s_ease-out_both]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
                            {String(active + 1).padStart(2, "0")} · {item.name}
                        </p>
                        <p className="mt-2 font-serif text-2xl italic leading-tight text-white lg:text-3xl">{item.preview.line}</p>
                        <p className="mt-2 font-mono text-[11px] tracking-[0.06em] text-white/45">{item.preview.meta}</p>
                    </div>
                    <span className="h-px w-8 shrink-0 bg-gold/70" />
                </div>
            </div>

            {/* ── The strip ── */}
            <div className="relative flex w-11 flex-col">
                <p className="absolute -top-7 right-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                    page map
                </p>

                <div className="pointer-events-auto relative flex-1">
                    {segments.map((s, i) => {
                        const on = s.nav !== null && s.nav === active;
                        const tone = s.dark
                            ? on ? "bg-white/20" : "bg-white/[0.07]"
                            : on ? "bg-bone" : "bg-bone/55";
                        const style = {
                            top: pct(s.top),
                            height: `calc(${pct(s.height)} - 3px)`,
                            transform: open ? "scaleY(1)" : "scaleY(0)",
                            transitionDelay: open ? `${350 + i * 45}ms` : "0ms",
                        };
                        const cls = `absolute inset-x-0 origin-top rounded-[3px] transition-[transform,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${tone}
                            ${on ? "shadow-[0_0_0_1px_var(--color-gold)]" : ""}`;

                        if (s.nav === null) return <span key={i} aria-hidden className={cls} style={style} />;
                        const nav = navItems[s.nav];
                        return (
                            <button
                                key={i}
                                type="button"
                                tabIndex={-1}
                                aria-label={`Go to ${nav.name}`}
                                data-cursor={nav.name.toLowerCase()}
                                onMouseEnter={() => onHover(s.nav!)}
                                onClick={() => onGo(nav.href)}
                                className={`${cls} cursor-pointer`}
                                style={style}
                            />
                        );
                    })}

                    {/* You are here */}
                    <div
                        aria-hidden
                        className={`pointer-events-none absolute -inset-x-1.5 rounded-sm border border-gold bg-gold/10 transition-opacity duration-500 ${open ? "opacity-100 delay-700" : "opacity-0"}`}
                        style={{ top: pct(view.top), height: pct(Math.max(view.height, 0.012)) }}
                    >
                        <span className="absolute left-full top-1/2 ml-2.5 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.14em] text-gold">
                            you
                        </span>
                    </div>
                </div>

                <p className="absolute -bottom-7 right-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                    {read}% read
                </p>
            </div>
        </div>
    );
};

export default PageMap;
