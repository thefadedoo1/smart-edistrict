import { useQuery } from "@tanstack/react-query";

import { getDistricts } from "../services/district.service";

export function useDistricts() {
  return useQuery({
    queryKey: ["districts"],
    queryFn: getDistricts,
  });
}