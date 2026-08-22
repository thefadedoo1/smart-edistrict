import { useQuery } from "@tanstack/react-query";

import { getDepartments } from "../services/department.service";

export function useAdminDepartments() {
  return useQuery({
    queryKey: ["admin-departments"],
    queryFn: getDepartments,
  });
}