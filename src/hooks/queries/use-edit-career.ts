import { instance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// hooks/mutations/use-edit-career.ts
async function editCareer(id: number | string, data: FormData) {
  const res = await instance.put(`/career/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data ?? res.data;
}

export function useEditCareerMutation(id: number | string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => editCareer(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["career"] });
      qc.invalidateQueries({ queryKey: ["career", "detail", id] });
    },
  });
}
