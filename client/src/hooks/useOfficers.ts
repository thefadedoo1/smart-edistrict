import { useQuery } from "@tanstack/react-query";
import { getOfficers } from "../services/officer.service";

export function useOfficers() {
  return useQuery({
    queryKey: ["officers"],
    queryFn: getOfficers,
  });
}