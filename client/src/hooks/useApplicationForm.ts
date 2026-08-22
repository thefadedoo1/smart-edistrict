import { useMutation, useQuery } from "@tanstack/react-query";

import {
  createApplication,
  getApplicationById,
  getApplicationForm,
  submitApplication,
  type CreateApplicationRequest,
} from "../services/application.service";

export function useApplicationForm(code: string) {
  return useQuery({
    queryKey: ["application-form", code],

    queryFn: () => getApplicationForm(code),

    enabled: !!code,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ["application", id],

    queryFn: () => getApplicationById(id),

    enabled: !!id,
  });
}

export function useCreateApplication() {
  return useMutation({
    mutationFn: (data: CreateApplicationRequest) =>
      createApplication(data),
  });
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: (id: string) =>
      submitApplication(id),
  });
}