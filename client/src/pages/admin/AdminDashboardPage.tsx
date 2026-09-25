import { useState, useEffect } from "react";
import AdminStatsGrid from "../../components/admin/AdminStatsGrid";
import QuickActions from "../../components/admin/QuickActions";
import api from "../../services/api";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch admin analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="mt-2 text-gray-500">
          Welcome to Smart eDistrict Administration Portal.
          Manage officers, departments and citizen services.
        </p>
      </div>

      {/* Statistics */}
      {stats && stats.overview && <AdminStatsGrid stats={stats.overview} />}

      {/* Tehsil Performance or other dashboard items could go here if we want */}

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default AdminDashboardPage;