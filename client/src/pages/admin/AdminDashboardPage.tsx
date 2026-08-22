import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import QuickActions from "../../components/admin/QuickActions";

const AdminDashboardPage = () => {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Welcome to Smart eDistrict Administration Portal.
          Manage officers, departments and citizen services.
        </p>

      </div>

      {/* Statistics */}

      <AdminStatsGrid />

      {/* Quick Actions */}

      <QuickActions />

    </div>
  );
};

export default AdminDashboardPage;