import { useRef } from 'react'
import { Socials } from '../constants/Index'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const line1Ref = useRef<HTMLDivElement>(null)
    const line2Ref = useRef<HTMLDivElement>(null)
    const line3Ref = useRef<HTMLDivElement>(null)
    const emailRef = useRef<HTMLAnchorElement>(null)
    const detailsRef = useRef<HTMLDivElement>(null)
    const socialsRef = useRef<HTMLDivElement>(null)

    const filteredSocials = Socials.filter(
        (social) => social.name === 'Github' || social.name === 'Linkedin'
    )

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse',
            }
        })

        tl.from(headerRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
        })

        tl.from([line1Ref.current, line2Ref.current, line3Ref.current], {
            y: 120,
            opacity: 0,
            stagger: 0.15,
            duration: 1,
            ease: 'power4.out',
        }, '-=0.4')

        tl.from(emailRef.current, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
        }, '-=0.6')

        tl.from(detailsRef.current?.children || [], {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power3.out',
        }, '-=0.5')

        tl.from(socialsRef.current?.children || [], {
            y: 30,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power2.out',
        }, '-=0.4')

    }, [])

    const handleEmailHover = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        gsap.to(e.currentTarget, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out',
        })
    }

    const handleEmailLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        gsap.to(e.currentTarget, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
        })
    }

    return (
        <section ref={sectionRef} id="contact" className="min-h-screen w-full bg-black py-12 sm:py-20 lg:py-32 overflow-hidden">
            <div className="px-5 sm:px-8 md:px-16 lg:px-24">
                <div ref={headerRef} className="mb-8">
                    <p className="text-xs sm:text-sm tracking-[0.3rem] sm:tracking-[0.5rem] uppercase text-white/50">Get in Touch</p>
                </div>
                <div className="mb-10 sm:mb-16 lg:mb-24 overflow-hidden">
                    <div ref={line1Ref} className="overflow-hidden">
                        <h2 className="text-[clamp(1.75rem,8vw,8rem)] font-light leading-[1.1] text-white uppercase tracking-tighter sm:tracking-tight">
                            I'm always open to
                        </h2>
                    </div>
                    <div ref={line2Ref} className="overflow-hidden">
                        <h2 className="text-[clamp(1.75rem,8vw,8rem)] font-light leading-[1.1] text-white uppercase tracking-tighter sm:tracking-tight">
                            new opportunities &
                        </h2>
                    </div>
                    <div ref={line3Ref} className="overflow-hidden">
                        <h2 className="text-[clamp(1.75rem,8vw,8rem)] font-light leading-[1.1] text-white/60 uppercase tracking-tighter sm:tracking-tight">
                            collaborations
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
                    <div className="flex flex-col justify-center">
                        <p className="text-xs sm:text-sm tracking-[0.2rem] sm:tracking-[0.3rem] uppercase text-white/40 mb-3 sm:mb-4">Say Hello</p>
                        <a
                            ref={emailRef}
                            href="mailto:bhuvansbhuvans113@gmail.com"
                            onMouseMove={handleEmailHover}
                            onMouseLeave={handleEmailLeave}
                            className="group inline-block text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white lowercase tracking-wide 
                                       transition-colors duration-300 hover:text-white/70 relative break-all sm:break-normal"
                        >
                            <span className="relative">
                                bhuvansbhuvans113@gmail.com
                                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-500 group-hover:w-full" />
                            </span>
                        </a>
                    </div>

                    <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16">
                        <div ref={detailsRef} className="grid grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                            <div className="group">
                                <p className="text-[10px] sm:text-xs tracking-[0.15rem] sm:tracking-[0.2rem] uppercase text-white/40 mb-2 sm:mb-3">Phone</p>
                                <p

                                    className="text-base sm:text-lg md:text-xl text-white/80 hover:text-white transition-colors duration-300 block"
                                >
                                    +91-7019119683
                                </p>
                            </div>

                            <div>
                                <p className="text-[10px] sm:text-xs tracking-[0.15rem] sm:tracking-[0.2rem] uppercase text-white/40 mb-2 sm:mb-3">Location</p>
                                <p className="text-base sm:text-lg md:text-xl text-white/80">India</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] sm:text-xs tracking-[0.15rem] sm:tracking-[0.2rem] uppercase text-white/40 mb-3 sm:mb-4">Socials</p>
                            <div ref={socialsRef} className="flex flex-wrap gap-4 sm:gap-6">
                                {filteredSocials.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative text-base sm:text-lg uppercase tracking-wider sm:tracking-widest text-white/70 hover:text-white transition-colors duration-300"
                                    >
                                        {social.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-white/50 transition-all duration-300 group-hover:w-full" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 sm:mt-24 lg:mt-32 pt-6 sm:pt-8 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-white/30 tracking-wide">2026 Bhuvan S Prasad</p>
                        <p className="text-xs sm:text-sm text-white/30 tracking-wide">Developed with passion</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact