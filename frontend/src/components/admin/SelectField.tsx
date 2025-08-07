import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField = ({
  name,
  value,
  options,
  onChange,
}: SelectFieldProps) => {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-2 pr-8 border rounded-lg appearance-none"
        required
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
};
