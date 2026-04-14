const AVATAR_COLORS = [
  '#1d4ed8', '#0f766e', '#b45309', '#7c3aed',
  '#0369a1', '#15803d', '#be185d', '#9333ea',
];

function getColor(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
}

/**
 * Renders a circular avatar — photo if available, coloured initials otherwise.
 *
 * Props:
 *   photo   {string|null}  - URL of the member photo
 *   name    {string}       - Member full name (drives initials + colour)
 *   size    {number}       - Diameter in px, default 36
 *   className {string}     - Additional class names
 */
export default function MemberAvatarCell({ photo, name, size = 36, className = '' }) {
  const bg = getColor(name);
  const style = {
    width: size,
    height: size,
    minWidth: size,
    fontSize: size * 0.35,
  };

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`mem-avatar ${className}`}
        style={style}
        loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  }

  return (
    <span
      className={`mem-avatar mem-avatar--initials ${className}`}
      style={{ ...style, background: bg }}
      aria-label={`Avatar for ${name}`}
    >
      {initials(name)}
    </span>
  );
}
