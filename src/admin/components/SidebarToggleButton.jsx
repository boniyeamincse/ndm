import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

export default function SidebarToggleButton({
  collapsed = false,
  mobile = false,
  open = false,
  onClick,
  label,
  className = '',
}) {
  const Icon = mobile ? (open ? X : Menu) : (collapsed ? ChevronRight : ChevronLeft);

  return (
    <button
      type="button"
      className={`adm-icon-button ${className}`.trim()}
      onClick={onClick}
      aria-label={label}
    >
      <Icon size={18} />
    </button>
  );
}
