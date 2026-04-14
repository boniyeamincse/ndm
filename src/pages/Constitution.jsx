import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, Vote, Users, BookOpenCheck, Landmark } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Constitution.css';

const PRINCIPLES = [
  {
    icon: <Scale size={20} />,
    en: 'Democracy and constitutional governance',
    bn: 'গণতন্ত্র ও সাংবিধানিক শাসনব্যবস্থা',
  },
  {
    icon: <ShieldCheck size={20} />,
    en: 'Rule of law and accountability',
    bn: 'আইনের শাসন ও জবাবদিহিতা',
  },
  {
    icon: <Vote size={20} />,
    en: 'Student rights and fair representation',
    bn: 'শিক্ষার্থীদের অধিকার ও ন্যায্য প্রতিনিধিত্ব',
  },
  {
    icon: <Users size={20} />,
    en: 'Inclusive participation without discrimination',
    bn: 'বৈষম্যহীন অন্তর্ভুক্তিমূলক অংশগ্রহণ',
  },
];

const ARTICLES = [
  {
    no: 'Article 1',
    titleEn: 'Name and Identity',
    titleBn: 'নাম ও পরিচিতি',
    bodyEn: 'The name of the organization shall be Student Movement - NDM, functioning as the student wing aligned with democratic values and national reform.',
    bodyBn: 'সংগঠনের নাম হবে ছাত্র আন্দোলন - এনডিএম, যা গণতান্ত্রিক মূল্যবোধ ও জাতীয় সংস্কারের লক্ষ্যে ছাত্র শাখা হিসেবে পরিচালিত হবে।',
  },
  {
    no: 'Article 2',
    titleEn: 'Aims and Objectives',
    titleBn: 'লক্ষ্য ও উদ্দেশ্য',
    bodyEn: 'To build politically conscious youth leadership, protect student rights, and strengthen democratic culture on campuses and across Bangladesh.',
    bodyBn: 'রাজনৈতিকভাবে সচেতন তরুণ নেতৃত্ব গড়ে তোলা, শিক্ষার্থীদের অধিকার রক্ষা করা এবং ক্যাম্পাস ও জাতীয় পর্যায়ে গণতান্ত্রিক সংস্কৃতি শক্তিশালী করা।',
  },
  {
    no: 'Article 3',
    titleEn: 'Membership',
    titleBn: 'সদস্যপদ',
    bodyEn: 'Any student who agrees with the core principles and code of conduct may apply for membership, subject to verification by the relevant unit committee.',
    bodyBn: 'মূলনীতি ও আচরণবিধির সাথে একমত যেকোনো শিক্ষার্থী সংশ্লিষ্ট ইউনিট কমিটির যাচাই সাপেক্ষে সদস্যপদের জন্য আবেদন করতে পারবে।',
  },
  {
    no: 'Article 4',
    titleEn: 'Organizational Structure',
    titleBn: 'সাংগঠনিক কাঠামো',
    bodyEn: 'The organization shall operate through central, district, and campus committees with clear delegation of authority and transparent reporting.',
    bodyBn: 'সংগঠন কেন্দ্রীয়, জেলা ও ক্যাম্পাস কমিটির মাধ্যমে পরিচালিত হবে; কর্তৃত্ব বণ্টন ও রিপোর্টিং হবে সুস্পষ্ট ও স্বচ্ছ।',
  },
  {
    no: 'Article 5',
    titleEn: 'Code of Conduct',
    titleBn: 'আচরণবিধি',
    bodyEn: 'All members must uphold discipline, non-violence, respect for diversity, and ethical political engagement in all organizational activities.',
    bodyBn: 'সকল সদস্যকে শৃঙ্খলা, অহিংসা, বৈচিত্র্যের প্রতি সম্মান এবং নৈতিক রাজনৈতিক আচরণ বজায় রাখতে হবে।',
  },
  {
    no: 'Article 6',
    titleEn: 'Amendments',
    titleBn: 'সংশোধনী',
    bodyEn: 'This constitution may be amended by a qualified majority through the official decision-making process of the central committee conference.',
    bodyBn: 'কেন্দ্রীয় কমিটির আনুষ্ঠানিক সিদ্ধান্ত গ্রহণ প্রক্রিয়ার মাধ্যমে নির্ধারিত সংখ্যাগরিষ্ঠ ভোটে এই সংবিধান সংশোধন করা যাবে।',
  },
];

export default function Constitution() {
  const { lang } = useLang();
  useScrollReveal();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{lang === 'en' ? 'Home' : 'হোম'}</Link>
            <span>/</span>
            <span>{lang === 'en' ? 'Constitution' : 'সংবিধান'}</span>
          </div>
          <h1>{lang === 'en' ? 'Organization Constitution' : 'সংগঠনের সংবিধান'}</h1>
          <p>
            {lang === 'en'
              ? 'Foundational rules, principles, and governance framework of Student Movement - NDM.'
              : 'ছাত্র আন্দোলন - এনডিএম এর মূলনীতি, শাসন কাঠামো ও সাংগঠনিক বিধিমালা।'}
          </p>
        </div>
      </section>

      <section className="section-pad constitution-intro">
        <div className="container constitution-intro__layout">
          <div className="reveal">
            <span className="section-label">{lang === 'en' ? 'Preamble' : 'প্রস্তাবনা'}</span>
            <h2 className="section-title" style={{ marginTop: '.8rem' }}>
              {lang === 'en' ? 'Commitment to Democratic Student Politics' : 'গণতান্ত্রিক ছাত্র রাজনীতির প্রতি অঙ্গীকার'}
            </h2>
            <div className="divider divider-left" />
            <p className="constitution-copy">
              {lang === 'en'
                ? 'We, the members of Student Movement - NDM, adopt this constitution to establish a transparent, disciplined, and democratic organizational culture that empowers students to lead national change.'
                : 'আমরা, ছাত্র আন্দোলন - এনডিএম এর সদস্যবৃন্দ, একটি স্বচ্ছ, শৃঙ্খলাবদ্ধ ও গণতান্ত্রিক সাংগঠনিক সংস্কৃতি প্রতিষ্ঠার লক্ষ্যে এই সংবিধান গ্রহণ করছি, যাতে শিক্ষার্থীরা জাতীয় পরিবর্তনের নেতৃত্ব দিতে পারে।'}
            </p>
          </div>

          <aside className="constitution-note reveal">
            <div className="constitution-note__icon">
              <Landmark size={24} />
            </div>
            <h3>{lang === 'en' ? 'Document Status' : 'ডকুমেন্টের অবস্থা'}</h3>
            <p>
              {lang === 'en'
                ? 'This page presents a public summary version of the constitution. The official full text should be maintained by the central committee.'
                : 'এই পৃষ্ঠায় সংবিধানের জনসম্মুখে প্রকাশযোগ্য সারসংক্ষেপ দেখানো হয়েছে। পূর্ণাঙ্গ অফিসিয়াল সংস্করণ কেন্দ্রীয় কমিটি সংরক্ষণ করবে।'}
            </p>
          </aside>
        </div>
      </section>

      <section className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{lang === 'en' ? 'Core Principles' : 'মূল নীতি'}</span>
            <h2 className="section-title">{lang === 'en' ? 'Foundational Values' : 'ভিত্তিগত মূল্যবোধ'}</h2>
            <div className="divider" />
          </div>
          <div className="constitution-principles">
            {PRINCIPLES.map((item, i) => (
              <article className="constitution-principle reveal" key={i} style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="constitution-principle__icon">{item.icon}</div>
                <p>{lang === 'en' ? item.en : item.bn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{lang === 'en' ? 'Articles' : 'অনুচ্ছেদসমূহ'}</span>
            <h2 className="section-title">{lang === 'en' ? 'Constitution Summary' : 'সংবিধানের সারসংক্ষেপ'}</h2>
            <div className="divider" />
          </div>

          <div className="constitution-articles">
            {ARTICLES.map((article, i) => (
              <article className="constitution-article card reveal" key={article.no} style={{ transitionDelay: `${i * 0.06}s` }}>
                <div className="constitution-article__head">
                  <span className="constitution-article__no">{article.no}</span>
                  <h3>{lang === 'en' ? article.titleEn : article.titleBn}</h3>
                </div>
                <p>{lang === 'en' ? article.bodyEn : article.bodyBn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad constitution-actions">
        <div className="container constitution-actions__inner reveal">
          <BookOpenCheck size={22} />
          <p>
            {lang === 'en'
              ? 'For the official approved document, contact the central office or request a signed PDF copy.'
              : 'অফিসিয়াল অনুমোদিত কপির জন্য কেন্দ্রীয় কার্যালয়ে যোগাযোগ করুন অথবা স্বাক্ষরিত PDF কপি অনুরোধ করুন।'}
          </p>
          <Link to="/contact" className="btn btn-outline">
            {lang === 'en' ? 'Contact Office' : 'কার্যালয়ে যোগাযোগ'}
          </Link>
        </div>
      </section>
    </main>
  );
}