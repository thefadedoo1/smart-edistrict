import { InputHTMLAttributes, forwardRef } from "react";

interface Props
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">

        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>

        <input
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
        />

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;