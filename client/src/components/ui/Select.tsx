import {
  SelectHTMLAttributes,
  forwardRef,
} from "react";

interface Option {
  label: string;
  value: string;
}

interface Props
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

const Select = forwardRef<
  HTMLSelectElement,
  Props
>(
  (
    {
      label,
      options,
      error,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">

        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <select
          ref={ref}
          {...props}
          className={`
            w-full
            rounded-lg
            border
            border-gray-300
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-600
            focus:ring-2
            focus:ring-blue-100
            ${error ? "border-red-500" : ""}
            ${className}
          `}
        >

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
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;