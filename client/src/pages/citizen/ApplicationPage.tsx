import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import toast from "react-hot-toast";

import Card from "../../components/ui/Card";
import DynamicForm from "../../components/application/DynamicForm";
import { AuthContext } from "../../context/AuthContext";

import {
  useApplicationForm,
  useCreateApplication,
} from "../../hooks/useApplicationForm";

const ApplicationPage = () => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const { code = "" } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useApplicationForm(code);

  const createApplicationMutation =
    useCreateApplication();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading application...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-600">
        Failed to load application form.
      </div>
    );
  }

  const handleSubmit = (
    formData: Record<string, any>
  ) => {
    createApplicationMutation.mutate(
      {
        certificateServiceId: data.id,
        formData,
      },
      {
        onSuccess: (response) => {
          toast.success(response.message);

          navigate(
            `/applications/${response.data.id}`
          );
        },

        onError: (error: any) => {
          toast.error(
            error.response?.data?.message ||
              "Failed to submit application"
          );
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {data.name}
        </h1>

        <p className="mt-2 text-gray-600">
          {data.form?.title}
        </p>

        {data.form?.description && (
          <p className="mt-1 text-sm text-gray-500">
            {data.form.description}
          </p>
        )}
      </div>

      <Card className="p-8">
        {data.form ? (
          <DynamicForm
            fields={data.form.fields}
            onSubmit={handleSubmit}
            loading={createApplicationMutation.isPending}
            citizenFullName={user?.fullName || ""}
          />
        ) : (
          <div className="py-10 text-center text-gray-500">
            No application form has been configured for
            this service.
          </div>
        )}
      </Card>
    </div>
  );
};

export default ApplicationPage;