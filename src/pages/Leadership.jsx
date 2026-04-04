import { Link } from 'react-router-dom';
import { Mail, Phone, Link2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Leadership.css';

const CENTRAL_COMMITTEE = [
  {
    name_en: 'Masud Rana Jewel', name_bn: 'মাসুদ রানা জুয়েল',
    role_en: 'President', role_bn: 'সভাপতি',
    university_en: 'Dhaka University, Law Dept.', university_bn: 'ঢাকা বিশ্ববিদ্যালয়, আইন বিভাগ',
    bio_en: 'Political science scholar and campus activist since 2022. Led student unions in three consecutive terms.',
    bio_bn: '২০২২ সাল থেকে রাজনৈতিক বিজ্ঞান গবেষক ও ক্যাম্পাস কর্মী। টানা তিনবার ছাত্র সংসদে নেতৃত্ব দিয়েছেন।',
    facebook: 'https://www.facebook.com/masud.rana.jewel.2025',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  },
  {
    name_en: 'Nasrin Akter', name_bn: 'নাসরিন আক্তার',
    role_en: 'General Secretary', role_bn: 'সাধারণ সম্পাদক',
    university_en: 'BUET, Civil Engineering', university_bn: 'বুয়েট, সিভিল ইঞ্জিনিয়ারিং',
    bio_en: 'Engineering student turned youth leader. Champion of STEM education reforms and gender equality on campuses.',
    bio_bn: 'ইঞ্জিনিয়ারিং শিক্ষার্থী থেকে যুব নেতা। ক্যাম্পাসে এসটিইএম শিক্ষা সংস্কার ও লিঙ্গ সমতার প্রবক্তা।',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80',
  },
  {
    name_en: 'Karim Hossain', name_bn: 'করিম হোসেন',
    role_en: 'Joint Secretary', role_bn: 'যুগ্ম সম্পাদক',
    university_en: 'Chittagong University, Economics', university_bn: 'চট্টগ্রাম বিশ্ববিদ্যালয়, অর্থনীতি',
    bio_en: 'Economist and youth policy researcher. Architect of the movement\'s economic manifesto for students.',
    bio_bn: 'অর্থনীতিবিদ ও যুব নীতি গবেষক। শিক্ষার্থীদের জন্য আন্দোলনের অর্থনৈতিক ইশতেহারের রচয়িতা।',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
  },
  {
    name_en: 'Farida Begum', name_bn: 'ফরিদা বেগম',
    role_en: 'Women Affairs Secretary', role_bn: 'মহিলা বিষয়ক সম্পাদক',
    university_en: 'Rajshahi University, Sociology', university_bn: 'রাজশাহী বিশ্ববিদ্যালয়, সমাজবিজ্ঞান',
    bio_en: 'Activist for women\'s rights in higher education. Leads the women\'s wing of the student movement.',
    bio_bn: 'উচ্চশিক্ষায় নারী অধিকারের সক্রিয় কর্মী। ছাত্র আন্দোলনের মহিলা শাখার নেতৃত্ব দেন।',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
  },
  {
    name_en: 'Tanvir Ahmed', name_bn: 'তানভীর আহমেদ',
    role_en: 'Organizing Secretary', role_bn: 'সংগঠন সম্পাদক',
    university_en: 'Jahangirnagar University, Economics', university_bn: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়, অর্থনীতি',
    bio_en: 'Organizational strategist responsible for expanding the movement to 64 districts.',
    bio_bn: 'সাংগঠনিক কৌশলবিদ, ৬৪ জেলায় আন্দোলন সম্প্রসারণের দায়িত্বশীল।',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
  },
  {
    name_en: 'Mim Sultana', name_bn: 'মিম সুলতানা',
    role_en: 'Cultural Secretary', role_bn: 'সাংস্কৃতিক সম্পাদক',
    university_en: 'Dhaka University, Fine Arts', university_bn: 'ঢাকা বিশ্ববিদ্যালয়, চারুকলা',
    bio_en: 'Visual artist and cultural activist who uses art to communicate the movement\'s message.',
    bio_bn: 'ভিজ্যুয়াল আর্টিস্ট ও সাংস্কৃতিক কর্মী যিনি শিল্পকলার মাধ্যমে আন্দোলনের বার্তা পৌঁছে দেন।',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  },
];

const DISTRICT_LEADERS = [
  { district_en: 'Dhaka', district_bn: 'ঢাকা', name_en: 'Arif Rahman', name_bn: 'আরিফ রহমান' },
  { district_en: 'Chittagong', district_bn: 'চট্টগ্রাম', name_en: 'Rubel Chowdhury', name_bn: 'রুবেল চৌধুরী' },
  { district_en: 'Rajshahi', district_bn: 'রাজশাহী', name_en: 'Sohel Rana', name_bn: 'সোহেল রানা' },
  { district_en: 'Khulna', district_bn: 'খুলনা', name_en: 'Sabina Yesmin', name_bn: 'সাবিনা ইয়াসমিন' },
  { district_en: 'Sylhet', district_bn: 'সিলেট', name_en: 'Noor Islam', name_bn: 'নূর ইসলাম' },
  { district_en: 'Barisal', district_bn: 'বরিশাল', name_en: 'Riya Das', name_bn: 'রিয়া দাস' },
  { district_en: 'Mymensingh', district_bn: 'ময়মনসিংহ', name_en: 'Hasan Ali', name_bn: 'হাসান আলী' },
  { district_en: 'Rangpur', district_bn: 'রংপুর', name_en: 'Poly Khatun', name_bn: 'পলি খাতুন' },
];

export default function Leadership() {
  const { t, lang } = useLang();
  useScrollReveal();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_leadership')}</span>
          </div>
          <h1>{t('leader_hero_title')}</h1>
          <p>{t('leader_hero_sub')}</p>
        </div>
      </section>

      {/* Central Committee */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('leader_committee_label')}</span>
            <h2 className="section-title">{t('leader_committee_title')}</h2>
            <div className="divider" />
          </div>
          <div className="leader-grid">
            {CENTRAL_COMMITTEE.map((l, i) => (
              <div className="leader-full-card card reveal" key={i} style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="leader-full-card__img">
                  <img src={l.img} alt={lang === 'en' ? l.name_en : l.name_bn} loading="lazy" />
                  <div className="leader-full-card__overlay">
                    <a href="#" aria-label="Email"><Mail size={16} /></a>
                    <a href="#" aria-label="Phone"><Phone size={16} /></a>
                    <a
                      href={l.facebook || '#'}
                      target={l.facebook ? '_blank' : undefined}
                      rel={l.facebook ? 'noopener noreferrer' : undefined}
                      aria-label="Facebook"
                    >
                      <Link2 size={16} />
                    </a>
                  </div>
                </div>
                <div className="leader-full-card__body">
                  <h3>{lang === 'en' ? l.name_en : l.name_bn}</h3>
                  <span className="badge badge-red">{lang === 'en' ? l.role_en : l.role_bn}</span>
                  <p className="leader-full-card__uni">{lang === 'en' ? l.university_en : l.university_bn}</p>
                  <p className="leader-full-card__bio">{lang === 'en' ? l.bio_en : l.bio_bn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* District Leaders */}
      <section className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('leader_district_label')}</span>
            <h2 className="section-title">{t('leader_district_title')}</h2>
            <div className="divider" />
          </div>
          <div className="district-grid">
            {DISTRICT_LEADERS.map((d, i) => (
              <div className="district-card card reveal" key={i}>
                <div className="district-card__badge">
                  {(lang === 'en' ? d.district_en : d.district_bn).charAt(0)}
                </div>
                <div>
                  <h4>{lang === 'en' ? d.district_en : d.district_bn}</h4>
                  <p>{lang === 'en' ? d.name_en : d.name_bn}</p>
                  <span className="badge badge-red" style={{ marginTop: '.4rem' }}>
                    {lang === 'en' ? 'District Coordinator' : 'জেলা সমন্বয়কারী'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
