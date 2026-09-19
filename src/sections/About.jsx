import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const About = ({ globalSettings }) => {
  const avatarUrl = globalSettings?.avatarUrl?.trim();

  return (
    <section id="about" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading eyebrow="About" title="A bit about me" />

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {avatarUrl && (
            <motion.div {...fadeUp} className="lg:col-span-4">
              <img
                src={avatarUrl}
                alt="Eshan Gunasekara"
                loading="lazy"
                className="w-full max-w-xs rounded-2xl object-cover aspect-[4/5] border border-white/10"
              />
            </motion.div>
          )}

          <motion.div {...fadeUp} className={`space-y-5 text-lg text-gray-300 leading-relaxed ${avatarUrl ? 'lg:col-span-8' : 'lg:col-span-9'}`}>
            <p>
              I'm Eshan, a software engineering student from Matale, Sri Lanka. I'm doing a BSc (Hons)
              in Software Engineering with Birmingham City University, studying through Java Institute
              for Advanced Technology.
            </p>
            <p>
              Most of what I build is web apps with React and Android apps with Java, usually with
              Firebase or MySQL behind them. I've also built two desktop apps in Java Swing for point of
              sale and stock management. Lately I've been learning 3D and scroll animation on the web
              with Three.js and GSAP.
            </p>
            <p>
              Alongside my degree I work part-time at RIO Online School as an IT and digital operations
              assistant. I look after their Zoom classes, their Facebook page, and whatever tech problems
              come up during the day.
            </p>
            <p>
              I'm looking for an internship where I can work on a real product with a team and learn from
              people who've been doing this longer than me.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
