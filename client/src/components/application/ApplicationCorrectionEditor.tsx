import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Save,
  Send,
  Plus,
  Trash2,
  AlertCircle,
  MapPin,
  User,
  Users,
  FileCheck,
  Building2,
  DollarSign,
} from "lucide-react";

import { locationService, LocationOption } from "../../services/location.service";
import { updateApplication, resubmitApplication } from "../../services/application.service";
import DocumentUploadList from "./DocumentUploadList";
import Button from "../ui/Button";

interface FamilyMember {
  name: string;
  relation: string;
}

interface Props {
  application: any;
  onUpdated: () => void;
}

const ApplicationCorrectionEditor = ({ application, onUpdated }: Props) => {
  const initialFormData = application.formData || {};

  // Applicant name is always locked to their account profile — cannot be changed
  const applicantName = application.applicant?.fullName || initialFormData.applicantName || "";

  // Form Fields
  const [salutation, setSalutation] = useState(initialFormData.salutation || "Shri");
  const [gender, setGender] = useState(initialFormData.gender || "MALE");
  const [relationType, setRelationType] = useState(initialFormData.relationType || "Son of");
  const [relativeName, setRelativeName] = useState(
    initialFormData.relativeName || initialFormData.fatherName || application.applicant?.profile?.fatherName || ""
  );
  const [address, setAddress] = useState(
    initialFormData.address || application.applicant?.profile?.address || ""
  );
  const [annualIncome, setAnnualIncome] = useState(initialFormData.annualIncome || "100000");
  const [incomeSource, setIncomeSource] = useState(initialFormData.incomeSource || "Agriculture");
  const [purpose, setPurpose] = useState(initialFormData.purpose || "Higher Education");

  // Location Hierarchy
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [tehsils, setTehsils] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState(
    initialFormData.district || application.applicant?.profile?.district?.name || "Kangra"
  );

  const [selectedTehsilId, setSelectedTehsilId] = useState("");
  const [selectedTehsilName, setSelectedTehsilName] = useState(
    initialFormData.tehsil || application.applicant?.profile?.tehsil?.name || "Indora"
  );

  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [selectedVillageName, setSelectedVillageName] = useState(
    initialFormData.village || application.applicant?.profile?.village?.name || "Indora"
  );

  // Family Members — load from existing formData, or start empty (no demo data)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(
    Array.isArray(initialFormData.familyMembers) && initialFormData.familyMembers.length > 0
      ? initialFormData.familyMembers.map((m: any) => ({
          name: m.name || m.fullName || "",
          relation: (m.relation || m.relationship || "Son").replace(/\/.*$/, "").trim(),
        }))
      : []
  );

  const [citizenRemarks, setCitizenRemarks] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isResubmitting, setIsResubmitting] = useState(false);

  // Load Districts
  useEffect(() => {
    async function loadDistricts() {
      try {
        const dList = await locationService.getDistricts();
        setDistricts(dList || []);

        const matched = dList?.find(
          (d) => d.name.toLowerCase() === selectedDistrictName.toLowerCase()
        );
        if (matched) {
          setSelectedDistrictId(matched.id);
        } else if (dList?.length > 0) {
          setSelectedDistrictId(dList[0].id);
          setSelectedDistrictName(dList[0].name);
        }
      } catch (e) {
        console.warn("Failed to fetch districts:", e);
      }
    }
    loadDistricts();
  }, []);

  // Load Tehsils when District changes
  useEffect(() => {
    if (!selectedDistrictId) return;

    async function loadTehsils() {
      try {
        const tList = await locationService.getTehsils(selectedDistrictId);
        setTehsils(tList || []);

        const matched = tList?.find(
          (t) => t.name.toLowerCase() === selectedTehsilName.toLowerCase()
        );
        if (matched) {
          setSelectedTehsilId(matched.id);
        } else if (tList?.length > 0) {
          setSelectedTehsilId(tList[0].id);
          setSelectedTehsilName(tList[0].name);
        }
      } catch (e) {
        console.warn("Failed to fetch tehsils:", e);
      }
    }
    loadTehsils();
  }, [selectedDistrictId]);

  // Load Villages when Tehsil changes
  useEffect(() => {
    if (!selectedTehsilId) return;

    async function loadVillages() {
      try {
        const vList = await locationService.getVillages(selectedTehsilId);
        setVillages(vList || []);

        const matched = vList?.find(
          (v) => v.name.toLowerCase() === selectedVillageName.toLowerCase()
        );
        if (matched) {
          setSelectedVillageId(matched.id);
        } else if (vList?.length > 0) {
          setSelectedVillageId(vList[0].id);
          setSelectedVillageName(vList[0].name);
        }
      } catch (e) {
        console.warn("Failed to fetch villages:", e);
      }
    }
    loadVillages();
  }, [selectedTehsilId]);

  function handleDistrictChange(districtId: string) {
    setSelectedDistrictId(districtId);
    const d = districts.find((item) => item.id === districtId);
    if (d) setSelectedDistrictName(d.name);
  }

  function handleTehsilChange(tehsilId: string) {
    setSelectedTehsilId(tehsilId);
    const t = tehsils.find((item) => item.id === tehsilId);
    if (t) setSelectedTehsilName(t.name);
  }

  function handleVillageChange(villageVal: string) {
    const v = villages.find((item) => item.id === villageVal);
    if (v) {
      setSelectedVillageId(v.id);
      setSelectedVillageName(v.name);
    } else {
      setSelectedVillageName(villageVal);
    }
  }

  function handleAddFamilyMember() {
    setFamilyMembers([...familyMembers, { name: "", relation: "SON/पुत्र" }]);
  }

  function handleRemoveFamilyMember(index: number) {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  }

  function handleFamilyMemberChange(index: number, field: "name" | "relation", val: string) {
    const updated = [...familyMembers];
    updated[index][field] = val;
    setFamilyMembers(updated);
  }

  const buildPayload = () => ({
    formData: {
      ...initialFormData,
      salutation,
      applicantName,
      gender,
      relationType,
      relativeName,
      district: selectedDistrictName,
      districtId: selectedDistrictId,
      tehsil: selectedTehsilName,
      tehsilId: selectedTehsilId,
      village: selectedVillageName,
      villageId: selectedVillageId,
      address,
      annualIncome,
      incomeSource,
      purpose,
      familyMembers,
    },
  });

  async function handleSaveDraft() {
    try {
      setIsSaving(true);
      await updateApplication(application.id, buildPayload());
      toast.success("Application details updated successfully.");
      onUpdated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update application");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResubmit() {
    if (!applicantName.trim()) {
      toast.error("Please enter applicant name.");
      return;
    }
    if (!relativeName.trim()) {
      toast.error("Please enter father / relative name.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter complete residential address.");
      return;
    }

    try {
      setIsResubmitting(true);
      // 1. Update form data
      await updateApplication(application.id, buildPayload());

      // 2. Submit correction to officer
      await resubmitApplication(application.id, {
        remarks: citizenRemarks.trim() || "Applicant updated form data and verified documents.",
      });

      toast.success("Corrected application resubmitted to Dealing Assistant!");
      onUpdated();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to resubmit application");
    } finally {
      setIsResubmitting(false);
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-6 shadow-md">
      {/* Header Banner */}
      <div className="flex items-start justify-between border-b border-amber-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-black tracking-tight">Edit Application (Addressing Officer Corrections)</h2>
          </div>
          <p className="mt-1 text-xs text-amber-800">
            Please make the necessary changes to your application information and supporting documents below, then click
            &ldquo;Submit Corrected Application&rdquo;.
          </p>
        </div>
        <span className="rounded-lg bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">
          EDIT MODE ACTIVE
        </span>
      </div>

      {/* Officer Remarks Display */}
      {application.remarks && (
        <div className="rounded-xl border border-amber-300 bg-white p-4 text-xs">
          <p className="font-bold text-amber-900">Officer&rsquo;s Correction Request:</p>
          <p className="mt-1 text-slate-700 font-medium italic">&ldquo;{application.remarks}&rdquo;</p>
        </div>
      )}

      {/* Section 1: Applicant Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
          <User className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">1. Applicant & Relative Particulars</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Salutation */}
          <div>
            <label className="block text-xs font-bold text-slate-700">Salutation *</label>
            <select
              value={salutation}
              onChange={(e) => setSalutation(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="Shri">Shri</option>
              <option value="Smt">Smt</option>
              <option value="Kumari">Kumari</option>
            </select>
          </div>

          {/* Applicant Name — Read-Only (locked to profile) */}
          <div>
            <label className="block text-xs font-bold text-slate-700">Applicant Full Name</label>
            <div className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
              {applicantName}
              <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">LOCKED TO PROFILE</span>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-slate-700">Gender *</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Relation Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700">Relationship *</label>
            <select
              value={relationType}
              onChange={(e) => setRelationType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
            >
              <option value="Son of">Son of</option>
              <option value="Son of Late.">Son of Late.</option>
              <option value="Daughter of">Daughter of</option>
              <option value="Daughter of Late.">Daughter of Late.</option>
              <option value="Wife of">Wife of</option>
              <option value="Husband of">Husband of</option>
            </select>
          </div>

          {/* Relative Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700">Father / Husband Name *</label>
            <input
              type="text"
              value={relativeName}
              onChange={(e) => setRelativeName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Late. Chaman Lal / Ashwani Kumar"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Address & Jurisdiction */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
          <MapPin className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">2. Revenue Jurisdiction & Address (HP Master)</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* District */}
          <div>
            <label className="block text-xs font-bold text-slate-700">District *</label>
            <select
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tehsil */}
          <div>
            <label className="block text-xs font-bold text-slate-700">Tehsil / Sub-Division *</label>
            <select
              value={selectedTehsilId}
              onChange={(e) => handleTehsilChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
            >
              {tehsils.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Village / Muhal */}
          <div>
            <label className="block text-xs font-bold text-slate-700">Village / Ward / Muhal *</label>
            {villages.length > 0 ? (
              <select
                value={selectedVillageId}
                onChange={(e) => handleVillageChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedVillageName}
                onChange={(e) => handleVillageChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
                placeholder="Enter Village Name"
              />
            )}
          </div>

          {/* Complete Address */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-700">Complete Residential Address *</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm font-medium focus:border-blue-500 focus:outline-none"
              placeholder="e.g. VPO INDORA TEH INDORA DISTT KANGRA HP 176401"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Income & Purpose */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
          <DollarSign className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">3. Income & Application Purpose</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold text-slate-700">Total Annual Family Income (INR) *</label>
            <input
              type="number"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              placeholder="e.g. 100000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">Source of Income</label>
            <input
              type="text"
              value={incomeSource}
              onChange={(e) => setIncomeSource(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Agriculture / Private Business"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700">Purpose</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Higher Education / Scholarship"
            />
          </div>
        </div>
      </div>

      {/* Section 4: Family Members */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Users className="h-4 w-4 text-purple-600" />
            <h3 className="text-sm font-bold uppercase tracking-wider">4. Family Members (As per Affidavit)</h3>
          </div>
          <button
            type="button"
            onClick={handleAddFamilyMember}
            className="flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 hover:bg-purple-200 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Add Member
          </button>
        </div>

        <div className="space-y-3">
          {familyMembers.map((member, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 w-6">{idx + 1}.</span>
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleFamilyMemberChange(idx, "name", e.target.value)}
                placeholder="Full Name (e.g. Jeewana Kumari)"
                className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              />
              <select
                value={member.relation}
                onChange={(e) => handleFamilyMemberChange(idx, "relation", e.target.value)}
                className="w-44 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium focus:border-blue-500 focus:outline-none"
              >
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Wife">Wife</option>
                <option value="Husband">Husband</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="button"
                onClick={() => handleRemoveFamilyMember(idx)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                title="Remove Member"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Documents Re-upload */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
          <FileCheck className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">5. Supporting Documents (Upload / Replace)</h3>
        </div>
        <DocumentUploadList
          applicationId={application.id}
          requiredDocuments={application.certificateService?.requiredDocuments || []}
          isSubmitted={false}
          allowEdit={true}
        />
      </div>

      {/* Section 6: Remarks to Reviewing Officer & Actions */}
      <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-800">
            Citizen Response / Clarification Note to Officer:
          </label>
          <input
            type="text"
            value={citizenRemarks}
            onChange={(e) => setCitizenRemarks(e.target.value)}
            placeholder="e.g. Corrected residential address to Indora (Kangra) and attached updated affidavit."
            className="mt-1 w-full rounded-xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-medium focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving || isResubmitting}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Draft Changes"}
          </button>

          <button
            type="button"
            onClick={handleResubmit}
            disabled={isSaving || isResubmitting}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition"
          >
            <Send className="h-4 w-4" />
            {isResubmitting ? "Resubmitting..." : "Submit Corrected Application"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationCorrectionEditor;
