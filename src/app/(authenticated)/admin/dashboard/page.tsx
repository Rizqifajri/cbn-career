"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Users, Eye, Upload, ImageIcon, Briefcase, LogOut } from "lucide-react"

import { useCareersQuery } from "@/hooks/queries/use-get-career"
import { useDeleteCareerMutation } from "@/hooks/queries/use-delete-career"
import { link } from "fs"

type Job = {
  id: string
  branch: string
  title: string
  location: string
  role: string
  type: string
  requirements: string[]
  applicants?: number
  image?: File
  link: string
}

type Applicant = {
  id: string
  jobId: string
  name: string
  email: string
  appliedAt: string
}

const mockApplicants: Applicant[] = [
  { id: "1", jobId: "1", name: "John Doe", email: "john@email.com", appliedAt: "2024-01-15" },
  { id: "2", jobId: "1", name: "Jane Smith", email: "jane@email.com", appliedAt: "2024-01-14" },
  { id: "3", jobId: "2", name: "Bob Wilson", email: "bob@email.com", appliedAt: "2024-01-13" },
]

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentView, setCurrentView] = useState<"jobs" | "create" | "applicants">("jobs")
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string>("all")

  // form state
  const [formData, setFormData] = useState({
    branch: "",
    title: "",
    location: "",
    role: "",
    type: "",
    requirements: "",
    link: "",
  })

  // Image upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false) 

  // fetch list
  const { data: apiData, isLoading, isError, error, refetch } = useCareersQuery()
  const normalizedJobs: Job[] = useMemo(() => {
    const arr = Array.isArray(apiData) ? apiData : apiData?.data ?? []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return arr.map((j: any) => ({
      id: String(j.id),
      branch: j.branch ?? "",
      title: j.title ?? "",
      location: j.location ?? "",
      role: j.role ?? "",
      type: j.type ?? "",
      image: j.image || j.image || undefined,
      applicants: j.applicants ?? 0,
      requirements: Array.isArray(j.requirements)
        ? j.requirements
        : typeof j.requirements === "string"
          ? j.requirements.split(/\r?\n/).filter(Boolean)
          : [],
      link: j.link ?? "",
    }))
  }, [apiData])

  useEffect(() => {
    if (normalizedJobs.length && jobs.length === 0) setJobs(normalizedJobs)
  }, [normalizedJobs, jobs.length])

  // mutations
  const { mutateAsync: deleteCareer, isPending: deleting } = useDeleteCareerMutation()

  // Handle image upload with preview
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

    // Create preview URL
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  // Handle form submission with FormData for file upload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.branch || !formData.title || !formData.location || !formData.role || !formData.type) {
      alert("Please fill in all required fields")
      return
    }

    const requirementsArray = formData.requirements.split("\n").map((r) => r.trim()).filter(Boolean)
    if (!requirementsArray.length) {
      alert("Please add at least one requirement")
      return
    }

    // For new jobs, require image upload
    if (!editingJob && !selectedFile) {
      alert("Please upload an image")
      return
    }

    try {
      setIsSubmitting(true)

      // Prepare FormData for file upload
      const formDataToSend = new FormData()

      // Add file if selected
      if (selectedFile) {
        formDataToSend.append("file", selectedFile)
      }

      // Add other form fields
      formDataToSend.append("branch", formData.branch)
      formDataToSend.append("title", formData.title)
      formDataToSend.append("location", formData.location)
      formDataToSend.append("role", formData.role)
      formDataToSend.append("type", formData.type)
      formDataToSend.append("requirements", JSON.stringify(requirementsArray))
      formDataToSend.append("link", formData.link)

      // Add existing image URL if editing and no new file selected
      if (editingJob && !selectedFile && editingJob.image) {
        formDataToSend.append("image", editingJob.image)
      }

      let response: Response

      if (editingJob) {
        // Update existing job
        response = await fetch(`/api/career/${editingJob.id}`, {
          method: 'PUT',
          body: formDataToSend,
        })
      } else {
        // Create new job
        response = await fetch('/api/career', {
          method: 'POST',
          body: formDataToSend,
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
        throw new Error(errorData.message || `${editingJob ? 'Update' : 'Create'} failed`)
      }

      const saved = await response.json()

      if (editingJob) {
        // Update job in local state
        setJobs((prev) =>
          prev.map((j) =>
            j.id === editingJob.id
              ? {
                ...j,
                branch: saved?.branch ?? formData.branch,
                title: saved?.title ?? formData.title,
                location: saved?.location ?? formData.location,
                role: saved?.role ?? formData.role,
                type: saved?.type ?? formData.type,
                image: saved?.image || saved?.image || editingJob.image,
                requirements: Array.isArray(saved?.requirements)
                  ? saved.requirements
                  : requirementsArray,
              }
              : j,
          ),
        )
        setEditingJob(null)
        alert("Job updated successfully")
      } else {
        // Add new job to local state
        const newJob: Job = {
          id: String(saved?.id ?? Date.now()),
          branch: saved?.branch ?? formData.branch,
          title: saved?.title ?? formData.title,
          location: saved?.location ?? formData.location,
          role: saved?.role ?? formData.role,
          type: saved?.type ?? formData.type,
          image: saved?.image || saved?.image,
          applicants: saved?.applicants ?? 0,
          requirements: Array.isArray(saved?.requirements)
            ? saved.requirements
            : requirementsArray,
          link: saved?.link ?? formData.link,
        }
        setJobs((prev) => [newJob, ...prev])
        alert("Job created successfully")
      }

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

      setCurrentView("jobs")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.message || "Submit failed"
      alert(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true)
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.replace("/auth/login")
    } finally {
      setIsLoggingOut(false)
    }
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
      link: job.link,
    })
    // Set preview to existing image
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //@ts-ignore
    setPreviewUrl(job.image || "")
    setSelectedFile(null)
    setCurrentView("create")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    try {
      await deleteCareer(id)
      setJobs((prev) => prev.filter((job) => job.id !== id))
      refetch() // Refresh from server
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete job"
      alert(msg)
    }
  }

  const resetForm = () => {
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
    setEditingJob(null)
    const fileInput = document.getElementById("posterUpload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
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
                Jobs ({jobs.length || 0})
              </Button>
              <Button
                variant={currentView === "create" ? "default" : "ghost"}
                onClick={() => {
                  setCurrentView("create")
                  resetForm()
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

              {/* Logout button */}
              <Button
                variant="outline"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-transparent flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
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
              <div className="flex items-center gap-2">
                <Button onClick={() => {
                  setCurrentView("create")
                  resetForm()
                }} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Job
                </Button>
                <Button variant="outline" onClick={() => refetch()} className="bg-transparent">
                  Refresh
                </Button>
              </div>
            </div>

            {isLoading && (
              <div className="grid gap-4">
                <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
                <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
                <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
              </div>
            )}
            {isError && (
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-red-600">
                    No Jobs found.
                    Gagal memuat data dari API{error instanceof Error ? `: ${error.message}` : ""}.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="border border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          {job.image && (
                            <div className="flex-shrink-0">
                              <img
                                src={job.image || "/placeholder.svg"}
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
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(job.id)} disabled={deleting}>
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
            )}
          </div>
        )}

        {currentView === "create" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">{editingJob ? "Edit Job" : "Create New Job"}</h2>

            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="image">Hiring Poster</Label>
                    <div className="mt-2">
                      {previewUrl ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={previewUrl}
                            alt="Hiring poster preview"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          <div className="flex flex-col gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("posterUpload")?.click()}
                              className="flex items-center gap-2"
                              disabled={isSubmitting}
                            >
                              <Upload className="h-4 w-4" />
                              {isSubmitting ? "Processing..." : "Change Image"}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setPreviewUrl("")
                                setSelectedFile(null)
                                const fileInput = document.getElementById("posterUpload") as HTMLInputElement
                                if (fileInput) fileInput.value = ""
                              }}
                              className="text-red-600 hover:text-red-700"
                              disabled={isSubmitting}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                          onClick={() => document.getElementById("posterUpload")?.click()}
                        >
                          <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">Click to upload image (max {MAX_FILE_MB}MB)</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG</p>
                        </div>
                      )}
                      <input
                        id="posterUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="branch">Branch</Label>
                      <Select value={formData.branch} onValueChange={(v) => setFormData((s) => ({ ...s, branch: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cretivox">Cretivox</SelectItem>
                          <SelectItem value="OGS">OGS</SelectItem>
                          <SelectItem value="Condfe">Condfe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(v) => setFormData((s) => ({ ...s, type: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                      onChange={(e) => setFormData((s) => ({ ...s, title: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData((s) => ({ ...s, location: e.target.value }))}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData((s) => ({ ...s, role: e.target.value }))}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData((s) => ({ ...s, requirements: e.target.value }))}
                      rows={6}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="link">Link</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => setFormData((s) => ({ ...s, link: e.target.value }))}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? (editingJob ? "Updating..." : "Creating...")
                        : (editingJob ? "Update Job" : "Create Job")
                      }
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCurrentView("jobs")
                        resetForm()
                      }}
                      disabled={isSubmitting}
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
                <SelectTrigger className="w-64"><SelectValue placeholder="Filter by job" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>{job.title} - {job.branch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {mockApplicants
                .filter((a) => selectedJobId === "all" || a.jobId === selectedJobId)
                .map((applicant) => {
                  const job = jobs.find((j) => j.id === applicant.jobId)
                  return (
                    <Card key={applicant.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{applicant.name}</h3>
                            <p className="text-sm text-muted-foreground">{applicant.email}</p>
                            <p className="text-sm text-muted-foreground">Applied for: {job?.title} at {job?.branch}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Applied: {new Date(applicant.appliedAt).toLocaleDateString()}</p>
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