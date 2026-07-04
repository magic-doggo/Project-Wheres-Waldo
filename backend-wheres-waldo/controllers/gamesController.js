const {prisma} = require("../lib/prisma.js")

async function startGame(req, res) {
    try {
        const game = await prisma.game.create({data: {}});

        const characters = await prisma.character.findMany({
            select: {
                id: true,
                name: true,
                iconUrl: true
            }
        });
        res.status(201).json({ //use 201 when http request created resource on server, and you return that resource in response
            gameId: game.id,
            characters
        })
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Failed to start game"})
    }
}

module.exports = {
    startGame
}