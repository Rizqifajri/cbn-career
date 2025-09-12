// hooks/mutations/use-add-career.ts
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type AddCareerPayload = {
  branch: string
  title: string
  location: string
  role: string
  type: string
  image?: File
  requirements: string[]
}

async function addCareer(data: AddCareerPayload | FormData) {
  let response: Response

  if (data instanceof FormData) {
    response = await fetch("/api/career", {
      method: "POST",
      body: data,
    })
  } else {
    response = await fetch("/api/career", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Request failed" }))
    throw new Error(errorData.message || "Failed to create career")
  }

  const result = await response.json()
  return result?.data ?? result
}

export function useAddCareerMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addCareer,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["career"] })
    },
  })
}
