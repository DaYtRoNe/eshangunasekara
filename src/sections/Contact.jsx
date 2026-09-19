import React, { useState } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import SectionHeading from '../components/SectionHeading';

const EMAIL = 'eshangunsekara@gmail.com';
const PHONE_DISPLAY = '+94 77 815 7227';

const inputClass = "w-full bg-dark-800 border border-white/10 rounded-md px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition-colors disabled:opacity-60";

const Contact = ({ globalSettings }) => {
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const settings = {
    linkedinUrl: '',
    whatsappUrl: '',
    githubUrl: '',
    twitterUrl: '',
    ...(globalSettings || {}),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Honeypot: real people never see or fill this field. Bots usually do.
    if (formData.get('website')) {
      form.reset();
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      await addDoc(collection(db, 'messages'), {
        name: String(formData.get('name')).trim().slice(0, 100),
        email: String(formData.get('email')).trim().slice(0, 200),
        subject: String(formData.get('subject')).trim().slice(0, 200),
        message: String(formData.get('message')).trim().slice(0, 5000),
        unread: true,
        createdAt: serverTimestamp()
      });
      form.reset();
      setStatus('sent');
      toast.success("Sent. I'll get back to you soon.");
      setTimeout(() => setStatus('idle'), 4000);
    } catch (error) {
      console.error("Error submitting message:", error);
      setStatus('idle');
      toast.error(`Couldn't send that. Email me directly at ${EMAIL}.`);
    }
  };

  const socials = [
    { label: 'GitHub', href: settings.githubUrl, icon: <FaGithub /> },
    { label: 'LinkedIn', href: settings.linkedinUrl, icon: <FaLinkedin /> },
    { label: 'WhatsApp', href: settings.whatsappUrl, icon: <FaWhatsapp /> },
    { label: 'Twitter', href: settings.twitterUrl, icon: <FaTwitter /> },
  ].filter(s => s.href);

  return (
    <section id="contact" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          intro="If you have an internship, a project, or just a question, send me a message. I usually reply within a day."
        />

        <div className="grid lg:grid-cols-12 gap-12 max-w-6xl">
          {/* Details */}
          <div className="lg:col-span-5 space-y-6">
            <a href={`mailto:${EMAIL}`} className="flex items-start gap-4 group">
              <Mail className="w-5 h-5 text-gray-500 mt-1 shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Email</div>
                <div className="text-white group-hover:text-primary transition-colors break-all">{EMAIL}</div>
              </div>
            </a>

            {settings.whatsappUrl ? (
              <a href={settings.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-start gap-4 group">
                <Phone className="w-5 h-5 text-gray-500 mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Phone / WhatsApp</div>
                  <div className="text-white group-hover:text-primary transition-colors">{PHONE_DISPLAY}</div>
                </div>
              </a>
            ) : (
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-gray-500 mt-1 shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Phone</div>
                  <div className="text-white">{PHONE_DISPLAY}</div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-gray-500 mt-1 shrink-0" aria-hidden="true" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-gray-500 mb-1">Location</div>
                <div className="text-white">Matale, Sri Lanka</div>
              </div>
            </div>

            {socials.length > 0 && (
              <div className="flex items-center gap-1 pt-2">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-xl"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Form */}
          <form className="lg:col-span-7 card p-6 md:p-8 flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm text-gray-300">Name</label>
                <input type="text" id="name" name="name" required maxLength={100} disabled={status === 'sending'} className={inputClass} autoComplete="name" />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-gray-300">Email</label>
                <input type="email" id="email" name="email" required maxLength={200} disabled={status === 'sending'} className={inputClass} autoComplete="email" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm text-gray-300">Subject</label>
              <input type="text" id="subject" name="subject" required maxLength={200} disabled={status === 'sending'} className={inputClass} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm text-gray-300">Message</label>
              <textarea id="message" name="message" rows="6" required maxLength={5000} disabled={status === 'sending'} className={`${inputClass} resize-y`} />
            </div>

            {/* Honeypot. Hidden from people, not from bots. */}
            <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <button
                type="submit"
                disabled={status !== 'idle'}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : 'Send message'}
              </button>
              {status === 'sent' && <span className="text-sm text-gray-400">Thanks. I'll reply by email.</span>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
