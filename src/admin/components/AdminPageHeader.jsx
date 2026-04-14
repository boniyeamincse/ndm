import { Link } from 'react-router-dom';

export default function AdminPageHeader({ title, subtitle, breadcrumbs = [], actions = null }) {
  return (
    <section className="adm-page-header">
      <div className="adm-page-header__meta">
        {breadcrumbs.length ? (
          <nav className="adm-breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((item, index) => (
              item.path ? (
                <Link key={`${item.label}-${index}`} to={item.path} className="adm-breadcrumbs__item">
                  {item.label}
                </Link>
              ) : (
                <span key={`${item.label}-${index}`} className="adm-breadcrumbs__item adm-breadcrumbs__item--current">
                  {item.label}
                </span>
              )
            ))}
          </nav>
        ) : null}
        <div>
          <h1 className="adm-page-header__title">{title}</h1>
          {subtitle ? <p className="adm-page-header__subtitle">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="adm-page-header__actions">{actions}</div> : null}
    </section>
  );
}
