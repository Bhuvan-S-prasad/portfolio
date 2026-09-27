export type Artwork = {
    name: string;
    image: string;
};

const IMG = "https://ik.imagekit.io/wq68aygdr/portfolio/artworks";

export const artworks: Artwork[] = [
    { name: "Boa Hancock", image: `${IMG}/boa.png` },
    { name: "Thomas Shelby", image: `${IMG}/cilian.png` },
    { name: "Kurapika", image: `${IMG}/kurapika.png` },
    { name: "Naruto", image: `${IMG}/naruto.png` },
    { name: "Oni", image: `${IMG}/oni.png` },
    { name: "Radahn", image: `${IMG}/radahn.png` },
];
