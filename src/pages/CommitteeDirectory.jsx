import { useState, useRef } from 'react';
import { Search, ArrowLeft, ChevronRight } from 'lucide-react';
import './CommitteeDirectory.css';

// ─── Central Committee ────────────────────────────────────────────────────────
const CC_MEMBERS = [
  { initials: 'MJ', nameEn: 'Masud Rana Jewel',  nameBn: 'মাসুদ রানা জুয়েল', roleEn: 'President',             roleBn: 'সভাপতি',                  leader: true  },
  { initials: 'NA', nameEn: 'Nasrin Akter',       nameBn: 'নাসরিন আক্তার',     roleEn: 'General Secretary',     roleBn: 'সাধারণ সম্পাদক',          leader: true  },
  { initials: 'KH', nameEn: 'Karim Hossain',      nameBn: 'করিম হোসেন',        roleEn: 'Joint Secretary',       roleBn: 'যুগ্ম সম্পাদক',            leader: false },
  { initials: 'FB', nameEn: 'Farida Begum',       nameBn: 'ফরিদা বেগম',        roleEn: 'Women Affairs Sec.',    roleBn: 'মহিলা বিষয়ক সম্পাদক',     leader: false },
  { initials: 'TA', nameEn: 'Tanvir Ahmed',       nameBn: 'তানভীর আহমেদ',     roleEn: 'Organising Secretary',  roleBn: 'সংগঠন সম্পাদক',           leader: false },
  { initials: 'MS', nameEn: 'Mim Sultana',        nameBn: 'মিম সুলতানা',       roleEn: 'Cultural Secretary',    roleBn: 'সাংস্কৃতিক সম্পাদক',      leader: false },
];

// ─── All 8 Divisions with all 64 Districts ────────────────────────────────────
const DIVISIONS = [
  {
    id: 'dhaka', en: 'Dhaka', bn: 'ঢাকা',
    members: 24, districtCount: 13, accent: 0,
    leaderEn: 'Arif Rahman', leaderBn: 'আরিফ রহমান',
    districts: [
      { id: 'dhaka-d',      en: 'Dhaka',        bn: 'ঢাকা',           members: 18, upazilas: ['Savar', 'Keraniganj', 'Dhamrai', 'Dohar', 'Nawabganj'] },
      { id: 'faridpur',     en: 'Faridpur',     bn: 'ফরিদপুর',        members: 10, upazilas: ['Faridpur Sadar', 'Bhanga', 'Boalmari', 'Alfadanga', 'Sadarpur'] },
      { id: 'gazipur',      en: 'Gazipur',      bn: 'গাজীপুর',        members: 14, upazilas: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sripur'] },
      { id: 'gopalganj',    en: 'Gopalganj',    bn: 'গোপালগঞ্জ',      members: 8,  upazilas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'] },
      { id: 'kishoreganj',  en: 'Kishoreganj',  bn: 'কিশোরগঞ্জ',      members: 11, upazilas: ['Kishoreganj Sadar', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Pakundia'] },
      { id: 'madaripur',    en: 'Madaripur',    bn: 'মাদারীপুর',      members: 7,  upazilas: ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar'] },
      { id: 'manikganj',    en: 'Manikganj',    bn: 'মানিকগঞ্জ',      members: 10, upazilas: ['Manikganj Sadar', 'Daulatpur', 'Ghior', 'Harirampur', 'Singair'] },
      { id: 'munshiganj',   en: 'Munshiganj',   bn: 'মুন্সীগঞ্জ',     members: 9,  upazilas: ['Munshiganj Sadar', 'Gajaria', 'Lohajang', 'Sirajdikhan', 'Sreenagar'] },
      { id: 'narayanganj',  en: 'Narayanganj',  bn: 'নারায়ণগঞ্জ',     members: 12, upazilas: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'] },
      { id: 'narsingdi',    en: 'Narsingdi',    bn: 'নরসিংদী',        members: 10, upazilas: ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura'] },
      { id: 'rajbari',      en: 'Rajbari',      bn: 'রাজবাড়ী',        members: 8,  upazilas: ['Rajbari Sadar', 'Baliakandi', 'Goalundaghat', 'Kalukhali', 'Pangsha'] },
      { id: 'shariatpur',   en: 'Shariatpur',   bn: 'শরীয়তপুর',      members: 7,  upazilas: ['Shariatpur Sadar', 'Bhedarganj', 'Damudya', 'Gosairhat', 'Naria'] },
      { id: 'tangail',      en: 'Tangail',      bn: 'টাঙ্গাইল',       members: 13, upazilas: ['Tangail Sadar', 'Basail', 'Bhuapur', 'Ghatail', 'Kalihati', 'Madhupur', 'Mirzapur'] },
    ],
  },
  {
    id: 'chattogram', en: 'Chattogram', bn: 'চট্টগ্রাম',
    members: 18, districtCount: 11, accent: 1,
    leaderEn: 'Rubel Chowdhury', leaderBn: 'রুবেল চৌধুরী',
    districts: [
      { id: 'bandarban',     en: 'Bandarban',     bn: 'বান্দরবান',       members: 6,  upazilas: ['Bandarban Sadar', 'Alikadam', 'Lama', 'Naikhongchhari', 'Ruma'] },
      { id: 'brahmanbaria',  en: 'Brahmanbaria',  bn: 'ব্রাহ্মণবাড়িয়া', members: 12, upazilas: ['Brahmanbaria Sadar', 'Akhaura', 'Ashuganj', 'Kasba', 'Nabinagar'] },
      { id: 'chandpur',      en: 'Chandpur',      bn: 'চাঁদপুর',        members: 10, upazilas: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Haziganj', 'Kachua'] },
      { id: 'chattogram-d',  en: 'Chattogram',    bn: 'চট্টগ্রাম',      members: 20, upazilas: ['Chattogram Sadar', 'Hathazari', 'Mirsharai', 'Patiya', 'Raozan', 'Sitakunda'] },
      { id: 'coxsbazar',     en: "Cox's Bazar",   bn: 'কক্সবাজার',      members: 9,  upazilas: ["Cox's Bazar Sadar", 'Chakaria', 'Kutubdia', 'Maheshkhali', 'Teknaf'] },
      { id: 'cumilla',       en: 'Cumilla',       bn: 'কুমিল্লা',       members: 15, upazilas: ['Cumilla Sadar', 'Barura', 'Chandina', 'Daudkandi', 'Muradnagar'] },
      { id: 'feni',          en: 'Feni',          bn: 'ফেনী',           members: 8,  upazilas: ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Parshuram', 'Sonagazi'] },
      { id: 'khagrachhari',  en: 'Khagrachhari',  bn: 'খাগড়াছড়ি',     members: 6,  upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Mahalchhari', 'Matiranga', 'Ramgarh'] },
      { id: 'lakshmipur',    en: 'Lakshmipur',    bn: 'লক্ষ্মীপুর',     members: 9,  upazilas: ['Lakshmipur Sadar', 'Kamalnagar', 'Ramganj', 'Ramgati', 'Roypur'] },
      { id: 'noakhali',      en: 'Noakhali',      bn: 'নোয়াখালী',      members: 11, upazilas: ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya'] },
      { id: 'rangamati',     en: 'Rangamati',     bn: 'রাঙ্গামাটি',     members: 7,  upazilas: ['Rangamati Sadar', 'Barkal', 'Belaichhari', 'Kaptai', 'Langadu'] },
    ],
  },
  {
    id: 'rajshahi', en: 'Rajshahi', bn: 'রাজশাহী',
    members: 16, districtCount: 8, accent: 2,
    leaderEn: 'Sohel Rana', leaderBn: 'সোহেল রানা',
    districts: [
      { id: 'bogura',     en: 'Bogura',             bn: 'বগুড়া',             members: 13, upazilas: ['Bogura Sadar', 'Dhunat', 'Gabtali', 'Sariakandi', 'Shajahanpur', 'Sonatala'] },
      { id: 'chapai',     en: 'Chapai Nawabganj',   bn: 'চাঁপাইনবাবগঞ্জ',   members: 9,  upazilas: ['Chapai Nawabganj Sadar', 'Bholahat', 'Gomastapur', 'Nachole', 'Shibganj'] },
      { id: 'joypurhat',  en: 'Joypurhat',          bn: 'জয়পুরহাট',         members: 7,  upazilas: ['Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi'] },
      { id: 'naogaon',    en: 'Naogaon',            bn: 'নওগাঁ',             members: 11, upazilas: ['Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Manda', 'Patnitala', 'Sapahar'] },
      { id: 'natore',     en: 'Natore',             bn: 'নাটোর',             members: 9,  upazilas: ['Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Singra'] },
      { id: 'pabna',      en: 'Pabna',              bn: 'পাবনা',             members: 11, upazilas: ['Pabna Sadar', 'Atgharia', 'Bera', 'Chatmohar', 'Ishwardi', 'Santhia'] },
      { id: 'rajshahi-d', en: 'Rajshahi',           bn: 'রাজশাহী',           members: 14, upazilas: ['Rajshahi Sadar', 'Bagha', 'Bagmara', 'Charghat', 'Godagari', 'Puthia'] },
      { id: 'sirajganj',  en: 'Sirajganj',          bn: 'সিরাজগঞ্জ',         members: 12, upazilas: ['Sirajganj Sadar', 'Belkuchi', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Ullahpara'] },
    ],
  },
  {
    id: 'khulna', en: 'Khulna', bn: 'খুলনা',
    members: 15, districtCount: 10, accent: 3,
    leaderEn: 'Sabina Yesmin', leaderBn: 'সাবিনা ইয়াসমিন',
    districts: [
      { id: 'bagerhat',   en: 'Bagerhat',   bn: 'বাগেরহাট',  members: 9,  upazilas: ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Mollahat', 'Rampal'] },
      { id: 'chuadanga',  en: 'Chuadanga',  bn: 'চুয়াডাঙ্গা', members: 7,  upazilas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'] },
      { id: 'jashore',    en: 'Jashore',    bn: 'যশোর',       members: 12, upazilas: ['Jashore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Manirampur'] },
      { id: 'jhenaidah',  en: 'Jhenaidah',  bn: 'ঝিনাইদহ',   members: 9,  upazilas: ['Jhenaidah Sadar', 'Harinakunda', 'Kaliganj', 'Kotchandpur', 'Shailkupa'] },
      { id: 'khulna-d',   en: 'Khulna',     bn: 'খুলনা',      members: 16, upazilas: ['Khulna Sadar', 'Batiaghata', 'Dacope', 'Dumuria', 'Koyra', 'Paikgachha'] },
      { id: 'kushtia',    en: 'Kushtia',    bn: 'কুষ্টিয়া',  members: 10, upazilas: ['Kushtia Sadar', 'Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Mirpur'] },
      { id: 'magura',     en: 'Magura',     bn: 'মাগুরা',     members: 7,  upazilas: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'] },
      { id: 'meherpur',   en: 'Meherpur',   bn: 'মেহেরপুর',   members: 6,  upazilas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'] },
      { id: 'narail',     en: 'Narail',     bn: 'নড়াইল',     members: 7,  upazilas: ['Narail Sadar', 'Kalia', 'Lohagara'] },
      { id: 'satkhira',   en: 'Satkhira',   bn: 'সাতক্ষীরা',  members: 9,  upazilas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Shyamnagar', 'Tala'] },
    ],
  },
  {
    id: 'barishal', en: 'Barishal', bn: 'বরিশাল',
    members: 11, districtCount: 6, accent: 0,
    leaderEn: 'Riya Das', leaderBn: 'রিয়া দাস',
    districts: [
      { id: 'barguna',    en: 'Barguna',    bn: 'বরগুনা',     members: 7,  upazilas: ['Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata'] },
      { id: 'barishal-d', en: 'Barishal',   bn: 'বরিশাল',     members: 14, upazilas: ['Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Gournadi', 'Uzirpur'] },
      { id: 'bhola',      en: 'Bhola',      bn: 'ভোলা',       members: 9,  upazilas: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan'] },
      { id: 'jhalokati',  en: 'Jhalokati',  bn: 'ঝালকাঠি',   members: 6,  upazilas: ['Jhalokati Sadar', 'Kanthalia', 'Nalchiti', 'Rajapur'] },
      { id: 'patuakhali', en: 'Patuakhali', bn: 'পটুয়াখালী', members: 8,  upazilas: ['Patuakhali Sadar', 'Bauphal', 'Galachipa', 'Kalapara', 'Mirzaganj'] },
      { id: 'pirojpur',   en: 'Pirojpur',   bn: 'পিরোজপুর',  members: 7,  upazilas: ['Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur'] },
    ],
  },
  {
    id: 'sylhet', en: 'Sylhet', bn: 'সিলেট',
    members: 12, districtCount: 4, accent: 1,
    leaderEn: 'Noor Islam', leaderBn: 'নূর ইসলাম',
    districts: [
      { id: 'habiganj',    en: 'Habiganj',    bn: 'হবিগঞ্জ',      members: 10, upazilas: ['Habiganj Sadar', 'Bahubal', 'Baniachong', 'Chunarughat', 'Nabiganj'] },
      { id: 'moulvibazar', en: 'Moulvibazar', bn: 'মৌলভীবাজার',   members: 10, upazilas: ['Moulvibazar Sadar', 'Barlekha', 'Kamalganj', 'Kulaura', 'Sreemangal'] },
      { id: 'sunamganj',   en: 'Sunamganj',   bn: 'সুনামগঞ্জ',    members: 10, upazilas: ['Sunamganj Sadar', 'Chhatak', 'Dharampasha', 'Doarabazar', 'Jagannathpur'] },
      { id: 'sylhet-d',    en: 'Sylhet',      bn: 'সিলেট',        members: 16, upazilas: ['Sylhet Sadar', 'Balaganj', 'Beanibazar', 'Bishwanath', 'Golapganj', 'Jaintiapur'] },
    ],
  },
  {
    id: 'rangpur', en: 'Rangpur', bn: 'রংপুর',
    members: 13, districtCount: 8, accent: 2,
    leaderEn: 'Poly Khatun', leaderBn: 'পলি খাতুন',
    districts: [
      { id: 'dinajpur',    en: 'Dinajpur',    bn: 'দিনাজপুর',    members: 13, upazilas: ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Chirirbandar', 'Khansama', 'Parbatipur'] },
      { id: 'gaibandha',   en: 'Gaibandha',   bn: 'গাইবান্ধা',   members: 9,  upazilas: ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Sadullapur', 'Sundarganj'] },
      { id: 'kurigram',    en: 'Kurigram',    bn: 'কুড়িগ্রাম',  members: 8,  upazilas: ['Kurigram Sadar', 'Bhurungamari', 'Chilmari', 'Nageshwari', 'Ulipur'] },
      { id: 'lalmonirhat', en: 'Lalmonirhat', bn: 'লালমনিরহাট',  members: 7,  upazilas: ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'] },
      { id: 'nilphamari',  en: 'Nilphamari',  bn: 'নীলফামারী',   members: 8,  upazilas: ['Nilphamari Sadar', 'Dimla', 'Domar', 'Jaldhaka', 'Saidpur'] },
      { id: 'panchagarh',  en: 'Panchagarh',  bn: 'পঞ্চগড়',     members: 6,  upazilas: ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'] },
      { id: 'rangpur-d',   en: 'Rangpur',     bn: 'রংপুর',       members: 14, upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachhara', 'Kaunia', 'Mithapukur', 'Pirganj'] },
      { id: 'thakurgaon',  en: 'Thakurgaon',  bn: 'ঠাকুরগাঁও',  members: 8,  upazilas: ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail'] },
    ],
  },
  {
    id: 'mymensingh', en: 'Mymensingh', bn: 'ময়মনসিংহ',
    members: 10, districtCount: 4, accent: 3,
    leaderEn: 'Hasan Ali', leaderBn: 'হাসান আলী',
    districts: [
      { id: 'jamalpur',     en: 'Jamalpur',   bn: 'জামালপুর',    members: 9,  upazilas: ['Jamalpur Sadar', 'Baksiganj', 'Dewanganj', 'Islampur', 'Melandaha'] },
      { id: 'mymensingh-d', en: 'Mymensingh', bn: 'ময়মনসিংহ',   members: 14, upazilas: ['Mymensingh Sadar', 'Bhaluka', 'Gaffargaon', 'Haluaghat', 'Muktagachha', 'Trishal'] },
      { id: 'netrokona',    en: 'Netrokona',  bn: 'নেত্রকোণা',   members: 9,  upazilas: ['Netrokona Sadar', 'Atpara', 'Durgapur', 'Kendua', 'Mohanganj'] },
      { id: 'sherpur',      en: 'Sherpur',    bn: 'শেরপুর',      members: 7,  upazilas: ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi'] },
    ],
  },
];

const CD_ACCENTS = ['#378ADD', '#639922', '#1D9E75', '#BA7517'];
const CD_AV      = ['av-blue', 'av-teal', 'av-green', 'av-amber', 'av-coral'];
const upazilaMemberCount = i => ((i * 7 + 3) % 8) + 5;

const TAB_LABELS = {
  en: { all: 'All', central: 'Central', divisional: 'Divisional', district: 'District', upazila: 'Upazila' },
  bn: { all: 'সব', central: 'কেন্দ্রীয়', divisional: 'বিভাগীয়', district: 'জেলা', upazila: 'উপজেলা' },
};

function divRoles(div) {
  return [
    { initials: div.en.slice(0, 1) + 'P', nameEn: div.leaderEn,         nameBn: div.leaderBn,         roleEn: 'Division President',  roleBn: 'বিভাগীয় সভাপতি',         leader: true  },
    { initials: 'GS',                       nameEn: 'General Secretary',  nameBn: 'সাধারণ সম্পাদক',   roleEn: 'General Secretary',   roleBn: 'সাধারণ সম্পাদক',          leader: true  },
    { initials: 'OR',                       nameEn: 'Organising Rep.',    nameBn: 'সংগঠন প্রতিনিধি',  roleEn: 'Organiser',           roleBn: 'সংগঠক',                    leader: false },
    { initials: 'WA',                       nameEn: "Women's Affairs",    nameBn: 'মহিলা বিষয়ক',     roleEn: "Women's Affairs",     roleBn: 'মহিলা বিষয়ক সম্পাদক',    leader: false },
  ];
}

function distRoles(dist) {
  return [
    { initials: dist.en.slice(0, 2).toUpperCase(), roleEn: 'President',        roleBn: 'সভাপতি',                  leader: true  },
    { initials: 'SK',                               roleEn: 'Secretary',        roleBn: 'সম্পাদক',                 leader: true  },
    { initials: 'JS',                               roleEn: 'Joint Secretary',  roleBn: 'যুগ্ম সম্পাদক',           leader: false },
    { initials: 'CS',                               roleEn: 'Cultural Sec.',    roleBn: 'সাংস্কৃতিক সম্পাদক',    leader: false },
    { initials: 'PS',                               roleEn: 'Publicity Sec.',   roleBn: 'প্রচার সম্পাদক',         leader: false },
  ];
}

export default function CommitteeDirectory({ lang }) {
  const [view,    setView]    = useState('home');
  const [level,   setLevel]   = useState('all');
  const [selDiv,  setSelDiv]  = useState(null);
  const [selDist, setSelDist] = useState(null);
  const [search,  setSearch]  = useState('');
  const topRef = useRef(null);

  const go = v => {
    setView(v);
    setTimeout(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const filtered = DIVISIONS.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return d.en.toLowerCase().includes(q) || d.bn.includes(q) ||
      d.districts.some(dist => dist.en.toLowerCase().includes(q) || dist.bn.includes(q));
  });

  const showCentral = level === 'all' || level === 'central';
  const showDiv     = level === 'all' || level === 'divisional' || level === 'district' || level === 'upazila';

  return (
    <div className="cd-wrap" ref={topRef}>

      {/* ── Blue Hero ──────────────────────────────────────────────────────── */}
      <div className="cd-hero">
        <div className="cd-hero-pattern" />
        <span className="cd-org-badge">
          {lang === 'en' ? 'Student Movement – NDM' : 'ছাত্র আন্দোলন – এনডিএম'}
        </span>
        <h2 className="cd-hero-title">
          {lang === 'en' ? 'National Committee Directory' : 'জাতীয় কমিটি ডিরেক্টরি'}
        </h2>
        <p className="cd-hero-sub">
          {lang === 'en'
            ? 'Explore committees at every level — Central, Division, District, and Upazila.'
            : 'কেন্দ্রীয়, বিভাগ, জেলা ও উপজেলা পর্যায়ে কমিটি অন্বেষণ করুন।'}
        </p>
        <div className="cd-stats">
          {[
            { num: '8',      labelEn: 'Divisions', labelBn: 'বিভাগ'  },
            { num: '64',     labelEn: 'Districts', labelBn: 'জেলা'   },
            { num: '495',    labelEn: 'Upazilas',  labelBn: 'উপজেলা' },
            { num: '12,000+',labelEn: 'Members',   labelBn: 'সদস্য'  },
          ].map((s, i) => (
            <div key={i} className="cd-stat">
              <span className="cd-stat-num">{s.num}</span>
              <span className="cd-stat-lbl">{lang === 'en' ? s.labelEn : s.labelBn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOME VIEW ──────────────────────────────────────────────────────── */}
      {view === 'home' && (
        <div className="cd-body">

          {/* Level filter tabs */}
          <div className="cd-tabs">
            {['all', 'central', 'divisional', 'district', 'upazila'].map(lvl => (
              <button key={lvl} onClick={() => setLevel(lvl)}
                className={`cd-tab${level === lvl ? ' active' : ''}`}>
                {lang === 'en' ? TAB_LABELS.en[lvl] : TAB_LABELS.bn[lvl]}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="cd-search">
            <Search size={15} className="cd-search-icon" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'en' ? 'Search division, district...' : 'বিভাগ, জেলা খুঁজুন...'} />
          </div>

          {/* Central Committee preview */}
          {showCentral && (
            <div className="cd-cc">
              <div className="cd-cc-head">
                <div>
                  <p className="cd-cc-title">{lang === 'en' ? 'Central Committee' : 'কেন্দ্রীয় কমিটি'}</p>
                  <span className="cd-cc-sub">{lang === 'en' ? 'National leadership body' : 'জাতীয় নেতৃত্ব পরিষদ'}</span>
                </div>
                <button className="cd-view-btn" onClick={() => go('central')}>
                  {lang === 'en' ? 'View all' : 'সব দেখুন'} <ChevronRight size={14} />
                </button>
              </div>
              <div className="cd-members">
                {CC_MEMBERS.map((m, i) => (
                  <div className="cd-member" key={i}>
                    <div className={`cd-av ${CD_AV[i % 5]}`}>{m.initials}</div>
                    <p className="cd-m-name">{lang === 'en' ? m.nameEn : m.nameBn}</p>
                    <p className="cd-m-role">{lang === 'en' ? m.roleEn : m.roleBn}</p>
                    <span className={`cd-role-badge${m.leader ? ' leader' : ''}`}>
                      {m.leader ? (lang === 'en' ? 'Leader' : 'নেতা') : (lang === 'en' ? 'Member' : 'সদস্য')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Division cards grid */}
          {showDiv && (
            <>
              <p className="cd-section-lbl">
                {lang === 'en' ? 'Divisional Committees' : 'বিভাগীয় কমিটিসমূহ'}
              </p>
              <div className="cd-grid">
                {filtered.map((div, i) => (
                  <button key={div.id} className="cd-card"
                    onClick={() => { setSelDiv(div); go('division'); }}>
                    <span className="cd-card-bar" style={{ background: CD_ACCENTS[div.accent] }} />
                    <div className="cd-card-inner">
                      <p className="cd-card-name">{lang === 'en' ? div.en : div.bn} {lang === 'en' ? 'Division' : 'বিভাগ'}</p>
                      <div className="cd-card-meta">
                        <span className="cd-count-badge">{div.members} {lang === 'en' ? 'members' : 'সদস্য'}</span>
                        <span className="cd-dot" />
                        <span>{div.districtCount} {lang === 'en' ? 'districts' : 'জেলা'}</span>
                        <ChevronRight size={14} className="cd-card-arr" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {filtered.length === 0 && (
                <p className="cd-empty">{lang === 'en' ? 'No results found.' : 'কোনো ফলাফল পাওয়া যায়নি।'}</p>
              )}
            </>
          )}

          <div className="cd-info-bar">
            {lang === 'en'
              ? 'Click any division card to explore its districts and committee members.'
              : 'যেকোনো বিভাগে ক্লিক করে জেলা ও কমিটির সদস্যদের দেখুন।'}
          </div>
        </div>
      )}

      {/* ── DIVISION VIEW ───────────────────────────────────────────────────── */}
      {view === 'division' && selDiv && (
        <div className="cd-body">
          <button className="cd-back" onClick={() => go('home')}>
            <ArrowLeft size={15} /> {lang === 'en' ? 'All Divisions' : 'সব বিভাগ'}
          </button>
          <div className="cd-breadcrumb">
            <button className="cd-bc-link" onClick={() => go('home')}>{lang === 'en' ? 'Home' : 'হোম'}</button>
            <ChevronRight size={12} />
            <span>{lang === 'en' ? `${selDiv.en} Division` : `${selDiv.bn} বিভাগ`}</span>
          </div>

          <div className="cd-detail">
            <div className="cd-detail-head">
              <p className="cd-detail-title">
                {lang === 'en' ? `${selDiv.en} Division Committee` : `${selDiv.bn} বিভাগ কমিটি`}
              </p>
              <p className="cd-detail-sub">{selDiv.members} {lang === 'en' ? 'members' : 'সদস্য'}</p>
            </div>
            <div className="cd-members">
              {divRoles(selDiv).map((m, i) => (
                <div className="cd-member" key={i}>
                  <div className={`cd-av ${CD_AV[i % 5]}`}>{m.initials}</div>
                  <p className="cd-m-name">{lang === 'en' ? m.nameEn : m.nameBn}</p>
                  <p className="cd-m-role">{lang === 'en' ? m.roleEn : m.roleBn}</p>
                  <span className={`cd-role-badge${m.leader ? ' leader' : ''}`}>
                    {m.leader ? (lang === 'en' ? 'Leader' : 'নেতা') : (lang === 'en' ? 'Member' : 'সদস্য')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="cd-section-lbl">
            {lang === 'en' ? `Districts in ${selDiv.en} Division` : `${selDiv.bn} বিভাগের জেলাসমূহ`}
          </p>
          <div className="cd-grid">
            {selDiv.districts.map((dist, i) => (
              <button key={dist.id} className="cd-card"
                onClick={() => { setSelDist(dist); go('district'); }}>
                <span className="cd-card-bar" style={{ background: CD_ACCENTS[i % 4] }} />
                <div className="cd-card-inner">
                  <p className="cd-card-name">{lang === 'en' ? dist.en : dist.bn}</p>
                  <div className="cd-card-meta">
                    <span className="cd-count-badge">{dist.members} {lang === 'en' ? 'members' : 'সদস্য'}</span>
                    <span className="cd-dot" />
                    <span>{dist.upazilas.length} {lang === 'en' ? 'upazilas' : 'উপজেলা'}</span>
                    <ChevronRight size={14} className="cd-card-arr" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── DISTRICT VIEW ───────────────────────────────────────────────────── */}
      {view === 'district' && selDiv && selDist && (
        <div className="cd-body">
          <button className="cd-back" onClick={() => go('division')}>
            <ArrowLeft size={15} /> {lang === 'en' ? `${selDiv.en} Division` : `${selDiv.bn} বিভাগ`}
          </button>
          <div className="cd-breadcrumb">
            <button className="cd-bc-link" onClick={() => go('home')}>{lang === 'en' ? 'Home' : 'হোম'}</button>
            <ChevronRight size={12} />
            <button className="cd-bc-link" onClick={() => go('division')}>
              {lang === 'en' ? selDiv.en : selDiv.bn}
            </button>
            <ChevronRight size={12} />
            <span>{lang === 'en' ? selDist.en : selDist.bn}</span>
          </div>

          <div className="cd-detail">
            <div className="cd-detail-head">
              <p className="cd-detail-title">
                {lang === 'en' ? `${selDist.en} District Committee` : `${selDist.bn} জেলা কমিটি`}
              </p>
              <p className="cd-detail-sub">{selDist.members} {lang === 'en' ? 'members' : 'সদস্য'}</p>
            </div>
            <div className="cd-members">
              {distRoles(selDist).map((m, i) => (
                <div className="cd-member" key={i}>
                  <div className={`cd-av ${CD_AV[i % 5]}`}>{m.initials}</div>
                  <p className="cd-m-name">{lang === 'en' ? selDist.en : selDist.bn}</p>
                  <p className="cd-m-role">{lang === 'en' ? m.roleEn : m.roleBn}</p>
                  <span className={`cd-role-badge${m.leader ? ' leader' : ''}`}>
                    {m.leader ? (lang === 'en' ? 'Leader' : 'নেতা') : (lang === 'en' ? 'Member' : 'সদস্য')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="cd-section-lbl">{lang === 'en' ? 'Upazilas' : 'উপজেলাসমূহ'}</p>
          <div className="cd-grid">
            {selDist.upazilas.map((upazila, i) => (
              <div key={upazila} className="cd-card cd-card--leaf">
                <span className="cd-card-bar" style={{ background: CD_ACCENTS[i % 4] }} />
                <div className="cd-card-inner">
                  <p className="cd-card-name">{upazila} {lang === 'en' ? 'Upazila' : 'উপজেলা'}</p>
                  <div className="cd-card-meta">
                    <span className="cd-count-badge">{upazilaMemberCount(i)} {lang === 'en' ? 'members' : 'সদস্য'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CENTRAL FULL VIEW ───────────────────────────────────────────────── */}
      {view === 'central' && (
        <div className="cd-body">
          <button className="cd-back" onClick={() => go('home')}>
            <ArrowLeft size={15} /> {lang === 'en' ? 'Home' : 'হোম'}
          </button>
          <div className="cd-cc-head" style={{ borderRadius: 12, marginBottom: '1rem', padding: '1rem 1.25rem' }}>
            <div>
              <p className="cd-cc-title">
                {lang === 'en' ? 'Central Committee — Full Roster' : 'কেন্দ্রীয় কমিটি — সম্পূর্ণ তালিকা'}
              </p>
              <span className="cd-cc-sub">{lang === 'en' ? 'National leadership body' : 'জাতীয় নেতৃত্ব পরিষদ'}</span>
            </div>
          </div>
          <div className="cd-members cd-members--full">
            {CC_MEMBERS.map((m, i) => (
              <div className="cd-member" key={i}>
                <div className={`cd-av cd-av--lg ${CD_AV[i % 5]}`}>{m.initials}</div>
                <p className="cd-m-name">{lang === 'en' ? m.nameEn : m.nameBn}</p>
                <p className="cd-m-role">{lang === 'en' ? m.roleEn : m.roleBn}</p>
                <span className={`cd-role-badge${m.leader ? ' leader' : ''}`}>
                  {m.leader ? (lang === 'en' ? 'Leader' : 'নেতা') : (lang === 'en' ? 'Member' : 'সদস্য')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
