import { Calendar } from 'lucide-react';

export default function WelcomeBanner() {
  const rawUser = localStorage.getItem('ndm_user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const name = user?.name || 'Admin';

  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Good morning' :
    now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="adm-welcome">
      <div className="adm-welcome__text">
        <h2 className="adm-welcome__heading">{greeting}, {name}!</h2>
        <p className="adm-welcome__sub">Here's what's happening in the NDM community today.</p>
      </div>
      <div className="adm-welcome__date">
        <Calendar size={16} />
        <span>{dateStr}</span>
      </div>
    </div>
  );
}
