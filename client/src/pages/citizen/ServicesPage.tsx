import { useMemo, useState } from "react";

import DepartmentAccordion from "../../components/services/DepartmentAccordion";
import SearchBar from "../../components/services/SearchBar";
import { useDepartments } from "../../hooks/useDepartments";
import { DepartmentCatalog } from "../../types/service";

const ServicesPage = () => {
  const { data = [], isLoading, error } = useDepartments();

  const [search, setSearch] = useState("");

  const filteredDepartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data
      .map((department) => ({
        ...department,
        certificateServices: department.certificateServices.filter(
          (service) =>
            service.name.toLowerCase().includes(query) ||
            (service.description ?? "")
              .toLowerCase()
              .includes(query)
        ),
      }))
      .filter(
        (department) =>
          department.certificateServices.length > 0
      );
  }, [data, search]);

  if (isLoading) {
    return (
      <div className="p-6">
        Loading government services...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load government services.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Government Services
        </h1>

        <p className="mt-2 text-gray-600">
          Browse available services and submit applications online.
        </p>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {filteredDepartments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-500">
          No services found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDepartments.map(
            (department: DepartmentCatalog) => (
              <DepartmentAccordion
                key={department.id}
                department={department}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;