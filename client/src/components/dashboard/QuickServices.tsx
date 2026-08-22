import {
  FilePlus,
  FolderOpen,
  Download,
  Upload,
  User,
  CircleHelp,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Card from "../ui/Card";
import SectionHeader from "../ui/SectionHeader";

const services = [
  {
    title: "Government Services",
    description: "Browse and apply for available government services",
    icon: FilePlus,
    path: "/services",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "My Applications",
    description: "Track your submitted applications and progress",
    icon: FolderOpen,
    path: "/applications",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    title: "Certificates",
    description: "Download approved digitally signed certificates",
    icon: Download,
    path: "/certificates",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    title: "Apply Certificate",
    description: "Start application for Income, Caste, or Bonafide",
    icon: Upload,
    path: "/services",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "Profile",
    description: "Update personal & residential details",
    icon: User,
    path: "/profile",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    title: "Verify Certificate",
    description: "Public QR / Reference number verification",
    icon: CircleHelp,
    path: "/verify/demo",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

const QuickServices = () => {
  const navigate = useNavigate();

  return (
    <>
      <SectionHeader
        title="Quick Services"
        subtitle="Frequently used citizen services"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <Card
              key={service.title}
              className="p-6 cursor-pointer hover:-translate-y-1"
            >
              <div
                onClick={() => navigate(service.path)}
                className="flex flex-col h-full"
              >
                <div
                  className={`
                    w-14
                    h-14
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${service.bg}
                  `}
                >
                  <Icon
                    size={28}
                    className={service.color}
                  />
                </div>

                <h3 className="text-lg font-semibold mt-5 text-gray-800">
                  {service.title}
                </h3>

                <p className="text-gray-500 mt-2 flex-1">
                  {service.description}
                </p>

                <div className="flex justify-end mt-6">
                  <ArrowRight
                    className={`${service.color}`}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default QuickServices;