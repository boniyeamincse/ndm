import { useState } from 'react';
import { Copy, Check, CalendarDays, Building2, User2, Link2 } from 'lucide-react';
import SectionCard from '../../shared/components/SectionCard';
import MemberStatusBadge from './MemberStatusBadge';
import MemberAvatarCell from './MemberAvatarCell';
import MemberLeadershipBadge from './MemberLeadershipBadge';

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  return (
    <button type="button" className="mem-copy-btn" onClick={handleCopy} title="Copy member number">
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export default function MemberOverviewCard({ entity }) {
  const linkedStatus = entity.user?.status || (entity.user_id ? 'linked' : 'unlinked');

  return (
    <SectionCard title="Member Overview" subtitle="Identity, status and linked account quick summary.">
      <div className="mem-overview-hero">
        <MemberAvatarCell photo={entity.photo} name={entity.full_name} size={64} />
        <div className="mem-overview-hero__info">
          <div className="mem-overview-hero__name-row">
            <h2 className="mem-overview-hero__name">{entity.full_name}</h2>
            <MemberStatusBadge value={entity.status} />
            {entity.is_leadership ? <MemberLeadershipBadge label={entity.leadership_summary} /> : null}
          </div>
          <div className="mem-overview-hero__no-row">
            <code className="mem-overview-hero__no">{entity.member_no}</code>
            <CopyButton value={entity.member_no} />
          </div>
          <div className="mem-overview-hero__meta-chips">
            {entity.primary_committee_name ? (
              <span className="mem-meta-chip">
                <Building2 size={13} />{entity.primary_committee_name}
              </span>
            ) : null}
            {entity.primary_position_name ? (
              <span className="mem-meta-chip">
                <User2 size={13} />{entity.primary_position_name}
              </span>
            ) : null}
            {entity.joined_at ? (
              <span className="mem-meta-chip">
                <CalendarDays size={13} />
                Joined {new Date(entity.joined_at).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: '2-digit' })}
              </span>
            ) : null}
            <span className={`mem-meta-chip mem-meta-chip--${entity.user_id ? 'linked' : 'unlinked'}`}>
              <Link2 size={13} />
              {linkedStatus === 'active' ? 'Account Active' : linkedStatus === 'pending' ? 'Account Pending' : 'No Account Linked'}
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
