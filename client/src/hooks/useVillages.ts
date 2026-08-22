
import { useQuery } from "@tanstack/react-query";

import { getVillagesByTehsil } from "../services/village.service";

export function useVillages(
  tehsilId?: string
) {
  return useQuery({
    queryKey: [
      "villages",
      tehsilId,
    ],

    queryFn: () =>
      getVillagesByTehsil(
        tehsilId!
      ),

    enabled: !!tehsilId,
  });
}
