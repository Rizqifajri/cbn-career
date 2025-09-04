export type Job = {
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

export type ApiJob = Partial<Job> & { id: string | number; requirements?: string[] | string; image?: string }