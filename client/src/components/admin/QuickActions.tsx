import { Link } from "react-router-dom";

import {
  UserPlus,
  Building2,
  FileCog,
  ClipboardList,
} from "lucide-react";

const actions = [
  {
    title: "Add Officer",
    description:
      "Create DA, Patwari or Tehsildar accounts",
    icon: UserPlus,
    path: "/admin/officers/new",
    color: "bg-blue-600",
  },

  {
    title: "Departments",
    description:
      "Manage government departments",
    icon: Building2,
    path: "/admin/departments",
    color: "bg-green-600",
  },

  {
    title: "Certificate Services",
    description:
      "Manage available services",
    icon: FileCog,
    path: "/admin/services",
    color: "bg-purple-600",
  },

  {
    title: "Applications",
    description:
      "Monitor submitted applications",
    icon: ClipboardList,
    path: "/admin/applications",
    color: "bg-orange-500",
  },
];

const QuickActions = () => {
  return (
    <div>

      <h2 className="mb-5 text-2xl font-bold">
        Quick Actions
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.path}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-white ${action.color}`}
              >
                <Icon size={28} />
              </div>

              <h3 className="text-lg font-semibold">
                {action.title}
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                {action.description}
              </p>

            </Link>
          );
        })}

      </div>

    </div>
  );
};

export default QuickActions;