// hooks/mutations/use-edit-career.ts
import { instance } from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"


export type EditCareerPayload = Partial<{
  branch: string
  title: string
  location: string
  role: string
  type: string
  image?: string
  requirements: string[] | string
}>

async function editCareer(id: number | string, data: EditCareerPayload) {
  const res = await instance.put(`/career/${id}`, data)
  const payload = res.data
  return payload?.data ?? payload
}

export function useEditCareerMutation(id: number | string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: EditCareerPayload) => editCareer(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["career"] })
      qc.invalidateQueries({ queryKey: ["career", "detail", id] })
    },
  })
}
