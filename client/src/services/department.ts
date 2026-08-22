import api from "./api";
import { DepartmentCatalog } from "../types/service";

interface ApiResponse {
  success: boolean;
  data: DepartmentCatalog[];
}

export async function getDepartmentCatalog(): Promise<DepartmentCatalog[]> {
  const response = await api.get<ApiResponse>("/departments/catalog");

  return response.data.data;
}