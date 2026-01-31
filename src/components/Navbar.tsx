import { useEffect, useRef, useState } from "react"
import { Items, Socials } from "../constants/Index"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useLenis } from "lenis/react"

const Navbar = () => {

    const navRef = useRef<HTMLElement>(null)
    const linksRef = useRef<(HTMLDivElement | null)[]>([])
    const contactRef = useRef<HTMLDivElement>(null)

    const topLineRef = useRef<HTMLSpanElement>(null)
    const bottomLineRef = useRef<HTMLSpanElement>(null)
    const tl = useRef<gsap.core.Timeline | null>(null)
    const iconTL = useRef<gsap.core.Timeline | null>(null)

    const [isOpen, setIsOpen] = useState(false)
    const [showMenuIcon, setShowMenuIcon] = useState(true)
    const lenis = useLenis()

    useGSAP(() => {
        gsap.set(navRef.current, { xPercent: 100 });
        gsap.set([linksRef.current, contactRef.current], {
            autoAlpha: 0,
            x: -20,
        });
        tl.current = gsap.timeline({ paused: true }).to(navRef.current, {
            xPercent: 0,
            duration: 1,
            ease: "power3.out",
        }).to(linksRef.current, {
            autoAlpha: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
        },
            "<"

        ).to(contactRef.current, {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
        });

        iconTL.current = gsap.timeline({ paused: true }).to(topLineRef.current, {
            rotate: 45,
            y: 3.3,
            duration: 0.3,
            ease: "power2.out",
        }).to(bottomLineRef.current, {
            rotate: -45,
            y: -3.3,
            duration: 0.3,
            ease: "power2.inOut",
        }, "<")
    }, []);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setShowMenuIcon(currentScrollY <= lastScrollY || currentScrollY < 10);
            lastScrollY = currentScrollY;
        }
        window.addEventListener("scroll", handleScroll, {
            passive: true
        });
        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    const toggleMenu = () => {
        if (isOpen) {
            tl.current?.reverse();
            iconTL.current?.reverse();
        } else {
            tl.current?.play();
            iconTL.current?.play();
        }
        setIsOpen(!isOpen);
    }
    return (
        <>
            <nav
                ref={navRef}
                className='fixed z-50 flex flex-col justify-between w-full h-full px-10 uppercase bg-black text-white/60 py-28 gap-y-10 md:w-1/2 md:left-1/2'>
                <div className="flex flex-col text-5xl gap-y-2 md:text-6xl lg:text-7xl">
                    {Items.map((section, index) => (
                        <div key={index} ref={(element) => { linksRef.current[index] = element }}>
                            <button
                                onClick={() => {
                                    lenis?.scrollTo(section.href, { duration: 2 });
                                    toggleMenu();
                                }}
                                className="transition-all duration-300 cursor-pointer hover:text-white">{section.name}</button>
                        </div>
                    ))}
                </div>
                <div ref={contactRef}
                    className="flex flex-col flex-wrap justify-between gap-8 md:flex-row">
                    <div>
                        <p className="tracking-wider text-white/50">E-mail</p>
                        <p className="text-xl tracking-widest lowercase">bhuvan@gmail.com</p>
                    </div>
                    <div>
                        <p className="tracking-wider text-white/50">Social Media</p>
                        <div className="flex flex-col flex-wrap md:flex-row gap-x-2">
                            {Socials.map((social, index) => (
                                <a key={index} href={social.href}
                                    className="text-sm leading-loose tracking-widest uppercase hover:text-white transition-colors duration-300">
                                    {social.name}
                                </a>
                            ))}

                        </div>
                    </div>
                </div>
            </nav>

            <div
                onClick={toggleMenu}
                style={showMenuIcon ? { clipPath: "circle(50% at 50% 50%)" } : { clipPath: "circle(0% at 50% 50%)" }}
                className="fixed z-50 flex flex-col items-center justify-center gap-1 transition-all duration-300 bg-black rounded-full cursor-pointer w-12 h-12 md:w-16 md:h-16 top-4 right-10">
                <span ref={topLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center">
                </span>
                <span ref={bottomLineRef} className="block w-8 h-0.5 bg-white rounded-full origin-center">
                </span>

            </div>
        </>
    )
}

export default Navbar