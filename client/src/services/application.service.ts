import api from "./api";
import { Application } from "../types/application";

/* ---------- Dynamic Form Types ---------- */
export interface DynamicField {
  id: string;
  label: string;
  fieldKey: string;
  fieldType:
    | "TEXT"
    | "NUMBER"
    | "DATE"
    | "TEXTAREA"
    | "SELECT"
    | "RADIO"
    | "CHECKBOX";
  placeholder?: string | null;
  defaultValue?: string | null;
  isRequired: boolean;
  displayOrder: number;
  options?: any;
}

export interface ServiceForm {
  id: string;
  title: string;
  description?: string | null;
  fields: DynamicField[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  isMandatory: boolean;
}

export interface CertificateServiceDetails {
  id: string;
  code: string;
  name: string;
  description: string | null;
  processingDays: number;
  form: ServiceForm | null;
  requiredDocuments: RequiredDocument[];
}

interface ApplicationFormResponse {
  success: boolean;
  data: CertificateServiceDetails;
}

export async function getApplicationForm(code: string) {
  const response = await api.get<ApplicationFormResponse>(
    `/certificate-services/${code}`
  );
  return response.data.data;
}

/* ---------- Create & Update Application ---------- */
export interface CreateApplicationRequest {
  certificateServiceId: string;
  formData: Record<string, any>;
  remarks?: string;
}

export interface UpdateApplicationRequest {
  formData?: Record<string, any>;
  remarks?: string;
}

interface CreateApplicationResponse {
  success: boolean;
  message: string;
  data: Application;
}

interface ApplicationResponse {
  success: boolean;
  data: Application;
}

export async function getApplicationById(id: string): Promise<Application> {
  const response = await api.get<ApplicationResponse>(`/applications/${id}`);
  return response.data.data;
}

export async function createApplication(payload: CreateApplicationRequest) {
  const response = await api.post<CreateApplicationResponse>(
    "/applications",
    payload
  );
  return response.data;
}

export async function updateApplication(id: string, payload: UpdateApplicationRequest) {
  const response = await api.patch<ApplicationResponse>(
    `/applications/${id}`,
    payload
  );
  return response.data;
}

export async function submitApplication(id: string) {
  const response = await api.patch(`/applications/${id}/submit`);
  return response.data;
}

export async function resubmitApplication(id: string, payload?: { remarks?: string }) {
  const response = await api.post(`/applications/${id}/resubmit`, payload || {});
  return response.data;
}

interface MyApplicationsResponse {
  success: boolean;
  data: Application[];
}

export async function getMyApplications(): Promise<Application[]> {
  const response = await api.get<MyApplicationsResponse>("/applications/my");
  return response.data.data;
}