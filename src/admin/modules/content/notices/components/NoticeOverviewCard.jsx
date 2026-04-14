import SectionCard from '../../../membership/shared/components/SectionCard';
import NoticeAudienceBadge from '../../shared/components/NoticeAudienceBadge';
import NoticePriorityBadge from '../../shared/components/NoticePriorityBadge';
import NoticeStatusBadge from '../../shared/components/NoticeStatusBadge';
import NoticeVisibilityBadge from '../../shared/components/NoticeVisibilityBadge';
import { formatDateTime } from '../../shared/utils/contentFormatters';

export default function NoticeOverviewCard({ notice }) {
  return (
    <SectionCard title={notice.title} subtitle={notice.summary}>
      <div className="cnt-overview-head__badges">
        <span className="cnt-pill cnt-pill--slate">{notice.notice_no}</span>
        <NoticePriorityBadge value={notice.priority} />
        <NoticeStatusBadge value={notice.status} />
        <NoticeVisibilityBadge value={notice.visibility} />
        <NoticeAudienceBadge value={notice.audience_type} />
        {notice.is_pinned ? <span className="cnt-pill cnt-pill--amber">Pinned</span> : null}
      </div>
      <div className="cnt-overview-meta">
        <div><span>Author</span><strong>{notice.author_name}</strong></div>
        <div><span>Approver</span><strong>{notice.approver_name}</strong></div>
        <div><span>Publish At</span><strong>{formatDateTime(notice.publish_at)}</strong></div>
        <div><span>Expires At</span><strong>{formatDateTime(notice.expires_at)}</strong></div>
      </div>
    </SectionCard>
  );
}
