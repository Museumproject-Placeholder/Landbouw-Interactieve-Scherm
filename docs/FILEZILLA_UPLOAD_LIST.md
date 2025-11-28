# FileZilla Upload List - Key Moments Feature

## 📁 Pliki do wrzucenia na serwer

### 1. Backend (PHP) - Admin Panel

**Zmienione pliki:**
```
adminpanel/
├── edit_add.php (ZMIENIONY - dodano zarządzanie key moments)
└── backend/
    └── api/
        ├── index.php (ZMIENIONY - dodano routing dla key-moments)
        └── endpoints/
            ├── get_events.php (ZMIENIONY - zwraca has_key_moments)
            └── get_key_moments.php (NOWY PLIK - wrzuć!)
```

**Ścieżki na serwerze:**
- `adminpanel/edit_add.php` → `timeline/adminpanel/edit_add.php`
- `adminpanel/backend/api/index.php` → `timeline/backend/api/index.php`
- `adminpanel/backend/api/endpoints/get_events.php` → `timeline/backend/api/endpoints/get_events.php`
- `adminpanel/backend/api/endpoints/get_key_moments.php` → `timeline/backend/api/endpoints/get_key_moments.php` (NOWY)

### 2. Frontend (Zbudowany)

**Cały folder dist:**
```
frontend/dist/ (cały folder)
```

**Ścieżka na serwerze:**
- `frontend/dist/*` → `timeline/frontend/` (wszystkie pliki z dist)

**Uwaga:** Zastąp wszystkie pliki w `timeline/frontend/` plikami z `frontend/dist/`

### 3. SQL (NIE wrzucać - tylko uruchomić w bazie)

**Pliki SQL są tylko do uruchomienia w phpMyAdmin, NIE wrzucać na serwer:**
- `adminpanel/backend/api/sql/create_key_moments_table.sql` - uruchom w phpMyAdmin
- `adminpanel/backend/api/sql/create_key_moments_table_safe.sql` - alternatywna wersja
- `adminpanel/backend/api/sql/create_key_moments_table_minimal.sql` - wersja bez indeksów

## 📋 Checklist przed wrzuceniem

- [ ] Uruchom SQL w bazie danych (create_key_moments_table.sql)
- [ ] Sprawdź czy tabela `event_key_moments` istnieje
- [ ] Sprawdź czy kolumna `has_key_moments` istnieje w `timeline_events`

## 📋 Checklist po wrzuceniu

- [ ] Sprawdź czy API działa: `https://twoja-domena.pl/backend/api/key-moments?event_id=1`
- [ ] Sprawdź panel admina - czy checkbox "Heeft Belangrijke momenten?" jest widoczny
- [ ] Sprawdź frontend - czy key moments wyświetlają się w detailed modal

## 🔍 Weryfikacja

### Sprawdź API:
```
GET https://twoja-domena.pl/backend/api/key-moments?event_id=[ID]
```

Powinno zwrócić:
```json
{
  "success": true,
  "data": [...],
  "count": X
}
```

### Sprawdź w konsoli przeglądarki:
1. Otwórz aplikację
2. Otwórz event z `has_key_moments = true`
3. W konsoli (F12) powinno być: `Fetching key moments for event: [ID]`

## ⚠️ Ważne

- **Nie wrzucaj** plików SQL na serwer - są tylko do uruchomienia w bazie
- **Zastąp** wszystkie pliki w `frontend/` nowymi z `dist/`
- **Zachowaj** strukturę folderów na serwerze

