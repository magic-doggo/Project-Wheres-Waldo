import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [clickCoords, setClickCoords] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [foundCharacterIds, setFoundCharacterIds] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [username, setUsername] = useState("");
  const [foundMarkers, setFoundMarkers] = useState([]);

  const notFoundCharacters = characters.filter((char) => !foundCharacterIds.includes(char.id))

  async function startGame() {
    setIsGameOver(false);
    setFinalTimeMs(null);
    setFoundCharacterIds([]);
    setFoundMarkers([]);
    try {
      const response = await fetch(`${API_BASE_URL}/api/games`, {
        method: "POST",
      });
      const data = await response.json();
      setGameId(data.gameId);
      setCharacters(data.characters);
    } catch (err) {
      console.error(err)
    }
  }

  function handleImageClick(e) { //only runs if clickCoords null. otherwise the click does not go on the image, it goes on "fixed" position backdrop
    e.stopPropagation();
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    //x coord = (px from left of browser window to click - px from left browser window to left of image)/image width on screen = px from left of image to click/width(to get%)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setClickCoords({ x, y })
  }

  async function guessCharacter(chosenCharacterId) {
    if (!clickCoords || !gameId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/${gameId}/guesses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          characterId: chosenCharacterId,
          clickX: clickCoords.x,
          clickY: clickCoords.y
        })
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("error: ", data.error);
        alert(data.error || data.message);
      } else {
        setFoundCharacterIds((prev) => [...prev, chosenCharacterId]);
        if (data.foundLocation) {
          setFoundMarkers((prev) => [...prev, data.foundLocation]);
        }
        if (data.gameOver) {
          setIsGameOver(true);
          setFinalTimeMs(data.durationMs);
          getLeaderboard();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClickCoords(null); //reset coords after a guess
    }
  }

  async function getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/leaderboard`, {
        method: "GET"
      });
      const data = await response.json();
      setLeaderboard(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleUserSubmit(e) {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/games/username`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: username, gameId })
      });
      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }
      getLeaderboard()
      if (!response.ok) {
        console.log("error: ", data.error)
        //create error state to display error message
        return
      }

    } catch (err) {
      console.error(err)
    }
  }
  return (
    <div>
      <h1>Where's Waldo</h1>
      {isGameOver ? (
        <div>
          <h2>Gave Over! You won in {(finalTimeMs / 1000).toFixed(2)} seconds</h2>
          <div>
            {leaderboard.length < 10 || finalTimeMs < leaderboard[leaderboard.length - 1]?.durationMs ?
              (<div>
                <div>You have reached a top 10 score! Edit your username to save it in the Hall of Fame!</div>
                <form onSubmit={handleUserSubmit}>
                  <label htmlFor="username">Username: </label>
                  <input type="text" id="username" name="username" value={username} onChange={(e) => { setUsername(e.target.value) }} required />
                  <button type="submit">Save username change</button>
                </form>
              </div>) :
              //add a play again button. not in the requirements, but can just add button and reset all state
              <div>Your score has not reached top 10. Try again for a chance in the hall of fame!</div>
            } 
          </div>
          <h3>Global Leaderboard:</h3>
          <ol>
            {leaderboard.map((entry) => (
              <li key={entry.id}>
                {entry.playerName ?? "Anonymous"} - {(entry.durationMs / 1000).toFixed(2)} seconds <strong>{entry.id === gameId ? "- YOUR ENTRY!" : ""}</strong>
              </li>
            ))}
          </ol>
        </div>
      ) : !gameId ? (
        <button onClick={startGame}>Start Game</button>
      ) :
        <div className="image-wrapper" style={{ position: 'relative' }}>
          <img
            src="https://res.cloudinary.com/magicdoggo/image/upload/v1783315157/wheres-waldo_rcbhir.webp"
            // src="wheres-waldo.webp"
            alt="where's waldo image"
            onClick={handleImageClick}
            style={{ maxWidth: '100%' }}
          />
          {foundMarkers.map((marker, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${marker.x * 100}%`,
                top: `${marker.y * 100}%`,
                width: "4%", //same as 0.02% guess acceptableDistance from centre of click in backend
                height: "4%",
                transform: "translate(-50%, -50%)", //move 50% of div width to left and up. by default, top-left corner would be at clickcoords. this moves box center to coords
                border: "2px solid red",
                borderRadius: "50%",
                pointerEvents: "none",
              }}
            ></div>
          ))}
          {clickCoords && (
            <div className="guess-character-container">
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 5 }}  //covers entire screen while clickCoords are not null, to remove guess character tab on clicking anywhere
                onClick={() => setClickCoords(null)}
              />

              <div
                style={{
                  position: 'absolute',
                  left: `${clickCoords.x * 100}%`,
                  top: `${clickCoords.y * 100}%`,
                  width: 'max-content',
                  zIndex: 10,
                }}>
                {notFoundCharacters.map((char) => (
                  <button key={char.id} type="button" onClick={() => { guessCharacter(char.id) }}>
                    <img src={char.iconUrl} alt={char.name}
                      style={{
                        width: '48px',
                        height: '48px',
                      }} />
                    <div>{char.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>}
      <div className="image-wrapper" style={{ position: 'relative' }}>
      </div>
    </div>
  )
}