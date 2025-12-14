"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ROLES = ["Batsman", "Bowler", "Allrounder"]

export default function AddPlayerForm() {
  const [formData, setFormData] = useState({
    playerName: "",
    role: "Allrounder",
    wicketKeeper: "True",
    basePrice: "",
    age: "",
  })

  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        return
      }

      setFormData((prev) => ({
        ...prev,
        photo: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const resetForm = () => {
    setFormData({
      playerName: "",
      role: "Allrounder",
      wicketKeeper: "True",
      basePrice: "",
      age: "",
    })
    setPreview(null)
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.playerName.trim()) {
      setError("Player name is required")
      return
    }

    try {
      setLoading(true)

      // Create FormData object
      const submitData = new FormData()
      submitData.append("playerName", formData.playerName)
      submitData.append("role", formData.role)
      submitData.append("wicketKeeper", formData.wicketKeeper)
      submitData.append("basePrice", formData.basePrice || "0")
      submitData.append("age", formData.age || "0")

      if (formData.photo) {
        submitData.append("photo", formData.photo)
      }

      const response = await fetch("/api/player/add", {
        method: "POST",
        body: submitData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add player")
      }

      const data = await response.json()
      setSuccess(true)
      toast({
        title: "Success",
        description: `${formData.playerName} has been added successfully!`,
      })

      // Reset form after 2 seconds
      setTimeout(resetForm, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred"
      setError(message)
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">Player added successfully! Redirecting...</AlertDescription>
        </Alert>
      )}

      {/* Player Name */}
      <div>
        <label htmlFor="playerName" className="block text-sm font-medium text-gray-700 mb-2">
          Player Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="playerName"
          name="playerName"
          value={formData.playerName}
          onChange={handleInputChange}
          placeholder="Enter player name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          required
        />
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
        >
          {ROLES.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      {/* Wicket Keeper */}
      <div>
        <label htmlFor="wicketKeeper" className="block text-sm font-medium text-gray-700 mb-2">
          Wicket Keeper
        </label>
        <select
          id="wicketKeeper"
          name="wicketKeeper"
          value={formData.wicketKeeper}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
        >
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
          Age
        </label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="Enter player age"
          min="0"
          max="150"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Base Price */}
      <div>
        <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-2">
          Base Price
        </label>
        <input
          type="number"
          id="basePrice"
          name="basePrice"
          value={formData.basePrice}
          onChange={handleInputChange}
          placeholder="Enter base price"
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
      </div>

      {/* Photo Upload */}
      <div>
        <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
          Player Photo
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleImageChange}
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer"
            />
          </div>
        </div>

        {/* Image Preview */}
        {preview && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="relative inline-block">
              <img
                src={preview || "/placeholder.svg"}
                alt="Player preview"
                className="h-48 w-48 object-cover rounded-lg border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setPreview(null)
                  setFormData((prev) => ({ ...prev, photo: undefined }))
                  const input = document.getElementById("photo")
                  if (input) input.value = ""
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Adding Player..." : "Add Player"}
        </Button>
        <Button
          type="button"
          onClick={resetForm}
          disabled={loading}
          variant="outline"
          className="flex-1 py-2 bg-transparent"
        >
          Reset
        </Button>
      </div>
    </form>
  )
}
