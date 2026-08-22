import { useQuery } from "@tanstack/react-query";
import { getMyCertificates } from "../services/certificate.service";

export function useCertificates() {
  return useQuery({
    queryKey: ["my-certificates"],
    queryFn: getMyCertificates,
  });
}
