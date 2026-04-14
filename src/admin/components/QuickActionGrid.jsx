import { useNavigate } from 'react-router-dom';

export default function QuickActionGrid({ actions = [] }) {
  const navigate = useNavigate();

  return (
    <div className="adm-quick-grid">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            className="adm-quick-btn"
            style={{ '--action-color': action.color || 'var(--clr-primary)' }}
            onClick={() => navigate(action.route)}
          >
            <span className="adm-quick-btn__icon">
              <Icon size={20} strokeWidth={1.8} />
            </span>
            <span className="adm-quick-btn__label">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
