# Przegląd Projektu - Fries Landbouwmuseum Interactive Timeline

## 🎯 Cel Projektu

**Fries Landbouwmuseum Interactive Timeline** to aplikacja webowa stworzona z okazji 100-lecia muzeum (1925-2025). Aplikacja działa na touchscreen kiosku w muzeum w Leeuwarden (Holandia) i pozwala odwiedzającym interaktywnie eksplorować 100-letnią historię muzeum.

### Główne funkcjonalności:

- **Interaktywna Timeline** - pozioma, przewijalna oś czasu z 9 historycznymi okresami
- **Modal ze szczegółami** - bogata treść z galeriami zdjęć, wideo, mapami i kontekstem historycznym
- **Gra Puzzle** - 3x3 sliding puzzle z obrazkami związanymi z wydarzeniami
- **Dwa motywy** - Modern (niebieski/cyjan) i Museum (ziemiste kolory)
- **Optymalizacja dotykowa** - zaprojektowana dla ekranów dotykowych 1920x1080

---

## 📁 Struktura Projektu

```
Landbouw-Interactieve-Scherm/
│
├── frontend/                          # React + Vite aplikacja (Frontend)
│   ├── src/
│   │   ├── components/               # Komponenty React
│   │   │   ├── Timeline/            # Komponenty timeline
│   │   │   │   ├── Timeline.jsx     # Główny komponent timeline
│   │   │   │   ├── modals/
│   │   │   │   │   └── TimelineDetailModal.jsx  # Modal ze szczegółami eventu
│   │   │   │   ├── ui/              # Podstawowe komponenty UI
│   │   │   │   └── content/         # Komponenty treści
│   │   │   ├── PuzzleGame/          # Gra puzzle
│   │   │   │   └── ImagePuzzleModal.jsx  # Modal z grą puzzle
│   │   │   └── Common/              # Wspólne komponenty
│   │   ├── config/                  # Konfiguracja
│   │   │   ├── themes.js            # Definicje motywów kolorystycznych
│   │   │   └── timelineGalleries.js # Konfiguracja galerii
│   │   ├── services/
│   │   │   └── api.js               # Klient API (Axios)
│   │   ├── hooks/
│   │   │   └── useTimeline.js       # Hook do pobierania danych timeline
│   │   ├── utils/
│   │   │   └── imageSplitter.js     # Narzędzie do dzielenia obrazków na puzzle
│   │   └── pages/                   # Strony aplikacji
│   ├── public/                      # Statyczne pliki
│   └── dist/                        # Zbudowana aplikacja (produkcja)
│
├── backend/                          # PHP Backend + Admin Panel
│   ├── api/                         # REST API endpoints
│   │   ├── config/
│   │   │   └── database.php        # Konfiguracja połączenia z MySQL
│   │   ├── events.php              # Endpoint: GET wszystkie eventy
│   │   ├── event_media_direct.php  # Endpoint: GET media dla eventu
│   │   ├── event_sections_direct.php  # Endpoint: GET sekcje dla eventu
│   │   ├── puzzle_image_direct.php  # Endpoint: GET URL obrazka puzzle
│   │   └── key_moments_simple.php  # Endpoint: GET kluczowe momenty
│   │
│   └── adminpanel/                  # Panel administracyjny (PHP/HTML/JS)
│       ├── index.php               # Lista eventów
│       ├── edit_add.php            # Edycja/dodawanie eventu
│       ├── includes/
│       │   ├── db.php              # Połączenie z bazą danych
│       │   └── functions.php       # Funkcje pomocnicze
│       └── uploads/                # Folder na uploadowane pliki
│           └── [puzzle images]     # Obrazki puzzle (np. 1763627546_xdddd.jpg)
│
├── docs/                            # Dokumentacja projektu
│   ├── frontend/                    # Dokumentacja frontendu
│   └── [inne pliki dokumentacji]
│
└── README.md                        # Główny plik README
```

---

## 🔄 Architektura i Przepływ Danych

### 1. **Frontend (React)**

- **Technologie**: React 18, Vite, Tailwind CSS, Framer Motion
- **Główny komponent**: `Timeline.jsx` - wyświetla oś czasu z eventami
- **API Client**: `services/api.js` - komunikacja z backendem przez Axios
- **Dane**: Pobierane z `/backend/api/events.php` i przekształcane na format frontendu

### 2. **Backend (PHP)**

- **API Endpoints**: REST API w PHP zwracające JSON
- **Baza danych**: MySQL (`timeline` database)
- **Główne tabele**:
  - `timeline_events` - główna tabela z eventami
  - `event_media` - zdjęcia/wideo dla eventów
  - `event_sections` - sekcje treści dla eventów
  - `event_key_moments` - kluczowe momenty w historii

### 3. **Admin Panel**

- **Funkcjonalność**: Zarządzanie treścią (dodawanie/edycja eventów)
- **Upload plików**: Obrazki puzzle są uploadowane do `adminpanel/uploads/`
- **Zapis w bazie**: Nazwa pliku zapisywana w kolumnie `puzzle_image_url` w tabeli `timeline_events`

---

## 🧩 Problem z Puzzle - Szczegółowa Analiza

### Obecny Problem

**Symptomy:**

- Przycisk "Speel Puzzle" pojawia się poprawnie dla eventu 1930
- Po kliknięciu otwiera się modal z grą puzzle
- **Obrazek puzzle nie ładuje się** - widoczne są tylko szare kwadraty
- W konsoli przeglądarki pojawia się błąd: `Failed to load image: [URL]`
- Błąd 404 dla obrazka puzzle

### Przyczyna Problemu

Problem wynika z **niepoprawnego generowania URL do obrazka puzzle**.

#### Przepływ danych:

1. **Admin Panel** (`adminpanel/edit_add.php`):

   - Użytkownik uploaduje obrazek puzzle (np. `1763627546_xdddd.jpg`)
   - Plik zapisywany jest w: `adminpanel/uploads/1763627546_xdddd.jpg`
   - W bazie danych zapisywana jest tylko nazwa pliku: `puzzle_image_url = "1763627546_xdddd.jpg"`

2. **Backend API** (`backend/api/events.php`):

   - Zwraca dane eventu z kolumną `puzzle_image_url = "1763627546_xdddd.jpg"` (tylko nazwa pliku)

3. **Frontend** (`frontend/src/components/Timeline/Timeline.jsx`):

   - Pobiera dane z API (snake_case: `puzzle_image_url`)
   - Przekształca na camelCase: `puzzleImage = "1763627546_xdddd.jpg"`

4. **Modal** (`frontend/src/components/Timeline/modals/TimelineDetailModal.jsx`):

   - Próbuje zbudować pełny URL do obrazka
   - **Problem**: Frontend nie wie dokładnie, gdzie na serwerze znajduje się folder `adminpanel/uploads/`
   - Próbuje zgadywać ścieżkę na podstawie `window.location.pathname`
   - Generuje URL: `https://mbo-portal.nl/museumproject/landbouwmuseum/timeline/adminpanel/uploads/1763627546_xdddd.jpg`
   - **Ale**: Ta ścieżka może być niepoprawna w zależności od struktury katalogów na serwerze

5. **ImagePuzzleModal** (`frontend/src/components/PuzzleGame/ImagePuzzleModal.jsx`):
   - Próbuje załadować obrazek z wygenerowanego URL
   - Używa `splitImageIntoPieces()` do podzielenia obrazka na 9 części
   - **Błąd**: Obrazek nie ładuje się (404), więc puzzle nie może być utworzone

### Rozwiązanie (Zaimplementowane)

Stworzyłem **endpoint PHP**, który buduje poprawny URL po stronie serwera:

#### 1. Nowy Endpoint: `backend/api/puzzle_image_direct.php`

```php
// Endpoint: /backend/api/puzzle_image_direct.php?filename=1763627546_xdddd.jpg
// Zwraca: { "success": true, "url": "https://.../adminpanel/uploads/1763627546_xdddd.jpg" }
```

**Zalety:**

- PHP wie dokładnie, gdzie znajduje się plik (używa `$_SERVER['SCRIPT_NAME']`)
- Automatycznie wykrywa strukturę katalogów na serwerze
- Zwraca pełny, poprawny URL

#### 2. Zmiana w Frontend (`TimelineDetailModal.jsx`):

- Dodano `useEffect`, który wywołuje endpoint `puzzle_image_direct.php`
- Endpoint zwraca poprawny URL
- URL jest zapisywany w state `puzzleImageUrl`
- Przekazywany do `ImagePuzzleModal`

#### 3. Fallback:

- Jeśli endpoint nie zadziała, frontend używa ręcznie skonstruowanego URL
- Logi w konsoli pomagają zdiagnozować problem

### Dlaczego to rozwiązanie jest lepsze?

1. **Niezawodność**: Serwer zawsze wie, gdzie są pliki
2. **Elastyczność**: Działa niezależnie od struktury katalogów
3. **Debugowanie**: Endpoint zwraca informacje o ścieżce, co pomaga w diagnozie
4. **Spójność**: Używa tej samej logiki co `event_media_direct.php` (dla mediów)

---

## 🔍 Szczegóły Techniczne - Puzzle

### Komponenty zaangażowane:

1. **`TimelineDetailModal.jsx`**:

   - Sprawdza, czy event ma puzzle (`has_puzzle` i `puzzle_image_url`)
   - Wyświetla przycisk "Speel Puzzle"
   - Pobiera URL obrazka z endpointu
   - Otwiera `ImagePuzzleModal` z URL

2. **`ImagePuzzleModal.jsx`**:

   - Otrzymuje `puzzleImage` (URL do obrazka)
   - Używa `splitImageIntoPieces()` do podziału obrazka na 9 części
   - Wyświetla puzzle 3x3
   - Obsługuje drag & drop i kliknięcie do przesuwania kawałków

3. **`imageSplitter.js`** (utils):
   - Funkcja `splitImageIntoPieces()`:
     - Ładuje obrazek do `<img>` elementu
     - Rysuje każdy kawałek na `<canvas>`
     - Konwertuje na Data URL
     - Zwraca tablicę 8 Data URLs (9. miejsce to puste)

### Baza danych:

```sql
-- Tabela: timeline_events
has_puzzle BOOLEAN DEFAULT FALSE,        -- Czy event ma puzzle?
puzzle_image_url VARCHAR(500),          -- Nazwa pliku (np. "1763627546_xdddd.jpg")
```

### Struktura plików na serwerze:

```
/museumproject/landbouwmuseum/timeline/
├── frontend/                    # Zbudowana aplikacja React
│   └── index.html
├── backend/
│   └── api/
│       └── puzzle_image_direct.php
└── adminpanel/
    └── uploads/
        └── 1763627546_xdddd.jpg  # Obrazek puzzle
```

---

## 🛠️ Jak Naprawić Problem (Kroki)

### 1. Wgraj nowy build frontendu:

```bash
cd frontend
npm run build
# Wgraj zawartość folderu dist/ na serwer
```

### 2. Wgraj nowy endpoint PHP:

- Wgraj `backend/api/puzzle_image_direct.php` na serwer
- Upewnij się, że plik ma uprawnienia do odczytu

### 3. Sprawdź, czy obrazek istnieje:

- Sprawdź, czy plik `adminpanel/uploads/1763627546_xdddd.jpg` istnieje na serwerze
- Sprawdź uprawnienia do pliku (powinien być dostępny przez HTTP)

### 4. Test:

- Otwórz aplikację w przeglądarce
- Otwórz modal dla eventu 1930
- Kliknij "Speel Puzzle"
- Sprawdź konsolę przeglądarki (F12):
  - Powinien być log: `🧩 Fetching puzzle image URL from: ...`
  - Powinien być log: `✅ Puzzle image URL received: ...`
  - Jeśli błąd: `❌ Failed to fetch puzzle image URL: ...`

### 5. Jeśli nadal nie działa:

- Sprawdź w konsoli, jaki URL jest generowany
- Sprawdź w Network tab (F12), czy request do `puzzle_image_direct.php` zwraca 200 OK
- Sprawdź, czy odpowiedź zawiera poprawny URL

---

## 📊 Podsumowanie

### Co działa:

✅ Frontend poprawnie pobiera dane z API  
✅ Przycisk "Speel Puzzle" pojawia się dla eventów z `has_puzzle = true`  
✅ Modal puzzle otwiera się poprawnie  
✅ Logika gry puzzle działa (gdy obrazek się załaduje)

### Co nie działa:

❌ Obrazek puzzle nie ładuje się (błąd 404)  
❌ Puzzle nie może być utworzone bez obrazka

### Rozwiązanie:

✅ Endpoint `puzzle_image_direct.php` buduje poprawny URL po stronie serwera  
✅ Frontend używa tego endpointu do pobrania URL  
✅ Fallback na ręcznie skonstruowany URL, jeśli endpoint nie zadziała

---

## 🔗 Powiązane Pliki

- `frontend/src/components/Timeline/modals/TimelineDetailModal.jsx` - Modal ze szczegółami
- `frontend/src/components/PuzzleGame/ImagePuzzleModal.jsx` - Modal z grą puzzle
- `frontend/src/utils/imageSplitter.js` - Narzędzie do dzielenia obrazków
- `backend/api/puzzle_image_direct.php` - Endpoint do generowania URL obrazka
- `backend/api/events.php` - Endpoint zwracający dane eventów
- `adminpanel/edit_add.php` - Panel do uploadowania obrazków puzzle

---

_Ostatnia aktualizacja: 2025-11-20_
