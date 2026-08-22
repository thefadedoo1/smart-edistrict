import React, { useState, useEffect } from "react";
import api from "../../services/api";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import { Loader2 } from "lucide-react";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overall");
  const [overall, setOverall] = useState<any>(null);
  const [districts, setDistricts] = useState<any[]>([]);
  const [tehsils, setTehsils] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [overallRes, distRes, tehsilRes, officerRes] = await Promise.all([
          api.get("/admin/reports/overall"),
          api.get("/admin/reports/district"),
          api.get("/admin/reports/tehsil"),
          api.get("/admin/reports/officer")
        ]);
        setOverall(overallRes.data.data);
        setDistricts(distRes.data.data);
        setTehsils(tehsilRes.data.data);
        setOfficers(officerRes.data.data);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  const TabButton = ({ value, label }: { value: string, label: string }) => (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-2 font-medium text-sm rounded-lg ${activeTab === value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <PageHeader title="Performance Reports" subtitle="System-wide analytics and SLA tracking." />

      <div className="flex gap-2 mt-6 mb-6">
        <TabButton value="overall" label="Overall" />
        <TabButton value="district" label="District-wise" />
        <TabButton value="tehsil" label="Tehsil-wise" />
        <TabButton value="officer" label="Officer Performance" />
      </div>

      {activeTab === "overall" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-slate-500 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold">{overall?.totalApplications}</p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-emerald-600 mb-2">Approved</h3>
            <p className="text-3xl font-bold">{overall?.approved}</p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-rose-600 mb-2">Rejected</h3>
            <p className="text-3xl font-bold">{overall?.rejected}</p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-amber-600 mb-2">Pending</h3>
            <p className="text-3xl font-bold">{overall?.pending}</p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-orange-600 mb-2">Escalated (SLA Breach)</h3>
            <p className="text-3xl font-bold">{overall?.escalated}</p>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-bold text-red-600 mb-2">Active Grievances</h3>
            <p className="text-3xl font-bold">{overall?.complaints}</p>
          </Card>
        </div>
      )}

      {activeTab === "district" && (
        <Card className="p-6 overflow-hidden">
          <h2 className="text-lg font-bold mb-4">District-wise Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-3 border-b">District Name</th>
                  <th className="p-3 border-b text-right">Total Apps</th>
                  <th className="p-3 border-b text-right">Approved</th>
                  <th className="p-3 border-b text-right">Pending</th>
                  <th className="p-3 border-b text-right">Escalated</th>
                </tr>
              </thead>
              <tbody>
                {districts.map(d => (
                  <tr key={d.id} className="border-b">
                    <td className="p-3 font-medium">{d.name}</td>
                    <td className="p-3 text-right">{d.total}</td>
                    <td className="p-3 text-right text-emerald-600 font-semibold">{d.approved}</td>
                    <td className="p-3 text-right text-amber-600 font-semibold">{d.pending}</td>
                    <td className="p-3 text-right text-red-600 font-bold">{d.escalated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "tehsil" && (
        <Card className="p-6 overflow-hidden">
          <h2 className="text-lg font-bold mb-4">Tehsil-wise Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-3 border-b">Tehsil Name</th>
                  <th className="p-3 border-b">District</th>
                  <th className="p-3 border-b text-right">Total Apps</th>
                  <th className="p-3 border-b text-right">Approved</th>
                  <th className="p-3 border-b text-right">Pending</th>
                  <th className="p-3 border-b text-right">Escalated</th>
                </tr>
              </thead>
              <tbody>
                {tehsils.map(t => (
                  <tr key={t.id} className="border-b">
                    <td className="p-3 font-medium">{t.name}</td>
                    <td className="p-3">{t.districtName}</td>
                    <td className="p-3 text-right">{t.total}</td>
                    <td className="p-3 text-right text-emerald-600 font-semibold">{t.approved}</td>
                    <td className="p-3 text-right text-amber-600 font-semibold">{t.pending}</td>
                    <td className="p-3 text-right text-red-600 font-bold">{t.escalated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "officer" && (
        <Card className="p-6 overflow-hidden">
          <h2 className="text-lg font-bold mb-4">Officer Performance Tracker</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-3 border-b">Officer Name</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b text-right">Total Assigned</th>
                  <th className="p-3 border-b text-right">Actioned</th>
                  <th className="p-3 border-b text-right">Pending</th>
                  <th className="p-3 border-b text-right">Escalated</th>
                  <th className="p-3 border-b text-right">Complaints</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(o => (
                  <tr key={o.id} className="border-b">
                    <td className="p-3">
                      <div className="font-medium">{o.fullName}</div>
                      <div className="text-xs text-slate-500">{o.email}</div>
                    </td>
                    <td className="p-3">{o.role}</td>
                    <td className="p-3 text-right">{o.totalAssigned}</td>
                    <td className="p-3 text-right text-emerald-600 font-semibold">{o.completed}</td>
                    <td className="p-3 text-right text-amber-600 font-semibold">{o.pending}</td>
                    <td className="p-3 text-right text-orange-600 font-semibold">{o.escalated}</td>
                    <td className="p-3 text-right text-red-600 font-bold">{o.complaints}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </div>
  );
}
