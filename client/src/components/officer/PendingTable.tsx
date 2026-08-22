import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import PriorityBadge from "./PriorityBadge";
import SLATimer from "./SLATimer";

interface Props {
  applications: any[];
}

const PendingTable = ({
  applications,
}: Props) => {
  const [search, setSearch] =
    useState("");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("ALL");

  const filteredApplications =
    useMemo(() => {
      return applications
        .filter((application) => {
          const keyword =
            search.toLowerCase();

          const matchesSearch =
            application.applicationNumber
              .toLowerCase()
              .includes(keyword) ||
            application.applicant.fullName
              .toLowerCase()
              .includes(keyword) ||
            application.certificateService.name
              .toLowerCase()
              .includes(keyword);

          let matchesPriority = true;

          switch (priorityFilter) {
            case "CRITICAL":
              matchesPriority =
                application.priority >=
                90;
              break;

            case "HIGH":
              matchesPriority =
                application.priority >=
                  70 &&
                application.priority <
                  90;
              break;

            case "MEDIUM":
              matchesPriority =
                application.priority >=
                  40 &&
                application.priority <
                  70;
              break;

            case "LOW":
              matchesPriority =
                application.priority <
                40;
              break;

            default:
              matchesPriority = true;
          }

          return (
            matchesSearch &&
            matchesPriority
          );
        })
        .sort(
          (a, b) =>
            b.priority - a.priority
        );
    }, [
      applications,
      search,
      priorityFilter,
    ]);

  if (applications.length === 0) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow">
        <h3 className="text-lg font-semibold">
          🎉 No Pending Applications
        </h3>

        <p className="mt-2 text-gray-500">
          All applications have been
          processed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Search & Filter */}

      <div className="flex flex-col gap-4 md:flex-row">

        <input
          type="text"
          placeholder="Search by Application Number, Citizen or Service..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
        />

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(
              e.target.value
            )
          }
          className="rounded-lg border px-4 py-2"
        >
          <option value="ALL">
            All Priority
          </option>

          <option value="CRITICAL">
            Critical
          </option>

          <option value="HIGH">
            High
          </option>

          <option value="MEDIUM">
            Medium
          </option>

          <option value="LOW">
            Low
          </option>
        </select>

      </div>

      {/* Table */}

      <div className="overflow-x-auto rounded-xl bg-white shadow">

        <table className="min-w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-6 py-4 text-left">
                Priority
              </th>

              <th className="px-6 py-4 text-left">
                Application
              </th>

              <th className="px-6 py-4 text-left">
                Citizen
              </th>

              <th className="px-6 py-4 text-left">
                Service
              </th>

              <th className="px-6 py-4 text-left">
                SLA
              </th>

              <th className="px-6 py-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredApplications.length ===
            0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-500"
                >
                  No applications found.
                </td>
              </tr>
            ) : (
              filteredApplications.map(
                (
                  application
                ) => (
                  <tr
                    key={
                      application.id
                    }
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4">

                      <PriorityBadge
                        priority={
                          application.priority
                        }
                        isEscalated={
                          application.isEscalated
                        }
                      />

                    </td>

                    <td className="px-6 py-4">

                      <div className="font-semibold">
                        {
                          application.applicationNumber
                        }
                      </div>

                      <div className="text-sm text-gray-500">
                        {
                          application.currentStage
                        }
                      </div>

                    </td>

                    <td className="px-6 py-4">

                      {
                        application
                          .applicant
                          .fullName
                      }

                    </td>

                    <td className="px-6 py-4">

                      {
                        application
                          .certificateService
                          .name
                      }

                    </td>

                    <td className="px-6 py-4">

                      <SLATimer
                        deadline={
                          application.stageDeadline
                        }
                      />

                    </td>

                    <td className="px-6 py-4 text-center">

                      <Link
                        to={`/officer/applications/${application.id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
                      >
                        Review
                      </Link>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default PendingTable;