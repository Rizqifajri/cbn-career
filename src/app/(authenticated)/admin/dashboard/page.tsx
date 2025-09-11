"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Users, Eye, Briefcase, LogOut } from "lucide-react"

import { useCareersQuery } from "@/hooks/queries/use-get-career"
import { useDeleteCareerMutation } from "@/hooks/queries/use-delete-career"
import JobFormEdit from "@/components/job-edit-form"
import JobFormCreate from "@/components/job-create-form"
import Image from "next/image"
import { toast } from "sonner"

type Job = {
  id: string
  branch: string
  title: string
  location: string
  role: string
  type: string
  requirements: string[]
  applicants?: number
  image?: string // Ubah dari File ke string
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
  
  // PERBAIKAN: Langsung gunakan data dari API tanpa local state jobs
  const normalizedJobs: Job[] = useMemo(() => {
    const arr = Array.isArray(apiData) ? apiData : (apiData?.data ?? [])
    return arr.map((j: any) => ({
      id: String(j.id),
      branch: j.branch ?? "",
      title: j.title ?? "",
      location: j.location ?? "",
      role: j.role ?? "",
      type: j.type ?? "",
      image: j.image || undefined, // PERBAIKAN: Hapus duplikasi
      applicants: j.applicants ?? 0,
      requirements: Array.isArray(j.requirements)
        ? j.requirements
        : typeof j.requirements === "string"
          ? j.requirements.split(/\r?\n/).filter(Boolean)
          : [],
      link: j.link ?? "",
    }))
  }, [apiData])

  // mutations
  const { mutateAsync: deleteCareer, isPending: deleting } = useDeleteCareerMutation()

  // Handle image upload with preview
  const MAX_FILE_MB = 2
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const mb = file.size / (1024 * 1024)
    if (mb > MAX_FILE_MB) {
      toast.error(`File is too large (${mb.toFixed(2)} MB). Maks ${MAX_FILE_MB}MB.`)
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
      toast.error("Please fill in all required fields")
      return
    }

    const requirementsArray = formData.requirements
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean)
    if (!requirementsArray.length) {
      toast.error("Please add at least one requirement")
      return
    }

    // For new jobs, require image upload
    if (!editingJob && !selectedFile) {
      toast.error("Please upload an image")
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
          method: "PUT",
          body: formDataToSend,
        })
      } else {
        // Create new job
        response = await fetch("/api/career", {
          method: "POST",
          body: formDataToSend,
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Request failed" }))
        throw new Error(errorData.message || `${editingJob ? "Update" : "Create"} failed`)
      }

      const saved = await response.json()
      console.log("Response from server:", saved) // Debug log

      // PERBAIKAN: Langsung refetch data dari server, jangan update local state
      toast.success(editingJob ? "Job updated successfully" : "Job created successfully")
      
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
      setEditingJob(null)

      // Reset file input
      const fileInput = document.getElementById("posterUpload") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      // PERBAIKAN: Refetch data dari server untuk mendapatkan data terbaru
      await refetch()
      setCurrentView("jobs")

    } catch (err: any) {
      const msg = err?.message || "Submit failed"
      toast.error(msg)
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
    setPreviewUrl(job.image || "")
    setSelectedFile(null)
    setCurrentView("create")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return
    try {
      await deleteCareer(id)
      await refetch() // PERBAIKAN: Refetch setelah delete
      toast.success("Job deleted successfully")
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete job"
      toast.error(msg)
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

  // PERBAIKAN: Callback untuk JobFormEdit
  const handleEditSuccess = async () => {
    setCurrentView("jobs")
    setEditingJob(null)
    await refetch() // Refetch data terbaru
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
                Jobs ({normalizedJobs.length || 0})
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
                <Button
                  onClick={() => {
                    setCurrentView("create")
                    resetForm()
                  }}
                  className="flex items-center gap-2"
                >
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
                    No Jobs found. Gagal memuat data dari API{error instanceof Error ? `: ${error.message}` : ""}.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && (
              <div className="grid gap-4">
                {normalizedJobs.map((job) => (
                  <Card key={`${job.id}-${job.image}`} className="border border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          {job.image && (
                            <div className="flex-shrink-0">
                              <Image
                                src={job.image}
                                alt={`${job.title} hiring poster`}
                                width={200}
                                height={200}
                                className="w-20 h-20 object-cover rounded-lg border"
                                key={job.image} // PERBAIKAN: Force re-render saat URL berubah
                                unoptimized // PERBAIKAN: Disable Next.js optimization untuk external images
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
            {editingJob ? (
              <JobFormEdit
                key={`edit-${editingJob.id}-${editingJob.image}`} // Force re-mount saat image berubah
                job={editingJob}
                onSuccess={handleEditSuccess} // PERBAIKAN: Gunakan callback yang tepat
              />
            ) : (
              <JobFormCreate
                onSuccess={() => {
                  setCurrentView("jobs")
                  refetch()
                }}
              />
            )}
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
                  {normalizedJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {mockApplicants
                .filter((a) => selectedJobId === "all" || a.jobId === selectedJobId)
                .map((applicant) => {
                  const job = normalizedJobs.find((j) => j.id === applicant.jobId)
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