import { useQuery } from "@tanstack/react-query";

import { getCertificateService } from "../services/certificate.service";

export function useCertificateService(code: string) {
  return useQuery({
    queryKey: ["certificate-service", code],
    queryFn: () => getCertificateService(code),
    enabled: !!code,
  });
}