import {
  FileText,
  Users,
  BadgeCheck,
  Clock3,
} from "lucide-react";

const stats = [
  {
    title: "Government Services",
    value: "20+",
    icon: FileText,
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "Applications Processed",
    value: "15K+",
    icon: Users,
    color: "bg-green-100 text-green-700",
  },
  {
    title: "SLA Compliance",
    value: "98%",
    icon: Clock3,
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Certificates Issued",
    value: "5K+",
    icon: BadgeCheck,
    color: "bg-purple-100 text-purple-700",
  },
];

const Statistics = () => {
  return (
    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold">
            Smart eDistrict at a Glance
          </h2>

          <p className="mt-4 text-gray-600">
            Delivering faster, transparent and accountable
            government services.
          </p>

        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >

                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${stat.color}`}
                >
                  <Icon size={30} />
                </div>

                <h3 className="mt-6 text-4xl font-bold text-blue-900">
                  {stat.value}
                </h3>

                <p className="mt-3 text-gray-600">
                  {stat.title}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default Statistics;