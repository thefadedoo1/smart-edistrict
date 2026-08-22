import api from "./api";

export interface UploadedDocument {
  id: string;
  applicationId: string;
  requiredDocumentId: string;
  originalFileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;

  requiredDocument: {
    id: string;
    name: string;
    isMandatory: boolean;
  };
}

interface DocumentsResponse {
  success: boolean;
  data: UploadedDocument[];
}

export async function getDocuments(
  applicationId: string
) {
  const response =
    await api.get<DocumentsResponse>(
      `/documents/${applicationId}`
    );

  return response.data.data;
}

export async function uploadDocument(
  applicationId: string,
  requiredDocumentId: string,
  file: File
) {
  const formData = new FormData();

  formData.append(
    "requiredDocumentId",
    requiredDocumentId
  );

  formData.append("document", file);

  const response =
    await api.post(
      `/documents/${applicationId}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
}