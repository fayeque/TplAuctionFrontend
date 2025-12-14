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
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700">
          {/* Left: TPL Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <Trophy className="w-10 h-10 text-amber-400" />
            <div className="flex flex-col">
              <span className="font-bold text-white text-2xl leading-none">TPL</span>
              <span className="text-amber-400 text-xs font-semibold">AUCTION 2025</span>
            </div>
          </Link>

          {/* Center: Main Title */}
          <div className="flex flex-col items-center">
            <h1 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold text-center bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent">
              TPL AUCTION SEASON 3
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-slate-400 text-xs font-medium">2025</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
          </div>

          {/* Right: Young Generation Logo and Text */}
          <div className="flex flex-col items-end gap-1">
            <img 
            src="https://tplauctionbackend.onrender.com/uploads/players/yg_logo.jpg"
            alt="Young Generation Logo" className="w-12 h-12 object-contain" />
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">Organised by</p>
              <p className="text-sm text-amber-400 font-bold leading-tight">Young Generation</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          {/* <form onSubmit={handleSearch} className="flex gap-2 flex-shrink-0 w-full lg:w-auto">
            <input
              type="text"
              value={serialNo}
              onChange={(e) => setSerialNo(e.target.value)}
              placeholder="Search Player by Serial No..."
              className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-400 w-full lg:w-64 text-sm"
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition text-sm"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form> */}

          {/* Navigation Links */}
          <nav className="flex gap-4 flex-shrink-0 flex-wrap justify-center">
            <Link
              to="/"
              className="text-white hover:text-amber-400 transition font-semibold text-sm px-3 py-1 rounded hover:bg-slate-700/50"
            >
              Teams
            </Link>
            <Link
              to="/players"
              className="text-white hover:text-amber-400 transition font-semibold text-sm px-3 py-1 rounded hover:bg-slate-700/50"
            >
              All Players
            </Link>
            {/* <Link
              to="/addPlayer"
              className="text-white hover:text-amber-400 transition font-semibold text-sm px-3 py-1 rounded hover:bg-slate-700/50"
            >
              Add Player
            </Link>
            <Link
              to="/addTeam"
              className="text-white hover:text-amber-400 transition font-semibold text-sm px-3 py-1 rounded hover:bg-slate-700/50"
            >
              Add Team
            </Link> */}
          </nav>
        </div>
      </div>
    </header>
  )
}
