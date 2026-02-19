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
    <div className="mt-2 bg-gray-50 border border-gray-200 text-base text-gray-700  rounded-lg p-3">
      <p className="font-semibold mb-2 ">Password must :</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1  ">
        {rules.map((rule) => (
          <li key={rule.id} className="flex items-center">
            <MdCheck className={`mr-1 ${rule.valid ? 'text-green-500' : 'text-red-400'}`} size={14} />
            <span className={rule.valid ? 'text-green-600' : ''}>{rule.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const checkDobAndShowNotification = (userDob) => {
  const isDobSet = userDob !== null && userDob !== undefined && userDob !== '';
  console.log("this is dob notification")
  if (!isDobSet) {
    // Return notification object instead of showing toast
    return {
      _id: `dob-${Date.now()}`,
      title: 'Date of Birth Required',
      message: 'Please set your date of birth in your profile settings',
      type: 'warning',
      createdAt: new Date().toISOString(),
    };
  }
  return null;
};

export default Tooltip;
