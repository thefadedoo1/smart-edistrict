import WorkloadBadge from "./WorkloadBadge";

interface Props {
  officerName?: string;
  pending: number;
}

const OfficerGreeting = ({
  officerName = "Officer",
  pending,
}: Props) => {
  const hour = new Date().getHours();

  let greeting = "Good Morning";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow border">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {greeting}, {officerName}
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back to the Smart
            eDistrict Officer Dashboard.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <WorkloadBadge pending={pending} />

          <p className="text-sm text-gray-600">
            Pending Applications:
            <span className="ml-2 font-semibold">
              {pending}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficerGreeting;