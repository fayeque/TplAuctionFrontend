import AddTeamForm from "../components/AddTeamForm"

export default function AddTeamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Add New Team</h1>
          <p className="text-slate-600">Fill in the details to add a new team to the auction</p>
        </div>
        <AddTeamForm />
      </div>
    </main>
  )
}
