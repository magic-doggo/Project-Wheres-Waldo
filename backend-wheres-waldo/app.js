const express = require("express");
const app = express();

const gamesRouter = require("./routes/gamesRouter");

app.get("/", (req, res) => res.send("Hello, world!"));

// app.get("/", (req, res) => )
//what routes do I need?
//route to start the game.
//route to ask db if specified character exists at specified coordinates. post verifyUserGuess
//automatic api call to end duration of Game when there are 3 entries in GameFoundCharacter with the same @@id
//get api call to show score, and if in top 10, ask for username
//post api call to submit username if top 10, and update entry in db with username

app.use("/api/games", gamesRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on port ${PORT}!`);
});
