# 📤 MAPA UPLOADU - Co gdzie wgrać

## ⚠️ WAŻNE: Struktura lokalna vs serwerowa

### Lokalnie (u Ciebie):
```
Landbouw-Interactieve-Scherm/
├── adminpanel/
│   ├── backend/
│   │   └── api/          ← TO WYRZUĆ DO OSOBNEGO FOLDERU
│   ├── includes/
│   ├── assets/
│   └── *.php
└── frontend/
    └── dist/
```

### Na serwerze (timeline/):
```
timeline/
├── adminpanel/           ← Admin panel (BEZ folderu backend!)
│   ├── includes/
│   ├── assets/
│   └── *.php
├── backend/              ← OSOBNY folder (nie w adminpanel!)
│   └── api/
│       ├── config/
│       ├── endpoints/
│       └── *.php
└── frontend/             ← Zbudowany React
    ├── assets/
    ├── images/
    └── index.html
```

---

## 📋 CO GDZIE WGRAĆ - Krok po kroku

### 1️⃣ BACKEND API (najważniejsze!)

**Z lokalnego:**
```
adminpanel/backend/api/
```

**Wgraj do serwera:**
```
timeline/backend/api/
```

**Pliki do wgrania:**
- `adminpanel/backend/api/config/database.php` → `timeline/backend/api/config/database.php`
- `adminpanel/backend/api/endpoints/get_events.php` → `timeline/backend/api/endpoints/get_events.php`
- `adminpanel/backend/api/endpoints/get_key_moments.php` → `timeline/backend/api/endpoints/get_key_moments.php`
- `adminpanel/backend/api/events.php` → `timeline/backend/api/events.php`
- `adminpanel/backend/api/key_moments_simple.php` → `timeline/backend/api/key_moments_simple.php` ⭐ NOWY
- `adminpanel/backend/api/index.php` → `timeline/backend/api/index.php`
- `adminpanel/backend/api/.htaccess` → `timeline/backend/api/.htaccess`

### 2️⃣ ADMIN PANEL

**Z lokalnego:**
```
adminpanel/  (ALE BEZ folderu backend!)
```

**Wgraj do serwera:**
```
timeline/adminpanel/
```

**Pliki do wgrania:**
- `adminpanel/includes/` → `timeline/adminpanel/includes/`
- `adminpanel/assets/` → `timeline/adminpanel/assets/`
- `adminpanel/edit_add.php` → `timeline/adminpanel/edit_add.php`
- `adminpanel/index.php` → `timeline/adminpanel/index.php`
- `adminpanel/login.php` → `timeline/adminpanel/login.php`
- `adminpanel/logout.php` → `timeline/adminpanel/logout.php`
- `adminpanel/delete.php` → `timeline/adminpanel/delete.php`
- `adminpanel/style.css` → `timeline/adminpanel/style.css`

**⚠️ NIE wgrywaj:**
- `adminpanel/backend/` ← TO NIE IDZIE DO adminpanel!
- `adminpanel/.git/` ← NIE wgrywaj folderu .git!

### 3️⃣ FRONTEND

**Z lokalnego:**
```
frontend/dist/
```

**Wgraj do serwera:**
```
timeline/frontend/
```

**Wgraj CAŁĄ zawartość `frontend/dist/` do `timeline/frontend/`**

---

## ✅ CHECKLIST

- [ ] Wgrać `adminpanel/backend/api/` → `timeline/backend/api/` (OSOBNY folder!)
- [ ] Wgrać `adminpanel/` (bez backend) → `timeline/adminpanel/`
- [ ] Wgrać `frontend/dist/*` → `timeline/frontend/`
- [ ] Sprawdzić czy `key_moments_simple.php` jest w `timeline/backend/api/`
- [ ] Sprawdzić czy `events.php` jest w `timeline/backend/api/`

---

## 🔍 WERYFIKACJA

Po wgraniu sprawdź w FileZilla, czy na serwerze masz:

```
timeline/
├── adminpanel/
│   ├── includes/
│   ├── assets/
│   └── *.php          ← TUTAJ NIE MA folderu backend!
├── backend/            ← OSOBNY folder
│   └── api/
│       ├── config/
│       ├── endpoints/
│       ├── events.php
│       ├── key_moments_simple.php  ← SPRAWDŹ CZY JEST!
│       └── index.php
└── frontend/
    ├── assets/
    └── index.html
```

---

## 🚨 NAJWAŻNIEJSZE:

1. **Backend API** (`adminpanel/backend/api/`) → **OSOBNY folder** `timeline/backend/api/`
2. **Admin Panel** (`adminpanel/` bez backend) → `timeline/adminpanel/`
3. **Frontend** (`frontend/dist/`) → `timeline/frontend/`

**NIE wgrywaj folderu `.git` na serwer!**

