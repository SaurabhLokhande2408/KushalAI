# KushalAI — Frontend Demo

An AI-enabled competency-gap and learning platform prototype for India's Official
Statistical System. **This is a frontend-only demo.** There is no backend, no
database, and no live integration with iGOT Karmayogi or any other external
system — every officer, course, quiz, and analytics figure in this app is
synthetic demo data bundled in `src/data/`.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Logging in

There is no real authentication. From `/login`, use either demo button:

- **Demo officer** → signs in as Arjun Mehta and opens the officer dashboard.
- **Demo admin** → signs in as Priya Sharma and opens the admin dashboard.

Submitting the login form with any email/password also signs you in as the
demo officer, since there is no backend to validate credentials against.

## Project structure

```
kushalai-frontend/
├── public/assets/kushalAI_logo.png  # KushalAI logo
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/       # Button, Card, Modal, Drawer, Toast, StatCard, etc.
│   │   ├── dashboard/    # ActivityHeatmap, QuizTrendChart
│   │   ├── roadmap/      # Roadmap, RoadmapNode, CourseDrawer, UploadDropzone
│   │   ├── quiz/         # QuizQuestion, QuizProgress, QuizResult
│   │   └── admin/        # Heatmap, ColleagueTable, EmergingSkills
│   ├── layouts/          # AuthLayout, OfficerLayout, AdminLayout
│   ├── pages/            # one file per route (see Routes below)
│   ├── data/             # all mock data — the only "backend" this app has
│   ├── context/          # AppContext: auth + discipline score + roadmap state
│   ├── styles/           # tokens.css (design system values), globals.css, components.css
│   └── App.jsx / main.jsx
├── package.json
├── requirements.txt
└── vite.config.js
```

## Routes

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/login`, `/register`, `/profile-setup` | Auth flow (mocked) |
| `/dashboard` | Officer dashboard — discipline score, KPIs, skill passport preview, quiz trend |
| `/roadmap` | Interactive competency roadmap with filters and a course detail drawer |
| `/quiz/:id` | Full-page quiz for the course with id `:id`, ending in an in-page results review |
| `/skills` | Full Skill Passport with expandable domains |
| `/profile` | Officer profile (locally editable) |
| `/admin` | Read-only admin dashboard: KPIs, competency heatmap, emerging skills, officer table with search/filters |
| `/admin/colleagues/:id` | Read-only detail view for one synthetic officer |
| `*` | 404 |

## How the demo behaves

Everything is wired to local React state (`src/context/AppContext.jsx`) and
persisted to `localStorage` so it survives a page refresh:

- Completing a quiz updates the discipline score (+10), records the score in
  the quiz trend chart, marks the matching roadmap node as completed, and
  unlocks any roadmap node whose prerequisites are now satisfied.
- The "Upload material → Generate MCQs" flow in the course drawer is fully
  simulated: it shows a processing sequence and then reveals a pre-baked
  quiz. No file is actually parsed or sent anywhere.
- The admin dashboard's search, department filter, and status filter run
  against the local synthetic officer list in `src/data/mockAdmin.js`.

## Design system

Colors, type scale, spacing (8px system), radii, shadows, and button styles
are centralized in `src/styles/tokens.css` and `src/styles/components.css`,
matching the brief's design system exactly (primary blue `#1B4CA1`, orange
`#F5A12A`, cream `#FCE5CC`, Poppins/Inter typography, pill buttons, 16px
card radius, etc.).

## Known limitations / what to know before demoing

- **Logo:** the supplied `public/assets/kushalAI_logo.png` is used throughout
  the app and as the favicon.
- This build covers every route and the core interactions end-to-end
  (login → roadmap → course drawer → upload/quiz → result → dashboard
  update; admin → heatmap/table → colleague detail). Some of the more
  decorative details in the original brief (e.g. Framer Motion micro-
  animations beyond hover/transition states, a dedicated onboarding tour)
  were kept intentionally minimal so the app stays fast and easy to extend
  — the component structure is in place to add more of that polish.
- All names, departments, scores, and skill levels are fictional and
  regenerated the same way on every load (no live randomness), so the demo
  looks consistent across runs.
