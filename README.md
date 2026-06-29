# 🚀 Eshan Gunasekara - Developer Portfolio

> A highly modern, premium, and interactive personal portfolio built with React, Vite, Tailwind CSS, Framer Motion, and a fully functional Firebase Backend Admin Panel.

This portfolio is designed to stand out. It moves away from standard static templates by incorporating cinematic animations, 3D elements, interactive physics, and a "Holographic Nexus" design language. **It also features a secure, custom-built Admin Dashboard allowing real-time content management without touching code.**

## ✨ Key Features

- **Holographic Nexus Hero**: A cinematic, center-focused hero section with massive animated gradient typography and floating 3D "Glass Nodes".
- **Auto CV Generator (PDF)**: Automatically generates an ATS-friendly, beautifully formatted PDF Curriculum Vitae on the fly directly from your Firebase data using `@react-pdf/renderer`.
- **Glass Terminal & 3D ID Card**: A highly creative "About Me" section featuring a rotating 3D holographic ID card and a frosted glass macOS-style terminal.
- **Dynamic Content & Admin Panel**: A secure, authenticated `/admin` dashboard that allows the owner to Add, Edit, and Delete Projects, Experience, Education, and Skills in real-time. Includes specific fields to customize text for the Auto CV separately from the Portfolio UI.
- **Profile Avatar Cropper**: Built-in image upload tool with a full crop UI (`react-easy-crop`) that lets the admin upload and frame a perfectly circular avatar for the 3D ID Card.
- **Firebase Backend Integration**: Fully integrated with Firebase Firestore for database management, Firebase Storage for asset/image uploads, and Firebase Auth for secure admin access (including password resets).
- **Interactive Contact Hub**: Features a spinning 3D Globe, direct email/WhatsApp integrations, and a Floating Social Media Dock.
- **Premium Aesthetics**: Fully responsive layout utilizing glassmorphism, glowing accents, premium typography, and smooth scroll transitions.

## 🛠️ Tech Stack

- **Frontend Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling & Animations**: [Tailwind CSS](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Firebase Firestore](https://firebase.google.com/products/firestore), [Firebase Auth](https://firebase.google.com/products/auth), & [Firebase Storage](https://firebase.google.com/products/storage)
- **3D Graphics**: [Cobe](https://github.com/shuding/cobe) (Interactive Globe)
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

## 🚀 Getting Started

If you want to run this project locally, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine. You will also need a Firebase project.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DaYtRoNe/eshangunasekara.git
   cd eshangunasekara
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Public Site: `http://localhost:5173`
   - Admin Panel: `http://localhost:5173/admin`

## 🎨 Deployment (Vercel)
When deploying to Vercel, ensure you add the Environment Variables in your Vercel Project Settings. The included `vercel.json` ensures that React Router correctly handles Single Page Application (SPA) routing to prevent 404 errors on direct navigation.

## 📄 License
This project is for personal use as a portfolio. You are welcome to take inspiration, but please do not copy the exact design or content directly.

---
*Crafted with ❤️ by [Eshan Gunasekara](https://github.com/DaYtRoNe)*
