import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import Card from "../ui/Card";
import ServiceCard from "./ServiceCard";
import { DepartmentCatalog } from "../../types/service";

interface DepartmentAccordionProps {
  department: DepartmentCatalog;
}

const DepartmentAccordion = ({
  department,
}: DepartmentAccordionProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between p-5 text-left"
      >
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {department.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {department.certificateServices.length} service
            {department.certificateServices.length !== 1 ? "s" : ""}
          </p>
        </div>

        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="grid gap-4 border-t bg-gray-50 p-5 md:grid-cols-2 xl:grid-cols-3">
          {department.certificateServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default DepartmentAccordion;