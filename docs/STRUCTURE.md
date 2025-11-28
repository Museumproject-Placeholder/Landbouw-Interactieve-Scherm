# Project Structure

This document describes the organized structure of the Fries Landbouwmuseum Interactive Timeline project.

## Root Structure

```
Landbouw-Interactieve-Scherm/
├── docs/                    # All project documentation
│   ├── frontend/           # Frontend documentation
│   ├── backend/            # Backend documentation (future)
│   ├── README.md           # Documentation index
│   ├── STRUCTURE.md        # This file
│   ├── ADMIN_PANEL_USER_STORY.md
│   └── DATABASE_USER_STORY.md
├── frontend/                # React frontend application
│   ├── src/                # Source code
│   ├── public/            # Static assets
│   ├── dist/              # Build output (gitignored)
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/                 # PHP REST API backend + Admin Panel
│   ├── api/               # API endpoints
│   ├── adminpanel/        # Admin panel (PHP/HTML/JS)
│   ├── .htaccess          # Apache configuration
│   └── README.md
└── README.md               # Main project README
```

## Frontend Structure

```
frontend/src/
├── assets/                 # Static assets
│   ├── images/            # Image files
│   │   ├── puzzle/       # Puzzle game images
│   │   ├── timeline/     # Timeline event images
│   │   └── ...           # Other images
│   └── sounds/           # Audio files
├── components/            # React components
│   ├── Admin/            # Admin components
│   ├── Common/           # Shared components
│   ├── DetailPage/       # Detail page components
│   ├── PuzzleGame/       # Puzzle game components
│   └── Timeline/         # Timeline components
│       ├── content/      # Content display components
│       ├── modals/       # Modal components
│       ├── ui/          # UI components
│       └── examples/    # Example components
├── config/               # Configuration files
│   ├── themes.js        # Theme definitions
│   └── timelineGalleries.js
├── hooks/                 # Custom React hooks
├── pages/                 # Page components
├── services/              # API services
├── styles/                # Global styles
└── utils/                 # Utility functions
```

## Backend Structure

```
backend/
├── api/                   # REST API endpoints
│   ├── config/
│   │   └── database.php  # Database connection
│   ├── endpoints/
│   │   ├── get_events.php        # GET all events (for React frontend)
│   │   └── event_crud.php        # CRUD operations (for adminpanel)
│   └── index.php         # API router
├── adminpanel/            # Admin panel
│   ├── includes/
│   │   ├── auth.php      # Authentication check
│   │   ├── db.php        # Database connection
│   │   └── functions.php # Helper functions
│   ├── assets/           # CSS, uploads
│   ├── index.php         # Dashboard (list events)
│   ├── edit_add.php      # Add/edit event form
│   ├── delete.php        # Delete confirmation
│   ├── login.php         # Login page
│   └── logout.php        # Logout handler
├── .htaccess             # Apache URL rewriting
└── README.md
```

## Documentation Structure

```
docs/
├── README.md              # Documentation index
├── STRUCTURE.md           # Project structure (this file)
├── frontend/              # Frontend documentation
│   ├── ANIMATION_GUIDE.md
│   ├── GALLERY_SYSTEM_GUIDE.md
│   ├── MUSEUM_COLORS_MAP.md
│   ├── QUICK_THEME_TEST.md
│   ├── THEME_SYSTEM_DOCUMENTATION.md
│   ├── TIMELINE_IMPROVEMENTS.md
│   ├── TIMELINE_COMPONENT_README.md
│   └── VIRTUAL_GUIDE_DOCUMENTATION.md
├── backend/               # Backend documentation (future)
├── ADMIN_PANEL_USER_STORY.md
└── DATABASE_USER_STORY.md
```

## Asset Organization

### Images
- **Puzzle images**: `frontend/src/assets/images/puzzle/`
- **Timeline images**: `frontend/src/assets/images/timeline/`
  - Each timeline event has its own folder (e.g., `museum-foundation/`)
- **Logo/images**: `frontend/src/assets/images/`

### Public Assets
- Static assets that need to be accessible directly: `frontend/public/`
- These are copied to `dist/` during build

## Build Output

- **Production build**: `frontend/dist/` (gitignored)
- Contains optimized, minified files ready for deployment

## Ignored Files

See `.gitignore` for complete list. Main ignored items:
- `node_modules/`
- `frontend/dist/`
- `*.log`
- `.env*`
- IDE files
- OS files

