import { useParams } from "react-router-dom";

import Card from "../../components/ui/Card";
import { useWorkflowHistory } from "../../hooks/useWorkflow";

const HistoryPage = () => {
  const { id = "" } = useParams();

  const {
    data,
    isLoading,
    error,
  } = useWorkflowHistory(id);

  if (isLoading) {
    return (
      <div className="p-6">
        Loading history...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-600">
        Failed to load workflow history.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Card className="p-6">
        <h1 className="mb-6 text-3xl font-bold">
          Workflow History
        </h1>

        {data.length === 0 ? (
          <p className="text-gray-500">
            No workflow history found.
          </p>
        ) : (
          <div className="space-y-6">
            {data.map((item: any) => (
              <div
                key={item.id}
                className="border-l-4 border-blue-600 pl-4"
              >
                <h3 className="font-semibold">
                  {item.action}
                </h3>

                <p className="text-sm text-gray-600">
                  {item.officer.fullName}
                  {" • "}
                  {item.officer.role}
                </p>

                <p className="mt-2 text-sm">
                  From:{" "}
                  <strong>
                    {item.fromStage}
                  </strong>
                </p>

                <p className="text-sm">
                  To:{" "}
                  <strong>
                    {item.toStage}
                  </strong>
                </p>

                {item.remarks && (
                  <p className="mt-2">
                    {item.remarks}
                  </p>
                )}

                <p className="mt-2 text-xs text-gray-500">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default HistoryPage;