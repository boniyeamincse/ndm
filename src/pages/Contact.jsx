import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Globe, MessageSquare, Play, Camera, Send, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Contact.css';

export default function Contact() {
  const { t, lang } = useLang();
  useScrollReveal();

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_contact')}</span>
          </div>
          <h1>{t('contact_hero_title')}</h1>
          <p>{t('contact_hero_sub')}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container contact-layout">
          {/* Info Panel */}
          <div className="contact-info reveal">
            <div className="contact-info-card">
              <h3>{t('contact_office')}</h3>
              <ul className="contact-info-list">
                <li>
                  <div className="contact-info-icon"><MapPin size={18} /></div>
                  <span>{t('contact_address_val')}</span>
                </li>
                <li>
                  <div className="contact-info-icon"><Mail size={18} /></div>
                  <a href={`mailto:${t('contact_email_val')}`}>{t('contact_email_val')}</a>
                </li>
                <li>
                  <div className="contact-info-icon"><Phone size={18} /></div>
                  <a href={`tel:+8801700000000`}>{t('contact_phone_val')}</a>
                </li>
              </ul>
            </div>

            <div className="contact-social-card">
              <h3>{t('contact_follow')}</h3>
              <div className="contact-socials">
                <a href="https://facebook.com/ndmbdofficial" target="_blank" rel="noopener noreferrer">
                  <Globe size={20} /><span>Facebook</span>
                </a>
                <a href="https://twitter.com/ndmbd_official" target="_blank" rel="noopener noreferrer">
                  <MessageSquare size={20} /><span>Twitter / X</span>
                </a>
                <a href="https://youtube.com/@ndmbdofficial" target="_blank" rel="noopener noreferrer">
                  <Play size={20} /><span>YouTube</span>
                </a>
                <a href="https://instagram.com/ndmbdofficial" target="_blank" rel="noopener noreferrer">
                  <Camera size={20} /><span>Instagram</span>
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="contact-map">
              <iframe
                title="NDM Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902!2d90.4152!3d23.7276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQzJzM5LjQiTiA5MMKwMjQnNTQuNyJF!5e0!3m2!1sen!2sbd!4v1617000000000"
                width="100%" height="220"
                style={{ border: 0, borderRadius: 'var(--radius-md)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrap card reveal">
            <h2>{t('contact_form_title')}</h2>
            <div className="divider divider-left" style={{ marginBottom: '1.75rem' }} />

            {submitted ? (
              <div className="join-success">
                <CheckCircle2 size={48} color="var(--clr-primary)" />
                <h3>{t('contact_success')}</h3>
                <p>
                  {lang === 'en'
                    ? 'We will reply within 1–2 business days.'
                    : 'আমরা ১–২ কার্যদিবসের মধ্যে উত্তর দেব।'}
                </p>
                <button className="btn btn-outline" onClick={() => setSubmitted(false)}>
                  {lang === 'en' ? 'Send Another' : 'আরও পাঠান'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-name">{t('contact_name')} *</label>
                    <input id="c-name" name="name" type="text" className="form-control"
                      value={form.name} onChange={handleChange} required
                      placeholder={lang === 'en' ? 'Your name' : 'আপনার নাম'} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-email">{t('contact_email')} *</label>
                    <input id="c-email" name="email" type="email" className="form-control"
                      value={form.email} onChange={handleChange} required
                      placeholder="example@email.com" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="c-subject">{t('contact_subject')} *</label>
                  <input id="c-subject" name="subject" type="text" className="form-control"
                    value={form.subject} onChange={handleChange} required
                    placeholder={lang === 'en' ? 'Message subject' : 'বার্তার বিষয়'} />
                </div>
                <div className="form-group">
                  <label htmlFor="c-message">{t('contact_message')} *</label>
                  <textarea id="c-message" name="message" className="form-control"
                    value={form.message} onChange={handleChange} required
                    placeholder={lang === 'en' ? 'Write your message...' : 'আপনার বার্তা লিখুন...'} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                  {loading
                    ? (lang === 'en' ? 'Sending...' : 'পাঠানো হচ্ছে...')
                    : <>{t('contact_send')} <Send size={17} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
