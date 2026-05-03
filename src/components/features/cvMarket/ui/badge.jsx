const Badge = ({ label, className = "" }) => {
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold leading-tight ${className}`}>
            {label}
        </span>
    );
};

export default Badge;