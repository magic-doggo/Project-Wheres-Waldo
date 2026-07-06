import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [clickCoords, setClickCoords] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [foundCharacterIds, setFoundCharacterIds] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalTimeMs, setFinalTimeMs] = useState(null);


  const notFoundCharacters = characters.filter((char) => !foundCharacterIds.includes(char.id))

  async function startGame() {
    setIsGameOver(false);
    setFinalTimeMs(null);
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
    console.log({ x, y });
    // displayAvailableCharacters() //just jsx the notFoundCharacters tab open when clickCoords are set
  }

  async function guessCharacter(chosenCharacterId) {
    //check db if that character exists on clickCoords
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
      console.log("data:", data);

      if (!response.ok) {
        console.log("error: ", data.error);
        alert(data.error || data.message);
      } else {
        console.log(data.message);
        setFoundCharacterIds((prev) => [...prev, chosenCharacterId]);
        if (data.gameOver) {
          setIsGameOver(true);
          setFinalTimeMs(data.duration);
          console.log(`game won in ${data.duration} milliseconds`)
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClickCoords(null); //reset coords after a guess
    }
    // setClickCoords(null);
  }
  return (
    <div>
      <h1>Where's Waldo</h1>
      {isGameOver && 
      <h2>Gave Over! You won in {(finalTimeMs/1000).toFixed(2)} seconds</h2>}
      {!gameId ? (
        <button onClick={startGame}>Start Game</button>
      ) : (
        <div className="image-wrapper" style={{ position: 'relative' }}>
          <img
            src="https://res.cloudinary.com/magicdoggo/image/upload/v1783315157/wheres-waldo_rcbhir.webp"
            // src="wheres-waldo.webp"
            alt="where's waldo image"
            onClick={handleImageClick}
            style={{ maxWidth: '100%' }}
          />
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
                  <button key={char.id} type="button" onClick={() => {guessCharacter(char.id)}}>
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
        </div>
      )}


      <div className="image-wrapper" style={{ position: 'relative' }}>
      </div>
    </div>
  )
}