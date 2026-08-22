import { useMemo, useState } from "react";

import { useOfficers } from "../../hooks/useOfficers";

import OfficerTable from "../../components/admin/OfficerTable";
import OfficerModal from "../../components/admin/OfficerModal";
import OfficerFilters from "../../components/admin/OfficerFilters";

export default function OfficerManagementPage() {
  const { data, isLoading } = useOfficers();

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [role, setRole] = useState("");

  const filteredOfficers = useMemo(() => {
    const officers = data?.data ?? [];

    return officers.filter((officer) => {
      const matchesSearch =
        officer.fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        officer.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesRole =
        role === "" || officer.role === role;

      return matchesSearch && matchesRole;
    });
  }, [data, search, role]);

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Officer Management
          </h1>

          <p className="mt-1 text-gray-500">
            Create and manage DA, Patwari and Tehsildar accounts.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
        >
          + Add Officer
        </button>

      </div>

      <OfficerFilters
        search={search}
        setSearch={setSearch}
        role={role}
        setRole={setRole}
      />

      <OfficerTable
        officers={filteredOfficers}
        loading={isLoading}
      />

      <OfficerModal
        open={open}
        onClose={() => setOpen(false)}
      />

    </div>
  );
}