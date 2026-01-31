import { useState, useEffect } from "react"
import StickyCards from "./UI/StickyCards"
import { Artworks as ArtworkData } from "../constants/Index"
import ArtworkPreloader from "./UI/ArtworkPreloader";

interface Artwork {
    name: string;
    image: string;
}

const Artworks = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (isMobile) {
        return (
            <section id="artworks" className="bg-black py-16 px-6">
                <div className="mb-12 text-center">
                    <p className="text-sm tracking-[0.4rem] uppercase text-white/60 mb-4">
                        Beyond Code
                    </p>
                    <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
                        Artworks
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {ArtworkData.map((artwork: Artwork) => (
                        <div key={artwork.name} className="flex flex-col gap-4">
                            <div className="w-full overflow-hidden rounded-lg">
                                <img
                                    className="w-full h-auto"
                                    src={artwork.image}
                                    alt={artwork.name}
                                    loading="lazy"
                                />
                            </div>
                            <p className="text-white text-center uppercase text-sm tracking-widest font-medium">
                                {artwork.name}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="artworks" className="bg-black pb-48">
            <ArtworkPreloader />
            <StickyCards />
        </section>
    )
}

export default Artworks