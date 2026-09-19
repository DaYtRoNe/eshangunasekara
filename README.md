# eshangunasekara.vercel.app

My personal portfolio. Live at [eshangunasekara.vercel.app](https://eshangunasekara.vercel.app/).

The public site shows my projects, experience, education and skills. All of that content lives in Firebase and is edited from a private admin panel at `/admin`, so I can update it without touching the code. The site can also build a PDF CV from the same data.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Framer Motion for animations
- Firebase: Firestore (content), Storage (images), Auth (admin login)
- `@react-pdf/renderer` for the CV
- React Router for the `/projects` and `/admin` pages

## How it's put together

```
src/
  sections/     Home page sections (Hero, About, Skills, Experience, Projects, Contact)
  pages/        /projects, /admin, 404
  components/   Shared UI (Navbar, Footer, ProjectCard, CV template, ...)
  components/admin/   Admin panel screens (projects, experience, education, skills, messages, settings, CV)
  config/firebase.js  Firebase setup (reads from .env.local)
  utils/        CV generator, image crop helper, error messages
```

Firestore collections: `projects`, `experience`, `education`, `skills`, `settings/global`, `messages` (contact form).

The public site reads from Firestore without logging in. Writes need an authenticated admin. The contact form is the only thing a visitor can write to.

## Running it locally

You need Node.js and a Firebase project.

```bash
git clone https://github.com/DaYtRoNe/eshangunasekara.git
cd eshangunasekara
npm install
```

Create `.env.local` with your Firebase web config:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Then:

```bash
npm run dev       # http://localhost:5173  (admin at /admin)
npm run build     # production build to dist/
npm run lint      # oxlint
```

## Firestore rules

Public collections allow `read` for everyone and `write` only for signed-in users. `messages` allows `create` for everyone and `read/update/delete` only for signed-in users. Set these in the Firebase console under Firestore → Rules.

## Deploying

It's on Vercel. Add the same environment variables in the Vercel project settings. `vercel.json` rewrites all routes to `index.html` so React Router works on direct links.

## License

Personal project. Feel free to look through the code and borrow ideas, but please don't copy the site as-is.
