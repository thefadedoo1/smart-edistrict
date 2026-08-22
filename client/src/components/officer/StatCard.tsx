interface Props {
  title: string;
  value: string | number;
  color:
    | "blue"
    | "yellow"
    | "red"
    | "green"
    | "purple"
    | "emerald";
}

const colors = {
  blue: "border-blue-500",
  yellow: "border-yellow-500",
  red: "border-red-500",
  green: "border-green-500",
  purple: "border-purple-500",
  emerald: "border-emerald-500",
};

const StatCard = ({
  title,
  value,
  color,
}: Props) => {
  return (
    <div
      className={`rounded-xl border-l-4 ${colors[color]} bg-white p-5 shadow`}
    >
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;