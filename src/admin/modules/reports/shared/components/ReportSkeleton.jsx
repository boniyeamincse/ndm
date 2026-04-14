import { LoadingSkeleton } from '../../../membership/shared/components/PageStates';

export default function ReportSkeleton({ rows = 8 }) {
  return <LoadingSkeleton rows={rows} />;
}
