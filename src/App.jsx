import { Routes, Route } from "react-router";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Dashboard from "./components/Main/Dashboard";
import Infrastructure from "./components/Main/Infrastructure";
import Equipement from "./components/Main/Equipement";

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

      <div className="flex-1 overflow-auto">
        <Routes>
          <Route 
          path="/"
          element={<Dashboard opened={opened} />}
          />

          <Route
          path="/Infrastructure"
          element={<Infrastructure isLight={isLight} toggleDarkMode={toggleDarkMode} />}
          />
          <Route 
          path="/Equipement"
          element={<Equipement isLight={isLight} />}
          />

        </Routes>
        
      </div>
    </div>
  )
}

export default App
