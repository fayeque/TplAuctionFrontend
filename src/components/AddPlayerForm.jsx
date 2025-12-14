"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"

const playerSchema = z.object({
  serialNo: z.string().min(1, "Serial number is required"),
  playerName: z.string().min(2, "Player name must be at least 2 characters"),
  role: z.enum(["Batsman", "Bowler", "Allrounder"]),
  wicketKeeper: z.string(),
  basePrice: z
    .string()
    .transform((val) => (val ? Number.parseInt(val) : undefined))
    .optional(),
  age: z
    .string()
    .transform((val) => (val ? Number.parseInt(val) : undefined))
    .optional(),
})

export default function AddPlayerForm() {
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      role: "Allrounder",
      wicketKeeper: "True",
    },
  })

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB")
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImagePreview(null)
    setSelectedFile(null)
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)

      const formData = new FormData()
      formData.append("serialNo", data.serialNo)
      formData.append("playerName", data.playerName)
      formData.append("role", data.role)
      formData.append("wicketKeeper", data.wicketKeeper)
      // if (data.basePrice) formData.append("basePrice", data.basePrice)
      if (data.age) formData.append("age", data.age)
      if (selectedFile) formData.append("picture", selectedFile)

      const API_BASE_URL = "https://tplauctionbackend.onrender.com" // Change this to your backend URL
      const response = await fetch(`${API_BASE_URL}/api/player/add`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to add player")
        return
      }

      toast.success("Player added successfully!")
      reset()
      removeImage()
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while adding the player")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-4 md:p-8 space-y-4 md:space-y-6">
      <div>
        <label htmlFor="serialNo" className="block text-sm font-semibold text-slate-700 mb-2">
          Serial Number <span className="text-red-500">*</span>
        </label>
        <input
          id="serialNo"
          type="text"
          placeholder="Enter player serial number"
          {...register("serialNo")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        {errors.serialNo && <p className="text-red-500 text-sm mt-1">{errors.serialNo.message}</p>}
      </div>

      {/* Player Name */}
      <div>
        <label htmlFor="playerName" className="block text-sm font-semibold text-slate-700 mb-2">
          Player Name <span className="text-red-500">*</span>
        </label>
        <input
          id="playerName"
          type="text"
          placeholder="Enter player name"
          {...register("playerName")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        {errors.playerName && <p className="text-red-500 text-sm mt-1">{errors.playerName.message}</p>}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
          Role
        </label>
        <select
          id="role"
          {...register("role")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          <option value="Batsman">Batsman</option>
          <option value="Bowler">Bowler</option>
          <option value="Allrounder">Allrounder</option>
        </select>
      </div>

      {/* Wicket Keeper */}
      <div>
        <label htmlFor="wicketKeeper" className="block text-sm font-semibold text-slate-700 mb-2">
          Wicket Keeper
        </label>
        <select
          id="wicketKeeper"
          {...register("wicketKeeper")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        >
          <option value="True">Yes</option>
          <option value="False">No</option>
        </select>
      </div>

      {/* Age */}
      <div>
        <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-2">
          Age
        </label>
        <input
          id="age"
          type="number"
          placeholder="Enter age"
          {...register("age")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>

      {/* Base Price */}
      {/* <div>
        <label htmlFor="basePrice" className="block text-sm font-semibold text-slate-700 mb-2">
          Base Price
        </label>
        <input
          id="basePrice"
          type="number"
          placeholder="Enter base price"
          {...register("basePrice")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div> */}

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Player Photo</label>
        <div className="flex flex-col gap-4">
          <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-600 transition">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-sm text-slate-600">Click to upload or drag and drop</span>
              <span className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</span>
            </div>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>

          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Player preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition duration-200"
      >
        {isLoading ? "Adding Player..." : "Add Player"}
      </button>
    </form>
  )
}
