import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Loader2 } from 'lucide-react';
import { FaGithub, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { Link } from 'react-scroll';
import toast from 'react-hot-toast';

const Hero = ({ globalSettings }) => {
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);

  const settings = globalSettings || {
    aboutMe: "Software engineering student in Sri Lanka. I build web and Android apps.",
    linkedinUrl: "",
    whatsappUrl: "",
    githubUrl: ""
  };

  const downloadCV = async () => {
    setIsGeneratingCV(true);
    const toastId = toast.loading('Building the PDF…');
    try {
      // The PDF renderer is large, so it only loads when someone asks for the CV.
      const { generateCV } = await import('../utils/generateCV');
      const blob = await generateCV();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Eshan_Gunasekara_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success('CV downloaded', { id: toastId });
    } catch (error) {
      console.error("Failed to generate CV", error);
      toast.error("Couldn't build the CV. Please try again.", { id: toastId });
    } finally {
      setIsGeneratingCV(false);
    }
  };

  const socials = [
    { href: settings.githubUrl, label: 'GitHub', icon: <FaGithub className="w-5 h-5" /> },
    { href: settings.linkedinUrl, label: 'LinkedIn', icon: <FaLinkedin className="w-5 h-5" /> },
    { href: settings.whatsappUrl, label: 'WhatsApp', icon: <FaWhatsapp className="w-5 h-5" /> },
  ].filter(s => s.href);

  return (
    <section id="home" className="min-h-screen flex items-center pt-28 pb-16">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="inline-flex items-center gap-2 text-sm text-gray-400 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500" aria-hidden="true" />
            Open to internships and freelance work
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Eshan Gunasekara
          </h1>

          <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl">
            {settings.aboutMe}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="projects"
              smooth={true}
              duration={500}
              offset={-80}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors cursor-pointer"
            >
              See my projects
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              disabled={isGeneratingCV}
              onClick={downloadCV}
              className="inline-flex items-center gap-2 px-6 py-3 surface hover:border-white/25 text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-wait"
            >
              {isGeneratingCV ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isGeneratingCV ? 'Building…' : 'Download CV'}
            </button>

            {socials.length > 0 && (
              <div className="flex items-center gap-1 sm:ml-2">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="p-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
