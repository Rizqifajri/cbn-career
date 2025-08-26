"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Users, Briefcase, Eye, Upload, ImageIcon } from "lucide-react"

type Job = {
  id: string
  branch: string
  title: string
  location: string
  role: string
  type: string
  requirements: string[]
  applicants?: number
  posterImage?: string
}

type Applicant = {
  id: string
  jobId: string
  name: string
  email: string
  appliedAt: string
}

const initialJobs: Job[] = [
  {
    id: "1",
    branch: "Cretivox",
    title: "Video Editor",
    location: "Jakarta",
    role: "Editor",
    type: "Fulltime",
    requirements: ["1–2 years experience", "Creative mindset", "Video editing skills"],
    applicants: 12,
    posterImage: "/video-editor-hiring-poster.png",
  },
  {
    id: "2",
    branch: "OGS",
    title: "Jr. Graphic Designer",
    location: "Jakarta",
    role: "Designer",
    type: "Fulltime",
    requirements: ["Portfolio desain", "Menguasai Figma/Adobe", "Detail-oriented"],
    applicants: 8,
    posterImage: "/graphic-designer-hiring-poster.png",
  },
]

const mockApplicants: Applicant[] = [
  { id: "1", jobId: "1", name: "John Doe", email: "john@email.com", appliedAt: "2024-01-15" },
  { id: "2", jobId: "1", name: "Jane Smith", email: "jane@email.com", appliedAt: "2024-01-14" },
  { id: "3", jobId: "2", name: "Bob Wilson", email: "bob@email.com", appliedAt: "2024-01-13" },
]

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [currentView, setCurrentView] = useState<"jobs" | "create" | "applicants">("jobs")
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string>("")

  const [formData, setFormData] = useState({
    branch: "",
    title: "",
    location: "",
    role: "",
    type: "",
    requirements: "",
    posterImage: "",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({ ...formData, posterImage: e.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const requirementsArray = formData.requirements.split("\n").filter((req) => req.trim())

    if (editingJob) {
      setJobs(
        jobs.map((job) => (job.id === editingJob.id ? { ...job, ...formData, requirements: requirementsArray } : job)),
      )
      setEditingJob(null)
    } else {
      const newJob: Job = {
        id: Date.now().toString(),
        ...formData,
        requirements: requirementsArray,
        applicants: 0,
      }
      setJobs([...jobs, newJob])
    }

    setFormData({ branch: "", title: "", location: "", role: "", type: "", requirements: "", posterImage: "" })
    setCurrentView("jobs")
  }

  const handleEdit = (job: Job) => {
    setEditingJob(job)
    setFormData({
      branch: job.branch,
      title: job.title,
      location: job.location,
      role: job.role,
      type: job.type,
      requirements: job.requirements.join("\n"),
      posterImage: job.posterImage || "",
    })
    setCurrentView("create")
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this job?")) {
      setJobs(jobs.filter((job) => job.id !== id))
    }
  }

  const getApplicantsForJob = (jobId: string) => {
    return mockApplicants.filter((applicant) => applicant.jobId === jobId)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">CBN Career Dashboard</h1>
            <nav className="flex gap-4">
              <Button
                variant={currentView === "jobs" ? "default" : "ghost"}
                onClick={() => setCurrentView("jobs")}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Jobs ({jobs.length})
              </Button>
              <Button
                variant={currentView === "create" ? "default" : "ghost"}
                onClick={() => {
                  setCurrentView("create")
                  setEditingJob(null)
                  setFormData({
                    branch: "",
                    title: "",
                    location: "",
                    role: "",
                    type: "",
                    requirements: "",
                    posterImage: "",
                  })
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Job
              </Button>
              <Button
                variant={currentView === "applicants" ? "default" : "ghost"}
                onClick={() => setCurrentView("applicants")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Applicants
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {currentView === "jobs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Jobs</h2>
              <Button onClick={() => setCurrentView("create")} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Job
              </Button>
            </div>

            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="border border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {job.posterImage && (
                          <div className="flex-shrink-0">
                            <img
                              src={job.posterImage || "/placeholder.svg"}
                              alt={`${job.title} hiring poster`}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {job.title}
                            <Badge variant="secondary">{job.branch}</Badge>
                          </CardTitle>
                          <CardDescription>
                            {job.location} • {job.role} • {job.type}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {job.applicants || 0} applicants
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h4 className="font-medium">Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {job.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentView === "create" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">{editingJob ? "Edit Job" : "Create New Job"}</h2>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="posterImage">Hiring Poster</Label>
                    <div className="mt-2">
                      {formData.posterImage ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={formData.posterImage || "/placeholder.svg"}
                            alt="Hiring poster preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("posterUpload")?.click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Change Image
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => setFormData({ ...formData, posterImage: "" })}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => document.getElementById("posterUpload")?.click()}
                        >
                          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">Click to upload hiring poster</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                        </div>
                      )}
                      <input
                        id="posterUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select
                        value={formData.branch}
                        onValueChange={(value) => setFormData({ ...formData, branch: value })}
                      >
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
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                      >
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

                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Jakarta"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Developer"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      placeholder="Enter each requirement on a new line"
                      rows={6}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">{editingJob ? "Update Job" : "Create Job"}</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCurrentView("jobs")
                        setEditingJob(null)
                        setFormData({
                          branch: "",
                          title: "",
                          location: "",
                          role: "",
                          type: "",
                          requirements: "",
                          posterImage: "",
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "applicants" && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">Job Applicants</h2>
              <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {mockApplicants
                .filter((applicant) => selectedJobId === "all" || applicant.jobId === selectedJobId)
                .map((applicant) => {
                  const job = jobs.find((j) => j.id === applicant.jobId)
                  return (
                    <Card key={applicant.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{applicant.name}</h3>
                            <p className="text-sm text-muted-foreground">{applicant.email}</p>
                            <p className="text-sm text-muted-foreground">
                              Applied for: {job?.title} at {job?.branch}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Applied: {new Date(applicant.appliedAt).toLocaleDateString()}
                            </p>
                            <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                              <Eye className="h-4 w-4 mr-2" />
                              View Application
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
