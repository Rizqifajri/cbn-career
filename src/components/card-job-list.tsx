"use client"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, MapPin, User2, Briefcase, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoByBranch } from "./logo-by-branch"
import { useCareersQuery } from "@/hooks/queries/use-get-career"

type Job = {
  id: string
  branch: "Cretivox" | "OGS" | "Condfe" | (string & {})
  title: string
  location: string
  role: string
  type: string
  image?: string
  requirements: string[]
  link: string
}

function JobDetail({ job, onApply }: { job: Job; onApply: (link?: string) => void }) {
  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h1 className="font-serif text-2xl lg:text-3xl leading-tight">
          {job.branch} - {job.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-2">
            <User2 className="h-4 w-4" />
            {job.role}
          </span>
          <span className="inline-flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            {job.type}
          </span>
        </div>
      </header>

      {job.image ? (
        <div className="overflow-hidden rounded-md border border-gray-200 w-[300px] lg:w-[320px]">
          <Image
            src={job.image}
            alt={`${job.branch} hiring poster`}
            width={640}
            height={360}
            className="w-full h-auto object-cover"
          />
        </div>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Qualification & Requirements</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm lg:text-md leading-relaxed">
          {job.requirements.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      <Button
        size="lg"
        className="cursor-pointer flex justify-center items-center gap-3 rounded-full px-8 py-4 text-lg"
        onClick={() => onApply(job.link)}
      >
        Apply Now <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  )
}

export function CardJobList() {
  const router = useRouter()
  const search = useSearchParams()
  const { data, isLoading, isError } = useCareersQuery()

  const jobs: Job[] = useMemo(() => {
    if (!data) return []

    return data?.map((j: Job) => ({
      id: String(j.id),
      branch: j.branch,
      title: j.title,
      location: j.location,
      role: j.role,
      type: j.type,
      image: j.image || "",
      link: j.link ?? "",
      requirements: Array.isArray(j.requirements)
        ? j.requirements
        : typeof j.requirements === "string"
        ? (j.requirements as string).split(/\r?\n/).filter(Boolean)
        : [],
    }))
  }, [data])

  const q = (search.get("q") ?? "").toLowerCase().trim()

  const filteredJobs: Job[] = useMemo(() => {
    if (!q) return jobs
    return jobs.filter((j) => {
      const haystack = [
        j.title,
        j.branch,
        j.role,
        j.type,
        j.location,
        ...(Array.isArray(j.requirements) ? j.requirements : []),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [jobs, q])

  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  const initial = useMemo(() => {
    if (!filteredJobs.length) return undefined
    const jobParam = search.get("job")
    if (jobParam) {
      return filteredJobs.find((j) => j.id === jobParam) ?? filteredJobs[0]
    }
    return filteredJobs[0]
  }, [search, filteredJobs])

  const [selected, setSelected] = useState<Job | undefined>(initial)

  useEffect(() => {
    if (!filteredJobs.length) return
    const jobParam = search.get("job")
    if (!jobParam) {
      setSelected((prev) =>
        prev && filteredJobs.some((j) => j.id === prev.id) ? prev : filteredJobs[0]
      )
      return
    }
    const found = filteredJobs.find((j) => j.id === jobParam)
    if (found) setSelected(found)
    else setSelected(filteredJobs[0])
  }, [search, filteredJobs])

  function selectJob(job: Job) {
    setSelected(job)
    router.replace(
      `?${new URLSearchParams({ ...(q ? { q } : {}), job: job.id }).toString()}`,
      { scroll: false }
    )
  }

  function toggleMobileExpand(jobId: string) {
    if (expandedMobile === jobId) {
      setExpandedMobile(null)
    } else {
      setExpandedMobile(jobId)
      const found = filteredJobs.find((j) => j.id === jobId)
      if (found) selectJob(found)
    }
  }

  function goToApply(link?: string) {
    const url = (link || "").trim()
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    } else {
      alert("Apply: link belum tersedia.")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 mt-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
        </div>
        <aside className="space-y-4 hidden lg:block">
          <div className="h-40 bg-gray-100 animate-pulse rounded-md" />
        </aside>
      </div>
    )
  }

  if (isError || !jobs.length || !filteredJobs.length) {
    return (
      <div className="container mx-auto">
        <div className="mt-24">
          <p className="font-regular text-center text-foreground text-3xl font-serif">
            Ups.. Sorry there is no job available
          </p>
          <Image
            src="/no-job.png"
            alt="404"
            width={500}
            height={500}
            className="w-auto h-auto mx-auto"
          />
        </div>
      </div>
    )
  }

  const selectedJob = selected ?? filteredJobs[0]

  return (
    <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 mt-10 lg:grid-cols-2">
      {/* LEFT: Job List */}
      <div className="space-y-6">
        {filteredJobs.map((job) => {
          const active = job.id === selectedJob.id
          const isExpanded = expandedMobile === job.id

          return (
            <div id="work" key={job.id} className="space-y-0">
              <div className="group grid grid-cols-[1fr_88px] sm:grid-cols-[1fr_104px] md:grid-cols-[64px_1fr_88px] lg:grid-cols-[72px_1fr_104px]">
                {/* Logo - hanya tampil mulai md */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleMobileExpand(job.id)
                    } else {
                      selectJob(job)
                    }
                  }}
                  className="hidden md:flex h-full items-center justify-center bg-white border-r border-gray-300 focus:outline-none object-cover"
                  aria-label={`${job.branch}`}
                >
                  <LogoByBranch className="object-cover" branch={job.branch} size={56} />
                </button>

                {/* Content */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleMobileExpand(job.id)
                    } else {
                      selectJob(job)
                    }
                  }}
                  className="border-y border-gray-300 px-4 py-3 text-left sm:px-6 sm:py-4 focus:outline-none"
                  aria-current={active ? "true" : undefined}
                >
                  <h3 className="font-serif text-2xl leading-tight sm:text-3xl">
                    {job.branch} - {job.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <User2 className="h-4 w-4" />
                      {job.role}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </span>
                  </div>
                </button>

                {/* Expand / Chevron */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleMobileExpand(job.id)
                    } else {
                      selectJob(job)
                    }
                  }}
                  aria-label={isExpanded ? `Close ${job.title}` : `Open ${job.title}`}
                  className={`-ml-px h-full w-full relative overflow-hidden bg-gray-100 text-gray-600 transition-all duration-300 ease-out focus:outline-none ${
                    active ? "ring-1 ring-black" : ""
                  }`}
                >
                  <div className="absolute inset-0 bg-black transform translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0" />
                  {isExpanded ? (
                    <X className="relative z-10 mx-auto h-6 w-6 group-hover:text-white sm:h-7 sm:w-7" />
                  ) : (
                    <ArrowRight className="relative z-10 mx-auto h-6 w-6 group-hover:text-white group-hover:translate-x-1 sm:h-7 sm:w-7" />
                  )}
                </button>
              </div>

              {/* Mobile expanded detail */}
              {isExpanded && (
                <div className="lg:hidden border-x border-b border-gray-300 px-4 py-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                  <JobDetail job={job} onApply={goToApply} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* RIGHT: Aside (desktop only) */}
      <aside className="hidden lg:block">
        <JobDetail job={selectedJob} onApply={goToApply} />
      </aside>
    </div>
  )
}
