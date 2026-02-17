import { rule } from 'postcss';
import { MdCheck } from 'react-icons/md';

const Tooltip = ({ icon: Icon, label, onClick }) => (
  <div className="relative group cursor-pointer">
    <Icon size={24} onClick={onClick} />
    <span className="absolute hidden group-hover:block top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
      {label}
    </span>
  </div>
);

export const PasswordRules = ({ isVisible, password = "" }) => {
  if (!isVisible) return null;

  const rules = [
    { id: 'length', label: 'Min 8 - 12 characters', valid: password.length >= 8 && password.length <= 12 },
    { id: 'uppercase', label: '1 Uppercase letter', valid: /[A-Z]/.test(password) },
    { id: 'lowercase', label: '1 Lowercase letter', valid: /[a-z]/.test(password) },
    { id: 'number', label: '1 Number', valid: /[0-9]/.test(password) },
    { id: 'special', label: '1 Special character', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { id: 'noSpace', label: 'No spaces allowed', valid: /^\S*$/.test(password) },
  ];

  return (
    <div className="absolute z-10 left-0 top-full mt-2 w-64 bg-gray-800 text-white text-base rounded-lg p-3 shadow-lg">
      <p className="font-semibold mb-2">Password must :</p>
      <ul className="space-y-1">
        {rules.map((rule) => (
          <li key={rule.id} className="flex items-center">
            <MdCheck className={`mr-2 ${rule.valid ? 'text-green-400' : 'text-red-400'}`} size={16} />{rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tooltip;
