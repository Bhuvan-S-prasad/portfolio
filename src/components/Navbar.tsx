import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { navItems } from "../content/navigation";
import { profile, socials } from "../content/profile";
import { gsap, useGSAP } from "../lib/motion";
import { grainLayer } from "../lib/grain";
import { confidenceFor } from "../lib/annotate";
import DetectionBox from "./annotate/DetectionBox";

const Navbar = () => {
    /* ── refs ── */
    const overlayRef  = useRef<HTMLDivElement>(null);
    const panelTopRef = useRef<HTMLDivElement>(null);
    const panelBotRef = useRef<HTMLDivElement>(null);
    const contentRef  = useRef<HTMLDivElement>(null);
    const linksRef    = useRef<(HTMLLIElement | null)[]>([]);
    const metaRef     = useRef<HTMLDivElement>(null);
    const tlRef       = useRef<gsap.core.Timeline | null>(null);

    const toggleBtnRef = useRef<HTMLButtonElement>(null);
    const topLineRef = useRef<HTMLSpanElement>(null);
    const botLineRef = useRef<HTMLSpanElement>(null);

    /* ── state ── */
    const [isOpen, setIsOpen]           = useState(false);
    const [showBtn, setShowBtn]         = useState(true);
    const [time, setTime]               = useState("");
    const [preview, setPreview]         = useState(0);

    const lenis = useLenis();

    /* ── live clock ── */
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-IN", {
                hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
            }));
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, []);

    /* ── hide button on scroll down ── */
    useEffect(() => {
        let last = window.scrollY;
        const onScroll = () => {
            const cur = window.scrollY;
            setShowBtn(cur <= last || cur < 10);
            last = cur;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── GSAP setup ── */
    useGSAP(() => {
        const overlay  = overlayRef.current;
        const panelTop = panelTopRef.current;
        const panelBot = panelBotRef.current;
        const content  = contentRef.current;
        const links    = linksRef.current.filter(Boolean) as HTMLLIElement[];
        const meta     = metaRef.current;

        /* initial hidden state */
        gsap.set(overlay,  { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(panelTop, { yPercent: -100 });
        gsap.set(panelBot, { yPercent: 100 });
        gsap.set(content,  { opacity: 0 });
        gsap.set(links,    { yPercent: 110, opacity: 0 });
        gsap.set(meta,     { opacity: 0, y: 16 });

        tlRef.current = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut" } })

            /* 1 — panels slide in from top/bottom */
            .to(overlay,  { autoAlpha: 1, pointerEvents: "auto", duration: 0.01 }, 0)
            .to(panelTop, { yPercent: 0, duration: 0.72 }, 0)
            .to(panelBot, { yPercent: 0, duration: 0.72 }, 0)

            /* 2 — content layer fades in once background is mostly black */
            .to(content,  { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.35)

            /* 3 — links wipe up, staggered */
            .to(links, {
                yPercent: 0, opacity: 1,
                duration: 0.55, stagger: 0.05,
                ease: "power3.out",
            }, 0.4)

            /* 4 — bottom meta info fades in */
            .to(meta, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.58);

    }, []);

    /* ── toggle ── */
    const iconTLRef = useRef<gsap.core.Timeline | null>(null);

    useGSAP(() => {
        iconTLRef.current = gsap.timeline({ paused: true })
            .to(topLineRef.current, { rotate: 45,  y:  3.5, duration: 0.28, ease: "power2.inOut" })
            .to(botLineRef.current, { rotate: -45, y: -3.5, duration: 0.28, ease: "power2.inOut" }, "<");
    }, []);

    const toggle = () => {
        if (isOpen) {
            tlRef.current?.reverse();
            iconTLRef.current?.reverse();
            lenis?.start();
        } else {
            tlRef.current?.play();
            iconTLRef.current?.play();
            lenis?.stop();
        }
        setIsOpen(p => !p);
    };

    const handleNavClick = (href: string) => {
        // Close first: a stopped Lenis ignores scrollTo.
        toggle();
        lenis?.scrollTo(href, { duration: 2 });
    };

    /* ── keyboard: Esc closes, Tab stays inside the open menu ── */
    const toggleRef = useRef(toggle);
    useEffect(() => {
        toggleRef.current = toggle;
    });

    useEffect(() => {
        if (!isOpen) return;

        const firstLink = overlayRef.current?.querySelector<HTMLElement>("button, a");
        const focusTimer = window.setTimeout(() => firstLink?.focus(), 400);

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                toggleRef.current();
                toggleBtnRef.current?.focus();
                return;
            }
            if (e.key !== "Tab") return;

            const focusables = [
                ...(overlayRef.current?.querySelectorAll<HTMLElement>("button, a") ?? []),
                toggleBtnRef.current,
            ].filter(Boolean) as HTMLElement[];
            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen]);

    /* ── render ── */
    return (
        <>
            {/* ════════════════════════════════
                FULLSCREEN OVERLAY
                ════════════════════════════════ */}
            <div
                ref={overlayRef}
                style={{
                    position: "fixed", inset: 0, zIndex: 49,
                    pointerEvents: "none", overflow: "hidden",
                }}
            >
                {/* Top panel */}
                <div
                    ref={panelTopRef}
                    style={{
                        position: "absolute", top: 0, left: 0, right: 0,
                        height: "50%", background: "#080808", overflow: "hidden",
                    }}
                >
                    <div aria-hidden style={grainLayer(0.6)} />

                </div>

                {/* Bottom panel */}
                <div
                    ref={panelBotRef}
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: "50%", background: "#080808", overflow: "hidden",
                    }}
                >
                    <div aria-hidden style={grainLayer(0.6)} />
                </div>

                {/* ── Content layer (sits above both panels) ── */}
                <div
                    ref={contentRef}
                    style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        justifyContent: "space-between",
                        padding: "clamp(40px, 6vh, 80px) 6vw",
                        pointerEvents: "auto",
                        boxSizing: "border-box",
                    }}
                >

                    {/* top metadata row */}
                    <div style={{
                        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                    }}>
                        <span style={{
                            color: "rgba(255,255,255,0.35)", fontSize: 11,
                            textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.14em",
                        }}>
                            Portfolio — Navigation
                        </span>
                        <span style={{
                            color: "rgba(255,255,255,0.35)", fontSize: 11,
                            fontVariantNumeric: "tabular-nums", fontFamily: "var(--font-mono)", letterSpacing: "0.14em",
                        }}>
                            {time}
                        </span>
                    </div>

                    {/* nav links — centered vertically with generous padding */}
                    <div style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        flexGrow: 1,
                        margin: "3vh 0",
                    }}>
                        <nav aria-label="Main navigation">
                            <ul style={{
                                listStyle: "none", margin: 0, padding: 0,
                                display: "flex", flexDirection: "column",
                                gap: "0.5vh",
                            }}>
                                {navItems.map((item, i) => (
                                    <li
                                        key={item.name}
                                        ref={el => { linksRef.current[i] = el; }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <button
                                            onClick={() => handleNavClick(item.href)}
                                            onMouseEnter={() => setPreview(i)}
                                            onFocus={() => setPreview(i)}
                                            data-cursor="go to"
                                            style={{
                                                display: "flex",
                                                alignItems: "baseline",
                                                gap: "clamp(12px, 2vw, 28px)",
                                                background: "none", border: "none",
                                                cursor: "pointer", padding: "0.4vh 0",
                                                fontFamily: "inherit",
                                                lineHeight: 1,
                                            }}
                                            className="nav-link-btn"
                                        >
                                            {/* index */}
                                            <span style={{
                                                color: "#cfa355",
                                                fontSize: "clamp(10px, 1vw, 13px)",
                                                fontFamily: "var(--font-mono)",
                                                letterSpacing: "0.1em",
                                                fontVariantNumeric: "tabular-nums",
                                                marginBottom: "0.15em",
                                                flexShrink: 0,
                                            }}>
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                            {/* name */}
                                            <span style={{
                                                color: "rgba(255,255,255,0.45)",
                                                fontSize: "clamp(2rem, 6.8vh, 6.2rem)",
                                                fontWeight: 300,
                                                letterSpacing: "-0.02em",
                                                textTransform: "uppercase",
                                                lineHeight: 1.05,
                                                transition: "color 0.35s ease, letter-spacing 0.4s ease",
                                            }}
                                                className="nav-link-text"
                                            >
                                                {item.name}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* live preview of the hovered / focused section */}
                        <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 hidden md:block w-[clamp(260px,30vw,460px)] aspect-4/3 -translate-y-1/2">
                            <DetectionBox
                                className="-inset-3 z-10"
                                label={navItems[preview].name.toLowerCase()}
                                confidence={confidenceFor(navItems[preview].name)}
                            />
                            {navItems.map((item, i) => (
                                <div
                                    key={item.name}
                                    className={`absolute inset-0 overflow-hidden border border-white/10 bg-white/3
                                        transition-[clip-path,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                                        ${i === preview ? "opacity-100 [clip-path:inset(0_0_0_0)]" : "opacity-0 [clip-path:inset(100%_0_0_0)]"}`}
                                >
                                    {item.preview.image && (
                                        <img
                                            src={item.preview.image}
                                            alt=""
                                            loading="lazy"
                                            className="size-full object-cover object-top opacity-70"
                                        />
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6 bg-linear-to-t from-black via-black/80 to-transparent pt-16">
                                        <p className="font-serif italic text-2xl lg:text-3xl leading-tight text-white">
                                            {item.preview.line}
                                        </p>
                                        <p className="mt-2 font-mono text-[11px] tracking-[0.08em] text-white/50">
                                            {item.preview.meta}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* bottom meta row */}
                    <div
                        ref={metaRef}
                        style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "flex-end", flexWrap: "wrap", gap: 16,
                        }}
                    >
                        {/* email */}
                        <div>
                            <p style={{
                                color: "rgba(255,255,255,0.35)", fontSize: 10,
                                textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.14em",
                                margin: "0 0 6px",
                            }}>
                                E-mail
                            </p>
                            <a
                                href={`mailto:${profile.email}`}
                                data-cursor="email"
                                style={{
                                    color: "rgba(255,255,255,0.65)", fontSize: 13,
                                    letterSpacing: "0.18em", textDecoration: "none",
                                    transition: "color 0.3s",
                                }}
                                className="nav-meta-link"
                            >
                                {profile.email}
                            </a>
                        </div>

                        {/* socials */}
                        <div style={{ textAlign: "right" }}>
                            <p style={{
                                color: "rgba(255,255,255,0.35)", fontSize: 10,
                                textTransform: "uppercase", fontFamily: "var(--font-mono)", letterSpacing: "0.14em",
                                margin: "0 0 6px",
                            }}>
                                Social
                            </p>
                            <div style={{ display: "flex", gap: 20, justifyContent: "flex-end" }}>
                                {socials.map((s, i) => (
                                    <a
                                        key={i} href={s.href}
                                        target="_blank" rel="noopener noreferrer"
                                        data-cursor={s.name.toLowerCase()}
                                        style={{
                                            color: "rgba(255,255,255,0.55)", fontSize: 10,
                                            letterSpacing: "0.35em", textTransform: "uppercase",
                                            textDecoration: "none", transition: "color 0.3s",
                                        }}
                                        className="nav-meta-link"
                                    >
                                        {s.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <button
                ref={toggleBtnRef}
                onClick={toggle}
                data-cursor={isOpen ? "close" : "menu"}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
                style={{
                    position: "fixed",
                    top: 20, right: 36,
                    zIndex: 50,
                    width: 52, height: 52,
                    borderRadius: "50%",
                    background: "#080808",
                    border: "0.5px solid rgba(255,255,255,0.12)",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 5,
                    padding: 0,
                    clipPath: showBtn || isOpen
                        ? "circle(50% at 50% 50%)"
                        : "circle(0% at 50% 50%)",
                    transition: "clip-path 0.35s cubic-bezier(0.4,0,0.2,1), border-color 0.3s",
                }}
                className="nav-toggle-btn"
            >
                <span
                    ref={topLineRef}
                    style={{
                        display: "block", width: 22, height: 1.5,
                        background: "#fff", borderRadius: 2,
                        transformOrigin: "center",
                    }}
                />
                <span
                    ref={botLineRef}
                    style={{
                        display: "block", width: 22, height: 1.5,
                        background: "#fff", borderRadius: 2,
                        transformOrigin: "center",
                    }}
                />
            </button>
        </>
    );
};

export default Navbar;