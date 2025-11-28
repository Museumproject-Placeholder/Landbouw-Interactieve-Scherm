import React from "react"
import { HashRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import DetailPage from "./pages/DetailPage"
import AdminPage from "./pages/AdminPage"
import PuzzleGamePage from "./pages/PuzzleGamePage"
import MemoryGamePage from "./pages/MemoryGamePage"
import "./styles/index.css"

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/puzzle-game" element={<PuzzleGamePage />} />
            <Route path="/memory-game" element={<MemoryGamePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
export default App
