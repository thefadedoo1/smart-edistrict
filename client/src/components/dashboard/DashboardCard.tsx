import React from "react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const DashboardCard = ({
  title,
  value,
  icon,
  color,
  subtitle,
}: DashboardCardProps) => {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        border-l-4
        p-6
      "
      style={{ borderLeftColor: color }}
    >
      <div className="flex justify-between items-start">

        <div>

          <p className="text-sm text-gray-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2 text-gray-800">
            {value}
          </h2>

          {subtitle && (
            <p className="text-sm text-gray-400 mt-3">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${color}15`,
            color,
          }}
        >
          {icon}
        </div>

      </div>
    </div>
  );
};

export default DashboardCard;