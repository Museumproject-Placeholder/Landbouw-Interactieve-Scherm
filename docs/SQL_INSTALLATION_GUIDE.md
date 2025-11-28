# SQL Installation Guide - Key Moments Feature

## 📋 Który plik SQL uruchomić?

### ✅ Zalecany: `INSTALL_KEY_MOMENTS.sql` (NOWY - najprostszy)

**Plik:** `adminpanel/backend/api/sql/INSTALL_KEY_MOMENTS.sql`

**Dlaczego:**
- Automatycznie sprawdza co już istnieje
- Tworzy tylko to, czego brakuje
- Nie wywoła błędów jeśli coś już istnieje
- Pokazuje status po instalacji

**Jak uruchomić:**
1. Otwórz phpMyAdmin
2. Wybierz bazę danych `timeline`
3. Kliknij zakładkę "SQL"
4. Skopiuj całą zawartość pliku `INSTALL_KEY_MOMENTS.sql`
5. Wklej i kliknij "Wykonaj"

---

### Alternatywy (jeśli INSTALL_KEY_MOMENTS.sql nie działa):

#### Opcja 1: `create_key_moments_table.sql`
- Zawiera sprawdzanie czy kolumna istnieje
- Zawiera indeksy (może wymagać uprawnień)

#### Opcja 2: `create_key_moments_table_minimal.sql`
- Bez indeksów (dla użytkowników bez INDEX privilege)
- Prostsza wersja

#### Opcja 3: `create_key_moments_table_safe.sql`
- Najbardziej bezpieczna wersja
- Sprawdza wszystko przed utworzeniem

---

## 🔍 Co SQL robi?

1. **Tworzy tabelę `event_key_moments`** (jeśli nie istnieje)
   - Przechowuje key moments dla każdego eventu
   - Max 5 momentów na event (sprawdzane w PHP)

2. **Dodaje kolumnę `has_key_moments`** do `timeline_events` (jeśli nie istnieje)
   - Wskazuje czy event ma key moments
   - Typ: BOOLEAN (domyślnie FALSE)

3. **Tworzy indeksy** (opcjonalne, jeśli masz uprawnienia)
   - Poprawia wydajność zapytań

---

## ✅ Weryfikacja po uruchomieniu SQL

Uruchom w phpMyAdmin:

```sql
-- Sprawdź czy tabela istnieje
SHOW TABLES LIKE 'event_key_moments';

-- Sprawdź strukturę tabeli
DESCRIBE event_key_moments;

-- Sprawdź czy kolumna istnieje
SHOW COLUMNS FROM timeline_events LIKE 'has_key_moments';
```

**Oczekiwany wynik:**
- Tabela `event_key_moments` powinna istnieć
- Kolumna `has_key_moments` powinna być w `timeline_events`

---

## 🐛 Rozwiązywanie problemów

### Błąd: "Table already exists"
**Rozwiązanie:** To OK - tabela już istnieje, możesz kontynuować

### Błąd: "Column already exists"  
**Rozwiązanie:** To OK - kolumna już istnieje, możesz kontynuować

### Błąd: "INDEX command denied"
**Rozwiązanie:** Użyj `create_key_moments_table_minimal.sql` (bez indeksów)

### Błąd: "Foreign key constraint fails"
**Rozwiązanie:** Sprawdź czy tabela `timeline_events` istnieje i ma kolumnę `id`

---

## 📝 Po uruchomieniu SQL

1. ✅ Sprawdź czy wszystko się utworzyło (użyj weryfikacji powyżej)
2. ✅ Wrzuć pliki PHP na serwer (FileZilla)
3. ✅ Wrzuć zbudowany frontend na serwer
4. ✅ Przetestuj w panelu admina

