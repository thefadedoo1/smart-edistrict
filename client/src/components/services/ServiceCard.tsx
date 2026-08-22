import { ArrowRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../ui/Card";
import { CertificateService } from "../../types/service";

interface ServiceCardProps {
  service: CertificateService;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {service.name}
        </h3>

        <p className="mt-2 text-sm text-gray-500 leading-6">
          {service.description || "No description available."}
        </p>

        <div className="flex items-center gap-2 mt-5">
          <Clock3
            size={18}
            className="text-amber-500"
          />

          <span className="text-sm font-medium text-gray-600">
            {service.processingDays} Day
            {service.processingDays > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <button
        onClick={() =>
          navigate(`/services/${service.code}`)
        }
        className="
          mt-6
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-blue-600
          px-4
          py-3
          text-white
          font-medium
          transition
          hover:bg-blue-700
        "
      >
        Apply
        <ArrowRight size={18} />
      </button>
    </Card>
  );
};

export default ServiceCard;