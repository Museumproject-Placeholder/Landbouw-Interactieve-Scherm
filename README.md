# Fries Landbouwmuseum - Interactive Timeline App

Interactieve tijdlijn applicatie voor het Fries Landbouwmuseum in Leeuwarden (Nederland) ter gelegenheid van het 100-jarig jubileum (1925-2025). De applicatie draait op een touchscreen kiosk in het museum en laat bezoekers de geschiedenis van het museum op een interactieve manier verkennen.

## 📱 Over het Project

Een interactief touchscreen applicatie die bezoekers door 100 jaar geschiedenis van het Fries Landbouwmuseum leidt. De applicatie is speciaal ontworpen voor gebruik op touchscreen kiosk (1920x1080 resolutie) en bevat rijke historische content, interactieve elementen, en educatieve features.

## 🚀 Features

- **Interactieve Timeline** - Horizontale scrollbare tijdlijn met 9 historische periodes
- **Twee Thema's** - Modern (blauw/cyaan) en Museum (aarde tinten)
- **Touch Optimized** - Volledig geoptimaliseerd voor touchscreen displays
- **Puzzelspel** - 3x3 schuifpuzzel met meerdere afbeeldingen
- **Detail Modals** - Rijke content met foto galleries, video's, en historische context
- **Responsive Design** - Werkt op desktop, tablet, en grote touchscreens

## 📁 Project Structuur

```
Landbouw-Interactieve-Scherm/
├── frontend/                    # React + Vite applicatie
│   ├── src/
│   │   ├── components/         # React componenten
│   │   │   ├── Timeline/       # Timeline gerelateerde componenten
│   │   │   ├── PuzzleGame/     # Puzzelspel componenten
│   │   │   └── Common/         # Gedeelde componenten
│   │   ├── config/             # Configuratie (thema's, galleries)
│   │   ├── assets/             # Afbeeldingen, fonts
│   │   └── styles/             # Global CSS
│   ├── public/                 # Statische bestanden
│   └── dist/                   # Build output (niet in git)
├── backend/                     # PHP REST API + Admin Panel
│   ├── api/                    # REST API endpoints
│   │   ├── config/             # Database configuratie
│   │   ├── endpoints/          # API endpoints
│   │   └── index.php           # API router
│   ├── adminpanel/             # Admin panel (PHP/HTML/JS)
│   │   ├── includes/           # PHP includes
│   │   ├── assets/             # CSS, uploads
│   │   └── *.php               # Admin panel pagina's
│   └── .htaccess               # Apache configuratie
├── docs/                        # Project documentatie
└── README.md                    # Dit bestand
```

## 🛠️ Technologie Stack

**Frontend:**

- React.js 18
- Vite (build tool)
- Framer Motion (animaties)
- Tailwind CSS (styling)
- React Router (routing)
- Lucide React (icons)
- Yet Another React Lightbox (gallery)

**Backend:**

- MySQL Database (timeline_events tabel)
- PHP REST API
- Admin Panel voor content beheer (PHP/HTML/JS)

**Deployment:**

- Touchscreen kiosk (1920x1080 resolutie)
- Production build via Vite
- Static file hosting

## 📦 Installatie & Setup

### Prerequisites

- Node.js (v22.19.0) met npm
- VSCode (aanbevolen extensions: ES7+ React/Redux snippets, Tailwind CSS IntelliSense)
- Git of GitHub Desktop

### Frontend Setup

```bash
# Clone repository
git clone https://github.com/YOURNAME/Landbouw-Interactieve-Scherm.git
cd Landbouw-Interactieve-Scherm

# Installeer dependencies
cd frontend
npm install

# Start development server
npm run dev
```

De applicatie draait op `http://localhost:5173`

### Build voor Productie

```bash
cd frontend
npm run build
```

Output staat in `frontend/dist/`

## 🎨 Thema's

Het project heeft twee thema's:

**Modern Theme (default):**

- Kleuren: Blauw, Cyaan, Paars
- Modern UI design
- Gradient effecten

**Museum Theme:**

- Kleuren: Roest, Amber, Olijf, Maroon
- Warme, aarde tinten
- Klassiek museum gevoel

Wissel tussen thema's via de knop rechtsboven.

## 📊 Database Schema

De applicatie gebruikt een MySQL database met de volgende structuur:

```sql
timeline_events
├── id (INT)
├── year (VARCHAR)
├── title (VARCHAR)
├── description (TEXT)
├── icon (VARCHAR)
├── gradient (VARCHAR)
├── museum_gradient (VARCHAR)
├── stage (INT)
├── has_puzzle (BOOLEAN)
├── puzzle_image_url (VARCHAR)
├── use_detailed_modal (BOOLEAN)
├── historical_context (TEXT)
├── sort_order (INT)
├── is_active (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

Zie `DATABASE_USER_STORY.md` voor volledige setup instructies.

## 🔄 Git Workflow

### Branch maken en PR openen

```bash
# Update je lokale clone
git checkout main
git pull

# Maak nieuwe branch
git checkout -b feature/jouw-feature-naam

# Maak je changes...

# Add en commit
git add .
git commit -m "Beschrijving van je changes"

# Push naar GitHub
git push --set-upstream origin feature/jouw-feature-naam

# Open PR op GitHub
```

## 🔮 Roadmap

- [x] REST API backend
- [x] Admin panel voor content beheer
- [ ] Audio guide integratie
- [ ] Video content support
- [ ] Multi-language support (NL/EN/FY)
- [ ] Analytics & statistics

## 📝 Documentatie

Alle documentatie is georganiseerd in de `/docs` directory:

- **Frontend documentatie**: `/docs/frontend/`

  - `THEME_SYSTEM_DOCUMENTATION.md` - Thema systeem uitleg
  - `ANIMATION_GUIDE.md` - Animatie implementatie
  - `GALLERY_SYSTEM_GUIDE.md` - Gallery systeem
  - `VIRTUAL_GUIDE_DOCUMENTATION.md` - Virtual guide mascot
  - `TIMELINE_IMPROVEMENTS.md` - Timeline verbeteringen
  - `TIMELINE_COMPONENT_README.md` - Timeline component structuur
  - `MUSEUM_COLORS_MAP.md` - Museum kleuren referentie
  - `QUICK_THEME_TEST.md` - Quick reference voor thema testing

- **Project documentatie**: `/docs/`
  - `ADMIN_PANEL_USER_STORY.md` - Admin panel specificaties
  - `DATABASE_USER_STORY.md` - Database setup guide

Zie [docs/README.md](docs/README.md) voor volledige documentatie index.

## 👥 Team

- **Frontend Development:** Lukasz
- **Database Design:** Database Developer
- **Admin Panel Design:** Junior Lee
- **Content:** Fries Landbouwmuseum

## 📄 Licentie

Proprietary - Fries Landbouwmuseum © 2025

---
