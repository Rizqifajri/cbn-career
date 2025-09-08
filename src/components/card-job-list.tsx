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

export function CardJobList() {
  const router = useRouter()
  const search = useSearchParams()
  const { data, isLoading, isError } = useCareersQuery()

  const jobs: Job[] = useMemo(() => {
    if (!data) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data?.map((j: any) => ({
      id: String(j.id),
      branch: j.branch,
      title: j.title,
      location: j.location,
      role: j.role,
      type: j.type,
      image: j.posterImage || j.image || "", // API bisa pakai posterImage/image
      link: j.link ?? "",                    // ⬅️ ambil link dari API
      requirements: Array.isArray(j.requirements)
        ? j.requirements
        : typeof j.requirements === "string"
          ? j.requirements.split(/\r?\n/).filter(Boolean)
          : [],
    }))
  }, [data])

  // ====== SEARCH (via ?q=) ======
  const q = (search.get("q") ?? "").toLowerCase().trim()

  const filteredJobs: Job[] = useMemo(() => {
    if (!q) return jobs
    const match = (s: string) => s.toLowerCase().includes(q)
    return jobs.filter((j) => {
      const haystack = [
        j.title,
        j.branch,
        j.role,
        j.type,
        j.location,
        ...(Array.isArray(j.requirements) ? j.requirements : []),
      ].join(" ").toLowerCase()
      return haystack.includes(q)
    })
  }, [jobs, q])

  // ===== UI tetap sama; handle loading/error ringan =====
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null)

  const initial = useMemo(() => {
    if (!filteredJobs.length) return undefined
    const jobParam = search.get("job")
    if (jobParam) {
      return filteredJobs.find((j) => j.id === jobParam) ?? filteredJobs[0]
    }
    return filteredJobs[0]
  }, [search, filteredJobs])

  // kalau belum ada data, selected bisa undefined — jaga guard
  const [selected, setSelected] = useState<Job | undefined>(initial)

  useEffect(() => {
    if (!filteredJobs.length) return
    const jobParam = search.get("job")
    if (!jobParam) {
      // jika tidak ada query, pastikan selected diisi first filtered job
      setSelected((prev) => (prev && filteredJobs.some((j) => j.id === prev.id) ? prev : filteredJobs[0]))
      return
    }
    const found = filteredJobs.find((j) => j.id === jobParam)
    if (found) setSelected(found)
    else setSelected(filteredJobs[0])
  }, [search, filteredJobs])

  function selectJob(job: Job) {
    setSelected(job)
    router.replace(`?${new URLSearchParams({ ...(q ? { q } : {}), job: job.id }).toString()}`, { scroll: false })
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
      // buka di tab baru
      window.open(url, "_blank", "noopener,noreferrer")
    } else {
      alert("Apply: link belum tersedia.")
    }
  }

  // ----- loading & error state (tanpa ubah style utama) -----
  if (isLoading) {
    return (
      <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 mt-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
          <div className="h-24 bg-gray-100 animate-pulse rounded-md" />
        </div>
        <aside className="space-y-4">
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
          <Image src="/no-job.png" alt="404" width={500} height={500} className="w-auto h-auto mx-auto" />
        </div>
      </div>
    )
  }

  // pastikan selected ada setelah data ready
  const selectedJob = selected ?? filteredJobs[0]

  return (
    <div className="container mx-auto grid w-full grid-cols-1 gap-8 px-4 mt-10 lg:grid-cols-2">
      {/* LEFT: List (UI sama) */}
      <div className="space-y-6">
        {filteredJobs.map((job) => {
          const active = job.id === selectedJob.id
          const isExpanded = expandedMobile === job.id

          return (
            <div key={job.id} className="space-y-0">
              <div className="group grid grid-cols-[64px_1fr_88px] items-stretch sm:grid-cols-[72px_1fr_104px]">
                {/* Logo / brand block */}
                <button
                  type="button"
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleMobileExpand(job.id)
                    } else {
                      selectJob(job)
                    }
                  }}
                  className="flex h-full items-center justify-center bg-white border-r border-gray-300 focus:outline-none"
                  aria-label={`${job.branch}`}
                >
                  <LogoByBranch branch={job.branch} size={56} className="h-full w-full object-cover" />
                </button>

                {/* Middle content */}
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

                {/* Right chevron / close */}
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
                    <X className="relative z-10 mx-auto h-6 w-6 transition-all duration-300 ease-out group-hover:text-white sm:h-7 sm:w-7" />
                  ) : (
                    <ArrowRight className="relative z-10 mx-auto h-6 w-6 transition-all duration-300 ease-out group-hover:text-white group-hover:translate-x-1 sm:h-7 sm:w-7" />
                  )}
                </button>
              </div>

              {/* Mobile expanded content */}
              {isExpanded && (
                <div className="lg:hidden border-x border-b border-gray-300 px-4 py-6 space-y-4 animate-in slide-in-from-top-2 duration-300 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-2">
                  <header className="space-y-2">
                    <h1 className="font-serif text-2xl leading-tight">
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
                    <div className="overflow-hidden rounded-md border w-[200px] h-[100px] border-gray-200">
                      <Image
                        src={job.image}
                        alt={`${job.branch} hiring poster`}
                        width={640}
                        height={640}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}

                  <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Qualification & Requirements</h2>
                    <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
                      {job.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </section>

                  <Button
                    size="lg"
                    className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-lg"
                    onClick={() => goToApply(job.link)}  // ⬅️ pakai link
                  >
                    Apply Now <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* RIGHT: Detail (UI sama) */}
      <aside className={`space-y-4 ${expandedMobile ? "hidden lg:block" : "lg:block"}`}>
        <header className="space-y-2">
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">
            {selectedJob.branch} - {selectedJob.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedJob.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <User2 className="h-4 w-4" />
              {selectedJob.role}
            </span>
            <span className="inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {selectedJob.type}
            </span>
          </div>
        </header>

        {selectedJob.image ? (
          <div className="overflow-hidden rounded-md border border-gray-200 w-[300px]">
            <Image
              src={selectedJob.image}
              alt={`${selectedJob.branch} hiring poster`}
              width={640}
              height={360}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : null}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Qualification & Requirements</h2>
          <ul className="list-disc space-y-2 pl-5 text-md leading-relaxed">
            {selectedJob.requirements.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        <Button
          size="lg"
          className="cursor-pointer flex justify-center items-center gap-3 rounded-full px-8 py-4 text-lg"
          onClick={() => goToApply(selectedJob.link)}   // ⬅️ pakai link
        >
          Apply Now <ArrowRight className="h-5 w-5" />
        </Button>
      </aside>
    </div>
  )
}
