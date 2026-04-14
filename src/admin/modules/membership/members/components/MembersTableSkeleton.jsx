import { LoadingSkeleton } from '../../shared/components/PageStates';

export default function MembersTableSkeleton({ rows = 8 }) {
  return <LoadingSkeleton rows={rows} />;
}
