export interface CertificateService {
  id: string;
  code: string;
  name: string;
  description: string | null;
  processingDays: number;
}

export interface DepartmentCatalog {
  id: string;
  name: string;
  code: string;
  certificateServices: CertificateService[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  isMandatory: boolean;
  displayOrder: number;
}

export interface CertificateServiceDetails {
  id: string;
  code: string;
  name: string;
  description: string | null;
  processingDays: number;

  department: {
    id: string;
    code: string;
    name: string;
  };

  requiredDocuments: RequiredDocument[];
}