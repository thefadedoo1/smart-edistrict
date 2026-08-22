import { CalendarDays } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface WelcomeBannerProps {
  profileCompletion?: number;
}

const WelcomeBanner = ({
  profileCompletion = 70,
}: WelcomeBannerProps) => {
  const { user } = useAuth();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-2xl shadow-lg p-6 md:p-8">

      <div className="flex flex-col lg:flex-row justify-between gap-6">

        {/* Left */}

        <div>

          <h2 className="text-3xl font-bold">
            {greeting},{" "}
            <span className="text-blue-200">
              {user?.fullName}
            </span>
          </h2>

          <p className="mt-3 text-blue-100 text-lg">
            Welcome back to Smart eDistrict Portal
          </p>

          <div className="flex items-center gap-2 mt-5 text-blue-100">

            <CalendarDays size={20} />

            <span>{currentDate}</span>

          </div>

        </div>

        {/* Right */}

        <div className="lg:w-72">

          <div className="flex justify-between mb-2">

            <span className="text-sm font-medium">
              Profile Completion
            </span>

            <span className="font-semibold">
              {profileCompletion}%
            </span>

          </div>

          <div className="w-full h-3 bg-blue-300 rounded-full overflow-hidden">

            <div
              className="h-full bg-green-400 transition-all duration-700"
              style={{
                width: `${profileCompletion}%`,
              }}
            />

          </div>

          <p className="text-sm text-blue-100 mt-3">
            Complete your profile to enjoy all services.
          </p>

        </div>

      </div>

    </div>
  );
};

export default WelcomeBanner;