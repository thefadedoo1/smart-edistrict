import React, { InputHTMLAttributes } from "react";

interface InputFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  className = "",
  required,
  id,
  ...props
}) => {
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      <input
        id={inputId}
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
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;