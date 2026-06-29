import { pdf } from '@react-pdf/renderer';
import CVTemplate from '../components/CVTemplate';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export const generateCV = async () => {
  try {
    // Fetch all required data concurrently
    const [settingsSnap, experienceSnap, educationSnap, skillsSnap, projectsSnap] = await Promise.all([
      getDoc(doc(db, 'settings', 'global')),
      getDocs(query(collection(db, 'experience'), orderBy('createdAt', 'desc'))),
      getDocs(query(collection(db, 'education'), orderBy('createdAt', 'desc'))),
      getDocs(query(collection(db, 'skills'), orderBy('createdAt', 'asc'))),
      getDocs(query(collection(db, 'projects'), orderBy('createdAt', 'desc')))
    ]);

    const data = {
      settings: settingsSnap.exists() ? settingsSnap.data() : {},
      experience: experienceSnap.docs.map(doc => doc.data()),
      education: educationSnap.docs.map(doc => doc.data()),
      skills: skillsSnap.docs.map(doc => doc.data()),
      projects: projectsSnap.docs.map(doc => doc.data()).filter(p => p.isPublished !== false)
    };

    // Generate PDF blob
    const blob = await pdf(<CVTemplate data={data} />).toBlob();
    return blob;
  } catch (error) {
    console.error("Error generating CV:", error);
    throw error;
  }
};
