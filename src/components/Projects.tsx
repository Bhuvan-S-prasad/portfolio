import { ArrowUpRight } from "lucide-react"
import { projects } from "../constants/Index"
import AnimatedHeader from "./UI/AnimatedHeader"
import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const Projects = () => {

    const previewRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<(HTMLDivElement | null)[]>([]);

    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const moveX = useRef<gsap.QuickToFunc | null>(null);
    const moveY = useRef<gsap.QuickToFunc | null>(null);
    const mouse = useRef({ x: 0, y: 0 });

    useGSAP(() => {
        moveX.current = gsap.quickTo(previewRef.current, "x", {
            duration: 1.5,
            ease: "power3.out"
        });
        moveY.current = gsap.quickTo(previewRef.current, "y", {
            duration: 2,
            ease: "power3.out"
        });

        // Initialize overlays to hidden state (clipped at bottom)
        overlayRef.current.forEach((el) => {
            if (el) {
                gsap.set(el, {
                    clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
                });
            }
        });

        gsap.from("#project", {
            y: 100,
            opacity: 0,
            delay: 0.5,
            duration: 1,
            ease: "back.out",
            stagger: 0.1,
            scrollTrigger: {
                trigger: "#project"
            }
        })

    })

    const handleMouseEnter = (index: number) => {
        if (window.innerWidth < 768) return;
        setCurrentIndex(index);

        const el = overlayRef.current[index];
        if (!el) return;

        gsap.killTweensOf(el);
        gsap.fromTo(el,
            {
                clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            },
            {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                duration: 0.15,
                ease: "power2.out"
            }
        );


        gsap.to(previewRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
        });


    }

    const handleMouseLeave = (index: number) => {
        if (window.innerWidth < 768) return;
        setCurrentIndex(null);
        gsap.to(previewRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.out",
        })

        const el = overlayRef.current[index];
        if (!el) return;

        gsap.killTweensOf(el);
        gsap.to(el, {
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
            duration: 0.2,
            ease: "power2.out"
        })
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (window.innerWidth < 768) return;
        mouse.current.x = e.clientX + 24;
        mouse.current.y = e.clientY + 24;

        moveX.current?.(mouse.current.x);
        moveY.current?.(mouse.current.y);
    }

    return (
        <section id="projects"
            className="flex flex-col min-h-screen"
        >
            <AnimatedHeader
                title="Projects"
                subTitle="A snapshot of what I’ve been building."
                text={`From deep learning and computer vision to explainable AI\n and LLM-powered systems, these projects reflect my approach\n to building practical, reliable, and thoughtfully engineered solutions.`}
                textColor="text-black"
            />

            <div className="relative flex flex-col font-light"
                onMouseMove={(e) => handleMouseMove(e)}
            >
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        id="project"
                        className="relative flex flex-col gap-1 py-5 cursor-pointer group md:gap-0"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                    >

                        <div ref={(el) => { overlayRef.current[index] = el }}

                            className="absolute inset-0 hidden md:block duration-200 bg-black -z-10 clip-path" />

                        <div className="flex justify-between px-10 text-black transition-all duration-5000 md:group-hover:px-12 md:group-hover:text-white">
                            <h2 className="lg:text-[32px] text-26px leading-none">
                                {project.name}
                            </h2>
                            <ArrowUpRight width={24} height={24} className="md:size-6 size-5" />
                        </div>

                        <div className="w-full h-0.5 bg-black/80" />

                        <div className="flex px-10 text-xs leading-loose uppercase transition-all duration-500 md:text-sm gap-x-5 md:group-hover:px-12">
                            {project.frameworks.map((framework) => (
                                <p
                                    key={framework.id}
                                    className="text-black transition-colors duration-500 md:group-hover:text-white"
                                >
                                    {framework.name}
                                </p>
                            ))}

                        </div>

                        <div className="relative flex items-center justify-center px-10 md:hidden h-[400px]">
                            <img src={project.image} alt={project.name} className="w-full h-full object-cover" />

                        </div>
                    </div>
                ))}


                <div ref={previewRef} className="fixed -top-2/6 left-0 z-50 overflow-hidden border-8 vorder-black pointer-events-none w-[960px] md:block hidden">
                    {currentIndex !== null && (
                        <img src={projects[currentIndex].bgImage} alt={projects[currentIndex].name} className="w-full h-full object-cover" />

                    )}
                </div>


            </div>


        </section>
    )
}

export default Projects