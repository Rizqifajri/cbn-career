"use client"

import type React from "react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Plus, Users, Eye, Briefcase, LogOut } from "lucide-react"

import { useCareersQuery } from "@/hooks/queries/use-get-career"
import { useDeleteCareerMutation } from "@/hooks/queries/use-delete-career"
import JobFormEdit from "@/components/job-edit-form"
import JobFormCreate from "@/components/job-create-form"
import ConfirmDeleteModal from "@/components/confirm-delete-modal"
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
  image?: string
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

// Utility function untuk menambahkan cache buster
const addCacheBuster = (imageUrl: string): string => {
  if (!imageUrl) return imageUrl
  const separator = imageUrl.includes('?') ? '&' : '?'
  return `${imageUrl}${separator}t=${Date.now()}`
}

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<"jobs" | "create" | "applicants">("jobs")
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string>("all")
  const [imageRefreshKey, setImageRefreshKey] = useState(0)
  
  // State untuk Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // fetch list
  const { data: apiData, isLoading, isError, error, refetch } = useCareersQuery()
  
  // Langsung gunakan data dari API tanpa local state jobs
  const normalizedJobs: Job[] = useMemo(() => {
    const arr = Array.isArray(apiData) ? apiData : (apiData?.data ?? [])
    return arr.map((j: Job) => ({
      id: String(j.id),
      branch: j.branch ?? "",
      title: j.title ?? "",
      location: j.location ?? "",
      role: j.role ?? "",
      type: j.type ?? "",
      image: j.image ? addCacheBuster(j.image) : undefined, // Add cache buster
      applicants: j.applicants ?? 0,
      requirements: Array.isArray(j.requirements)
        ? j.requirements
        : typeof j.requirements === "string"
          ? (j.requirements as string).split(/\r?\n/).filter(Boolean)
          : [],
      link: j.link ?? "",
    }))
  }, [apiData, imageRefreshKey]) // Add imageRefreshKey dependency

  // mutations
  const { mutateAsync: deleteCareer, isPending: deleting } = useDeleteCareerMutation()

  // Handle Delete Modal
  const handleDelete = (job: Job) => {
    setJobToDelete(job)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return
    
    try {
      await deleteCareer(jobToDelete.id)
      await refetch()
      setImageRefreshKey(prev => prev + 1) // Force refresh images
      toast.success("Job deleted successfully")
      setIsDeleteModalOpen(false)
      setJobToDelete(null)
    } catch (err) {
      let msg = "Failed to delete job";
      if (err && typeof err === "object") {
        if ("response" in err && err.response && typeof err.response === "object" && "data" in err.response && err.response.data && typeof err.response.data === "object" && "message" in err.response.data) {
          msg = (err.response.data as { message?: string }).message || msg;
        } else if ("message" in err && typeof err.message === "string") {
          msg = err.message;
        }
      }
      toast.error(msg);
    }
  }

  const handleDeleteCancel = () => {
    if (!deleting) {
      setIsDeleteModalOpen(false)
      setJobToDelete(null)
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

  const handleEdit = async (job: Job) => {
    console.log("Editing job:", job.id, "with image:", job.image)
    
    // Refetch data terbaru sebelum edit untuk memastikan dapat data yang paling baru
    await refetch()
    setImageRefreshKey(prev => prev + 1) // Force refresh images
    
    // Cari job dengan data terbaru
    const latestJobData = normalizedJobs.find(j => j.id === job.id) || job
    console.log("Latest job data for edit:", latestJobData)
    
    setEditingJob(latestJobData)
    setCurrentView("create")
  }

  // Callback untuk JobFormEdit
  const handleEditSuccess = async () => {
    console.log("Edit success, refreshing data...")
    // Refetch data terbaru dulu
    await refetch()
    setImageRefreshKey(prev => prev + 1) // Force refresh images
    setEditingJob(null)
    setCurrentView("jobs")
  }

  // Callback untuk JobFormCreate
  const handleCreateSuccess = async () => {
    console.log("Create success, refreshing data...")
    await refetch()
    setImageRefreshKey(prev => prev + 1) // Force refresh images
    setCurrentView("jobs")
  }

  const resetForm = () => {
    setEditingJob(null)
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
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    await refetch()
                    setImageRefreshKey(prev => prev + 1)
                  }} 
                  className="bg-transparent"
                >
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
                  <p className="text-sm text-gray-800">
                    No Jobs found. Please create a new job.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && (
              <div className="grid gap-4">
                {normalizedJobs.map((job) => (
                  <Card key={`job-${job.id}-${imageRefreshKey}`} className="border border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          {job.image && (
                            <div className="flex-shrink-0">
                              <Image
                                key={`image-${job.id}-${imageRefreshKey}-${job.image}`}
                                src={job.image}
                                alt={`${job.title} hiring poster`}
                                width={200}
                                height={200}
                                className="w-20 h-20 object-cover rounded-lg border"
                                unoptimized
                                onError={(e) => {
                                  console.error("Image load error:", job.image)
                                  // Fallback atau hide image on error
                                }}
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
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(job)}>
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
                key={`edit-form-${editingJob.id}-${imageRefreshKey}`}
                job={editingJob}
                onSuccess={handleEditSuccess}
              />
            ) : (
              <JobFormCreate
                key={`create-form-${imageRefreshKey}`}
                onSuccess={handleCreateSuccess}
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

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
        title="Delete Job Position"
        description="This action cannot be undone. This will permanently delete the job position and all associated data."
        itemName={
          jobToDelete
            ? `${jobToDelete.title} - ${jobToDelete.branch}`
            : undefined
        }
      />
    </div>
  )
}