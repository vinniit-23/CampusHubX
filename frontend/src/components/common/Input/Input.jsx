import React, { forwardRef } from "react"; // Import forwardRef
import clsx from "clsx";

// Wrap the component with forwardRef((props, ref) => ...)
const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      value,
      onChange,
      placeholder,
      error,
      required = false,
      disabled = false,
      register, // Keep for backward compatibility
      className,
      ...props
    },
    ref
  ) => {
    const isNumberField = type === "number";

    // Handle cases where 'register' is passed as a prop vs spread syntax
    const inputProps = register
      ? register(name, { valueAsNumber: isNumberField })
      : { name, value, onChange };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref} // 🔥 Connect the ref here
          type={type}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
            error ? "border-red-500" : "border-gray-300",
            disabled && "bg-gray-100 cursor-not-allowed",
            className
          )}
          {...inputProps} // Internal register handling
          {...props} // Spread props (handles standard onChange, onBlur, etc.)
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input"; // Good practice for debugging
export default Input;
