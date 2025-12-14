"use client"

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Users, Shield, Wallet, Trophy, Star } from "lucide-react"
import { toast } from "sonner"

// API base URL - change to your backend
const API_BASE_URL = "https://tplauctionbackend.onrender.com"

export default function PlayerDetailsPage() {
  const { serialNo } = useParams()
  const [player, setPlayer] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [soldPrice, setSoldPrice] = useState("")
  const [selectedTeamId, setSelectedTeamId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showStamp, setShowStamp] = useState(false)
  const [finalSoldPrice, setFinalSoldPrice] = useState(null)
  const [showUnsoldStamp, setShowUnsoldStamp] = useState(false)

  const canAssignPlayer =
  typeof window !== "undefined" &&
  localStorage.getItem("tplPasscode") === "abc123";

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        setLoading(true)
        const playerResponse = await fetch(`${API_BASE_URL}/api/player/${serialNo}`)
        if (!playerResponse.ok) throw new Error("Player not found")
        const playerData = await playerResponse.json()
        setPlayer(playerData.data)

        const teamsResponse = await fetch(`${API_BASE_URL}/api/team/all`)
        if (!teamsResponse.ok) throw new Error("Failed to fetch teams")
        const teamsData = await teamsResponse.json()
        setTeams(teamsData.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchPlayerDetails()
  }, [serialNo])

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }, [])

  const speakAnnouncement = (text) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      utterance.rate = 0.7 // Slower speech for clarity
      utterance.pitch = 1.0 // Natural pitch for commentator-like voice
      utterance.volume = 1.0

      const voices = window.speechSynthesis.getVoices()
      const commentatorVoice = voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.includes("Male") || voice.name.includes("Daniel") || voice.name.includes("Google US English")),
      )

      if (commentatorVoice) {
        utterance.voice = commentatorVoice
      }

      window.speechSynthesis.speak(utterance)
    } else {
      console.log("Speech synthesis not supported")
    }
  }

  const handleAssignPlayer = async (e) => {
    e.preventDefault()

    if (!selectedTeamId) {
      toast.error("Please select a team")
      return
    }

    if (!soldPrice) {
      toast.error("Please enter a valid sold price")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`${API_BASE_URL}/api/player/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: player._id,
          teamId: selectedTeamId,
          soldPrice: Number.parseFloat(soldPrice),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to assign player")
      }

      setFinalSoldPrice(Number.parseFloat(soldPrice))
      setShowStamp(true)

      const selectedTeam = teams.find((team) => (team._id || team.id) === selectedTeamId)
      const teamName = selectedTeam?.teamName || "Unknown Team"
      const announcement = `Congratulations! ${player.playerName} sold for ${Number.parseFloat(soldPrice).toLocaleString()} rupees to ${teamName}. What an amazing deal!`
      speakAnnouncement(announcement)

      toast.success(`Player successfully assigned!`)

      setSoldPrice("")
      setSelectedTeamId("")

      const playerResponse = await fetch(`${API_BASE_URL}/api/player/${serialNo}`)
      const playerData = await playerResponse.json()
      setPlayer(playerData.data)

      const teamsResponse = await fetch(`${API_BASE_URL}/api/team/all`)
      const teamsData = await teamsResponse.json()
      setTeams(teamsData.data)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnsold = async () => {
    try {
      setSubmitting(true)
      setShowUnsoldStamp(true)

      toast.error("Player marked as UNSOLD")
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading player details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 text-white px-6 py-4 rounded-xl">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden p-4">
      <div className="h-full flex gap-4">
        {/* Left Teams - 4 teams */}
        <div className="w-64 flex flex-col gap-2 overflow-y-auto">
          {teams.slice(0, 4).map((team, index) => (
            <CompactTeamCard key={index} team={team} />
          ))}
        </div>

        {/* Center Player Card */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`relative w-full h-full bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden transition-all duration-300 ${showStamp || showUnsoldStamp ? "stamp-shake" : ""}`}
          >
            {/* Stamp Overlays */}
            {showStamp && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="stamp-container">
                  <div className="stamp-badge stamp-sold">
                    <div className="stamp-content">
                      <div className="text-5xl font-black text-green-700 tracking-wider transform -rotate-12">SOLD</div>
                      <div className="text-2xl font-bold text-green-800 mt-2">₹{finalSoldPrice?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showUnsoldStamp && (
              <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                <div className="stamp-container">
                  <div className="stamp-badge stamp-unsold">
                    <div className="stamp-content">
                      <div className="text-5xl font-black text-red-700 tracking-wider transform -rotate-12">UNSOLD</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="h-full flex flex-col lg:flex-row">
              {/* Player Details Section - 40% */}
              <div className="w-full lg:w-[40%] flex flex-col gap-3 p-4 overflow-y-auto">
                {/* Player Header */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-4 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-2">
                    <Shield className="w-4 h-4" />#{player.serialNo || serialNo}
                  </div>
                  <h1 className="text-3xl font-black text-white mb-3 line-clamp-2 text-balance">{player.playerName}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-3 py-1 rounded-full font-bold text-sm">
                      {player.role}
                    </span>
                    {player.wicketKeeper === "True" && (
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1 rounded-full font-semibold text-sm">
                        WK
                      </span>
                    )}
                  </div>
                </div>

                {player.soldTo && (
                  <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-4 border-2 border-red-500 shadow-lg shadow-red-500/50">
                    <div className="text-center">
                      <div className="text-2xl font-black text-white mb-1">⚠️ ALREADY SOLD</div>
                      <div className="text-red-100 text-sm font-semibold">
                        This player has already been assigned to a team
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-3 border border-amber-500/30">
                    <div className="flex items-center gap-1 text-amber-400/70 text-xs font-semibold mb-2">
                      <Wallet className="w-4 h-4" />
                      <span>BASE PRICE</span>
                    </div>
                    <div className="text-2xl font-black text-amber-400">₹{player.basePrice?.toLocaleString()}</div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-3 border border-slate-700/50">
                    <div className="text-slate-400 text-xs font-semibold mb-2">AGE</div>
                    <div className="text-2xl font-black text-white">{player.age || "N/A"}</div>
                  </div>
                </div>

                {/* Player Info */}
                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl p-4 border border-slate-700/50">
                  <h3 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    PLAYER INFO
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                    <div>
                      <span className="text-slate-500 font-semibold">Role:</span> {player.role}
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">WK:</span> {player.wicketKeeper}
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Status:</span>
                      <span className="ml-1 text-emerald-400 font-semibold">Available</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold">Type:</span>
                      <span className="ml-1 text-amber-400 font-semibold">Pro</span>
                    </div>
                  </div>
                </div>

                {/* Assign Player Form */}
               {canAssignPlayer && (
  <div className="flex-1 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-xl p-4 border border-amber-500/30">
    <h3 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
      <Trophy className="w-4 h-4" />
      ASSIGN TO TEAM
    </h3>

    <form onSubmit={handleAssignPlayer} className="space-y-3">
      <div>
        <label className="block text-slate-300 font-semibold mb-2 text-sm">
          Sold Price (₹)
        </label>
        <input
          type="number"
          value={soldPrice}
          onChange={(e) => setSoldPrice(e.target.value)}
          placeholder="Enter amount"
          className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 transition"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-slate-300 font-semibold mb-2 text-sm">
          Select Team
        </label>
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 transition"
          required
        >
          <option value="">-- Choose team --</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.teamName} (₹{team.availablePurse?.toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {submitting ? "..." : "SOLD"}
        </button>

        <button
          type="button"
          onClick={handleUnsold}
          disabled={submitting}
          className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-2.5 rounded-lg text-sm transition disabled:opacity-50"
        >
          {submitting ? "..." : "UNSOLD"}
        </button>
      </div>
    </form>
  </div>
)}
              </div>

              {/* Player Image Section - 60% */}
              <div className="w-full lg:w-[60%] bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-l border-slate-700/30 overflow-hidden relative">
                {player.pictureUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img
                      src={`https://tplauctionbackend.onrender.com${player.pictureUrl}`}
                      alt={player.playerName}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Users className="w-32 h-32 text-slate-700 mb-4" />
                    <span className="text-slate-600 font-semibold text-lg">No Photo</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Teams - 4 teams */}
        <div className="w-64 flex flex-col gap-2 overflow-y-auto">
          {teams.slice(4, 8).map((team, index) => (
            <CompactTeamCard key={index} team={team} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .stamp-shake {
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .stamp-container {
          animation: stamp-appear 0.4s ease-out;
        }

        @keyframes stamp-appear {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(-15deg);
          }
          100% {
            transform: scale(1) rotate(-12deg);
            opacity: 1;
          }
        }

        .stamp-badge {
          width: 300px;
          height: 300px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .stamp-sold {
          background: radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 70%);
          border: 12px solid rgb(22, 163, 74);
        }

        .stamp-unsold {
          background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 70%);
          border: 12px solid rgb(220, 38, 38);
        }

        .stamp-content {
          text-align: center;
        }
      `}</style>
    </div>
  )
}

function CompactTeamCard({ team }) {
  return (
    <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-xl p-3 border border-slate-700/30 hover:border-amber-500/50 transition">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-slate-950/50 rounded-lg w-10 h-10 flex items-center justify-center border border-slate-700/50 flex-shrink-0">
          {team.teamLogo ? (
            <img
              src={`https://tplauctionbackend.onrender.com${team.teamLogo}`}
              alt={team.teamName}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <Shield className="w-5 h-5 text-slate-600" />
          )}
        </div>
        <h3 className="text-white font-bold text-sm truncate flex-1">{team.teamName}</h3>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs">Budget:</span>
          <span className="font-bold text-amber-400 text-sm">₹{team.availablePurse?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 text-xs">Players:</span>
          <span className="font-bold text-white text-sm">{team.totalPlayersBought || 0}</span>
        </div>
      </div>
    </div>
  )
}
