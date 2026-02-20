import React from 'react';

interface InputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  register?: any;
  required?: boolean;
}

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  required = false,
}: InputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
          error
            ? 'border-danger focus:ring-danger'
            : 'border-gray-300 focus:ring-primary focus:border-primary'
        }`}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
