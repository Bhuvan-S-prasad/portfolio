export type Artwork = {
    name: string;
    image: string;
};

const IMG = "https://ik.imagekit.io/wq68aygdr/portfolio/artworks";

export const artworks: Artwork[] = [
    { name: "Boa Hancock", image: `${IMG}/boa.png` },
    { name: "cilian", image: `${IMG}/cilian.png` },
    { name: "kurapika", image: `${IMG}/kurapika.png` },
    { name: "naruto", image: `${IMG}/naruto.png` },
    { name: "oni", image: `${IMG}/oni.png` },
    { name: "radahn", image: `${IMG}/radahn.png` },
];
