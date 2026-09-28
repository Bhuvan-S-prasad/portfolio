import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLenis } from 'lenis/react'
import { ArrowUpRight, ArrowUp, Copy, Check } from 'lucide-react'
import { profile, socials } from '../content/profile'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/motion'
import { grainLayer } from '../lib/grain'

const EASE = 'ease-[cubic-bezier(0.76,0,0.24,1)]'

/** Text that rolls up to a gold copy of itself on hover (inside a `group`). */
const Roll = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <span className={`relative inline-flex overflow-hidden pb-[0.08em] ${className}`}>
        <span className={`block transition-transform duration-600 ${EASE} group-hover:-translate-y-full`}>{children}</span>
        <span aria-hidden className={`absolute inset-x-0 top-0 block translate-y-full text-gold transition-transform duration-600 ${EASE} group-hover:translate-y-0`}>
            {children}
        </span>
    </span>
)

const HEADLINE = [
    { text: "I'm always open to", className: '' },
    { text: 'new opportunities &', className: '' },
    { text: 'collaborations.', className: 'font-serif italic normal-case tracking-normal text-white/55' },
]

const Contact = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const clockRef = useRef<HTMLSpanElement>(null)
    const wordmarkRef = useRef<HTMLParagraphElement>(null)
    const [copied, setCopied] = useState(false)
    const lenis = useLenis()

    const links = socials.filter((s) => s.name === 'Github' || s.name === 'Linkedin')

    // Local time, ticking. Written straight to the DOM so the section never re-renders for it.
    useEffect(() => {
        const fmt = new Intl.DateTimeFormat('en-GB', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
        })
        const update = () => { if (clockRef.current) clockRef.current.textContent = `${fmt.format(new Date())} IST` }
        update()
        const id = window.setInterval(update, 1000)
        return () => window.clearInterval(id)
    }, [])

    // The name fills the width exactly, whatever the viewport.
    useEffect(() => {
        const el = wordmarkRef.current
        const box = el?.parentElement
        if (!el || !box) return
        const fit = () => {
            const cs = getComputedStyle(box)
            const width = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
            el.style.fontSize = '100px'
            el.style.fontSize = `${(100 * width) / el.scrollWidth}px`
        }
        const ro = new ResizeObserver(fit)
        ro.observe(box)
        document.fonts.ready.then(fit)
        return () => ro.disconnect()
    }, [])

    useGSAP(() => {
        if (prefersReducedMotion()) return
        const q = gsap.utils.selector(sectionRef)

        const tl = gsap.timeline({
            scrollTrigger: { trigger: sectionRef.current, start: 'top 55%', toggleActions: 'play none none reverse' },
        })
        tl.from(q('[data-reveal="meta"]'), { y: 16, opacity: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' })
            .from(q('[data-reveal="line"]'), { yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'power4.out' }, '-=0.5')
            .from(q('[data-reveal="rule"]'), { scaleX: 0, duration: 1.1, ease: 'power3.inOut' }, '-=0.8')
            .from(q('[data-reveal="item"]'), { y: 28, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, '-=0.8')

        // The name rises letter by letter as the page reaches the end.
        gsap.from(q('[data-reveal="letter"]'), {
            yPercent: 100,
            ease: 'power2.out',
            stagger: 0.04,
            scrollTrigger: { trigger: wordmarkRef.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        })
    }, { scope: sectionRef })

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1800)
        } catch {
            window.location.href = `mailto:${profile.email}`
        }
    }

    return (
        // Pulled up a full screen so it slides over the pinned "Let's talk." stage above.
        <section
            ref={sectionRef}
            id="contact"
            className="relative z-10 -mt-[100svh] flex min-h-svh w-full flex-col overflow-hidden rounded-t-4xl bg-black text-white"
        >
            <div aria-hidden style={grainLayer(0.5)} />

            <div className="relative px-5 pt-16 sm:px-8 sm:pt-20 md:px-16 lg:px-24 lg:pt-28">
                {/* Meta row */}
                <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 sm:text-[11px]">
                    <span data-reveal="meta"><span className="text-gold">(end)</span> get in touch</span>
                    <span data-reveal="meta" className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-gold" /> {profile.location} · <span ref={clockRef} className="tabular-nums">--:--:-- IST</span>
                    </span>
                </div>

                {/* Headline */}
                <h2 className="mt-10 sm:mt-14 lg:mt-20">
                    {HEADLINE.map((line) => (
                        <span key={line.text} className="block overflow-hidden pb-[0.06em]">
                            <span
                                data-reveal="line"
                                className={`block text-[clamp(1.9rem,8vw,8rem)] font-light uppercase leading-[1.02] tracking-tight ${line.className}`}
                            >
                                {line.text}
                            </span>
                        </span>
                    ))}
                </h2>

                {/* Email — the main call to action */}
                <div className="mt-14 sm:mt-20 lg:mt-28">
                    <p data-reveal="item" className="mb-4 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 sm:text-[11px]">say hello</p>
                    <div data-reveal="rule" className="h-px origin-left bg-white/15" />
                    <div data-reveal="item" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 py-6 sm:py-8">
                        <a
                            href={`mailto:${profile.email}`}
                            data-cursor="write to me"
                            className="group flex min-w-0 items-center gap-4 sm:gap-6"
                        >
                            <Roll className="min-w-0 text-[clamp(1.15rem,4.6vw,4.25rem)] font-light leading-[1.1] tracking-tight">
                                <span className="break-all sm:break-normal">{profile.email}</span>
                            </Roll>
                            <span className={`grid size-10 shrink-0 place-items-center rounded-full border border-white/20 transition-all duration-500 ${EASE}
                                group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-ink sm:size-14 lg:size-16`}>
                                <ArrowUpRight className="size-4 sm:size-5" aria-hidden />
                            </span>
                        </a>
                        <button
                            type="button"
                            onClick={copyEmail}
                            data-cursor={copied ? 'copied' : 'copy email'}
                            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 transition-colors duration-300 hover:border-gold/60 hover:text-white sm:text-[11px]"
                        >
                            {copied ? <Check className="size-3.5 text-gold" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                            <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
                        </button>
                    </div>
                    <div data-reveal="rule" className="h-px origin-left bg-white/15" />
                </div>

                {/* Details + socials */}
                <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:mt-16 lg:grid-cols-4">
                    <div data-reveal="item">
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 sm:text-[11px]">Role</p>
                        <p className="text-base font-light text-white/85 sm:text-lg">{profile.role}</p>
                    </div>
                    <div data-reveal="item">
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 sm:text-[11px]">Based in</p>
                        <p className="text-base font-light text-white/85 sm:text-lg">{profile.location}</p>
                    </div>
                    <div data-reveal="item" className="col-span-2">
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40 sm:text-[11px]">Elsewhere</p>
                        <ul className="flex flex-wrap gap-x-8 gap-y-2">
                            {links.map((s) => (
                                <li key={s.name}>
                                    <a
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-cursor={s.name.toLowerCase()}
                                        className="group flex items-center gap-1.5 text-base font-light text-white/85 sm:text-lg"
                                    >
                                        <Roll>{s.name === 'Github' ? 'GitHub' : 'LinkedIn'}</Roll>
                                        <ArrowUpRight className={`size-4 text-white/40 transition-all duration-500 ${EASE} group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold`} aria-hidden />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35 sm:mt-24 sm:text-[11px]">
                    <span>© {new Date().getFullYear()} {profile.name}</span>
                    <span className="hidden sm:inline">Developed with passion</span>
                    <button
                        type="button"
                        onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2.2 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
                        data-cursor="take off"
                        className="group flex items-center gap-2 uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-white"
                    >
                        Back to top
                        <ArrowUp className={`size-3.5 transition-transform duration-500 ${EASE} group-hover:-translate-y-1`} aria-hidden />
                    </button>
                </div>
            </div>

            {/* Wordmark: the full name, edge to edge */}
            <div className="relative mt-auto overflow-hidden px-5 pb-5 pt-8 sm:px-8 sm:pb-8 md:px-16 lg:px-24" aria-hidden>
                <p
                    ref={wordmarkRef}
                    className="w-max whitespace-nowrap font-medium uppercase leading-none tracking-[-0.04em] text-white"
                >
                    {[...profile.name].map((ch, i) => (
                        <span key={i} className="inline-block overflow-hidden align-bottom">
                            <span data-reveal="letter" className="inline-block">{ch === ' ' ? ' ' : ch}</span>
                        </span>
                    ))}
                </p>
            </div>
        </section>
    )
}

export default Contact
