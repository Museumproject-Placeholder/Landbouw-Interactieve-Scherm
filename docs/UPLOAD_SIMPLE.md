# 🚀 PROSTA MAPA UPLOADU - Key Moments

## 📤 CO WGRAĆ (tylko zmienione pliki)

### 1. BACKEND API - Key Moments

**Lokalnie:** `adminpanel/backend/api/`
**Na serwerze:** `timeline/backend/api/` (OSOBNY folder, nie w adminpanel!)

**Pliki:**
- ✅ `key_moments_simple.php` (NOWY - najważniejszy!)
- ✅ `events.php` (zaktualizowany)
- ✅ `config/database.php` (zaktualizowany)
- ✅ `endpoints/get_events.php` (zaktualizowany)
- ✅ `endpoints/get_key_moments.php` (nowy)
- ✅ `index.php` (zaktualizowany)

### 2. ADMIN PANEL

**Lokalnie:** `adminpanel/` (BEZ folderu backend!)
**Na serwerze:** `timeline/adminpanel/`

**Pliki:**
- ✅ `edit_add.php` (zaktualizowany - dodano key moments)

### 3. FRONTEND

**Lokalnie:** `frontend/dist/`
**Na serwerze:** `timeline/frontend/`

**Wgraj CAŁĄ zawartość `frontend/dist/`**

---

## ⚠️ WAŻNE - Struktura na serwerze:

```
timeline/
├── adminpanel/          ← Admin panel (BEZ backend!)
│   ├── includes/
│   ├── assets/
│   └── *.php
├── backend/             ← OSOBNY folder (nie w adminpanel!)
│   └── api/
│       ├── key_moments_simple.php  ← SPRAWDŹ CZY JEST!
│       ├── events.php
│       └── ...
└── frontend/
    └── ...
```

---

## ✅ Szybki test po wgraniu:

1. Sprawdź: `https://mbo-portal.nl/museumproject/landbouwmuseum/timeline/backend/api/key_moments_simple.php?event_id=18`
2. Powinno zwrócić JSON z key moments
3. Jeśli działa - wszystko OK! 🎉

