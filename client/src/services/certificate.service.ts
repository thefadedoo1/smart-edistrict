import api from "./api";

export interface CitizenCertificate {
  id: string;
  applicationNumber: string;
  certificateNumber: string;
  serviceName: string;
  serviceCode: string;
  issuedAt: string;
  issuedBy: string;
  certificateUrl: string;
  downloadUrl: string;
  viewUrl: string;
  verifyUrl: string;
}

interface CertificatesResponse {
  success: boolean;
  data: CitizenCertificate[];
}

export async function getMyCertificates(): Promise<CitizenCertificate[]> {
  const response = await api.get<CertificatesResponse>("/certificates/my");
  return response.data.data;
}

export async function verifyCertificate(certificateNumber: string) {
  const response = await api.get(`/certificates/verify/${certificateNumber}`);
  return response.data.data;
}

export async function getCertificateService(code: string) {
  const response = await api.get(`/certificate-services/${code}`);
  return response.data.data;
}