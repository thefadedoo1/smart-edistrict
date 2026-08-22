import api from "./api";

import {
  Officer,
  CreateOfficerPayload,
} from "../types/officer";

export async function getOfficers() {
  const response = await api.get<{
    success: boolean;
    data: Officer[];
  }>("/officers");

  return response.data;
}

export async function getOfficer(
  id: string
) {
  const response = await api.get<{
    success: boolean;
    data: Officer;
  }>(`/officers/${id}`);

  return response.data;
}

export async function createOfficer(
  data: CreateOfficerPayload
) {
  const response = await api.post(
    "/officers",
    data
  );

  return response.data;
}

export async function updateOfficer(
  id: string,
  data: Partial<CreateOfficerPayload>
) {
  const response = await api.patch(
    `/officers/${id}`,
    data
  );

  return response.data;
}

export async function deleteOfficer(
  id: string
) {
  const response = await api.delete(
    `/officers/${id}`
  );

  return response.data;
}