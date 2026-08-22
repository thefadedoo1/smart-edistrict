import {
  User,
  ClipboardCheck,
  MapPinned,
  ShieldCheck,
  BadgeCheck,
  FileCheck2,
} from "lucide-react";

const workflow = [
  {
    title: "Citizen",
    description: "Apply Online",
    icon: User,
  },
  {
    title: "District Assistant",
    description: "Initial Verification",
    icon: ClipboardCheck,
  },
  {
    title: "Patwari",
    description: "Field Verification",
    icon: MapPinned,
  },
  {
    title: "DA Review",
    description: "Review Verification",
    icon: ShieldCheck,
  },
  {
    title: "Tehsildar",
    description: "Final Approval",
    icon: BadgeCheck,
  },
  {
    title: "Certificate",
    description: "Digital Download",
    icon: FileCheck2,
  },
];

const WorkflowSection = () => {
  return (
    <section className="bg-slate-50 py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold">
            Application Workflow
          </h2>

          <p className="mt-4 text-gray-600">
            Every application follows a transparent,
            multi-level verification process to ensure
            authenticity, accountability and timely delivery.
          </p>

        </div>

        {/* Desktop */}

        <div className="mt-20 hidden lg:flex items-center justify-between">

          {workflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex flex-1 items-center"
              >

                <div className="flex flex-col items-center text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg">

                    <Icon size={36} />

                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {step.description}
                  </p>

                </div>

                {index < workflow.length - 1 && (
                  <div className="mx-4 h-1 flex-1 rounded-full bg-blue-200" />
                )}

              </div>
            );
          })}

        </div>

        {/* Mobile */}

        <div className="mt-14 space-y-8 lg:hidden">

          {workflow.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex items-center gap-5 rounded-xl bg-white p-5 shadow"
              >

                <div className="rounded-full bg-blue-700 p-4 text-white">

                  <Icon size={28} />

                </div>

                <div>

                  <h3 className="font-semibold">
                    {step.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
};

export default WorkflowSection;