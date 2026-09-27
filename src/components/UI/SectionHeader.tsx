import { useEffect, useRef } from "react"
import { gsap, SplitText } from "../../lib/motion"

interface SectionHeaderProps {
    title: string;
    /** Trailing words set in the serif italic accent face. */
    accent?: string;
    /** Small mono count shown after a display title, e.g. 7 → (07). */
    count?: number;
    /** Section number shared with the menu, e.g. "02". */
    index?: string;
    label: string;
    text: string;
    tone?: "light" | "dark";
    /**
     * display — oversized uppercase title, divider, label + text below.
     * indexed — divider on top, index + label on the left, mixed-case title and text on the right.
     */
    variant?: "display" | "indexed";
    /** Only the hero should render an h1. */
    as?: "h1" | "h2";
    /** When false the intro waits (e.g. behind the preloader) until it turns true. */
    play?: boolean;
    withScrollTrigger?: boolean;
}

interface SplitResult {
    chars: HTMLElement[];
}

const SectionHeader = ({
    title,
    accent,
    count,
    index,
    label,
    text,
    tone = "light",
    variant = "display",
    as: Title = "h2",
    play = true,
    withScrollTrigger = true,
}: SectionHeaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const tlRef = useRef<gsap.core.Timeline | null>(null)
    // Initial value only: later changes are handled by the play effect below.
    const playRef = useRef(play)

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Words keep line breaks between words; chars get the reveal.
            const split = SplitText.create(titleRef.current!, {
                type: "words,chars",
            }) as unknown as SplitResult

            const charInners: HTMLSpanElement[] = []
            split.chars.forEach((char) => {
                const inner = document.createElement("span")
                inner.style.display = "inline-block"
                inner.style.willChange = "transform"
                inner.innerHTML = char.innerHTML
                char.innerHTML = ""
                // Mask each glyph, with room for descenders and italic overhang.
                char.style.overflow = "hidden"
                char.style.display = "inline-block"
                char.style.padding = "0 0.06em 0.16em"
                char.style.margin = "0 -0.06em -0.16em"
                char.appendChild(inner)
                charInners.push(inner)
            })

            const q = gsap.utils.selector(containerRef)

            gsap.set(charInners, { yPercent: 120, rotation: 4 })
            gsap.set(q(".sh-line"), { scaleX: 0, transformOrigin: "left center" })
            gsap.set(q(".sh-meta"), { opacity: 0, y: 12 })
            gsap.set(q(".sh-text"), { opacity: 0, y: 24 })

            const tl = gsap.timeline({
                paused: !withScrollTrigger && !playRef.current,
                scrollTrigger: withScrollTrigger ? {
                    trigger: containerRef.current,
                    start: "top 78%",
                } : undefined,
            })

            tl.to(charInners, {
                yPercent: 0,
                rotation: 0,
                duration: 1.3,
                stagger: 0.025,
                ease: "expo.out",
            })
                .to(q(".sh-line"), { scaleX: 1, duration: 1.1, ease: "power3.inOut" }, variant === "indexed" ? 0 : "-=0.8")
                .to(q(".sh-meta"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, "-=0.6")
                .to(q(".sh-text"), { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.45")

            tlRef.current = tl
        }, containerRef)

        return () => ctx.revert()
    }, [withScrollTrigger, variant])

    useEffect(() => {
        if (play) tlRef.current?.play()
    }, [play])

    const dark = tone === "dark"
    const ink = dark ? "text-white" : "text-black"
    const line = dark ? "bg-white/20" : "bg-black/15"
    const muted = dark ? "text-white/50" : "text-black/50"
    const body = dark ? "text-white/65" : "text-black/60"

    const titleContent = (
        <>
            {title}
            {accent && (
                <>
                    {" "}
                    <span className="font-serif italic font-normal normal-case tracking-[-0.01em]">
                        {accent}
                    </span>
                </>
            )}
        </>
    )

    const labelRow = (
        <p className={`sh-meta self-start flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] ${muted}`}>
            {index
                ? <span className="text-gold">({index})</span>
                : <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold shrink-0" />}
            {label}
        </p>
    )

    const description = (
        <p className={`sh-text text-base sm:text-lg lg:text-xl font-light leading-relaxed text-pretty max-w-[46ch] ${body}`}>
            {text}
        </p>
    )

    if (variant === "indexed") {
        return (
            <div ref={containerRef} className={`px-6 sm:px-10 pt-16 sm:pt-24 pb-10 sm:pb-16 ${ink}`}>
                <div className={`sh-line h-px ${line}`} />
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] gap-8 md:gap-12 pt-8 sm:pt-10">
                    {labelRow}
                    <div className="flex flex-col gap-8 sm:gap-10">
                        <Title
                            ref={titleRef}
                            className="text-[44px] sm:text-[72px] lg:text-[104px] xl:text-[120px] leading-[0.95] font-extralight tracking-[-0.035em]"
                        >
                            {titleContent}
                        </Title>
                        {description}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className={`pt-14 sm:pt-20 ${ink}`}>
            <div className="px-6 sm:px-10 pb-8 sm:pb-12">
                <div className="relative inline-block">
                    <Title
                        ref={titleRef}
                        className="uppercase text-[42px] sm:text-[80px] md:text-[100px] lg:text-[130px] xl:text-[152px]
                            leading-[0.85] sm:leading-[0.9] font-extralight tracking-[-0.02em]"
                    >
                        {titleContent}
                    </Title>
                    {count !== undefined && (
                        <span className={`sh-meta absolute -right-2 top-1 translate-x-full font-mono text-xs sm:text-sm tracking-[0.1em] ${muted}`}>
                            ({String(count).padStart(2, "0")})
                        </span>
                    )}
                </div>
            </div>

            <div className="px-6 sm:px-10">
                <div className={`sh-line h-px ${line}`} />
            </div>

            <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-4 sm:pb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-16">
                    {labelRow}
                    {description}
                </div>
            </div>
        </div>
    )
}

export default SectionHeader
