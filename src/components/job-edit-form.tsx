"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useEditCareerMutation } from "@/hooks/queries/use-edit-career"
import { toast } from "sonner"

type Job = {
  id: string
  branch: string
  title: string
  location: string
  role: string
  type: string
  requirements: string[]
  link: string
  image?: string // URL string dari backend
}

type Props = {
  job: Job
  onSuccess: () => void
}

export default function JobFormEdit({ job, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    branch: job.branch,
    title: job.title,
    location: job.location,
    role: job.role,
    type: job.type,
    requirements: job.requirements.join("\n"),
    link: job.link,
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(job.image || "")
  const [hasNewImage, setHasNewImage] = useState(false)

  const editCareerMutation = useEditCareerMutation(job.id)

  // Sync previewUrl dengan job.image saat props berubah
  useEffect(() => {
    console.log("Job image changed:", job.image)
    if (job.image) {
      setPreviewUrl(job.image)
    }
  }, [job.image]) // Hapus hasNewImage dependency

  const MAX_FILE_MB = 2
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    const mb = file.size / (1024 * 1024)
    if (mb > MAX_FILE_MB) {
      alert(`File terlalu besar (${mb.toFixed(2)} MB). Maks ${MAX_FILE_MB}MB.`)
      return
    }
    
    setSelectedFile(file)
    setHasNewImage(true)
    
    // Buat preview URL untuk gambar baru
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setPreviewUrl(result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const fd = new FormData()
    fd.append("branch", formData.branch)
    fd.append("title", formData.title)
    fd.append("location", formData.location)
    fd.append("role", formData.role)
    fd.append("type", formData.type)
    fd.append("link", formData.link)

    // Hanya kirim image ke FormData jika ada file baru yang dipilih
    if (hasNewImage && selectedFile) {
      fd.append("image", selectedFile, selectedFile.name)
      console.log("Image file attached:", selectedFile.name, selectedFile.size)
    }

    // Backend expect stringified array
    fd.append("requirements", JSON.stringify(formData.requirements.split("\n").filter(req => req.trim() !== "")))

    // Debug: Log FormData contents
    console.log("FormData contents:")
    for (const [key, value] of fd.entries()) {
      if (value instanceof File) {
        console.log(key, `File: ${value.name} (${value.size} bytes)`)
      } else {
        console.log(key, value)
      }
    }

    editCareerMutation.mutate(fd, {
      onSuccess: () => {
        toast.success("Job updated successfully")
        setHasNewImage(false)
        setSelectedFile(null)
        onSuccess()
      },
      onError: (err: any) => {
        console.error("Update error:", err)
        toast.error(err.message || "Update failed")
      },
    })
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
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => document.getElementById("posterUpload")?.click()}
            >
              <Upload className="h-4 w-4" /> Change
            </Button>
            {hasNewImage && (
              <span className="text-sm text-green-600">New image selected</span>
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
        <input 
          id="posterUpload" 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </div>

      {/* Branch + Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Branch</Label>
          <Select value={formData.branch} onValueChange={(v) => setFormData((s) => ({ ...s, branch: v }))}>
            <SelectTrigger>
              <SelectValue />
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
              <SelectValue />
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
      <Textarea
        placeholder="Requirements (one per line)"
        rows={5}
        value={formData.requirements}
        onChange={(e) => setFormData((s) => ({ ...s, requirements: e.target.value }))}
      />
      <Input
        placeholder="Application Link"
        value={formData.link}
        onChange={(e) => setFormData((s) => ({ ...s, link: e.target.value }))}
      />

      <Button type="submit" disabled={editCareerMutation.isPending}>
        {editCareerMutation.isPending ? "Updating..." : "Update Job"}
      </Button>
    </form>
  )
}