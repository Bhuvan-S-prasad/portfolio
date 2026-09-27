/** A labelled region, in % of the image. */
export type Region = { label: string; score: number; x: number; y: number; w: number; h: number };

export type Artwork = {
    name: string;
    image: string;
    /** "Seen by a model" view — hand-labelled, illustrative. */
    model: {
        subject: string;
        score: number;
        /** Attention hot spots, in % of the image. */
        focus: { x: number; y: number; r: number }[];
        regions: Region[];
    };
};

const IMG = "https://ik.imagekit.io/wq68aygdr/portfolio/artworks";

export const artworks: Artwork[] = [
    {
        name: "Boa Hancock",
        image: `${IMG}/boa.png`,
        model: {
            subject: "portrait · graphite",
            score: 0.97,
            focus: [{ x: 62, y: 27, r: 16 }, { x: 62, y: 49, r: 10 }],
            regions: [
                { label: "face", score: 0.98, x: 41, y: 13, w: 43, h: 47 },
                { label: "skull", score: 0.91, x: 0, y: 29, w: 22, h: 25 },
                { label: "earring", score: 0.87, x: 79, y: 44, w: 12, h: 11 },
                { label: "signature", score: 0.99, x: 11, y: 17, w: 12, h: 10 },
            ],
        },
    },
    {
        name: "Thomas Shelby",
        image: `${IMG}/cilian.png`,
        model: {
            subject: "portrait · graphite",
            score: 0.98,
            focus: [{ x: 50, y: 30, r: 15 }, { x: 45, y: 46, r: 9 }],
            regions: [
                { label: "face", score: 0.99, x: 31, y: 18, w: 41, h: 37 },
                { label: "cigarette", score: 0.93, x: 39, y: 44, w: 10, h: 7 },
                { label: "tie", score: 0.9, x: 47, y: 62, w: 13, h: 26 },
                { label: "signature", score: 0.99, x: 74, y: 8, w: 14, h: 8 },
            ],
        },
    },
    {
        name: "Kurapika",
        image: `${IMG}/kurapika.png`,
        model: {
            subject: "portrait · graphite",
            score: 0.95,
            focus: [{ x: 50, y: 35, r: 15 }, { x: 50, y: 78, r: 14 }],
            regions: [
                { label: "face", score: 0.97, x: 33, y: 26, w: 40, h: 34 },
                { label: "earring", score: 0.84, x: 68, y: 39, w: 5, h: 13 },
                { label: "hand · chains", score: 0.9, x: 33, y: 68, w: 36, h: 31 },
                { label: "chain", score: 0.94, x: 78, y: 60, w: 22, h: 39 },
            ],
        },
    },
    {
        name: "Naruto",
        image: `${IMG}/naruto.png`,
        model: {
            subject: "character · action",
            score: 0.94,
            focus: [{ x: 57, y: 34, r: 14 }],
            regions: [
                { label: "eyes", score: 0.99, x: 46, y: 30, w: 25, h: 8 },
                { label: "headband", score: 0.96, x: 47, y: 21, w: 31, h: 11 },
                { label: "hand", score: 0.88, x: 64, y: 33, w: 16, h: 21 },
                { label: "scroll", score: 0.92, x: 1, y: 10, w: 51, h: 89 },
            ],
        },
    },
    {
        name: "Oni",
        image: `${IMG}/oni.png`,
        model: {
            subject: "armored figure",
            score: 0.93,
            focus: [{ x: 38, y: 27, r: 14 }, { x: 70, y: 52, r: 16 }],
            regions: [
                { label: "oni mask", score: 0.97, x: 26, y: 17, w: 25, h: 21 },
                { label: "helmet", score: 0.93, x: 25, y: 2, w: 35, h: 15 },
                { label: "armor", score: 0.9, x: 53, y: 38, w: 36, h: 37 },
                { label: "horse", score: 0.83, x: 14, y: 44, w: 34, h: 29 },
            ],
        },
    },
    {
        name: "Radahn",
        image: `${IMG}/radahn.png`,
        model: {
            subject: "armored figure",
            score: 0.96,
            focus: [{ x: 48, y: 21, r: 15 }, { x: 40, y: 63, r: 16 }],
            regions: [
                { label: "helm", score: 0.96, x: 32, y: 3, w: 32, h: 31 },
                { label: "horns", score: 0.94, x: 13, y: 12, w: 68, h: 13 },
                { label: "hand", score: 0.89, x: 67, y: 44, w: 19, h: 13 },
                { label: "greatsword", score: 0.91, x: 21, y: 66, w: 78, h: 33 },
            ],
        },
    },
];
