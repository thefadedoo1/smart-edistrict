import React, {
  SelectHTMLAttributes,
} from "react";

interface Option {
  label: string;
  value: string;
}

interface SelectFieldProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  options,
  error,
  placeholder = "Select an option",
  className = "",
  required,
  id,
  ...props
}) => {
  const selectId = id || props.name;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={selectId}
        className="text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <select
        id={selectId}
        {...props}
        className={`
          w-full rounded-lg border px-4 py-2.5
          transition
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          ${
            error
              ? "border-red-500"
              : "border-gray-300"
          }
          ${
            props.disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white"
          }
          ${className}
        `}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;