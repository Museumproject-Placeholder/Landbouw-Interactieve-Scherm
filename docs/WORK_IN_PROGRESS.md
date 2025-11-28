# Work In Progress - Current Status

**Last Updated:** 2024-11-05

## Aktualny Stan Projektu

### ✅ Zakończone Zadania

#### 1. Porządkowanie Struktury Plików
- ✅ Utworzono folder `docs/` z organizacją dokumentacji
- ✅ Przeniesiono wszystkie pliki `.md` do odpowiednich folderów
- ✅ Zaktualizowano `.gitignore`
- ✅ Usunięto niepotrzebne pliki (test.php, logi)

#### 2. Backend API
- ✅ Backend zawiera tylko REST API w `backend/api/`
- ✅ Usunięto niepotrzebny folder `backend/admin/` (używamy `adminpanel/`)
- ✅ API endpointy działają:
  - `GET /api/events` - pobiera wszystkie eventy
  - `GET /api/event?id={id}` - pobiera pojedynczy event
  - `POST /api/event` - tworzy nowy event
  - `PUT /api/event` - aktualizuje event
  - `DELETE /api/event?id={id}` - usuwa event

#### 3. Admin Panel (`backend/adminpanel/`)
- ✅ Przeniesiono `adminpanel/` do `backend/adminpanel/` - wszystko w jednym miejscu
- ✅ Zintegrowano z tabelą `timeline_events` w bazie danych
- ✅ Wszystkie operacje CRUD działają:
  - **Lista eventów** (`index.php`) - wyświetla wszystkie eventy z tabeli `timeline_events`
  - **Dodawanie/Edytowanie** (`edit_add.php`) - formularz z mapowaniem kolumn
  - **Usuwanie** (`delete.php`) - usuwanie z potwierdzeniem
- ✅ Autoryzacja działa (`includes/auth.php`, `login.php`, `logout.php`)
- ✅ Mapowanie kolumn: formularz używa starych nazw (`jaar`, `titel`), ale zapisuje do nowych (`year`, `title`, `description`, etc.)

#### 4. Frontend API Integration
- ✅ Zaktualizowano `frontend/src/services/api.js` aby używał właściwych endpointów
- ✅ API_BASE_URL wskazuje na `http://localhost/backend/api`
- ✅ Dodano metody: `getTimeline()`, `getEventById()`, `createEvent()`, `updateEvent()`, `deleteEvent()`

### 📊 Struktura Bazy Danych

**Tabela:** `timeline_events` (baza: `timeline`)

Główne kolumny:
- `id`, `year`, `title`, `description`
- `icon`, `gradient`, `museum_gradient`
- `stage` (1, 2, 3)
- `has_puzzle`, `puzzle_image_url`
- `use_detailed_modal`, `historical_context`
- `sort_order`, `is_active`
- `created_at`, `updated_at`

### 📁 Struktura Projektu

```
Landbouw-Interactieve-Scherm/
├── backend/                 # Backend (API + Admin Panel)
│   ├── api/                 # REST API
│   │   ├── config/database.php
│   │   ├── endpoints/
│   │   │   ├── get_events.php
│   │   │   └── event_crud.php
│   │   └── index.php
│   ├── adminpanel/          # Admin panel (PHP/HTML/JS)
│   │   ├── includes/        # auth.php, db.php, functions.php
│   │   ├── index.php         # Dashboard - lista eventów
│   │   ├── edit_add.php      # Formularz dodawania/edytowania
│   │   ├── delete.php        # Usuwanie eventów
│   │   └── login.php, logout.php
│   ├── .htaccess
│   └── README.md
├── frontend/                # React aplikacja
│   └── src/services/api.js  # Zaktualizowane endpointy
└── docs/                    # Dokumentacja
```

### 🔄 Następne Kroki (do kontynuacji)

1. **Frontend - Integracja z API**
   - Sprawdzić czy frontend React pobiera eventy z API zamiast hardcoded data
   - Upewnić się że `useTimeline` hook używa `api.getTimeline()`
   - Przetestować czy timeline wyświetla eventy z bazy danych

2. **Admin Panel - Ulepszenia**
   - Możliwość zarządzania `event_sections` i `event_media`
   - Upload obrazów do puzzle
   - Walidacja formularzy

3. **API - Dodatkowe Endpointy**
   - Endpointy dla `event_sections` i `event_media` (jeśli potrzebne)
   - Upload endpoint dla obrazów

### ⚠️ Ważne Uwagi

- **Admin Panel** używa tabeli `timeline_events` (nie `events`)
- **Frontend** powinien używać API z `backend/api/`
- **Baza danych** to `timeline` z tabelą `timeline_events`
- **Mapowanie kolumn** w adminpanel: formularz używa starych nazw, ale zapisuje do nowych

### 🔗 Powiązane Pliki

- `backend/adminpanel/index.php` - lista eventów
- `backend/adminpanel/edit_add.php` - formularz CRUD
- `backend/adminpanel/includes/db.php` - połączenie z bazą
- `backend/api/endpoints/get_events.php` - API endpoint
- `backend/api/endpoints/event_crud.php` - CRUD endpoint
- `frontend/src/services/api.js` - frontend API client

---

**Status:** Gotowe do kontynuacji pracy nad integracją frontendu z API.


