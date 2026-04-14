import { Bell } from 'lucide-react';

export default function NotificationDropdown({ count = 0, notifications = [] }) {
  return (
    <div className="adm-dropdown-panel">
      <div className="adm-dropdown-panel__header">
        <div>
          <p className="adm-dropdown-panel__title">Notifications</p>
          <p className="adm-dropdown-panel__sub">{count} unread updates</p>
        </div>
        <Bell size={16} />
      </div>
      <div className="adm-dropdown-panel__body">
        {notifications.length ? notifications.map((item) => (
          <article key={item.id} className="adm-notification-item">
            <p className="adm-notification-item__title">{item.title}</p>
            <p className="adm-notification-item__desc">{item.description}</p>
            <span className="adm-notification-item__time">{item.time}</span>
          </article>
        )) : (
          <p className="adm-dropdown-panel__empty">No new notifications.</p>
        )}
      </div>
    </div>
  );
}
