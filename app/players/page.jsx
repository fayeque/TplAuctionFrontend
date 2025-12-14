"use client"
import { Card } from "@/components/ui/card"
import AddPlayerForm from "@/components/add-player-form"

export default function PlayersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Player</h1>
          <p className="text-gray-600">Fill in the player details to add them to the system</p>
        </div>

        <Card className="p-8 shadow-lg">
          <AddPlayerForm />
        </Card>
      </div>
    </main>
  )
}
