"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

type Job = {
  id: string
  branch: "Cretivox" | "OGS" | "Condfe" | (string & {})
  title: string
  location: string
  role: string
  type: string
  image?: string
  requirements: string[]
}

interface JobFormProps {
  onAddJob: (job: Job) => void
}

export function JobForm({ onAddJob }: JobFormProps) {
  const [formData, setFormData] = useState({
    branch: "",
    title: "",
    location: "",
    role: "",
    type: "",
    image: "",
  })
  const [requirements, setRequirements] = useState<string[]>([""])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.branch || !formData.title || !formData.location || !formData.role || !formData.type) {
      alert("Please fill in all required fields")
      return
    }

    const filteredRequirements = requirements.filter((req) => req.trim() !== "")
    if (filteredRequirements.length === 0) {
      alert("Please add at least one requirement")
      return
    }

    const newJob: Job = {
      id: `${formData.branch.toLowerCase()}-${formData.title.toLowerCase().replace(/\s+/g, "-")}`,
      branch: formData.branch as Job["branch"],
      title: formData.title,
      location: formData.location,
      role: formData.role,
      type: formData.type,
      image: formData.image || undefined,
      requirements: filteredRequirements,
    }

    onAddJob(newJob)

    // Reset form
    setFormData({
      branch: "",
      title: "",
      location: "",
      role: "",
      type: "",
      image: "",
    })
    setRequirements([""])
  }

  const addRequirement = () => {
    setRequirements([...requirements, ""])
  }

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index))
    }
  }

  const updateRequirement = (index: number, value: string) => {
    const updated = [...requirements]
    updated[index] = value
    setRequirements(updated)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-serif">Post New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch *</Label>
              <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
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

            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Video Editor"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Jakarta"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Editor"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fulltime">Fulltime</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="e.g. /hiring-poster.png"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Requirements *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
                className="flex items-center gap-2 bg-transparent"
              >
                <Plus className="h-4 w-4" />
                Add Requirement
              </Button>
            </div>

            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    placeholder={`Requirement ${index + 1}`}
                    className="min-h-[60px]"
                    rows={2}
                  />
                  {requirements.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                      className="shrink-0 h-[60px]"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Post Job
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
