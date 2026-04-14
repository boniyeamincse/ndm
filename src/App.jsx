import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingJoin from './components/FloatingJoin';
import Home from './pages/Home';
import About from './pages/About';
import Leadership from './pages/Leadership';
import Activities from './pages/Activities';
import News from './pages/News';
import Publications from './pages/Publications';
import Constitution from './pages/Constitution';
import Join from './pages/Join';
import Contact from './pages/Contact';
import { useLang } from './context/LanguageContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

export default function App() {
  const { lang } = useLang();

  useEffect(() => {
    document.body.className = lang === 'bn' ? 'lang-bn' : '';
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
  }, [lang]);

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/leadership" element={<Leadership />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/news" element={<News />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/constitution" element={<Constitution />} />
        <Route path="/join" element={<Join />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <FloatingJoin />
    </>
  );
}
