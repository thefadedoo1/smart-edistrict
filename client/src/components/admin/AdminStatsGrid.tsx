import {
  Users,
  UserCheck,
  FileText,
  Building2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import AdminStatCard from "./AdminStatCard";

const AdminStatsGrid = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <AdminStatCard
        title="Total Citizens"
        value={1250}
        icon={Users}
        color="bg-blue-600"
      />

      <AdminStatCard
        title="Total Officers"
        value={42}
        icon={UserCheck}
        color="bg-green-600"
      />

      <AdminStatCard
        title="Applications"
        value={583}
        icon={FileText}
        color="bg-purple-600"
      />

      <AdminStatCard
        title="Departments"
        value={8}
        icon={Building2}
        color="bg-orange-500"
      />

      <AdminStatCard
        title="Approved"
        value={450}
        icon={CheckCircle2}
        color="bg-emerald-600"
      />

      <AdminStatCard
        title="Pending"
        value={133}
        icon={Clock3}
        color="bg-red-500"
      />

    </div>
  );
};

export default AdminStatsGrid;