export default function SidebarOverlay({ visible, onClick }) {
  return (
    <button
      type="button"
      aria-label="Close sidebar"
      className={`adm-sidebar-overlay ${visible ? 'adm-sidebar-overlay--visible' : ''}`}
      onClick={onClick}
    />
  );
}
