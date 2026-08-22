import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createOfficer } from "../services/officer.service";

export function useCreateOfficer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOfficer,

    onSuccess: (response) => {
      toast.success(
        response.message ?? "Officer created successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["officers"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to create officer."
      );
    },
  });
}