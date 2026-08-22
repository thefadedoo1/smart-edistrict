import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
}

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  color = "bg-blue-600",
}: Props) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div
          className={`flex h-14 w-14 items-center justify-center rounded-xl text-white ${color}`}
        >
          <Icon size={28} />
        </div>

      </div>

    </div>
  );
};

export default AdminStatCard;