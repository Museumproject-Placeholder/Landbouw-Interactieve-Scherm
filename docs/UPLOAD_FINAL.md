# 🎯 FINALNA MAPA UPLOADU - Key Moments

## ✅ Struktura na serwerze (jak jest teraz):

```
timeline/
├── adminpanel/
│   ├── backend/          ← Backend API jest TUTAJ
│   │   └── api/
│   │       ├── events.php  ← Działa!
│   │       └── key_moments_simple.php  ← SPRAWDŹ CZY JEST!
│   ├── includes/
│   └── *.php
└── frontend/
```

---

## 📤 CO WGRAĆ (tylko key moments):

### 1. Backend API - Key Moments

**Wgraj do:** `timeline/adminpanel/backend/api/`

**Pliki:**
- ✅ `key_moments_simple.php` (NOWY - najważniejszy!)
- ✅ `events.php` (zaktualizowany - już wgrane)
- ✅ `config/database.php` (zaktualizowany)
- ✅ `endpoints/get_events.php` (zaktualizowany)
- ✅ `endpoints/get_key_moments.php` (nowy)

### 2. Admin Panel

**Wgraj do:** `timeline/adminpanel/`

**Pliki:**
- ✅ `edit_add.php` (zaktualizowany)

### 3. Frontend

**Wgraj do:** `timeline/frontend/`

**Cała zawartość:** `frontend/dist/*`

---

## 🧪 TEST PO UPLOADZIE:

1. Sprawdź w FileZilla:
   - Czy `key_moments_simple.php` jest w `timeline/adminpanel/backend/api/`

2. Przetestuj w przeglądarce:
   ```
   https://mbo-portal.nl/museumproject/landbouwmuseum/timeline/adminpanel/backend/api/key_moments_simple.php?event_id=18
   ```
   
   Powinno zwrócić JSON z key moments.

3. Jeśli działa - odśwież aplikację (Ctrl+F5)

---

## ⚠️ WAŻNE:

- Backend API jest w: `timeline/adminpanel/backend/api/`
- Frontend używa: `/backend/api/` (prawdopodobnie .htaccess przekierowuje)
- Jeśli `events.php` działa, to `key_moments_simple.php` też powinien działać!

