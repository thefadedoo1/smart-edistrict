import { useQuery } from "@tanstack/react-query";
import { getMyApplications } from "../services/application.service";

export function useMyApplications() {
  return useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
  });
}
