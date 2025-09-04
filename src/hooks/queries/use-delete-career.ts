// hooks/mutations/use-delete-career.ts
import { instance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteCareer(id: number | string) {
  const res = await instance.delete(`/career/${id}`);
  return res.status === 204 ? {} : (res.data?.data ?? res.data);
}

export function useDeleteCareerMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCareer,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["career"] }),
  });
}
