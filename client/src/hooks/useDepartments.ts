import { useQuery } from "@tanstack/react-query";
import { getDepartmentCatalog } from "../services/department";
import { DepartmentCatalog } from "../types/service";

export function useDepartments() {
  return useQuery<DepartmentCatalog[], Error>({
    queryKey: ["department-catalog"],
    queryFn: getDepartmentCatalog,
  });
}