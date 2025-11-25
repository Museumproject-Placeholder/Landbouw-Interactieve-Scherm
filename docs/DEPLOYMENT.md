# Deployment Guide - FileZilla Upload

Przewodnik jak wrzucić projekt na serwer przez FileZilla.

## 📁 Struktura na Serwerze

Na serwerze (`/var/www/html/museumproject/landbouwmuseum/timeline/`) powinno być:

```
timeline/
├── adminpanel/          # Admin panel (PHP)
├── backend/
│   └── api/             # REST API endpoints
└── frontend/            # Zbudowany React (dist/)
```

## 📤 Jak wrzucić przez FileZilla

### 1. Frontend (React)

1. **Zbuduj projekt lokalnie:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Wrzuć zawartość folderu `frontend/dist/` do `timeline/frontend/` na serwerze:**
   - Lokalnie: `frontend/dist/*` (wszystkie pliki z dist)
   - Na serwerze: `timeline/frontend/*`

### 2. Backend API

1. **Wrzuć folder `backend/api/` do `timeline/backend/api/` na serwerze:**
   - Lokalnie: `backend/api/`
   - Na serwerze: `timeline/backend/api/`
   - Zawartość: `config/`, `endpoints/`, `index.php`

2. **Wrzuć też `.htaccess` z `backend/.htaccess` do `timeline/backend/.htaccess`**

### 3. Admin Panel

1. **Wrzuć zawartość folderu `backend/adminpanel/` do `timeline/adminpanel/` na serwerze:**
   - Lokalnie: `backend/adminpanel/*` (wszystkie pliki)
   - Na serwerze: `timeline/adminpanel/*`
   - Zawartość: `includes/`, `assets/`, `*.php`, `style.css`

## ⚙️ Konfiguracja na Serwerze

### 1. API Base URL (Frontend)

W pliku `frontend/src/services/api.js` jest:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/backend/api';
```

**Dla produkcji:**
- Jeśli używasz zmiennej środowiskowej, ustaw `VITE_API_URL` przed buildem
- Lub zbuduj z właściwym URL:
  ```bash
  VITE_API_URL=https://twoja-domena.pl/backend/api npm run build
  ```

**Alternatywnie:** Po zbudowaniu możesz edytować plik `frontend/dist/assets/index-*.js` i zamienić `http://localhost/backend/api` na właściwą ścieżkę.

### 2. Database Connection

**Admin Panel** (`adminpanel/includes/db.php`):
```php
$conn = mysqli_connect("localhost", "timeline", "1234Time", "timeline");
```

**API** (`backend/api/config/database.php`):
```php
private $host = "localhost";
private $db_name = "timeline";
private $username = "timeline";
private $password = "1234Time";
```

**Sprawdź czy dane połączenia są poprawne na serwerze!**

### 3. .htaccess dla API

Plik `backend/.htaccess` powinien być w `timeline/backend/.htaccess` na serwerze.

## 🔗 URL-e na Serwerze

Po wrzuceniu plików:

- **Frontend:** `https://twoja-domena.pl/timeline/frontend/`
- **Admin Panel:** `https://twoja-domena.pl/timeline/adminpanel/login.php`
- **API:** `https://twoja-domena.pl/timeline/backend/api/events`

## ✅ Checklist przed Uploadem

- [ ] Zbudować React (`npm run build` w folderze `frontend`)
- [ ] Sprawdzić czy API_BASE_URL jest właściwy dla produkcji
- [ ] Sprawdzić dane połączenia z bazą danych
- [ ] Wrzucić `frontend/dist/*` → `timeline/frontend/`
- [ ] Wrzucić `backend/api/` → `timeline/backend/api/`
- [ ] Wrzucić `backend/.htaccess` → `timeline/backend/.htaccess`
- [ ] Wrzucić `backend/adminpanel/*` → `timeline/adminpanel/`
- [ ] Sprawdzić uprawnienia plików (755 dla folderów, 644 dla plików)

## 🐛 Troubleshooting

### API nie działa
- Sprawdź czy `.htaccess` jest w `backend/` na serwerze
- Sprawdź czy mod_rewrite jest włączony w Apache
- Sprawdź logi Apache

### Admin Panel nie działa
- Sprawdź czy `includes/db.php` ma poprawne dane bazy
- Sprawdź czy sesje PHP działają
- Sprawdź uprawnienia folderów

### Frontend nie łączy się z API
- Sprawdź czy API_BASE_URL wskazuje na właściwą ścieżkę
- Sprawdź CORS w `.htaccess`
- Sprawdź logi przeglądarki (F12 → Console)

---

**Uwaga:** Jeśli struktura na serwerze jest inna (np. `adminpanel` już istnieje osobno), możesz dostosować ścieżki odpowiednio.












