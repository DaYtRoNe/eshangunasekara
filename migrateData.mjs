import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_EIPZVPhY-RHJLl49hCKwGxvykv1ouSY",
  authDomain: "my-portfolio-946a9.firebaseapp.com",
  projectId: "my-portfolio-946a9",
  storageBucket: "my-portfolio-946a9.firebasestorage.app",
  messagingSenderId: "258358649196",
  appId: "1:258358649196:web:f7dcf6c63dafb532645349"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const seedData = async () => {
  console.log("Starting data migration...");

  // 1. Settings
  await setDoc(doc(db, "settings", "global"), {
    aboutMe: "I am a highly motivated Software Engineering student passionate about crafting digital experiences. My journey involves exploring everything from mobile app development to scalable web architectures.",
    linkedinUrl: "https://www.linkedin.com/in/eshan-gunasekara-83b9761b2",
    whatsappUrl: "https://wa.me/94778157227",
    githubUrl: "https://github.com/DaYtRoNe",
    twitterUrl: "",
    cvUrl: ""
  });
  console.log("Settings seeded.");

  // 2. Experience
  await addDoc(collection(db, "experience"), {
    role: "IT & Digital Operations Assistant",
    company: "RIO Online School",
    duration: "2024 - 2026",
    description: [
      "Managed official Facebook page and digital presence",
      "Published content and handled customer inquiries",
      "Managed Zoom classes and supported digital learning operations",
      "Solved technical issues for staff and students",
      "Improved workflow efficiency across digital platforms"
    ],
    createdAt: new Date().toISOString()
  });
  console.log("Experience seeded.");

  // 3. Education
  await addDoc(collection(db, "education"), {
    degree: "BSc (Hons) Software Engineering",
    university: "UK University (Currently Studying)",
    duration: "2023 - Present",
    details: "Studying core software engineering principles and modern architectures. Developing full-stack web applications for academic projects. Learning advanced algorithms and data structures. Collaborating on team-based agile software development.",
    createdAt: new Date().toISOString()
  });
  console.log("Education seeded.");

  // 4. Skills
  const skillCategories = [
    { title: "Core Stack", items: ['React.js', 'Node.js', 'TypeScript', 'Java', 'Next.js', 'Express'] },
    { title: "Database", items: ['MySQL', 'MongoDB', 'Firebase Firestore'] },
    { title: "Mobile", items: ['Android Java', 'Kotlin', 'React Native'] },
    { title: "Other & Tools", items: ['HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'JavaScript', 'PHP', 'Git', 'GitHub', 'Firebase', 'Vercel', 'Netlify', 'VS Code', 'IntelliJ IDEA'] }
  ];
  for (const cat of skillCategories) {
    await addDoc(collection(db, "skills"), {
      title: cat.title,
      items: cat.items,
      createdAt: new Date().toISOString()
    });
  }
  console.log("Skills seeded.");

  // 5. Projects
  const projects = [
    { title: 'Voxara E-Commerce', category: 'Mobile', description: 'Full-featured Android ecommerce application with product catalogue, cart, wishlist, profile, and secure authentication.', tech: ['Android Studio', 'Java', 'Firebase', 'Firestore'], github: '#', demo: '', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Voxara Admin Panel', category: 'Web', description: 'Admin dashboard for managing products, customers, orders, categories and brands with real-time database updates.', tech: ['React.js', 'Tailwind CSS', 'Node.js', 'Firebase'], github: '#', demo: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Mobile Planet', category: 'Web', description: 'Complete ecommerce platform with product filtering, cart, checkout, admin panel and sales management.', tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'], github: '#', demo: '', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000' },
    { title: 'ChitChat Messenger', category: 'Mobile', description: 'Cross-platform messaging application with secure authentication and real-time communication protocols.', tech: ['React Native', 'TypeScript', 'Java', 'MySQL'], github: '#', demo: '', image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=1000' },
    { title: 'Lavanya Fashions POS', category: 'Desktop', description: 'Enterprise POS system managing customers, inventory, employees, invoices and complex sales reports.', tech: ['Java', 'Java Swing', 'MySQL', 'JasperReports'], github: '#', demo: '', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1000' },
    { title: 'GymPos Management', category: 'Desktop', description: 'Team-built gym management desktop application handling members, payments, and administrative reports.', tech: ['Java', 'Java Swing', 'MySQL', 'JasperReports'], github: '#', demo: '', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1000' }
  ];
  for (const proj of projects) {
    await addDoc(collection(db, "projects"), {
      title: proj.title,
      description: proj.description,
      tech: proj.tech,
      github: proj.github,
      demo: proj.demo,
      image: proj.image,
      createdAt: new Date().toISOString()
    });
  }
  console.log("Projects seeded.");

  console.log("Migration complete!");
  process.exit(0);
};

seedData().catch(console.error);
