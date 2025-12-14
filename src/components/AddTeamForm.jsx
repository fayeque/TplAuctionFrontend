"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Upload, X } from "lucide-react"

const teamSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  purseAmount: z
    .string()
    .min(1, "Purse amount is required")
    .transform((val) => Number.parseInt(val)),
})

export default function AddTeamForm() {
  const [imagePreview, setImagePreview] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(teamSchema),
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
      formData.append("teamName", data.teamName)
      formData.append("ownerName", data.ownerName)
      formData.append("purseAmount", data.purseAmount)
      formData.append("availablePurse", data.purseAmount)
      if (selectedFile) formData.append("logo", selectedFile)

      const API_BASE_URL = "https://tplauctionbackend.onrender.com" // Change this to your backend URL
      const response = await fetch(`${API_BASE_URL}/api/team/add`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.message || "Failed to add team")
        return
      }

      toast.success("Team added successfully!")
      reset()
      removeImage()
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred while adding the team")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6 max-w-2xl mx-auto"
    >
      {/* Team Name */}
      <div>
        <label htmlFor="teamName" className="block text-sm font-semibold text-slate-700 mb-2">
          Team Name <span className="text-red-500">*</span>
        </label>
        <input
          id="teamName"
          type="text"
          placeholder="Enter team name"
          {...register("teamName")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        {errors.teamName && <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>}
      </div>

      {/* Owner Name */}
      <div>
        <label htmlFor="ownerName" className="block text-sm font-semibold text-slate-700 mb-2">
          Owner Name <span className="text-red-500">*</span>
        </label>
        <input
          id="ownerName"
          type="text"
          placeholder="Enter owner name"
          {...register("ownerName")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>}
      </div>

      {/* Purse Amount */}
      <div>
        <label htmlFor="purseAmount" className="block text-sm font-semibold text-slate-700 mb-2">
          Purse Amount <span className="text-red-500">*</span>
        </label>
        <input
          id="purseAmount"
          type="number"
          placeholder="Enter purse amount"
          {...register("purseAmount")}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
        {errors.purseAmount && <p className="text-red-500 text-sm mt-1">{errors.purseAmount.message}</p>}
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Team Logo</label>
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
                alt="Team logo preview"
                className="w-full h-full object-contain"
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
        {isLoading ? "Adding Team..." : "Add Team"}
      </button>
    </form>
  )
}
