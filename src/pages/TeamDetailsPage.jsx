"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Shield, DollarSign, Users, ArrowLeft, User } from "lucide-react"
import { toast } from "sonner"

const API_BASE_URL = "https://tplauctionbackend.onrender.com"

export default function TeamDetailsPage() {
  const { teamId } = useParams()
  const navigate = useNavigate()
  const [team, setTeam] = useState(null)
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setLoading(true)

        // Fetch team details
        const teamResponse = await fetch(`${API_BASE_URL}/api/team/${teamId}`)
        if (!teamResponse.ok) {
          throw new Error("Failed to fetch team details")
        }
        const teamData = await teamResponse.json()
        setTeam(teamData)

        // Fetch players for this team
        const playersResponse = await fetch(`${API_BASE_URL}/api/team/${teamId}/players`)
        if (!playersResponse.ok) {
          throw new Error("Failed to fetch team players")
        }
        const playersData = await playersResponse.json()
        setPlayers(playersData)
      } catch (error) {
        console.error("Error fetching team details:", error)
        toast.error("Failed to load team details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTeamDetails()
  }, [teamId])

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`
    }
    return `₹${(amount / 100000).toFixed(0)}L`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-300 font-semibold">Loading team details...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg mb-4">Team not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-amber-400 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-300 hover:text-amber-500 transition mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Teams</span>
        </button>

        {/* Team Header */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-xl p-6 lg:p-8 mb-8 border border-slate-600">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Team Logo */}
            <div className="flex-shrink-0">
              {team.teamLogo ? (
                <img
                  src={`https://tplauctionbackend.onrender.com${team.teamLogo}`}
                  alt={`${team.teamName} logo`}
                  className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-amber-500 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border-4 border-amber-500 shadow-lg">
                  <Shield className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                </div>
              )}
            </div>

            {/* Team Info */}
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{team.teamName}</h1>
              <p className="text-slate-300 text-lg mb-4">Owner: {team.ownerName}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Available Purse */}
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-slate-400">Available Purse</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{team.availablePurse}</p>
                </div>

                {/* Total Purse */}
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-slate-400">Total Purse</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{team.purseAmount}</p>
                </div>

                {/* Players Bought */}
                <div className="bg-slate-900 bg-opacity-50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-slate-400">Players Bought</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{team.totalPlayersBought}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Players List */}
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">Team Players</h2>

          {players.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-600">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-300 text-lg">No players bought yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {players.map((player) => (
                <div
                  key={player._id}
                  className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg shadow-lg overflow-hidden border border-slate-600 hover:border-amber-500 transition"
                >
                  <div className="p-3">
                    <div className="flex flex-col items-center gap-2 mb-3">
                      {player.pictureUrl ? (
                        <img
                          src={`https://tplauctionbackend.onrender.com${player.pictureUrl}`}
                          alt={player.playerName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-amber-500"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center border-2 border-amber-500">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      )}

                      <div className="text-center">
                        <h3 className="text-sm font-bold text-white leading-tight">{player.playerName}</h3>
                        <p className="text-xs text-slate-400">{player.role}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center pb-1 border-b border-slate-600">
                        <span className="text-xs text-slate-400">Serial No.</span>
                        <span className="text-xs font-semibold text-white">{player.serialNo}</span>
                      </div>

                      <div className="flex justify-between items-center pb-1 border-b border-slate-600">
                        <span className="text-xs text-slate-400">Base Price</span>
                        <span className="text-xs font-semibold text-white">{player.basePrice}</span>
                      </div>

                      <div className="flex justify-between items-center pb-1 border-b border-slate-600">
                        <span className="text-xs text-slate-400">Sold Price</span>
                        <span className="text-sm font-bold text-amber-500">{player.soldPrice}</span>
                      </div>

                      {player.age && (
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400">Age</span>
                          <span className="text-xs font-semibold text-white">{player.age} years</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
