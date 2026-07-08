const {Router} = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController.js")

gamesRouter.post("/", gamesController.startGame);
gamesRouter.post("/:gameId/guesses", gamesController.guessCharacter);
gamesRouter.get("/leaderboard", gamesController.getLeaderboard);
gamesRouter.put("/username", gamesController.updateUsername)

module.exports = gamesRouter;