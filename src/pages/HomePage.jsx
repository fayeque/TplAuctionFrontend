"use client"

import { useState, useEffect } from "react"
import { Users, Wallet, Shield, Eye } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = "https://tplauctionbackend.onrender.com"

export default function HomePage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/team/all`)

        if (!response.ok) {
          throw new Error("Failed to fetch teams")
        }

        const data = await response.json()
        setTeams(data.data)
      } catch (error) {
        console.error("Error fetching teams:", error)
        toast.error("Failed to load teams. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  const teamColors = [
    "from-red-600 to-red-700",
    "from-green-600 to-green-700",
    "from-blue-600 to-blue-700",
    "from-purple-600 to-purple-700",
    "from-yellow-600 to-yellow-700",
    "from-orange-600 to-orange-700",
    "from-pink-600 to-pink-700",
    "from-teal-600 to-teal-700",
  ]

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    }
    return `${(amount / 100000).toFixed(0)}L`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading teams...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-4 px-3">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">Teams</h2>
          <p className="text-slate-600 text-xs lg:text-sm">View team purse and player information</p>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 text-lg">No teams found. Add teams to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {teams.map((team, index) => (
              <div
                key={team._id}
                className={`bg-gradient-to-br ${teamColors[index % teamColors.length]} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:scale-105`}
              >
                <div className="p-3 text-white">
                  {/* Team Logo and Name */}
                  <div className="flex items-center gap-2 mb-3">
                    {team.teamLogo ? (
                      <img
                        src={`https://tplauctionbackend.onrender.com${team.teamLogo}`}
                        alt={`${team.teamName} logo`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white">
                        <Shield className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold leading-tight">{team.teamName}</h3>
                      <p className="text-xs opacity-90">{team.ownerName}</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="space-y-2">
                    {/* Total Purse */}
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Wallet className="w-3 h-3" />
                        <span className="text-xs opacity-90">Total Purse</span>
                      </div>
                      <p className="text-base font-bold">{team.purseAmount}</p>
                    </div>

                    {/* Remaining Purse */}
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Wallet className="w-3 h-3" />
                        <span className="text-xs opacity-90">Available Purse</span>
                      </div>
                      <p className="text-base font-bold">{team.availablePurse}</p>
                      <div className="w-full bg-white bg-opacity-30 rounded-full h-1 mt-1">
                        <div
                          className="bg-yellow-300 h-1 rounded-full transition-all duration-300"
                          style={{
                            width: `${(team.availablePurse / team.purseAmount) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Players Bought */}
                    <div className="bg-white bg-opacity-20 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-0.5">
                        <Users className="w-3 h-3" />
                        <span className="text-xs opacity-90">Players Bought</span>
                      </div>
                      <p className="text-base font-bold">{team.totalPlayersBought}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/team/${team._id}`)}
                    className="mt-3 w-full bg-white text-slate-900 font-semibold py-2 px-3 rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-1 shadow-md text-xs"
                  >
                    <Eye className="w-3 h-3" />
                    View Players
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
