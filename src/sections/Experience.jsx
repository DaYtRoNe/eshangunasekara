import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getFetchErrorMessage } from '../utils/fetchError';
import SectionHeading from '../components/SectionHeading';

const TimelineItem = ({ item, index }) => (
  <motion.li
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="group grid grid-cols-[1.5rem_1fr] md:grid-cols-[9rem_2rem_1fr] gap-x-4 md:gap-x-6 pb-12 last:pb-0"
  >
    {/* Period (desktop column) */}
    <div className="hidden md:block text-right pt-0.5">
      <span className="text-sm font-mono text-gray-500">{item.period}</span>
    </div>

    {/* Marker + line */}
    <div className="relative flex justify-center" aria-hidden="true">
      <span className="absolute top-2 bottom-0 w-px bg-white/10 group-last:hidden" />
      <span className="relative mt-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-dark-900" />
    </div>

    {/* Content */}
    <div>
      <span className="md:hidden block text-sm font-mono text-gray-500 mb-1">{item.period}</span>
      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
      <p className="text-gray-400 mb-4">{item.place}</p>
      {item.points.length > 0 && (
        <ul className="space-y-2 text-gray-300">
          {item.points.map((point, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2.5 w-1 h-1 rounded-full bg-gray-500 shrink-0" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </motion.li>
);

const Experience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = () => setReloadKey(k => k + 1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [expSnap, eduSnap] = await Promise.all([
          getDocs(query(collection(db, 'experience'), orderBy('createdAt', 'desc'))),
          getDocs(query(collection(db, 'education'), orderBy('createdAt', 'desc')))
        ]);

        const work = expSnap.docs.map(doc => {
          const data = doc.data();
          return {
            title: data.role,
            place: data.company,
            period: data.period || data.duration || '',
            points: data.description || [],
            createdAt: data.createdAt
          };
        });

        const education = eduSnap.docs.map(doc => {
          const data = doc.data();
          return {
            title: data.degree,
            place: data.institution || data.university || '',
            period: data.period || data.duration || '',
            points: data.details ? data.details.split(/\r?\n|\\n/).map(d => d.trim()).filter(Boolean) : [],
            createdAt: data.createdAt
          };
        });

        setItems([...work, ...education].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Error fetching experience data:", err);
        setError(getFetchErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reloadKey]);

  return (
    <section id="experience" className="py-24 border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading eyebrow="Background" title="Experience and education" />

        <div className="max-w-5xl">
          {loading ? (
            <p className="text-gray-500">Loading…</p>
          ) : error ? (
            <div className="max-w-xl card p-8 text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">Couldn't load this section</h3>
              <p className="text-gray-400 text-sm mb-6">{error}</p>
              <button
                onClick={retry}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg surface text-sm text-white hover:border-white/25 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
            </div>
          ) : (
            <ol>
              {items.map((item, i) => (
                <TimelineItem key={`${item.title}-${i}`} item={item} index={i} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
