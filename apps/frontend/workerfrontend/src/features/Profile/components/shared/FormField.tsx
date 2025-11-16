interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  isTextArea?: boolean;
}

export const FormField = ({ label, name, value, onChange, placeholder, isTextArea = false }: FormFieldProps) => {
  const InputComponent = isTextArea ? 'textarea' : 'input';
  
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">{label}</h3>
      <InputComponent
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        placeholder={placeholder}
      />
    </div>
  );
};