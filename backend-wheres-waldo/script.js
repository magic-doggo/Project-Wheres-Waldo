import { prisma } from "./lib/prisma.js";

async function main() {
    const characters = await prisma.character.createMany({
        data: [{
            name: "Waldo",
            xCoord: 0.6140,
            yCoord: 0.3508,
            iconUrl: "https://res.cloudinary.com/magicdoggo/image/upload/v1783158756/waldo_head_hcwhls.webp"
        },
        {
            name: "Wizard Whiteboard",
            xCoord: 0.2668,
            yCoord: 0.3345,
            iconUrl: "https://res.cloudinary.com/magicdoggo/image/upload/v1783158756/wizard_head_cuyeya.webp"
        }, {
            name: "Odlaw",
            xCoord: 0.1059,
            yCoord: 0.3345,
            iconUrl: "https://res.cloudinary.com/magicdoggo/image/upload/v1783158756/odlaw_head_lhgk3d.webp"
        }],

    });

    const allCharacters = await prisma.character.findMany({});
    console.log(allCharacters)
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });


//waldo x: 0.6140350740212988  y: 0.3508771929824561
//wizard whiteboard: {x: 0.2668128595449691, y: 0.3345029284382424}
//odlaw (yellow guy): {x: 0.10599414968224799, y: 0.3345029284382424}