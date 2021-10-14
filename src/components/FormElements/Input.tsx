import React, { ChangeEventHandler } from "react";

interface Props {
  label: string;
  type: string;
  placeholder: string;
  name: string;
  id: string;
  value: string;
  className?: string;
  handleChange: ChangeEventHandler;
}

function Input({
  label,
  type,
  placeholder,
  name,
  id,
  value,
  className,
  handleChange,
}: Props): JSX.Element {
  return (
    <div className={`flex flex-col ${className}`}>
      <label htmlFor={id} className="font-bold">
        {label}
      </label>

      <input
        type={type}
        className="bg-gray-200 border-0 rounded"
        value={value}
        onChange={handleChange}
        name={name}
        id={id}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Input;
