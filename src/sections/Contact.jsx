import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy, Loader2 } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import createGlobe from 'cobe';

// 3D Globe Component
const LocationGlobe = () => {
  const canvasRef = useRef();

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 250,
      height: 250,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.66, 0.23, 1], // Primary Color
      glowColor: [1, 1, 1],
      markers: [
        { location: [7.4675, 80.6234], size: 0.1 } // Matale, Sri Lanka
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.005;
      },
    });

    return () => globe.destroy();
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
      <canvas
        ref={canvasRef}
        style={{ width: 125, height: 125, maxWidth: "100%", aspectRatio: 1 }}
      />
    </div>
  );
};

const typewriterTexts = [
  "Hello Eshan, I would like to talk about a project...",
  "Hi, are you available for freelance work?",
  "Greetings! I have a mobile app idea...",
  "Hey Eshan, let's collaborate!"
];

import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const Contact = () => {
  const [formState, setFormState] = useState('idle'); // idle, submitting, success
  
  const [settings, setSettings] = useState({
    linkedinUrl: "https://www.linkedin.com/in/eshan-gunasekara-83b9761b2",
    whatsappUrl: "https://wa.me/94778157227",
    githubUrl: "https://github.com/DaYtRoNe"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'global'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSettings(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);
  
  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter Effect Logic
  useEffect(() => {
    const currentText = typewriterTexts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (placeholder !== currentText) {
          setPlaceholder(currentText.slice(0, placeholder.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2500);
        }
      } else {
        if (placeholder === "") {
          setIsDeleting(false);
          setTextIndex((prev) => (prev + 1) % typewriterTexts.length);
        } else {
          setPlaceholder(currentText.slice(0, placeholder.length - 1));
        }
      }
    }, isDeleting ? 30 : 60);

    return () => clearTimeout(timeout);
  }, [placeholder, isDeleting, textIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState('submitting');
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    try {
      await addDoc(collection(db, 'messages'), {
        name,
        email,
        subject,
        message,
        unread: true,
        createdAt: serverTimestamp()
      });
      
      setFormState('success');
      setTimeout(() => {
        setFormState('idle');
        e.target.reset();
      }, 3000);
    } catch (error) {
      console.error("Error submitting message:", error);
      setFormState('idle');
      // Ideally show a toast error here, but keeping it simple for now
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-dark-800/20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-3 glass rounded-2xl mb-4 shadow-[0_0_15px_rgba(170,59,255,0.2)] border border-white/10">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4 text-white">Get In <span className="text-primary">Touch</span></h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl text-lg">
            Feel free to reach out for collaborations, opportunities, or just a friendly chat. I'm always open to discussing new projects.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Email Card */}
            <motion.a
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              href="mailto:eshangunsekara@gmail.com"
              className="glass-card p-6 flex items-center justify-between cursor-hover hover:border-primary/40 transition-all shadow-lg group relative overflow-hidden h-28 block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="p-3.5 bg-dark-800 border border-white/10 rounded-xl text-primary shadow-inner group-hover:shadow-[0_0_15px_rgba(170,59,255,0.3)] transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Email</h4>
                  <p className="text-white font-medium">eshangunsekara@gmail.com</p>
                </div>
              </div>
            </motion.a>

            {/* Phone Card */}
            <motion.a
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.1 }}
              href={settings.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="glass-card p-6 flex items-center justify-between cursor-hover hover:border-primary/40 transition-all shadow-lg group relative overflow-hidden h-28 block"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center gap-5 relative z-10">
                <div className="p-3.5 bg-dark-800 border border-white/10 rounded-xl text-primary shadow-inner group-hover:shadow-[0_0_15px_rgba(170,59,255,0.3)] transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Phone</h4>
                  <p className="text-white font-medium">+94 77 815 7227</p>
                </div>
              </div>
            </motion.a>

            {/* Location Card with 3D Globe */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6 flex items-center justify-between cursor-hover hover:border-primary/40 transition-all shadow-lg group relative overflow-hidden h-40"
            >
              <div className="flex items-start gap-5 relative z-10 h-full pt-2">
                <div className="p-3.5 bg-dark-800 border border-white/10 rounded-xl text-primary shadow-inner group-hover:shadow-[0_0_15px_rgba(170,59,255,0.3)] transition-all">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wider">Location</h4>
                  <p className="text-white font-medium">Matale<br/>Sri Lanka</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-40 h-40">
                <LocationGlobe />
              </div>
            </motion.div>

            {/* Social Media Dock */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 mt-2 glass px-6 py-4 rounded-3xl border border-white/10 w-max shadow-xl"
            >
              {[
                { icon: <FaLinkedin className="w-5 h-5" />, href: settings.linkedinUrl },
                { icon: <FaWhatsapp className="w-5 h-5" />, href: settings.whatsappUrl },
                { icon: <FaGithub className="w-5 h-5" />, href: settings.githubUrl },
                ...(settings.twitterUrl ? [{ icon: <FaTwitter className="w-5 h-5" />, href: settings.twitterUrl }] : [])
              ].filter(link => link.href).map((link, idx) => (
                <motion.a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.25, y: -4 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-dark-900 border border-white/10 rounded-full hover:border-primary/50 text-gray-400 hover:text-white transition-colors shadow-lg cursor-hover hover:shadow-[0_0_15px_rgba(170,59,255,0.3)]"
                >
                  {link.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="lg:col-span-7 glass-card p-8 md:p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="text-2xl font-bold text-white mb-8">Send me a message</h3>

            <form className="relative z-10 flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-300">Your Name</label>
                  <input 
                    type="text" 
                    id="name"
                    required
                    disabled={formState !== 'idle'}
                    className="bg-dark-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-hover hover:bg-dark-950 disabled:opacity-50"
                    placeholder="John Doe"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    required
                    disabled={formState !== 'idle'}
                    className="bg-dark-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-hover hover:bg-dark-950 disabled:opacity-50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-300">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  required
                  disabled={formState !== 'idle'}
                  className="bg-dark-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-hover hover:bg-dark-950 disabled:opacity-50"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-medium text-gray-300">Message</label>
                <div className="relative">
                  <textarea 
                    id="message" 
                    rows="6"
                    required
                    disabled={formState !== 'idle'}
                    className="w-full bg-dark-950/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none cursor-hover hover:bg-dark-950 disabled:opacity-50 relative z-10 bg-transparent"
                  />
                  {/* Typewriter Placeholder rendered underneath */}
                  <div className="absolute top-3.5 left-5 right-5 text-gray-500 pointer-events-none z-0 overflow-hidden break-words whitespace-pre-wrap">
                    {placeholder}
                    <span className="inline-block w-[2px] h-4 ml-[1px] align-middle bg-primary animate-pulse" />
                  </div>
                </div>
              </div>

              <motion.button 
                whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
                whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
                disabled={formState !== 'idle'}
                type="submit"
                className={`rounded-xl px-8 py-4 font-medium transition-all flex items-center justify-center gap-3 mt-4 w-full md:w-auto self-end cursor-hover
                  ${formState === 'idle' ? 'bg-primary hover:bg-primary-dark text-white shadow-[0_0_20px_rgba(170,59,255,0.3)]' : ''}
                  ${formState === 'submitting' ? 'bg-dark-800 border border-primary text-primary' : ''}
                  ${formState === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : ''}
                `}
              >
                <AnimatePresence mode="wait">
                  {formState === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      Send Message <Send className="w-4 h-4" />
                    </motion.div>
                  )}
                  {formState === 'submitting' && (
                    <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      Sending... <Loader2 className="w-4 h-4 animate-spin" />
                    </motion.div>
                  )}
                  {formState === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      Sent Successfully! <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
