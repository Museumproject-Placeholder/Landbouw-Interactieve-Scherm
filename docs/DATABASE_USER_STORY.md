# User Story: Database Setup voor Timeline Events

**Als** database developer
**Wil ik** een MySQL database opzetten voor timeline events
**Zodat** de React applicatie dynamische data kan gebruiken en het museum content kan beheren

---

## Acceptance Criteria

✅ MySQL database `timeline` bestaat en draait
✅ Tabel `timeline_events` is aangemaakt met alle kolommen
✅ Alle 9 bestaande events zijn geïmporteerd
✅ Database gebruiker heeft correcte rechten
✅ Database is klaar voor API connectie

---

## Database Schema

### Tabel: `timeline_events`

```sql
CREATE TABLE timeline_events (
  id INT PRIMARY KEY AUTO_INCREMENT,

  -- Basis informatie
  year VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,

  -- Visuele opties
  icon VARCHAR(50) DEFAULT '🌾',
  gradient VARCHAR(100),
  museum_gradient VARCHAR(100),

  -- Categorisatie
  stage INT DEFAULT 1,

  -- Puzzle game
  has_puzzle BOOLEAN DEFAULT FALSE,
  puzzle_image_url VARCHAR(500),

  -- Modal opties
  use_detailed_modal BOOLEAN DEFAULT FALSE,
  historical_context TEXT,

  -- Volgorde & status
  sort_order INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Indexes
  INDEX idx_sort_order (sort_order),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Kolom Uitleg

| Kolom | Type | Doel |
|-------|------|------|
| `year` | VARCHAR(20) | "1925" of "1930-1956" |
| `title` | VARCHAR(255) | Titel van gebeurtenis |
| `description` | TEXT | Volledige beschrijving |
| `icon` | VARCHAR(50) | Emoji icoon (🌾) |
| `gradient` | VARCHAR(100) | Kleurverloop modern theme |
| `museum_gradient` | VARCHAR(100) | Kleurverloop museum theme |
| `stage` | INT | Museum fase (1, 2, 3) |
| `has_puzzle` | BOOLEAN | Heeft puzzelspel? |
| `puzzle_image_url` | VARCHAR(500) | Pad naar puzzel afbeelding |
| `use_detailed_modal` | BOOLEAN | Uitgebreide modal? |
| `historical_context` | TEXT | Extra historische info |
| `sort_order` | INT | Volgorde (0, 1, 2...) |
| `is_active` | BOOLEAN | Zichtbaar op timeline? |

---

## Database Setup

### 1. Database aanmaken

```sql
CREATE DATABASE timeline CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Gebruiker aanmaken

```sql
CREATE USER 'timeline_api'@'localhost' IDENTIFIED BY 'VEILIG_WACHTWOORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON timeline.* TO 'timeline_api'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Tabel aanmaken

Gebruik het CREATE TABLE statement hierboven.

### 4. Data importeren

```sql
INSERT INTO timeline_events
(year, title, description, icon, gradient, museum_gradient, stage, has_puzzle, sort_order, is_active)
VALUES
('1925', 'Oprichting van het museum', 'Het Fries Landbouwmuseum begint met een bescheiden zuivelexpositie in Leeuwarden...', '🌾', 'from-amber-600 to-orange-500', 'from-brand-rust to-brand-terracotta', 1, 1, 0, 1),
('1930–1956', 'Eysingahuis en Stania State', 'Uitbreiding van de collectie met landbouwgereedschap...', '🌾', 'from-blue-600 to-cyan-500', 'from-brand-sky to-brand-mist', 1, 0, 1, 1),
('1945–1987', 'Na de oorlog, groei, verplaatsingen', 'Na de Tweede Wereldoorlog snelle uitbreiding...', '🌾', 'from-slate-600 to-gray-500', 'from-brand-slate to-brand-maroon', 1, 1, 2, 1),
('1987', 'Nieuwe start in Exmorra', 'Officiële heropening als Fries Landbouwmuseum...', '🌾', 'from-green-600 to-emerald-500', 'from-brand-olive to-brand-mist', 2, 1, 3, 1),
('2006', 'Verhuizing naar Earnewâld, professionalisering', 'Samenwerking met It Fryske Gea...', '🌾', 'from-indigo-600 to-purple-500', 'from-brand-amber to-brand-terracotta', 2, 0, 4, 1),
('2018', 'Nieuwe locatie Leeuwarden', 'Het museum vestigt zich in de monumentale boerderij...', '🌾', 'from-rose-600 to-pink-500', 'from-brand-rust to-brand-gold', 2, 1, 5, 1),
('2020', 'Uitbreiding van de collectie', 'Integratie van de collectie van Stichting Ús Mem...', '🌾', 'from-teal-600 to-cyan-500', 'from-brand-mist to-brand-sky', 3, 0, 6, 1),
('2023–2025', 'Vernieuwing en jubileum', 'Grondige modernisering van het museum...', '🌾', 'from-yellow-500 to-amber-600', 'from-brand-gold to-brand-amber', 3, 1, 7, 1),
('2026', 'Toekomstgerichte exposities', 'Start van exposities over het internationale voedselsysteem...', '🌾', 'from-violet-600 to-fuchsia-500', 'from-brand-amber to-brand-rust', 3, 1, 8, 1);
```

---

## API Endpoints (voor referentie)

De database wordt gebruikt door REST API:

```
GET  /api/timeline/events        - Haal alle actieve events (voor React)
GET  /api/admin/events           - Haal alle events (voor Admin)
POST /api/admin/events           - Maak nieuw event
PUT  /api/admin/events/:id       - Update event
DELETE /api/admin/events/:id     - Verwijder event
```

---

## Geschatte Tijd

⏱️ **2-3 uur**

---

## Definition of Done

✅ Database draait en is toegankelijk
✅ Tabel heeft alle kolommen
✅ 9 events zijn geïmporteerd
✅ Test queries werken
✅ Connection credentials zijn gedocumenteerd
