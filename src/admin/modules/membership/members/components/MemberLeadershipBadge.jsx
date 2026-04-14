import { Shield } from 'lucide-react';

/**
 * A small leadership pill badge.
 *
 * Props:
 *   label   {string}   - Position label, e.g. "President"
 *   compact {boolean}  - Icon-only mode (no text)
 */
export default function MemberLeadershipBadge({ label, compact = false }) {
  if (!label) return null;

  return (
    <span className="mem-leadership-badge" title={label}>
      <Shield size={12} aria-hidden="true" />
      {!compact && <span>{label}</span>}
    </span>
  );
}
