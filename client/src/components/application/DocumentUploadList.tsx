import { useEffect } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, FileText, Eye, UploadCloud } from "lucide-react";

import {
  useDocuments,
  useUploadDocument,
} from "../../hooks/useDocument";

interface RequiredDocument {
  id: string;
  name: string;
  isMandatory: boolean;
}

interface Props {
  applicationId: string;
  requiredDocuments: RequiredDocument[];
  isSubmitted?: boolean;
  allowEdit?: boolean;
  onUploadStatusChange?: (uploaded: boolean) => void;
}

const DocumentUploadList = ({
  applicationId,
  requiredDocuments,
  isSubmitted = false,
  allowEdit = false,
  onUploadStatusChange,
}: Props) => {
  const { data: uploadedDocuments = [] } = useDocuments(applicationId);
  const uploadMutation = useUploadDocument(applicationId);

  useEffect(() => {
    if (!onUploadStatusChange) return;

    const mandatoryDocuments = requiredDocuments.filter((doc) => doc.isMandatory);
    const allUploaded = mandatoryDocuments.every((doc) =>
      uploadedDocuments.some((uploadedDoc) => uploadedDoc.requiredDocumentId === doc.id)
    );

    onUploadStatusChange(allUploaded);
  }, [uploadedDocuments, requiredDocuments, onUploadStatusChange]);

  async function handleFileChange(requiredDocumentId: string, file: File | null) {
    if (!file) return;

    try {
      await uploadMutation.mutateAsync({
        requiredDocumentId,
        file,
      });

      toast.success("Document uploaded successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed");
    }
  }

  const canUpload = !isSubmitted || allowEdit;

  return (
    <div className="space-y-4">
      {requiredDocuments.map((document) => {
        const uploaded = uploadedDocuments.find(
          (d) => d.requiredDocumentId === document.id
        );

        return (
          <div
            key={document.id}
            className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  {document.name}
                  {document.isMandatory && (
                    <span className="ml-1 text-rose-500 font-bold">* (Mandatory)</span>
                  )}
                </h3>
              </div>

              {uploaded ? (
                <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{uploaded.originalFileName}</span>
                </div>
              ) : (
                <p className="mt-1 text-xs text-slate-400">Not uploaded yet</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {uploaded && (
                <a
                  href={`http://localhost:5000/api/documents/file/${uploaded.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5" /> View File
                </a>
              )}

              {canUpload && (
                <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700">
                  <UploadCloud className="h-3.5 w-3.5" />
                  {uploaded ? "Replace File" : "Upload File"}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={uploadMutation.isPending}
                    className="hidden"
                    onChange={(e) => {
                      handleFileChange(document.id, e.target.files?.[0] ?? null);
                    }}
                  />
                </label>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DocumentUploadList;