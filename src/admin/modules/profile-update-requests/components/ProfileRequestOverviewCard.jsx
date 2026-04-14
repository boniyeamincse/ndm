import SectionCard from '../../membership/shared/components/SectionCard';
import ProfileRequestStatusBadge from './ProfileRequestStatusBadge';
import ProfileRequestTypeBadge from './ProfileRequestTypeBadge';

export default function ProfileRequestOverviewCard({ request }) {
  return (
    <SectionCard title={request.request_no} subtitle={request.submitted_note || 'Profile change request submitted by member.'}>
      <div className="cnt-overview-head__badges">
        <ProfileRequestTypeBadge value={request.request_type} />
        <ProfileRequestStatusBadge value={request.status} />
      </div>
      <div className="cnt-overview-meta">
        <div><span>Requester</span><strong>{request.requester?.name}</strong></div>
        <div><span>Member No</span><strong>{request.member?.member_no}</strong></div>
        <div><span>Submitted At</span><strong>{new Date(request.submitted_at).toLocaleString()}</strong></div>
        <div><span>Reviewed By</span><strong>{request.reviewed_by?.name || '—'}</strong></div>
      </div>
    </SectionCard>
  );
}
