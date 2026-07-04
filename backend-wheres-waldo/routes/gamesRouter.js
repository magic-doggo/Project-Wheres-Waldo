const {Router} = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController.js")

gamesRouter.post("/", gamesController.startGame);

module.exports = gamesRouter;