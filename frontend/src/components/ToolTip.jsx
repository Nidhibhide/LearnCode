  const Tooltip = ({ icon: Icon, label,onClick }) => (
    <div className="relative group cursor-pointer">
      <Icon size={24} onClick={onClick} />
      <span className="absolute hidden group-hover:block top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap">
        {label}
      </span>
    </div>
  );

  export default Tooltip