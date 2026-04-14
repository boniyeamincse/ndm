export function PageContainer({ children, flush = false }) {
  return (
    <div className={`adm-page-container ${flush ? 'adm-page-container--flush' : ''}`.trim()}>
      {children}
    </div>
  );
}

export function PageSection({ children, className = '' }) {
  return (
    <section className={`adm-page-section ${className}`.trim()}>
      {children}
    </section>
  );
}

export default function AdminContentWrapper({ children, fluid = false }) {
  return (
    <div className={`adm-content-wrapper ${fluid ? 'adm-content-wrapper--fluid' : ''}`.trim()}>
      {children}
    </div>
  );
}
