# 📤 MAPA UPLOADU - POPRAWNA STRUKTURA

## ✅ FAKTYCZNA struktura na serwerze:

```
timeline/
├── adminpanel/
│   ├── backend/          ← Backend API jest TUTAJ!
│   │   └── api/
│   │       ├── config/
│   │       ├── endpoints/
│   │       └── *.php
│   ├── includes/
│   ├── assets/
│   └── *.php
└── frontend/
    └── ...
```

## 📤 CO GDZIE WGRAĆ:

### 1️⃣ BACKEND API

**Z lokalnego:**
```
adminpanel/backend/api/
```

**Wgraj do serwera:**
```
timeline/adminpanel/backend/api/
```

**Najważniejsze pliki:**
- ✅ `key_moments_simple.php` (NOWY - najważniejszy!)
- ✅ `events.php` (zaktualizowany)
- ✅ `config/database.php` (zaktualizowany)
- ✅ `endpoints/get_events.php` (zaktualizowany)
- ✅ `endpoints/get_key_moments.php` (nowy)
- ✅ `index.php` (zaktualizowany)

### 2️⃣ ADMIN PANEL

**Z lokalnego:**
```
adminpanel/  (BEZ folderu .git!)
```

**Wgraj do serwera:**
```
timeline/adminpanel/
```

**Pliki:**
- ✅ `edit_add.php` (zaktualizowany)
- ✅ `includes/`
- ✅ `assets/`
- ✅ `*.php`

**⚠️ NIE wgrywaj:**
- ❌ `.git/` folder (niepotrzebny na serwerze)

### 3️⃣ FRONTEND

**Z lokalnego:**
```
frontend/dist/
```

**Wgraj do serwera:**
```
timeline/frontend/
```

---

## 🔍 WERYFIKACJA

Sprawdź w FileZilla, czy na serwerze masz:

```
timeline/adminpanel/backend/api/key_moments_simple.php  ← SPRAWDŹ CZY JEST!
```

---

## 🧪 TEST

Otwórz w przeglądarce:
```
https://mbo-portal.nl/museumproject/landbouwmuseum/timeline/adminpanel/backend/api/key_moments_simple.php?event_id=18
```

LUB (jeśli .htaccess przekierowuje):
```
https://mbo-portal.nl/museumproject/landbouwmuseum/timeline/backend/api/key_moments_simple.php?event_id=18
```

---

## ⚠️ WAŻNE

Jeśli frontend używa `/backend/api/`, a backend jest w `/adminpanel/backend/api/`, to:
1. Albo .htaccess przekierowuje `/backend/api/` → `/adminpanel/backend/api/`
2. Albo trzeba zaktualizować frontend, aby używał `/adminpanel/backend/api/`

Sprawdź, która ścieżka działa dla `events.php`!

