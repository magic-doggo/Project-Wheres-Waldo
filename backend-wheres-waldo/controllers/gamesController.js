const { prisma } = require("../lib/prisma.js")

async function startGame(req, res) {
    try {
        const game = await prisma.game.create({ data: {} });

        const characters = await prisma.character.findMany({
            select: {
                id: true,
                name: true,
                iconUrl: true
            }
        });
        res.status(201).json({ //use 201 instead of 200 when http request created resource on server, and you return that resource in response
            gameId: game.id,
            characters
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to start game" })
    }
}

async function guessCharacter(req, res) {
    const acceptableDistance = 0.02 // 2% of image, allow user to guess character if click is at least that close
    try {
        const { gameId } = req.params;
        const { characterId, clickX, clickY } = req.body;

        const alreadyFoundCharacter = await prisma.gameFoundCharacter.findUnique({
            where: {
                gameId_characterId: { //prisma composite @@id([gameId, characterId])
                    gameId: parseInt(gameId),
                    characterId: parseInt(characterId)
                }
            }
        });
        if (alreadyFoundCharacter) return res.status(400).json({ error: "You already found this character!" })

        const character = await prisma.character.findUnique({
            where: {
                id: parseInt(characterId)
            }
        });
        if (!character) {
            return res.status(404).json({ error: "Character not found" });
        }

        const xDistance = Math.abs(clickX - character.xCoord)
        const yDistance = Math.abs(clickY - character.yCoord)
        if (xDistance > acceptableDistance || yDistance > acceptableDistance) {
            return res.status(400).json({error: "Character not there, keep looking!"})
        }

        //if successful
        await prisma.gameFoundCharacter.create({
            data: {
                gameId: parseInt(gameId),
                characterId: parseInt(characterId),
            }
        });

        const foundCharactersCount = await prisma.gameFoundCharacter.count({
            where: {
                gameId: parseInt(gameId)
            }
        })

        const totalCharacters = 3; 
        if (foundCharactersCount >= totalCharacters) { //if user found all 3 characters, finish the game
            const game = await prisma.game.findUnique({
                where: {id: parseInt(gameId)}
            });
            const endedAt = new Date();
            const duration = endedAt.getTime() - game.startedAt.getTime();
            await prisma.game.update({
                where: {id: parseInt(gameId)},
                data: {
                    endedAt: endedAt,
                    durationMs: duration
                }
            });
            return res.status(200).json({
                duration: duration,
                message: "You found everyone",
                // match: true,
                gameOver: true
            });
        };

        //if they found a character, but not all 3
        return res.status(200).json({ 
            message: `You found ${character.name}!`,
            gameOver: false 
        });

        
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Error guessing character"})
    }
}

async function getLeaderboard(req, res){
    try {
        const topScores = await prisma.game.findMany({
            where: {
                durationMs: {not: null},
            },
            orderBy: {durationMs: 'asc'},
            take: 10
        });
        res.json(topScores);
    } catch(err) {
        console.error(err);
        res.status(500).json({error: "Failed to fetch Leaderboard"})
    }
}

module.exports = {
    startGame,
    guessCharacter,
    getLeaderboard
}