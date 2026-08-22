import InputField from "../forms/InputField";
import SelectField from "../forms/SelectField";
import TextAreaField from "../forms/TextAreaField";

interface DynamicFieldProps {
  field: {
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
    isRequired: boolean;
    options?: any;
  };
  value: any;
  onChange: (key: string, value: any) => void;
  disabled?: boolean;
}

const DynamicField = ({ field, value, onChange, disabled }: DynamicFieldProps) => {
  // Built-in intelligent options for standard HP e-District fields
  let computedOptions = field.options;

  if (!computedOptions || computedOptions.length === 0) {
    if (field.fieldKey === "salutation") {
      computedOptions = ["Shri", "Smt", "Kumari"];
    } else if (field.fieldKey === "gender") {
      computedOptions = ["Male", "Female", "Other"];
    } else if (field.fieldKey === "relationType") {
      computedOptions = [
        "Son of",
        "Son of Late.",
        "Daughter of",
        "Daughter of Late.",
        "Wife of",
      ];
    }
  }

  // Normalize options to { label, value } objects
  const normalizedOptions = (computedOptions || []).map((opt: any) => {
    if (typeof opt === "string") {
      return { label: opt, value: opt };
    }
    if (typeof opt === "object" && opt !== null) {
      return {
        label: opt.name || opt.label || opt.value || String(opt),
        value: opt.id || opt.value || opt.name || String(opt),
      };
    }
    return { label: String(opt), value: String(opt) };
  });

  switch (field.fieldType) {
    case "TEXT":
      return (
        <InputField
          label={field.label}
          required={field.isRequired}
          placeholder={field.placeholder ?? undefined}
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(field.fieldKey, e.target.value)}
        />
      );

    case "NUMBER":
      return (
        <InputField
          type="number"
          label={field.label}
          required={field.isRequired}
          placeholder={field.placeholder ?? undefined}
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(field.fieldKey, e.target.value)}
        />
      );

    case "DATE":
      return (
        <InputField
          type="date"
          label={field.label}
          required={field.isRequired}
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(field.fieldKey, e.target.value)}
        />
      );

    case "TEXTAREA":
      return (
        <TextAreaField
          label={field.label}
          required={field.isRequired}
          placeholder={field.placeholder ?? undefined}
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => onChange(field.fieldKey, e.target.value)}
        />
      );

    case "SELECT":
      return (
        <SelectField
          label={field.label}
          required={field.isRequired}
          placeholder={field.placeholder || "Select an option"}
          value={value ?? ""}
          disabled={disabled}
          options={normalizedOptions}
          onChange={(e) => onChange(field.fieldKey, e.target.value)}
        />
      );

    default:
      return (
        <div className="rounded-lg border border-dashed p-4 text-gray-500">
          {field.fieldType} is not implemented yet.
        </div>
      );
  }
};

export default DynamicField;