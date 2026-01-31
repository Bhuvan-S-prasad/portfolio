import { useEffect, useRef, useState } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Artworks } from "../../constants/Index";

gsap.registerPlugin(ScrollTrigger);

interface Artwork {
    name: string;
    image: string;
}

const StickyCards: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const rotation = [-12, 10, -5, 5, -5, -2];

        const cards = cardsRef.current;

        cards.forEach((card, index) => {
            if (card) {
                gsap.set(card, {
                    xPercent: -50,
                    yPercent: -50,
                    y: window.innerHeight,
                    rotate: rotation[index] || 0
                });
            }
        });

        const trigger = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top top",
            end: `+=${window.innerHeight * 8}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const totalCards = cards.length;
                const progressPerCard = 1 / totalCards;

                cards.forEach((card, index) => {
                    if (!card) return;

                    const cardStart = index * progressPerCard;
                    let cardProgress = (progress - cardStart) / progressPerCard;
                    cardProgress = Math.min(Math.max(cardProgress, 0), 1);

                    let ypos = window.innerHeight * (1 - cardProgress);
                    let xpos = 0;

                    if (index === totalCards - 1) {
                        if (cardProgress >= 0.99) {
                            ypos = 0;
                        }
                    } else if (cardProgress === 1) {
                        const remainingProgress = (progress - (cardStart + progressPerCard)) / (1 - (cardStart + progressPerCard));

                        if (remainingProgress > 0) {
                            const distanceMultiplier = 1 - index * 0.15;
                            xpos = -window.innerWidth * 0.3 * distanceMultiplier * remainingProgress;
                            ypos = window.innerHeight * 0.3 * distanceMultiplier * remainingProgress;
                        }
                    }

                    gsap.to(card, {
                        y: ypos,
                        x: xpos,
                        duration: 0,
                        ease: "none"
                    });
                });
            }
        });

        // Cleanup function
        return () => {
            trigger.kill();
        };
    }, [isMobile]);

    // Function to add card refs
    const addToRefs = (el: HTMLDivElement | null, index: number) => {
        if (el) {
            cardsRef.current[index] = el;
        }
    };

    if (isMobile) {
        return (
            <section className="py-12 px-5 bg-black min-h-screen">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-2">
                        Gallery
                    </h2>
                    <div className="w-16 h-0.5 bg-linear-to-r from-transparent via-white to-transparent mx-auto" />
                </div>

                {/* Artwork grid */}
                <div className="flex flex-col gap-10">
                    {Artworks.map((artwork: Artwork, index: number) => (
                        <div
                            key={artwork.name}
                            className={`group relative overflow-hidden rounded-xl
                                       shadow-2xl shadow-white/5
                                       transform transition-all duration-500 ease-out
                                       hover:shadow-white/10 hover:-translate-y-1
                                       ${index % 2 === 0 ? 'ml-0 mr-4' : 'ml-4 mr-0'}`}
                        >
                            <div className="relative w-full">
                                <img
                                    className="w-full h-auto object-contain"
                                    src={artwork.image}
                                    alt={artwork.name}
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-linear-to-t 
                                               from-black/80 via-black/20 to-transparent
                                               opacity-60 group-hover:opacity-80 
                                               transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4
                                               backdrop-blur-sm bg-black/30
                                               border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white text-lg font-semibold 
                                                         tracking-wide uppercase">
                                                {artwork.name}
                                            </p>
                                            <p className="text-white/50 text-xs uppercase tracking-widest mt-1">
                                                Digital Art
                                            </p>
                                        </div>

                                        <span className="text-white/20 text-4xl font-bold">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                <div className="absolute -top-8 -right-8 w-16 h-16 
                                               bg-linear-to-bl from-white/10 to-transparent
                                               rotate-45 transform origin-center" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <div className="w-24 h-px bg-linear-to-r from-transparent via-white/30 to-transparent mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-black"
        >
            {Artworks.map((artwork: Artwork, index: number) => (
                <div
                    key={artwork.name}
                    ref={(el) => addToRefs(el, index)}
                    className="absolute top-1/2 left-1/2 
                               w-[28%] max-h-[80vh]
                               flex flex-col
                               will-change-transform
                               rounded-xl overflow-hidden
                               shadow-2xl shadow-black/50"
                    style={{
                        background: 'linear-gradient(145deg, rgba(30,30,30,1) 0%, rgba(10,10,10,1) 100%)',
                    }}
                >
                    <div className="absolute inset-0 rounded-xl p-[2px] -z-10"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.2) 100%)',
                        }}
                    />

                    <div className="w-full overflow-hidden relative">
                        <img
                            className="w-full h-auto object-contain"
                            src={artwork.image}
                            alt={artwork.name}
                        />

                        <div className="absolute inset-0 pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
                            }}
                        />
                    </div>

                    <div className="shrink-0 px-4 py-3 backdrop-blur-sm"
                        style={{
                            background: 'linear-gradient(to right, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-white uppercase text-sm tracking-widest font-medium">
                                {artwork.name}
                            </p>
                            <span className="text-white/20 text-lg font-bold">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default StickyCards;
