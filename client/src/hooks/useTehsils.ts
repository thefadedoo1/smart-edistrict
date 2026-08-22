import { useQuery } from "@tanstack/react-query";

import { getTehsilsByDistrict } from "../services/tehsil.service";

export function useTehsils(
  districtId?: string
) {
  return useQuery({
    queryKey: [
      "tehsils",
      districtId,
    ],

    queryFn: () =>
      getTehsilsByDistrict(
        districtId!
      ),

    enabled: !!districtId,
  });
}