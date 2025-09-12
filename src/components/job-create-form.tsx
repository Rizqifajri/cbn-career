"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

type Props = {
  onSuccess: () => void
}

// Utility function untuk generate unique filename
const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const fileExtension = originalName.split('.').pop()
  const baseName = originalName.split('.').slice(0, -1).join('.')
  
  return `${baseName}_${timestamp}_${randomId}.${fileExtension}`
}

export default function JobFormCreate({ onSuccess }: Props) {
  const [formData, setFormData] = useState({
    branch: "",
    title: "",
    location: "",
    role: "",
    type: "",
    requirements: "",
    link: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const MAX_FILE_MB = 2
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const mb = file.size / (1024 * 1024)
    if (mb > MAX_FILE_MB) {
      toast.error(`File terlalu besar (${mb.toFixed(2)} MB). Maks ${MAX_FILE_MB}MB.`)
      return
    }
    
    // Create a new File with unique name
    const uniqueFilename = generateUniqueFilename(file.name)
    const uniqueFile = new File([file], uniqueFilename, { type: file.type })
    
    setSelectedFile(uniqueFile)
    
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string)
    reader.readAsDataURL(file) // Still use original file for preview
    
    toast.success("Image uploaded successfully")
    console.log("New unique filename:", uniqueFilename)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      toast.error("Please upload an image")
      return
    }

    try {
      setIsSubmitting(true)
      const formDataToSend = new FormData()
      
      // Gunakan nama field yang konsisten dengan backend
      formDataToSend.append("image", selectedFile, selectedFile.name) // Pastikan nama field konsisten
      formDataToSend.append("branch", formData.branch)
      formDataToSend.append("title", formData.title)
      formDataToSend.append("location", formData.location)
      formDataToSend.append("role", formData.role)
      formDataToSend.append("type", formData.type)
      formDataToSend.append("requirements", JSON.stringify(formData.requirements.split("\n").filter(req => req.trim())))
      formDataToSend.append("link", formData.link)

      // Debug log
      console.log("Creating job with file:", selectedFile.name)
      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(key, `File: ${value.name} (${value.size} bytes)`)
        } else {
          console.log(key, value)
        }
      }

      const res = await fetch("/api/career", { 
        method: "POST", 
        body: formDataToSend 
      })
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Create failed" }))
        throw new Error(errorData.message || "Failed to create job")
      }

      const result = await res.json()
      console.log("Create response:", result)

      toast.success("Job created successfully")
      
      // Reset form
      setFormData({
        branch: "",
        title: "",
        location: "",
        role: "",
        type: "",
        requirements: "",
        link: "",
      })
      setSelectedFile(null)
      setPreviewUrl("")
      
      // Reset file input
      const fileInput = document.getElementById("posterUpload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
      
      onSuccess()
    } catch (err: any) {
      console.error("Create error:", err)
      toast.error(err.message || "Create failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <Label>Hiring Poster</Label>
        {previewUrl ? (
          <div className="flex items-center gap-4 mt-2">
            <Image
              src={previewUrl}
              alt="preview"
              width={100}
              height={100}
              className="w-32 h-32 rounded-lg border object-cover"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById("posterUpload")?.click()}>
              <Upload className="h-4 w-4" /> Change
            </Button>
            {selectedFile && (
              <span className="text-sm text-blue-600">File: {selectedFile.name}</span>
            )}
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
            onClick={() => document.getElementById("posterUpload")?.click()}
          >
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="text-sm">Click to upload image (max {MAX_FILE_MB}MB)</p>
          </div>
        )}
        <input id="posterUpload" type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
      </div>

      {/* Branch + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Branch</Label>
          <Select value={formData.branch} onValueChange={(v) => setFormData((s) => ({ ...s, branch: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cretivox">Cretivox</SelectItem>
              <SelectItem value="OGS">OGS</SelectItem>
              <SelectItem value="Condfe">Condfe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Type</Label>
          <Select value={formData.type} onValueChange={(v) => setFormData((s) => ({ ...s, type: v }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Fulltime">Fulltime</SelectItem>
              <SelectItem value="Parttime">Parttime</SelectItem>
              <SelectItem value="Contract">Contract</SelectItem>
              <SelectItem value="Internship">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Title, Location, Role */}
      <Input
        placeholder="Job Title"
        value={formData.title}
        onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))}
      />
      <Input
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData((s) => ({ ...s, location: e.target.value }))}
      />
      <Input
        placeholder="Role"
        value={formData.role}
        onChange={(e) => setFormData((s) => ({ ...s, role: e.target.value }))}
      />

      {/* Requirements */}
      <Textarea
        placeholder="Requirements (one per line)"
        rows={5}
        value={formData.requirements}
        onChange={(e) => setFormData((s) => ({ ...s, requirements: e.target.value }))}
      />

      {/* Link */}
      <Input
        placeholder="Application Link"
        value={formData.link}
        onChange={(e) => setFormData((s) => ({ ...s, link: e.target.value }))}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Job"}
      </Button>
    </form>
  )
}