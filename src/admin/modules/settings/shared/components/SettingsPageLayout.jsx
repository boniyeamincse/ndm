import AdminPageHeader from '../../../../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../../../../components/AdminContentWrapper';
import { ErrorState } from '../../../membership/shared/components/PageStates';
import SettingsNav from './SettingsNav';
import SettingsSkeleton from './SettingsSkeleton';

export default function SettingsPageLayout({ title, subtitle, breadcrumbs, loading, error, onRetry, feedback, children }) {
  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
        <PageSection className="stg-layout">
          <div className="stg-layout__nav"><SettingsNav /></div>
          <div className="stg-layout__main">
            {feedback ? <div className="stg-feedback">{feedback}</div> : null}
            {loading ? <SettingsSkeleton rows={6} /> : null}
            {error ? <ErrorState message={error} onRetry={onRetry} /> : null}
            {!loading && !error ? children : null}
          </div>
        </PageSection>
      </PageContainer>
    </AdminContentWrapper>
  );
}
