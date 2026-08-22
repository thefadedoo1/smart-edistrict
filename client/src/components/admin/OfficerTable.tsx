import { Officer } from "../../types/officer";
import OfficerStatusBadge from "./OfficerStatusBadge";

interface Props {
  officers: Officer[];
  loading: boolean;
}

export default function OfficerTable({
  officers,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow">
        Loading officers...
      </div>
    );
  }

  if (officers.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow">
        <p className="text-gray-500">
          No officers found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-5 py-3 text-left font-semibold">
              Name
            </th>

            <th className="px-5 py-3 text-left font-semibold">
              Role
            </th>

            <th className="px-5 py-3 text-left font-semibold">
              District
            </th>

            <th className="px-5 py-3 text-left font-semibold">
              Tehsil
            </th>

            <th className="px-5 py-3 text-left font-semibold">
              Village
            </th>

            <th className="px-5 py-3 text-left font-semibold">
              Status
            </th>

            <th className="px-5 py-3 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {officers.map((officer) => (
            <tr
              key={officer.id}
              className="border-t transition hover:bg-gray-50"
            >
              <td className="px-5 py-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    {officer.fullName}
                  </p>

                  <p className="text-sm text-gray-500">
                    {officer.email}
                  </p>
                </div>
              </td>

              <td className="px-5 py-4">
                <span className="font-medium">
                  {officer.role}
                </span>
              </td>

              <td className="px-5 py-4">
                {officer.district?.name ?? "—"}
              </td>

              <td className="px-5 py-4">
                {officer.tehsil?.name ?? "—"}
              </td>

              <td className="px-5 py-4">
                {officer.role === "PATWARI"
                  ? officer.village?.name ?? "—"
                  : "—"}
              </td>

              <td className="px-5 py-4">
                <OfficerStatusBadge
                  active={officer.isActive}
                />
              </td>

              <td className="px-5 py-4 text-right whitespace-nowrap">
                <button className="mr-4 font-medium text-blue-600 transition hover:text-blue-800 hover:underline">
                  Edit
                </button>

                <button className="font-medium text-red-600 transition hover:text-red-800 hover:underline">
                  Disable
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}