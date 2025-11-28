# Deployment Guide: Key Moments Feature

## 📋 Checklist przed wdrożeniem

### 1. Baza danych - Uruchomienie SQL

**Metoda 1: phpMyAdmin (Zalecane)**
1. Zaloguj się do phpMyAdmin
2. Wybierz bazę danych `timeline`
3. Kliknij zakładkę "SQL"
4. Skopiuj i wklej zawartość pliku `adminpanel/backend/api/sql/create_key_moments_table.sql`
5. Kliknij "Wykonaj" (Execute)

**Metoda 2: MySQL CLI**
```bash
mysql -u timeline -p timeline < adminpanel/backend/api/sql/create_key_moments_table.sql
```

**Metoda 3: Ręcznie przez phpMyAdmin**
Jeśli "IF NOT EXISTS" nie działa, użyj tego SQL:

```sql
-- Sprawdź czy tabela istnieje, jeśli nie - utwórz
CREATE TABLE IF NOT EXISTS event_key_moments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  year INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  short_description VARCHAR(500),
  full_description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES timeline_events(id) ON DELETE CASCADE,
  INDEX idx_event_id (event_id),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sprawdź czy kolumna istnieje, jeśli nie - dodaj
-- (Uruchom to tylko jeśli kolumna nie istnieje)
ALTER TABLE timeline_events 
ADD COLUMN has_key_moments BOOLEAN DEFAULT FALSE;

-- Dodaj index (jeśli nie istnieje)
CREATE INDEX idx_has_key_moments ON timeline_events(has_key_moments);
```

### 2. Pliki do wrzucenia na serwer

#### Backend (PHP):
```
adminpanel/
├── edit_add.php (ZMIENIONY - dodano zarządzanie key moments)
└── backend/
    └── api/
        ├── index.php (ZMIENIONY - dodano routing dla key-moments)
        └── endpoints/
            ├── get_events.php (ZMIENIONY - zwraca has_key_moments)
            └── get_key_moments.php (NOWY PLIK)
```

#### Frontend:
```
frontend/dist/ (cały folder - zbudowany frontend)
```

### 3. Weryfikacja po wdrożeniu

1. **Sprawdź bazę danych:**
   ```sql
   -- Sprawdź czy tabela istnieje
   SHOW TABLES LIKE 'event_key_moments';
   
   -- Sprawdź czy kolumna istnieje
   DESCRIBE timeline_events;
   -- Powinna być kolumna: has_key_moments
   ```

2. **Sprawdź API:**
   - Otwórz: `https://twoja-domena.pl/backend/api/key-moments?event_id=1`
   - Powinno zwrócić JSON z key moments (lub pustą tablicę)

3. **Sprawdź panel admina:**
   - Zaloguj się do panelu admina
   - Edytuj dowolny event
   - Powinien być checkbox "Heeft Belangrijke momenten?"
   - Po zaznaczeniu i zapisaniu powinna pojawić się sekcja do zarządzania momentami

4. **Sprawdź frontend:**
   - Otwórz event z `has_key_moments = true`
   - W detailed modal powinna pojawić się sekcja "Belangrijke momenten"

## 🔧 Troubleshooting

### Problem: "Table already exists"
**Rozwiązanie:** Użyj `CREATE TABLE IF NOT EXISTS` (już jest w SQL)

### Problem: "Column already exists"
**Rozwiązanie:** Sprawdź czy kolumna istnieje:
```sql
SHOW COLUMNS FROM timeline_events LIKE 'has_key_moments';
```
Jeśli istnieje, pomiń `ALTER TABLE`.

### Problem: API zwraca 404 dla key-moments
**Rozwiązanie:** 
- Sprawdź czy plik `get_key_moments.php` jest w `backend/api/endpoints/`
- Sprawdź czy routing w `index.php` jest poprawny
- Sprawdź `.htaccess` w `backend/api/`

### Problem: Panel admina nie pokazuje sekcji key moments
**Rozwiązanie:**
- Sprawdź czy `edit_add.php` jest zaktualizowany
- Sprawdź czy w bazie danych kolumna `has_key_moments` istnieje
- Sprawdź logi PHP dla błędów

## 📝 Notatki

- Maksymalnie 5 momentów na event
- Key moments są wyświetlane tylko gdy `has_key_moments = true` i są dostępne momenty w bazie
- MiniTimeline automatycznie wyświetla momenty w kolejności `display_order` i `year`

