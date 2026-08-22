import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getDocuments,
  uploadDocument,
} from "../services/document.service";

export function useDocuments(
  applicationId: string
) {
  return useQuery({
    queryKey: ["documents", applicationId],

    queryFn: () =>
      getDocuments(applicationId),

    enabled: !!applicationId,
  });
}

export function useUploadDocument(
  applicationId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requiredDocumentId,
      file,
    }: {
      requiredDocumentId: string;
      file: File;
    }) =>
      uploadDocument(
        applicationId,
        requiredDocumentId,
        file
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "documents",
          applicationId,
        ],
      });
    },
  });
}