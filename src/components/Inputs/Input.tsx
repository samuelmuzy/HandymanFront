// Componente reutilizável para inputs
interface InputProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
  }
  export const Input = ({ id, label, value, onChange, type = "text" }: InputProps) => (
    <div className="space-y-1">
      <label htmlFor={id} className="text-xs text-white">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 rounded-lg bg-[#AD5700]/50 text-sm text-white"
        required
      />
    </div>
  );