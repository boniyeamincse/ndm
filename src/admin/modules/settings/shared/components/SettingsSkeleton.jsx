import { LoadingSkeleton } from '../../../membership/shared/components/PageStates';

export default function SettingsSkeleton({ rows = 6 }) {
  return <LoadingSkeleton rows={rows} />;
}
