import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function FloatingJoin() {
  const { t } = useLang();
  return (
    <Link to="/join" className="floating-join" aria-label="Join Movement">
      <UserPlus size={18} />
      {t('nav_join_btn')}
    </Link>
  );
}
