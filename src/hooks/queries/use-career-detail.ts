  // hooks/queries/use-career-detail.ts
import { useQuery } from "@tanstack/react-query"
import { instance } from "@/lib/axios"

export type Career = {
  id: number | string
  branch: string
  title: string
  location: string
  role: string
  type: string
  image?: string
  posterImage?: string
  requirements: string[] | string
}

async function getCareerById(id: number | string): Promise<Career> {
  const res = await instance.get(`/career/${id}`)
  const payload = res.data
  // server shape: { message, data }
  return payload?.data ?? payload
}

export function useCareerDetailQuery(id: number | string, enabled = true) {
  return useQuery({
    queryKey: ["career", "detail", id],
    queryFn: () => getCareerById(id),
    enabled: Boolean(id) && enabled,
  })
}
