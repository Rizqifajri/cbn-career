import { useQuery } from "@tanstack/react-query";
import { instance } from "@/lib/axios";

async function getCareers() {
  const res = await instance.get("/career");
  const payload = res.data
  return Array.isArray(payload) ? payload : payload?.data ?? []
}

export function useCareersQuery() {
  return useQuery({
    queryKey: ["career"],
    queryFn: getCareers,
  });
}
