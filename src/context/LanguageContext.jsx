import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // NAV
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_leadership: 'Leadership',
    nav_activities: 'Activities',
    nav_news: 'News',
    nav_publications: 'Publications',
    nav_join: 'Join Us',
    nav_contact: 'Contact',
    nav_join_btn: 'Join the Movement',
    lang_toggle: 'বাংলা',
  nav_login: 'Login',
  nav_dashboard: 'Dashboard',
  nav_logout: 'Logout',

    // HOME HERO
    hero_label: 'Student Wing of NDM Bangladesh',
    hero_title: 'Rise. Unite.',
    hero_title_accent: 'Lead the Change.',
    hero_subtitle:
      'Student Movement – NDM empowers the youth of Bangladesh to build a democratic, just, and prosperous nation through education, activism, and unity.',
    hero_cta_primary: 'Join the Movement',
    hero_cta_secondary: 'Learn More',
    hero_stat1: 'Student Members',
    hero_stat2: 'Universities',
    hero_stat3: 'Districts',
    hero_stat4: 'Years of Struggle',

    // HOME – ABOUT STRIP
    home_about_label: 'Who We Are',
    home_about_title: 'The Voice of the Youth Nation',
    home_about_body:
      'Student Movement – NDM is the official student wing of the National Democratic Movement (NDM), Bangladesh. Founded on the principles of democratic governance, social justice, and national progress, we mobilize the student community across every university and college in Bangladesh.',
    home_about_cta: 'Read Full Story',

    // HOME – HIGHLIGHTS
    highlights_label: 'What We Do',
    highlights_title: 'Our Core Focus Areas',
    highlight1_title: 'Democratic Advocacy',
    highlight1_body: 'Championing free and fair elections, student rights, and constitutional democracy across campuses.',
    highlight2_title: 'Youth Leadership',
    highlight2_body: 'Developing the next generation of national leaders through training programs, debates, and workshops.',
    highlight3_title: 'Social Campaigns',
    highlight3_body: 'Running impactful campaigns on education reform, anti-corruption, and environmental awareness.',
    highlight4_title: 'Academic Freedom',
    highlight4_body: 'Defending the rights of students to study, speak, and organize freely on every campus.',

    // HOME – NEWS
    home_news_label: 'Latest Updates',
    home_news_title: 'News & Announcements',
    home_news_cta: 'View All News',

    // HOME – LEADERSHIP SPOTLIGHT
    home_leader_label: 'Leadership Spotlight',
    home_leader_title: 'Meet Our Central Committee',
    home_leader_cta: 'Full Leadership',

    // HOME – JOIN CTA
    cta_title: 'Be Part of the Movement',
    cta_subtitle:
      'Thousands of students across Bangladesh have already joined. Your voice matters. Your action shapes the future.',
    cta_btn1: 'Become a Member',
    cta_btn2: 'Volunteer Now',

    // HOME – NEWSLETTER
    newsletter_title: 'Stay Updated',
    newsletter_body: 'Subscribe to our newsletter for movement news, campaign updates, and events.',
    newsletter_placeholder: 'Your email address',
    newsletter_btn: 'Subscribe',

    // ABOUT
    about_hero_title: 'About Us',
    about_hero_sub: 'Our story, mission, and values',
    about_mission_label: 'Mission',
    about_mission_title: 'Why We Exist',
    about_mission_body:
      'We exist to amplify the political conscience of Bangladeshi students — to equip them with knowledge, values, and the will to demand a transparent, democratic Bangladesh for future generations.',
    about_vision_label: 'Vision',
    about_vision_title: 'Where We Are Headed',
    about_vision_body:
      'A Bangladesh where every young person has the right and opportunity to participate in shaping their nation, free from fear, corruption, and political oppression.',
    about_values_label: 'Core Principles',
    about_values_title: 'Our 4 Main Principles',
    val1: 'Education',
    val2: 'Discipline',
    val3: 'Technology',
    val4: 'Prosperity',
    about_history_label: 'Our History',
    about_history_title: 'A Movement Born from Struggle',
    about_history_body:
      "Student Movement \u2013 NDM was established as the student wing of the National Democratic Movement (NDM), led by political leader and scholar Bobby Hajjaj. Born out of the July\u2013August 2024 mass uprising, this movement channels the energy and aspirations of Bangladesh's student community into a structured, principled, and forward-looking political force. We stand for democratic reform, accountability, and a student community that is informed, organized, and heard.",
    about_ndm_label: 'Parent Organization',
    about_ndm_title: 'Our Relationship with NDM',
    about_ndm_body:
      'The National Democratic Movement (NDM) is a progressive political party in Bangladesh dedicated to democratic governance, rule of law, and socioeconomic development. Student Movement – NDM functions as the student arm of this larger movement, sharing its core ideology while addressing specifically youth and campus-related issues.',

    // LEADERSHIP
    leader_hero_title: 'Leadership',
    leader_hero_sub: 'Meet the people steering the movement',
    leader_committee_label: 'Central Committee',
    leader_committee_title: 'Our National Leadership',
    leader_district_label: 'District Units',
    leader_district_title: 'Leaders Across Bangladesh',

    // ACTIVITIES
    act_hero_title: 'Activities & Programs',
    act_hero_sub: 'Campaigns, events, and student initiatives',
    act_campaigns_label: 'Campaigns',
    act_campaigns_title: 'Our Active Campaigns',
    act_events_label: 'Upcoming Events',
    act_events_title: 'Join Us at These Events',
    act_gallery_label: 'Gallery',
    act_gallery_title: 'Moments from the Movement',

    // NEWS
    news_hero_title: 'News & Updates',
    news_hero_sub: 'Latest from Student Movement – NDM',
    news_all: 'All',
    news_campus: 'Campus',
    news_national: 'National',
    news_events: 'Events',
    news_press: 'Press',
    news_read_more: 'Read More',
    news_search_placeholder: 'Search news...',

    // PUBLICATIONS
    pub_hero_title: 'Publications',
    pub_hero_sub: 'Statements, documents, and press releases',
    pub_all: 'All',
    pub_statements: 'Statements',
    pub_press: 'Press Releases',
    pub_docs: 'Documents',
    pub_manifestos: 'Manifestos',
    pub_download: 'Download PDF',

    // JOIN
    join_hero_title: 'Join the Movement',
    join_hero_sub: 'Be part of something bigger than yourself',
    join_why_label: 'Why Join?',
    join_why_title: 'What You Gain',
    join_form_title: 'Membership Application',
    join_fname: 'Full Name',
    join_email: 'Email Address',
    join_phone: 'Phone Number',
    join_university: 'University / College',
    join_dept: 'Department / Faculty',
    join_year: 'Year of Study',
    join_year_1: '1st Year',
    join_year_2: '2nd Year',
    join_year_3: '3rd Year',
    join_year_4: '4th Year',
    join_year_masters: 'Masters',
    join_district: 'District',
    join_why_join: 'Why do you want to join? (optional)',
    join_submit: 'Submit Application',
    join_vol_title: 'Volunteer Opportunities',
    join_success: 'Thank you! Your application has been submitted.',

    // CONTACT
    contact_hero_title: 'Contact Us',
      // LOGIN
      login_title: 'Member Login',
      login_sub: 'Sign in to access your member account',
      login_desc: 'Enter your registered email and password to continue.',
      login_email: 'Email Address',
      login_password: 'Password',
      login_forgot: 'Forgot password?',
      login_submit: 'Sign In',
      login_no_account: "Don't have an account?",
      login_join_link: 'Apply for membership',

      // MEMBER DASHBOARD
      dash_title: 'Member Dashboard',
      dash_sub: 'Your personal member area',
      dash_welcome: 'Welcome back,',
      dash_member: 'Member',
      dash_quick_links: 'Quick Links',
      dash_quick_news: 'Latest News',
      dash_quick_events: 'Upcoming Activities',
      dash_quick_publications: 'Publications',

    contact_hero_sub: 'Get in touch with Student Movement – NDM',
    contact_office: 'Central Office',
    contact_address_val: 'NDM Central Office, Dhaka, Bangladesh',
    contact_email_val: 'studentmovement@ndmbd.org',
    contact_phone_val: '+880 1700-000000',
    contact_follow: 'Follow Us',
    contact_form_title: 'Send a Message',
    contact_name: 'Your Name',
    contact_email: 'Your Email',
    contact_subject: 'Subject',
    contact_message: 'Your Message',
    contact_send: 'Send Message',
    contact_success: 'Message sent successfully!',

    // FOOTER
    footer_tagline: 'The student wing of National Democratic Movement, Bangladesh.',
    footer_quick: 'Quick Links',
    footer_connect: 'Connect',
    footer_rights: '© 2026 ছাত্র আন্দোলন-এনডিএম. All rights reserved.',
    footer_parent: 'A wing of',
  },

  bn: {
    // NAV
    nav_home: 'হোম',
    nav_about: 'আমাদের সম্পর্কে',
    nav_leadership: 'নেতৃত্ব',
    nav_activities: 'কার্যক্রম',
    nav_news: 'সংবাদ',
    nav_publications: 'প্রকাশনা',
    nav_join: 'যোগ দিন',
    nav_contact: 'যোগাযোগ',
    nav_join_btn: 'আন্দোলনে যোগ দিন',
    lang_toggle: 'English',
  nav_login: 'লগইন',
  nav_dashboard: 'ড্যাশবোর্ড',
  nav_logout: 'লগআউট',

    // HOME HERO
    hero_label: 'জাতীয় গণতান্ত্রিক আন্দোলনের ছাত্র শাখা',
    hero_title: 'জেগে ওঠো। একতাবদ্ধ হও।',
    hero_title_accent: 'পরিবর্তনের নেতৃত্ব দাও।',
    hero_subtitle:
      'ছাত্র আন্দোলন – এনডিএম বাংলাদেশের তরুণদের শিক্ষা, সক্রিয়তা ও ঐক্যের মাধ্যমে একটি গণতান্ত্রিক, ন্যায়সঙ্গত ও সমৃদ্ধ জাতি গড়তে সক্ষম করে তোলে।',
    hero_cta_primary: 'আন্দোলনে যোগ দিন',
    hero_cta_secondary: 'আরও জানুন',
    hero_stat1: 'ছাত্র সদস্য',
    hero_stat2: 'বিশ্ববিদ্যালয়',
    hero_stat3: 'জেলা',
    hero_stat4: 'বছরের সংগ্রাম',

    // HOME – ABOUT STRIP
    home_about_label: 'আমরা কারা',
    home_about_title: 'তরুণ জাতির কণ্ঠস্বর',
    home_about_body:
      'ছাত্র আন্দোলন – এনডিএম হলো জাতীয় গণতান্ত্রিক আন্দোলন (এনডিএম), বাংলাদেশের সরকারি ছাত্র শাখা। গণতান্ত্রিক শাসন, সামাজিক ন্যায়বিচার ও জাতীয় অগ্রগতির নীতির উপর ভিত্তি করে গড়ে উঠা এই সংগঠন বাংলাদেশের প্রতিটি বিশ্ববিদ্যালয় ও কলেজের ছাত্র সমাজকে ঐক্যবদ্ধ করে।',
    home_about_cta: 'সম্পূর্ণ গল্প পড়ুন',

    // HOME – HIGHLIGHTS
    highlights_label: 'আমরা কী করি',
    highlights_title: 'আমাদের মূল কার্যক্ষেত্র',
    highlight1_title: 'গণতান্ত্রিক অ্যাডভোকেসি',
    highlight1_body: 'অবাধ ও সুষ্ঠু নির্বাচন, ছাত্র অধিকার এবং সাংবিধানিক গণতন্ত্রের পক্ষে সক্রিয় অবস্থান।',
    highlight2_title: 'তরুণ নেতৃত্ব',
    highlight2_body: 'প্রশিক্ষণ কর্মসূচি, বিতর্ক ও কর্মশালার মাধ্যমে পরবর্তী প্রজন্মের জাতীয় নেতা গড়ে তোলা।',
    highlight3_title: 'সামাজিক আন্দোলন',
    highlight3_body: 'শিক্ষা সংস্কার, দুর্নীতি বিরোধী এবং পরিবেশ সচেতনতার উপর প্রভাবশালী ক্যাম্পেইন পরিচালনা।',
    highlight4_title: 'শিক্ষার স্বাধীনতা',
    highlight4_body: 'প্রতিটি ক্যাম্পাসে ছাত্রদের অধ্যয়ন, বক্তব্য ও সংগঠিত হওয়ার অধিকার রক্ষা।',

    // HOME – NEWS
    home_news_label: 'সর্বশেষ আপডেট',
    home_news_title: 'সংবাদ ও ঘোষণা',
    home_news_cta: 'সকল সংবাদ দেখুন',

    // HOME – LEADERSHIP SPOTLIGHT
    home_leader_label: 'নেতৃত্ব পরিচিতি',
    home_leader_title: 'কেন্দ্রীয় কমিটির সাথে পরিচিত হন',
    home_leader_cta: 'সকল নেতৃত্ব',

    // HOME – JOIN CTA
    cta_title: 'আন্দোলনের অংশ হন',
    cta_subtitle:
      'বাংলাদেশ জুড়ে হাজার হাজার শিক্ষার্থী ইতিমধ্যে যোগ দিয়েছে। আপনার কণ্ঠস্বর গুরুত্বপূর্ণ। আপনার পদক্ষেপ ভবিষ্যৎ গড়ে দেয়।',
    cta_btn1: 'সদস্য হন',
    cta_btn2: 'স্বেচ্ছাসেবক হন',

    // HOME – NEWSLETTER
    newsletter_title: 'আপডেট পান',
    newsletter_body: 'আন্দোলনের সংবাদ, ক্যাম্পেইন আপডেট ও ইভেন্টের জন্য আমাদের নিউজলেটারে সাবস্ক্রাইব করুন।',
    newsletter_placeholder: 'আপনার ইমেইল ঠিকানা',
    newsletter_btn: 'সাবস্ক্রাইব',

    // ABOUT
    about_hero_title: 'আমাদের সম্পর্কে',
    about_hero_sub: 'আমাদের গল্প, লক্ষ্য ও মূল্যবোধ',
    about_mission_label: 'লক্ষ্য',
    about_mission_title: 'কেন আমরা আছি',
    about_mission_body:
      'বাংলাদেশী শিক্ষার্থীদের রাজনৈতিক সচেতনতা বাড়ানো — তাদের জ্ঞান, মূল্যবোধ ও একটি স্বচ্ছ, গণতান্ত্রিক বাংলাদেশ দাবি করার ইচ্ছা দিয়ে সজ্জিত করা।',
    about_vision_label: 'দৃষ্টিভঙ্গি',
    about_vision_title: 'আমরা কোথায় যাচ্ছি',
    about_vision_body:
      'এমন একটি বাংলাদেশ যেখানে প্রতিটি তরুণের তার জাতি গঠনে অংশ নেওয়ার অধিকার ও সুযোগ আছে — ভয়, দুর্নীতি ও রাজনৈতিক নিপীড়ন মুক্ত।',
    about_values_label: 'ছাত্র আন্দোলনের মূলনীতি',
    about_values_title: '৪ টি মূলনীতি',
    val1: 'শিক্ষা',
    val2: 'শৃঙ্খলা',
    val3: 'প্রযুক্তি',
    val4: 'সমৃদ্ধি',
    about_history_label: 'আমাদের ইতিহাস',
    about_history_title: 'সংগ্রাম থেকে জন্ম নেওয়া আন্দোলন',
    about_history_body:
      'ছাত্র আন্দোলন – এনডিএম রাজনৈতিক নেতা ও পণ্ডিত ববি হাজ্জাজ নেতৃত্বাধীন জাতীয় গণতান্ত্রিক আন্দোলনের (এনডিএম) ছাত্র শাখা হিসেবে প্রতিষ্ঠিত হয়েছে। ২০২৪ সালের জুলাই–আগস্ট গণঅভ্যুত্থান থেকে জন্ম নেওয়া এই আন্দোলন বাংলাদেশের ছাত্র সমাজের শক্তি ও আকাঙ্ক্ষাকে একটি সংগঠিত, নীতিনিষ্ঠ ও ভবিষ্যৎমুখী রাজনৈতিক শক্তিতে রূপান্তরিত করে।',
    about_ndm_label: 'মূল সংগঠন',
    about_ndm_title: 'এনডিএম এর সাথে আমাদের সম্পর্ক',
    about_ndm_body:
      'জাতীয় গণতান্ত্রিক আন্দোলন (এনডিএম) বাংলাদেশের একটি প্রগতিশীল রাজনৈতিক দল যা গণতান্ত্রিক শাসন, আইনের শাসন ও আর্থ-সামাজিক উন্নয়নে নিবেদিত। ছাত্র আন্দোলন – এনডিএম এই বৃহত্তর আন্দোলনের ছাত্র শাখা হিসেবে কাজ করে।',

    // LEADERSHIP
    leader_hero_title: 'নেতৃত্ব',
    leader_hero_sub: 'আন্দোলনের নেতৃত্বদানকারীদের সাথে পরিচিত হন',
    leader_committee_label: 'কেন্দ্রীয় কমিটি',
    leader_committee_title: 'আমাদের জাতীয় নেতৃত্ব',
    leader_district_label: 'জেলা ইউনিট',
    leader_district_title: 'সারা বাংলাদেশে নেতৃত্ব',

    // ACTIVITIES
    act_hero_title: 'কার্যক্রম ও কর্মসূচি',
    act_hero_sub: 'ক্যাম্পেইন, ইভেন্ট ও ছাত্র উদ্যোগ',
    act_campaigns_label: 'ক্যাম্পেইন',
    act_campaigns_title: 'আমাদের সক্রিয় ক্যাম্পেইন',
    act_events_label: 'আসন্ন ইভেন্ট',
    act_events_title: 'এই ইভেন্টগুলোতে আমাদের সাথে যোগ দিন',
    act_gallery_label: 'গ্যালারি',
    act_gallery_title: 'আন্দোলনের মুহূর্তগুলো',

    // NEWS
    news_hero_title: 'সংবাদ ও আপডেট',
    news_hero_sub: 'ছাত্র আন্দোলন – এনডিএম এর সর্বশেষ',
    news_all: 'সব',
    news_campus: 'ক্যাম্পাস',
    news_national: 'জাতীয়',
    news_events: 'ইভেন্ট',
    news_press: 'প্রেস',
    news_read_more: 'আরও পড়ুন',
    news_search_placeholder: 'সংবাদ খুঁজুন...',

    // PUBLICATIONS
    pub_hero_title: 'প্রকাশনা',
    pub_hero_sub: 'বিবৃতি, দলিল ও প্রেস রিলিজ',
    pub_all: 'সব',
    pub_statements: 'বিবৃতি',
    pub_press: 'প্রেস রিলিজ',
    pub_docs: 'দলিল',
    pub_manifestos: 'ইশতেহার',
    pub_download: 'PDF ডাউনলোড',

    // JOIN
    join_hero_title: 'আন্দোলনে যোগ দিন',
    join_hero_sub: 'নিজের চেয়ে বড় কিছুর অংশ হন',
    join_why_label: 'কেন যোগ দেবেন?',
    join_why_title: 'আপনি কী পাবেন',
    join_form_title: 'সদস্যপদ আবেদন',
    join_fname: 'পূর্ণ নাম',
    join_email: 'ইমেইল ঠিকানা',
    join_phone: 'ফোন নম্বর',
    join_university: 'বিশ্ববিদ্যালয় / কলেজ',
    join_dept: 'বিভাগ / অনুষদ',
    join_year: 'অধ্যয়নের বছর',
    join_year_1: '১ম বর্ষ',
    join_year_2: '২য় বর্ষ',
    join_year_3: '৩য় বর্ষ',
    join_year_4: '৪র্থ বর্ষ',
    join_year_masters: 'মাস্টার্স',
    join_district: 'জেলা',
    join_why_join: 'কেন যোগ দিতে চান? (ঐচ্ছিক)',
    join_submit: 'আবেদন জমা দিন',
    join_vol_title: 'স্বেচ্ছাসেবক সুযোগ',
    join_success: 'ধন্যবাদ! আপনার আবেদন জমা হয়েছে।',
  // LOGIN
  login_title: 'সদস্য লগইন',
  login_sub: 'আপনার সদস্য অ্যাকাউন্টে প্রবেশ করুন',
  login_desc: 'চালিয়ে যেতে আপনার নিবন্ধিত ইমেইল ও পাসওয়ার্ড দিন।',
  login_email: 'ইমেইল ঠিকানা',
  login_password: 'পাসওয়ার্ড',
  login_forgot: 'পাসওয়ার্ড ভুলে গেছেন?',
  login_submit: 'সাইন ইন',
  login_no_account: 'অ্যাকাউন্ট নেই?',
  login_join_link: 'সদস্যপদের জন্য আবেদন করুন',

  // MEMBER DASHBOARD
  dash_title: 'সদস্য ড্যাশবোর্ড',
  dash_sub: 'আপনার ব্যক্তিগত সদস্য এলাকা',
  dash_welcome: 'স্বাগতম,',
  dash_member: 'সদস্য',
  dash_quick_links: 'দ্রুত লিংক',
  dash_quick_news: 'সর্বশেষ সংবাদ',
  dash_quick_events: 'আসন্ন কার্যক্রম',
  dash_quick_publications: 'প্রকাশনা',


    // CONTACT
    contact_hero_title: 'যোগাযোগ',
    contact_hero_sub: 'ছাত্র আন্দোলন – এনডিএম এর সাথে যোগাযোগ করুন',
    contact_office: 'কেন্দ্রীয় কার্যালয়',
    contact_address_val: 'এনডিএম কেন্দ্রীয় কার্যালয়, ঢাকা, বাংলাদেশ',
    contact_email_val: 'studentmovement@ndmbd.org',
    contact_phone_val: '+৮৮০ ১৭০০-০০০০০০',
    contact_follow: 'আমাদের অনুসরণ করুন',
    contact_form_title: 'বার্তা পাঠান',
    contact_name: 'আপনার নাম',
    contact_email: 'আপনার ইমেইল',
    contact_subject: 'বিষয়',
    contact_message: 'আপনার বার্তা',
    contact_send: 'বার্তা পাঠান',
    contact_success: 'বার্তা সফলভাবে পাঠানো হয়েছে!',

    // FOOTER
    footer_tagline: 'জাতীয় গণতান্ত্রিক আন্দোলন, বাংলাদেশের ছাত্র শাখা।',
    footer_quick: 'দ্রুত লিংক',
    footer_connect: 'সংযুক্ত হন',
    footer_rights: '© ২০২৬ ছাত্র আন্দোলন-এনডিএম। সর্বস্বত্ব সংরক্ষিত।',
    footer_parent: 'এর একটি শাখা',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const toggle = () => setLang(l => (l === 'en' ? 'bn' : 'en'));
  const t = key => translations[lang][key] || key;
  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
