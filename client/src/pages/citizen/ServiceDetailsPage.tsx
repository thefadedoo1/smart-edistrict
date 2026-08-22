import { useNavigate, useParams } from "react-router-dom";
import { Clock3, Building2, FileText } from "lucide-react";

import Card from "../../components/ui/Card";
import { useCertificateService } from "../../hooks/useCertificateService";

const ServiceDetailsPage = () => {
  const navigate = useNavigate();

  const { code = "" } = useParams();

  const {
    data: service,
    isLoading,
    error,
  } = useCertificateService(code);

  if (isLoading) {
    return (
      <div className="p-6">
        Loading service details...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="p-6 text-red-600">
        Failed to load service details.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {service.name}
        </h1>

        <p className="mt-2 text-gray-600">
          {service.description}
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-600" />

            <div>
              <p className="text-sm text-gray-500">
                Department
              </p>

              <p className="font-semibold">
                {service.department?.name || "Revenue Department"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Clock3 className="text-amber-500" />

            <div>
              <p className="text-sm text-gray-500">
                Processing Time
              </p>

              <p className="font-semibold">
                {service.processingDays} Days
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Required Documents */}
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText className="text-blue-600" />

          <h2 className="text-xl font-semibold">
            Required Documents
          </h2>
        </div>

        <ul className="space-y-3">
          {(service.requiredDocuments || []).map((document: any) => (
            <li
              key={document.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span>{document.name}</span>

              {document.isMandatory ? (
                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  Mandatory
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  Optional
                </span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      {/* Start Application */}
      <div className="flex justify-end">
        <button
          onClick={() =>
            navigate(`/apply/${service.code}`)
          }
          className="
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
          "
        >
          Start Application
        </button>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;