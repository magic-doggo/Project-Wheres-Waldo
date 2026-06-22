import { useState } from "react";

export default function App() {
  const [clickCoords, setClickCoords] = useState(null);
  function handleImageClick(e) {
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    //x coord = (px from left of browser window to click - px from left browser window to left of image)/image width on screen = px from left of image to click/width(to get%)
    const x = (e.clientX - rect.left) / rect.width;  
    const y = (e.clientY - rect.top) / rect.height;
    setClickCoords({x,y})
    console.log({ x, y });
    displayAvailableCharacters()
  }

  function displayAvailableCharacters() {
    //check db and return only characters not found
    //pop up window with image/names of these characters
    //add for each image: onClick guessCharacter(clickCoords, characterClickedOn)
  }
  function guessCharacter(chosenCharacter) {
    //check db if that character exists on clickCoords
  }
  return (
    <div>
      <h1>Where's Waldo</h1>
      <img
        src="https://wallpapercave.com/wp/wp7156937.jpg"
        alt="where's waldo image"
        onClick={handleImageClick}
        style={{ maxWidth: '100%' }}
      />
    </div>
  )
}