"use client"

import { useState, useEffect } from "react"
import { Search, Users, Trophy, Calendar, User } from "lucide-react"
import { Link } from "react-router-dom"

export default function AllPlayersPage() {
  const [players, setPlayers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [totalPlayers, setTotalPlayers] = useState(0)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await fetch("https://tplauctionbackend.onrender.com/api/player/summary/all")
      const result = await response.json()

      if (result.success) {
        setPlayers(result.data)
        setTotalPlayers(result.totalPlayers)
      }
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPlayers = players.filter((player) =>
    player.playerName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-amber-400 text-xl font-semibold animate-pulse">Loading players...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-10 h-10 text-amber-400" />
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
              All Players
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            Complete roster of {totalPlayers} players participating in the auction
          </p>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search players by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-12 bg-slate-900/50 border border-slate-800 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Players List */}
        <div className="space-y-3">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No players found matching your search.</p>
            </div>
          ) : (
            filteredPlayers.map((player, index) => (
              <Link key={index} to={`/playerDetails/${index + 1}`} className="block">
                <div className="group relative bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-lg border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-300" />

                  <div className="relative flex items-center gap-4 p-4">
                    {/* Player Photo */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-slate-700 group-hover:ring-amber-500 transition-all duration-300">
                        {player.pictureUrl ? (
                          <img
                            src={`https://tplauctionbackend.onrender.com${player.pictureUrl}` || "/placeholder.svg"}
                            alt={player.playerName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <User className="w-8 h-8 text-slate-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-bold text-white text-lg group-hover:text-amber-400 transition-colors">
                            {player.playerName}
                          </h3>
                        </div>

                        {/* Sold Price */}
                        <div className="text-right flex-shrink-0">
                          {player.soldPrice !== "Yet to be sold" ? (
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg px-3 py-1.5">
                              <div className="flex items-center gap-1.5">
                                <Trophy className="w-4 h-4 text-green-400" />
                                <span className="font-bold text-green-400 text-sm">₹{player.soldPrice}L</span>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5">
                              <span className="text-slate-400 text-xs font-medium">Yet to be sold</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Bottom Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{player.age} years</span>
                        </div>
                        {player.teamName && player.teamName !== "Unsold" && (
                          <div className="flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-amber-400 font-medium">{player.teamName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{totalPlayers}</div>
            <div className="text-xs text-slate-400 mt-1">Total Players</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {players.filter((p) => p.soldPrice !== "Yet to be sold").length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Sold</div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-slate-400">
              {players.filter((p) => p.soldPrice === "Yet to be sold").length}
            </div>
            <div className="text-xs text-slate-400 mt-1">Unsold</div>
          </div>
        </div>
      </div>
    </div>
  )
}
