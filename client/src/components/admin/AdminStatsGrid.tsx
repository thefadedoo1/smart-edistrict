import {
  Users,
  UserCheck,
  FileText,
  Building2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import AdminStatCard from "./AdminStatCard";

interface AdminStatsGridProps {
  stats: {
    totalUsers: number;
    totalOfficers: number;
    totalApplications: number;
    approvedApplications: number;
    inProgressApplications: number;
    servicesCount: number;
    [key: string]: any;
  };
}

const AdminStatsGrid = ({ stats }: AdminStatsGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <AdminStatCard
        title="Total Citizens"
        value={stats.totalUsers || 0}
        icon={Users}
        color="bg-blue-600"
      />

      <AdminStatCard
        title="Total Officers"
        value={stats.totalOfficers || 0}
        icon={UserCheck}
        color="bg-green-600"
      />

      <AdminStatCard
        title="Applications"
        value={stats.totalApplications || 0}
        icon={FileText}
        color="bg-purple-600"
      />

      <AdminStatCard
        title="Services"
        value={stats.servicesCount || 0}
        icon={Building2}
        color="bg-orange-500"
      />

      <AdminStatCard
        title="Approved"
        value={stats.approvedApplications || 0}
        icon={CheckCircle2}
        color="bg-emerald-600"
      />

      <AdminStatCard
        title="Pending"
        value={stats.inProgressApplications || 0}
        icon={Clock3}
        color="bg-red-500"
      />

    </div>
  );
};

export default AdminStatsGrid;