import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Dashboard from "./components/Main/Dashboard";
import Infrastructure from "./components/Main/Infrastructure";

function App() {
  const [opened, setOpened] = useState(false);
  const [isLight, setIsLight] = useState(true);

  function handleOpened() {
    setOpened(prev => !prev);
  }
  function toggleDarkMode() {
    setIsLight(!isLight)
  }

  return (
    <div className={`flex transition-colors duration-300
    ${isLight ?
      "bg-blue-50" :
      "bg-gray-900"
    }
    `}>
      <Sidebar opened={opened} handleOpened={handleOpened} isLight={isLight} toggleDarkMode={toggleDarkMode} />
      <Infrastructure isLight={isLight} toggleDarkMode={toggleDarkMode} />
    </div>
  )
}

export default App
