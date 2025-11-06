import { Input } from "../ui/input";

export default function InputField({
  label,
  name,
  description,
  required,
  type,
}: { label: string; required?: boolean; name: string; description?: string; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5 text-c14">
      <label htmlFor={name} className="block font-medium">
        {label}
      </label>
      <Input type={type || "text"} id={name} name={name} required={required} />
      {description && <p className="text-slate-500 text-sm">{description}</p>}
    </div>
  );
}
