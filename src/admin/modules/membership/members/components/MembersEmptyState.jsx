import { EmptyState } from '../../shared/components/PageStates';

export default function MembersEmptyState({ title = 'No members found', subtitle = 'Try adjusting filters and search terms.' }) {
  return <EmptyState title={title} subtitle={subtitle} />;
}
