import { useState } from "react";

export default function App() {
  const [clickCoords, setClickCoords] = useState(null);
  const [characters, setCharacters] = useState([
    { id: 1, name: "waldo", image: "https://res.cloudinary.com/magicdoggo/image/private/s--lefRfJmZ--/v1775204755/git1.jpg.jpg", coordinates: { x: 0.5, y: 0.7 } },
    { id: 2, name: "maldo", image: "https://res.cloudinary.com/magicdoggo/image/private/s--lefRfJmZ--/v1775204755/git1.jpg.jpg", coordinates: { x: 0.4, y: 0.2 } }]); // pull from db once backend is created
  const [foundCharacterIds, setFoundCharacterIds] = useState([]);


  const notFoundCharacters = characters.filter((char) => !foundCharacterIds.includes(char.id))

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

  function guessCharacter(chosenCharacter) {
    //check db if that character exists on clickCoords
    setClickCoords(null);
  }
  return (
    <div>
      <h1>Where's Waldo</h1>
      <div className="image-wrapper" style={{ position: 'relative' }}>

        <img
          src="https://wallpapercave.com/wp/wp7156937.jpg"
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
                <button key={char.id} type="button" onClick={() => guessCharacter(char.id)}>
                  <img src={char.image} alt={char.name}
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
    </div>
  )
}