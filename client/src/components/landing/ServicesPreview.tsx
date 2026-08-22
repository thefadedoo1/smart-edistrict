import {
  FileBadge,
  FileText,
  Shield,
  Home,
  Users,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Income Certificate",
    icon: FileText,
  },
  {
    title: "Caste Certificate",
    icon: Shield,
  },
  {
    title: "Character Certificate",
    icon: FileBadge,
  },
  {
    title: "Residence Certificate",
    icon: Home,
  },
  {
    title: "Marriage Certificate",
    icon: Users,
  },
  {
    title: "Birth Certificate",
    icon: FileText,
  },
];

const ServicesPreview = () => {
  return (
    <section className="bg-gray-50 py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold">
            Popular Government Services
          </h2>

          <p className="mt-4 text-gray-600">
            Apply online for essential certificates and
            government services through Smart eDistrict.
          </p>

        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <Icon
                  size={42}
                  className="text-blue-700"
                />

                <h3 className="mt-6 text-xl font-semibold">
                  {service.title}
                </h3>

                <p className="mt-3 text-gray-600">
                  Apply online with document upload,
                  workflow tracking and digital approval.
                </p>

              </div>
            );
          })}

        </div>

        <div className="mt-12 text-center">

          <Link
            to="/citizen/login"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-8 py-4 font-semibold text-white transition hover:bg-blue-800"
          >
            Explore Services

            <ArrowRight size={20} />

          </Link>

        </div>

      </div>

    </section>
  );
};

export default ServicesPreview;