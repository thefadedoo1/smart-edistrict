import {
  FileText,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardCard from "./DashboardCard";
import { useMyApplications } from "../../hooks/useMyApplications";

const StatsGrid = () => {
  const { data: applications } = useMyApplications();

  const total = applications?.length || 0;
  const pending =
    applications?.filter(
      (app) => app.status === "IN_PROGRESS" || app.status === "SUBMITTED"
    ).length || 0;
  const approved =
    applications?.filter((app) => app.status === "APPROVED").length || 0;
  const actionRequired =
    applications?.filter(
      (app) => app.status === "CORRECTION_REQUIRED" || app.status === "REJECTED"
    ).length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <Link to="/applications">
        <DashboardCard
          title="Total Applications"
          value={total}
          subtitle="All submitted requests"
          color="#2563EB"
          icon={<FileText size={28} />}
        />
      </Link>

      <Link to="/applications">
        <DashboardCard
          title="In Verification"
          value={pending}
          subtitle="Awaiting officer verification"
          color="#F59E0B"
          icon={<Clock3 size={28} />}
        />
      </Link>

      <Link to="/certificates">
        <DashboardCard
          title="Approved Certificates"
          value={approved}
          subtitle="Ready to view & download"
          color="#16A34A"
          icon={<CheckCircle2 size={28} />}
        />
      </Link>

      <Link to="/applications">
        <DashboardCard
          title="Action Required"
          value={actionRequired}
          subtitle="Clarifications / Correction"
          color="#DC2626"
          icon={<AlertCircle size={28} />}
        />
      </Link>
    </div>
  );
};

export default StatsGrid;