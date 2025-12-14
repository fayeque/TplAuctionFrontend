import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AddPlayerPage from "./pages/AddPlayerPage"
import AddTeamPage from "./pages/AddTeamPage"
import PlayerDetailsPage from "./pages/PlayerDetailsPage"
import TeamDetailsPage from "./pages/TeamDetailsPage"
import AllPlayerPage from "./pages/AllPlayerPage"

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/addPlayer" element={<AddPlayerPage />} />
        <Route path="/addTeam" element={<AddTeamPage />} />
        <Route path="/playerDetails/:serialNo" element={<PlayerDetailsPage />} />
        <Route path="/team/:teamId" element={<TeamDetailsPage />} />
        <Route path="/players" element={<AllPlayerPage />} />
      </Routes>
    </Router>
  )
}
