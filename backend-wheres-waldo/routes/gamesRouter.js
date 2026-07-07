const {Router} = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController.js")

gamesRouter.post("/", gamesController.startGame);
gamesRouter.post("/:gameId/guesses", gamesController.guessCharacter);
gamesRouter.get("/leaderboard", gamesController.getLeaderboard);

module.exports = gamesRouter;