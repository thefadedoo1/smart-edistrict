import { useState, useEffect } from "react";
import { Plus, Trash2, Users, MapPin, User, FileText, DollarSign } from "lucide-react";
import DynamicField from "./DynamicField";
import Button from "../ui/Button";
import { locationService, LocationOption } from "../../services/location.service";

interface FormField {
  id: string;
  label: string;
  fieldKey: string;
  fieldType:
    | "TEXT"
    | "NUMBER"
    | "DATE"
    | "TEXTAREA"
    | "SELECT"
    | "RADIO"
    | "CHECKBOX";
  placeholder?: string | null;
  defaultValue?: string | null;
  isRequired: boolean;
  options?: any;
  displayOrder: number;
}

interface FamilyMember {
  name: string;
  relation: string;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  loading?: boolean;
  citizenFullName?: string;
}

const DynamicForm = ({
  fields,
  onSubmit,
  loading = false,
  citizenFullName = "",
}: DynamicFormProps) => {
  const initialValues: Record<string, any> = {};

  fields.forEach((field) => {
    // Pre-fill applicantName from logged-in citizen's profile
    if (field.fieldKey === "applicantName" && citizenFullName) {
      initialValues[field.fieldKey] = citizenFullName;
    } else {
      initialValues[field.fieldKey] = field.defaultValue ?? "";
    }
  });

  const [formData, setFormData] = useState<Record<string, any>>(initialValues);

  // Dynamic Location Hierarchy
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [tehsils, setTehsils] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedTehsilId, setSelectedTehsilId] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");

  // Family Members Builder
  const hasFamilySection = fields.some(
    (f) => f.fieldKey === "annualIncome" || f.fieldKey === "familyMembers"
  );

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { name: "", relation: "Father" },
  ]);

  // Load Districts from DB on mount
  useEffect(() => {
    async function loadDistricts() {
      try {
        const dList = await locationService.getDistricts();
        setDistricts(dList || []);
        if (dList && dList.length > 0) {
          // Check if Kangra or first district should be selected
          const defaultD = dList.find((d) => d.name.toLowerCase() === "kangra") || dList[0];
          setSelectedDistrictId(defaultD.id);
          setFormData((prev) => ({
            ...prev,
            district: defaultD.name,
            districtId: defaultD.id,
          }));
        }
      } catch (err) {
        console.warn("Failed to load HP districts:", err);
      }
    }
    loadDistricts();
  }, []);

  // Load Tehsils when District changes
  useEffect(() => {
    if (!selectedDistrictId) {
      setTehsils([]);
      setVillages([]);
      return;
    }

    async function loadTehsils() {
      try {
        const tList = await locationService.getTehsils(selectedDistrictId);
        setTehsils(tList || []);
        if (tList && tList.length > 0) {
          const defaultT = tList.find((t) => t.name.toLowerCase() === "indora") || tList[0];
          setSelectedTehsilId(defaultT.id);
          setFormData((prev) => ({
            ...prev,
            tehsil: defaultT.name,
            tehsilId: defaultT.id,
          }));
        } else {
          setSelectedTehsilId("");
          setFormData((prev) => ({
            ...prev,
            tehsil: "",
            tehsilId: "",
          }));
        }
      } catch (err) {
        console.warn("Failed to load tehsils for district:", err);
      }
    }
    loadTehsils();
  }, [selectedDistrictId]);

  // Load Villages when Tehsil changes
  useEffect(() => {
    if (!selectedTehsilId) {
      setVillages([]);
      return;
    }

    async function loadVillages() {
      try {
        const vList = await locationService.getVillages(selectedTehsilId);
        setVillages(vList || []);
        if (vList && vList.length > 0) {
          const defaultV = vList.find((v) => v.name.toLowerCase().includes("badala")) || vList[0];
          setSelectedVillageId(defaultV.id);
          setFormData((prev) => ({
            ...prev,
            village: defaultV.name,
            villageId: defaultV.id,
          }));
        } else {
          setSelectedVillageId("");
          setFormData((prev) => ({
            ...prev,
            village: "",
            villageId: "",
          }));
        }
      } catch (err) {
        console.warn("Failed to load villages for tehsil:", err);
      }
    }
    loadVillages();
  }, [selectedTehsilId]);

  function handleChange(key: string, value: any) {
    if (key === "district") {
      const matched = districts.find((d) => d.id === value || d.name === value);
      if (matched) {
        setSelectedDistrictId(matched.id);
        setFormData((prev) => ({
          ...prev,
          district: matched.name,
          districtId: matched.id,
          tehsil: "",
          tehsilId: "",
          village: "",
          villageId: "",
        }));
        return;
      }
    }

    if (key === "tehsil") {
      const matched = tehsils.find((t) => t.id === value || t.name === value);
      if (matched) {
        setSelectedTehsilId(matched.id);
        setFormData((prev) => ({
          ...prev,
          tehsil: matched.name,
          tehsilId: matched.id,
          village: "",
          villageId: "",
        }));
        return;
      }
    }

    if (key === "village") {
      const matched = villages.find((v) => v.id === value || v.name === value);
      if (matched) {
        setSelectedVillageId(matched.id);
        setFormData((prev) => ({
          ...prev,
          village: matched.name,
          villageId: matched.id,
        }));
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleAddFamilyMember() {
    setFamilyMembers((prev) => [...prev, { name: "", relation: "Son" }]);
  }

  function handleRemoveFamilyMember(idx: number) {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleFamilyMemberChange(idx: number, field: "name" | "relation", val: string) {
    setFamilyMembers((prev) => {
      const updated = [...prev];
      updated[idx][field] = val;
      return updated;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const finalPayload = {
      ...formData,
    };

    if (hasFamilySection) {
      const validFamily = familyMembers.filter((m) => m.name.trim().length > 0);
      finalPayload.familyMembers = validFamily.length > 0 ? validFamily : [];
    }

    onSubmit(finalPayload);
  }

  // Identify special location fields to provide dynamic options
  const sortedFields = [...fields].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Standard Form Fields Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {sortedFields.map((field) => {
          let fieldWithOptions = { ...field };

          // Bind dynamic options from DB
          if (field.fieldKey === "district") {
            fieldWithOptions.fieldType = "SELECT";
            fieldWithOptions.options = districts.map((d) => ({ label: d.name, value: d.id }));
          } else if (field.fieldKey === "tehsil") {
            fieldWithOptions.fieldType = "SELECT";
            fieldWithOptions.options = tehsils.map((t) => ({ label: t.name, value: t.id }));
          } else if (field.fieldKey === "village") {
            fieldWithOptions.fieldType = "SELECT";
            fieldWithOptions.options = villages.map((v) => ({ label: v.name, value: v.id }));
          }

          const isFullWidth =
            field.fieldType === "TEXTAREA" ||
            field.fieldKey === "address" ||
            field.fieldKey === "purpose";

          // Determine current value to pass
          let currentValue = formData[field.fieldKey];
          if (field.fieldKey === "district" && selectedDistrictId) {
            currentValue = selectedDistrictId;
          } else if (field.fieldKey === "tehsil" && selectedTehsilId) {
            currentValue = selectedTehsilId;
          } else if (field.fieldKey === "village" && selectedVillageId) {
            currentValue = selectedVillageId;
          }

          return (
            <div key={field.id} className={isFullWidth ? "col-span-full" : ""}>
              {/* Lock applicantName to citizen profile — cannot apply for another person */}
              {field.fieldKey === "applicantName" ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700">{field.label}</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-800">
                    <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span>{citizenFullName || formData[field.fieldKey] || "—"}</span>
                    <span className="ml-auto text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">LOCKED TO PROFILE</span>
                  </div>
                </div>
              ) : (
                <DynamicField
                  field={fieldWithOptions}
                  value={currentValue}
                  onChange={handleChange}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Family Members Details Builder */}
      {hasFamilySection && (
        <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-purple-100 pb-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-purple-950">
                <Users className="h-4 w-4 text-purple-600" /> Family Member Details (For Revenue Verification & Certificate)
              </h3>
              <p className="text-xs text-purple-700 mt-0.5">
                Add family members as declared in your self-declaration affidavit.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFamilyMember}
              className="inline-flex items-center gap-1.5 self-start rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition"
            >
              <Plus className="h-4 w-4" /> Add Family Member
            </button>
          </div>

          <div className="space-y-3 pt-1">
            {familyMembers.map((member, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-purple-100 bg-white p-3 shadow-xs"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 w-8">
                  <span>#{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => handleFamilyMemberChange(idx, "name", e.target.value)}
                    placeholder="Member Full Name (e.g. Jeewana Kumari / Nitin Kaundal)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <select
                    value={member.relation}
                    onChange={(e) => handleFamilyMemberChange(idx, "relation", e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium focus:border-purple-500 focus:outline-none"
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
                </div>
                {familyMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFamilyMember(idx)}
                    className="self-end sm:self-center p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                    title="Remove Member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Submission Button */}
      <div className="flex justify-end pt-4 border-t border-slate-100">
        <Button
          type="submit"
          loading={loading}
          className="px-8 py-3 text-sm font-bold shadow-md shadow-blue-600/20"
        >
          Proceed to Document Upload
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;