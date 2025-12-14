"use client"

import { Link, useNavigate } from "react-router-dom"
import { Trophy, Search } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [serialNo, setSerialNo] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (serialNo.trim()) {
      navigate(`/playerDetails/${serialNo}`)
      setSerialNo("")
    }
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Trophy className="w-8 h-8 lg:w-10 lg:h-10 text-amber-400" />
            <span className="font-bold text-white text-lg lg:text-xl">TPL</span>
          </Link>

          {/* Center Title */}
          <h1 className="text-white text-lg sm:text-xl lg:text-2xl font-bold text-center flex-shrink-0 order-first lg:order-none w-full lg:w-auto">
            TPL AUCTION SEASON 3 2025
          </h1>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-shrink-0 w-full lg:w-auto">
            <input
              type="text"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              placeholder="Search Serial No..."
              className="px-3 lg:px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-400 w-full lg:w-48 text-sm"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-3 lg:px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="flex gap-3 lg:gap-4 flex-shrink-0 flex-wrap justify-center">
            <Link to="/" className="text-white hover:text-amber-400 transition font-semibold text-sm lg:text-base">
              Teams
            </Link>

            <Link to="/players" className="text-white hover:text-amber-400 transition font-semibold text-sm lg:text-base">
              All Players
            </Link>
            {/* <Link
              to="/addPlayer"
              className="text-white hover:text-amber-400 transition font-semibold text-sm lg:text-base"
            >
              Add Player
            </Link>
            <Link
              to="/addTeam"
              className="text-white hover:text-amber-400 transition font-semibold text-sm lg:text-base"
            >
              Add Team
            </Link> */}
          </nav>
        </div>
      </div>
    </header>
  )
}
