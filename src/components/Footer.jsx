import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowUp, Heart } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const [time, setTime] = useState("");

  // Update Local Time
  useEffect(() => {
    const updateTime = () => {
      const sriLankaTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(`${sriLankaTime} LK`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-950 pt-24 pb-8 overflow-hidden border-t border-white/5 mt-10">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-primary/5 blur-[120px] pointer-events-none" />
      
      {/* Huge Watermark Text */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
        <h1 className="text-[20vw] font-black font-outfit uppercase tracking-tighter text-white whitespace-nowrap leading-none">
          ESHAN.
        </h1>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 mb-24">
          
          {/* Left Column: CTA */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-8 px-5 py-2.5 rounded-full border border-white/10 bg-dark-900/50 backdrop-blur-md shadow-lg shadow-black/50 cursor-hover hover:border-white/20 transition-colors">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-dark-900"></span>
              </span>
              <span className="text-sm font-medium text-gray-300">Available for Opportunities</span>
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] font-outfit">
              Let's build <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 italic">extraordinary</span>
              <br/>
              things.
            </h2>

            <a 
              href="mailto:eshangunsekara@gmail.com"
              className="group inline-flex items-center gap-6 text-xl md:text-2xl lg:text-3xl font-medium text-gray-400 hover:text-white transition-colors cursor-hover mt-4"
            >
              eshangunsekara@gmail.com
              <span className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12 shadow-[0_0_15px_rgba(170,59,255,0)] group-hover:shadow-[0_0_20px_rgba(170,59,255,0.4)]">
                <ArrowUpRight className="w-7 h-7" />
              </span>
            </a>
          </div>

          {/* Right Column: Links */}
          <div className="flex flex-col lg:items-end justify-center">
            <div className="flex gap-16 md:gap-24 mb-12 lg:mb-0">
              <div>
                <h4 className="text-gray-500 font-semibold mb-8 tracking-widest uppercase text-xs">Navigation</h4>
                <ul className="space-y-5">
                  {['Home', 'About', 'Projects', 'Experience', 'Contact'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors text-lg md:text-xl font-medium cursor-hover relative group inline-block">
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-gray-500 font-semibold mb-8 tracking-widest uppercase text-xs">Socials</h4>
                <ul className="space-y-5">
                  {[
                    { name: 'LinkedIn', icon: <FaLinkedin/>, url: 'https://www.linkedin.com/in/eshan-gunasekara-83b9761b2' },
                    { name: 'WhatsApp', icon: <FaWhatsapp/>, url: 'https://wa.me/94778157227' },
                    { name: 'GitHub', icon: <FaGithub/>, url: 'https://github.com/DaYtRoNe' },
                    { name: 'Twitter', icon: <FaTwitter/>, url: '#' }
                  ].map((social) => (
                    <li key={social.name}>
                      <a href={social.url} className="text-gray-300 hover:text-white transition-colors text-lg md:text-xl font-medium cursor-hover flex items-center gap-4 group">
                        <span className="text-gray-500 group-hover:text-primary transition-colors text-xl">{social.icon}</span>
                        {social.name}
                        <span className="absolute -bottom-1 left-8 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
            <span className="font-medium text-gray-400">© {new Date().getFullYear()} Eshan Gunasekara.</span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="flex items-center gap-1.5">Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /></span>
          </div>

          <div className="flex items-center gap-6">
            {/* Local Time Widget */}
            <div className="flex items-center gap-3 bg-dark-900 px-5 py-2.5 rounded-full border border-white/5 shadow-inner">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(170,59,255,0.8)]" />
              <span className="font-mono text-gray-400 font-medium tracking-wide text-xs">{time}</span>
            </div>
            
            {/* Back to Top */}
            <button 
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 group cursor-hover shadow-lg"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
