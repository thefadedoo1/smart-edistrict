import { Link } from "react-router-dom";

import {
  UserPlus,
  FileCog,
  ClipboardList,
} from "lucide-react";

const actions = [
  {
    title: "Manage Officers",
    description: "Create and manage DA, Patwari or Tehsildar accounts",
    icon: UserPlus,
    path: "/admin/officers",
    color: "bg-blue-600",
  },
  {
    title: "Reports & Analytics",
    description: "View detailed system analytics and export data",
    icon: FileCog,
    path: "/admin/reports",
    color: "bg-purple-600",
  },
  {
    title: "Grievances",
    description: "Review and respond to citizen complaints",
    icon: ClipboardList,
    path: "/admin/grievances",
    color: "bg-red-500",
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