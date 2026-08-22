import React, { useState, useEffect } from "react";
import api from "../../services/api";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Loader2, MessageSquareWarning } from "lucide-react";

export default function GrievancesPage() {
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState<any[]>([]);

  const fetchComplaints = async () => {
    try {
      const res = await api.get("/complaints");
      setComplaints(res.data.data);
    } catch (error) {
      console.error("Failed to load complaints", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/complaints/${id}`, { status });
      fetchComplaints(); // refresh list
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6">
      <PageHeader title="Grievances Management" subtitle="Review and resolve citizen complaints regarding delayed services." />

      <Card className="mt-6 p-6 overflow-hidden">
        {complaints.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <MessageSquareWarning className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No grievances found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="p-3 border-b">Citizen</th>
                  <th className="p-3 border-b">Application No</th>
                  <th className="p-3 border-b">Assigned Officer</th>
                  <th className="p-3 border-b">Complaint Message</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(c => (
                  <tr key={c.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-medium">{c.citizen.fullName}</div>
                      <div className="text-xs text-slate-500">{c.citizen.phone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{c.application.applicationNumber}</div>
                      <div className="text-xs text-slate-500">Stage: {c.application.currentStage}</div>
                    </td>
                    <td className="p-3">
                      {c.officer ? `${c.officer.fullName} (${c.officer.role})` : "Unassigned"}
                    </td>
                    <td className="p-3 max-w-xs truncate" title={c.message}>
                      {c.message}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        c.status === "OPEN" ? "bg-red-100 text-red-700" :
                        c.status === "INVESTIGATING" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {c.status === "OPEN" && (
                        <Button size="sm" onClick={() => handleUpdateStatus(c.id, "INVESTIGATING")} variant="outline" className="mr-2">Investigate</Button>
                      )}
                      {(c.status === "OPEN" || c.status === "INVESTIGATING") && (
                        <Button size="sm" onClick={() => handleUpdateStatus(c.id, "RESOLVED")} variant="success">Resolve</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
