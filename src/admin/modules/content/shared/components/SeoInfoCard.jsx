import SectionCard from '../../../membership/shared/components/SectionCard';
import InfoGrid from '../../../membership/shared/components/InfoGrid';

export default function SeoInfoCard({ data = {} }) {
  return (
    <SectionCard title="SEO / Meta Information">
      <InfoGrid
        items={[
          { label: 'Meta Title', value: data.meta_title || '—' },
          { label: 'Meta Description', value: data.meta_description || '—' },
          { label: 'Meta Keywords', value: data.meta_keywords || '—' },
          { label: 'Slug', value: data.slug || '—' },
        ]}
      />
    </SectionCard>
  );
}
