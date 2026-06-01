"use client";

import { useEffect, useRef, useState } from "react";
import { Items, Socials } from "../constants/Index";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLenis } from "lenis/react";

/* ── types ─────────────────────────────────────────── */
interface NavItem  { name: string; href: string; }
interface Social   { name: string; href: string; }

/* ── grain (same as Artworks section for cohesion) ── */
const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='ng'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23ng)' opacity='0.07'/%3E%3C/svg%3E\")";

const Navbar = () => {
    /* ── refs ── */
    const overlayRef  = useRef<HTMLDivElement>(null);
    const panelTopRef = useRef<HTMLDivElement>(null);
    const panelBotRef = useRef<HTMLDivElement>(null);
    const contentRef  = useRef<HTMLDivElement>(null);
    const linksRef    = useRef<(HTMLLIElement | null)[]>([]);
    const metaRef     = useRef<HTMLDivElement>(null);
    const tlRef       = useRef<gsap.core.Timeline | null>(null);

    const topLineRef = useRef<HTMLSpanElement>(null);
    const botLineRef = useRef<HTMLSpanElement>(null);

    /* ── state ── */
    const [isOpen, setIsOpen]           = useState(false);
    const [showBtn, setShowBtn]         = useState(true);
    const [time, setTime]               = useState("");

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

        /* icon lines → X */
        gsap.timeline({ paused: true })
            .to(topLineRef.current, { rotate: 45,  y:  3.5, duration: 0.3, ease: "power2.inOut" })
            .to(botLineRef.current, { rotate: -45, y: -3.5, duration: 0.3, ease: "power2.inOut" }, "<");

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
        } else {
            tlRef.current?.play();
            iconTLRef.current?.play();
        }
        setIsOpen(p => !p);
    };

    const handleNavClick = (href: string) => {
        lenis?.scrollTo(href, { duration: 2 });
        toggle();
    };

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
                    <div aria-hidden style={{
                        position: "absolute", inset: 0,
                        backgroundImage: GRAIN, backgroundSize: "256px 256px",
                        opacity: 0.6, pointerEvents: "none",
                        animation: "navGrain 0.13s steps(1) infinite",
                    }} />

                </div>

                {/* Bottom panel */}
                <div
                    ref={panelBotRef}
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        height: "50%", background: "#080808", overflow: "hidden",
                    }}
                >
                    <div aria-hidden style={{
                        position: "absolute", inset: 0,
                        backgroundImage: GRAIN, backgroundSize: "256px 256px",
                        opacity: 0.6, pointerEvents: "none",
                        animation: "navGrain 0.13s steps(1) infinite",
                    }} />
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
                            color: "rgba(255,255,255,0.28)", fontSize: 10,
                            letterSpacing: "0.42em", textTransform: "uppercase",
                            fontFamily: "inherit",
                        }}>
                            Portfolio — Navigation
                        </span>
                        <span style={{
                            color: "rgba(255,255,255,0.28)", fontSize: 10,
                            letterSpacing: "0.35em", fontVariantNumeric: "tabular-nums",
                        }}>
                            {time}
                        </span>
                    </div>

                    {/* nav links — centered vertically with generous padding */}
                    <div style={{
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
                                {(Items as NavItem[]).map((item, i) => (
                                    <li
                                        key={item.name}
                                        ref={el => { linksRef.current[i] = el; }}
                                        style={{ overflow: "hidden" }}
                                    >
                                        <button
                                            onClick={() => handleNavClick(item.href)}
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
                                                letterSpacing: "0.3em",
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
                                                fontWeight: 500,
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
                                color: "rgba(255,255,255,0.3)", fontSize: 9,
                                letterSpacing: "0.42em", textTransform: "uppercase",
                                margin: "0 0 5px",
                            }}>
                                E-mail
                            </p>
                            <a
                                href="mailto:bhuvansbhuvans113@gmail.com"
                                style={{
                                    color: "rgba(255,255,255,0.65)", fontSize: 13,
                                    letterSpacing: "0.18em", textDecoration: "none",
                                    transition: "color 0.3s",
                                }}
                                className="nav-meta-link"
                            >
                                bhuvansbhuvans113@gmail.com
                            </a>
                        </div>

                        {/* socials */}
                        <div style={{ textAlign: "right" }}>
                            <p style={{
                                color: "rgba(255,255,255,0.3)", fontSize: 9,
                                letterSpacing: "0.42em", textTransform: "uppercase",
                                margin: "0 0 5px",
                            }}>
                                Social
                            </p>
                            <div style={{ display: "flex", gap: 20, justifyContent: "flex-end" }}>
                                {(Socials as Social[]).map((s, i) => (
                                    <a
                                        key={i} href={s.href}
                                        target="_blank" rel="noopener noreferrer"
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
                onClick={toggle}
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