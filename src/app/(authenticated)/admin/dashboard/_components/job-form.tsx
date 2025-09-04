"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

export function JobForm() {
  const [formData, setFormData] = useState({
    branch: "",
    title: "",
    location: "",
    role: "",
    type: "",
  })
  const [requirements, setRequirements] = useState<string[]>([""])
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const fd = new FormData()
      fd.append("branch", formData.branch)
      fd.append("title", formData.title)
      fd.append("location", formData.location)
      fd.append("role", formData.role)
      fd.append("type", formData.type)

      if (file) {
        // ⬅️ FIX: gunakan key "image"
        fd.append("image", file, file.name)
      }

      // kirim requirements sebagai JSON string array
      const filtered = requirements.map(r => r.trim()).filter(Boolean)
      fd.append("requirements", JSON.stringify(filtered))

      const res = await fetch("/api/career", {
        method: "POST",
        body: fd, // jangan set Content-Type manual
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || "Failed to create job")

      alert("Job posted successfully ✅")
      console.log("Saved job:", data)

      // reset form
      setFormData({ branch: "", title: "", location: "", role: "", type: "" })
      setRequirements([""])
      setFile(null)
    } catch (err: any) {
      alert(err.message || "Submit failed")
    } finally {
      setSubmitting(false)
    }
  }

  const addRequirement = () => setRequirements([...requirements, ""])
  const removeRequirement = (i: number) =>
    setRequirements(requirements.filter((_, idx) => idx !== i))
  const updateRequirement = (i: number, value: string) => {
    const copy = [...requirements]
    copy[i] = value
    setRequirements(copy)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Post New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Branch */}
          <div className="space-y-2">
            <Label>Branch *</Label>
            <Input
              value={formData.branch}
              onChange={(e) =>
                setFormData({ ...formData, branch: e.target.value })
              }
              required
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location *</Label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Role *</Label>
            <Input
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type *</Label>
            <Input
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              placeholder="Fulltime / Freelance / Internship"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Upload Image *</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
            {file && (
              <p className="text-sm text-gray-500">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <Label>Requirements *</Label>
            {requirements.map((req, i) => (
              <div key={i} className="flex gap-2">
                <Textarea
                  value={req}
                  onChange={(e) => updateRequirement(i, e.target.value)}
                  placeholder={`Requirement ${i + 1}`}
                  required
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeRequirement(i)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addRequirement}>
              <Plus className="h-4 w-4" /> Add Requirement
            </Button>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
