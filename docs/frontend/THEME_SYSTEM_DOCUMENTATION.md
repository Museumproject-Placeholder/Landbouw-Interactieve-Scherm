# 🎨 Theme System Documentation

## Przegląd

System z **dwoma themami** dla aplikacji Timeline:

1. **Modern** (Twój piękny design ✨) - Cyan/Blue/Purple gradienty
2. **Museum** (Ich oficjalne kolory 🎨) - Paleta kolorów muzeum

---

## 🚀 Jak przełączać theme'y

### Metoda 1: URL Parameter (NA PREZENTACJI! ⭐)

**To jest najlepsze na spotkanie z klientem!**

- **Modern theme**: `http://localhost:5173/`
- **Museum theme**: `http://localhost:5173/?theme=museum`

Po prostu dodaj `?theme=museum` do URL żeby pokazać ich kolory!

### Metoda 2: Przycisk w aplikacji

W lewym dolnym rogu jest przycisk **Theme Switcher**:
- Najedź myszką żeby zobaczyć który theme jest aktywny
- Kliknij żeby przełączyć między Modern ↔ Museum
- Automatycznie dodaje `?theme=X` do URL i przeładowuje stronę

### Metoda 3: Zmiana w kodzie (dla developmentu)

W pliku [`frontend/src/config/themes.js`](frontend/src/config/themes.js) linia 13:

```javascript
export const ACTIVE_THEME = 'modern' // Zmień na 'museum'
```

Zmień `'modern'` na `'museum'` i przebuduj projekt.

---

## 📂 Struktura plików

```
frontend/
├── src/
│   ├── config/
│   │   └── themes.js                    # ⭐ GŁÓWNA KONFIGURACJA THEME'ÓW
│   ├── components/
│   │   ├── Common/
│   │   │   └── ThemeSwitcher.jsx        # Przycisk przełączania theme'u
│   │   └── Timeline/
│   │       ├── Timeline.jsx             # Używa theme
│   │       ├── MuseumHeadline.jsx       # Używa theme
│   │       └── VirtualGuide.jsx         # Używa theme
│   └── components/PuzzleGame/
│       └── ImagePuzzleModal.jsx         # Używa theme
└── tailwind.config.js                   # Kolory muzeum dodane jako 'brand.*'
```

---

## 🎨 Palety kolorów

### Modern Theme (TWÓJ ✨)

```javascript
{
  background: {
    primary: 'from-blue-900/80 via-blue-700/70 to-cyan-600/60',
    overlay: 'from-black/40 via-transparent to-blue-900/30',
    card: 'bg-white/20',
    modal: 'bg-gradient-to-br from-blue-900/95 via-blue-700/90 to-cyan-600/85'
  },
  text: {
    primary: 'text-white',
    secondary: 'text-white/80',
    accent: 'text-cyan-300',
    gradient: 'from-cyan-300 via-blue-200 to-purple-300'
  },
  button: {
    primary: 'from-cyan-500 to-blue-500',
    secondary: 'bg-gray-500/90'
  },
  timeline: {
    line: 'from-cyan-400 via-blue-400 to-purple-400'
  },
  guide: {
    avatarGradient: 'from-cyan-400 via-blue-500 to-purple-500',
    bubbleBorder: 'border-cyan-300'
  }
}
```

### Museum Theme (ICH 🏛️)

Kolory muzeum:
- `#a7b8b4` - Sage green (szałwiowy zielony)
- `#b5cbd1` - Light blue-gray (jasny niebieskoszary)
- `#929d7c` - Olive green (oliwkowy)
- `#c9a300` - Gold (złoty)
- `#b48a0f` - Bronze (brązowy)
- `#440f0f` - Dark brown (ciemny brąz)
- `#89350a` - Rust (rdza)
- `#657575` - Gray (szary)
- `#f3f2e9` - Cream (kremowy)
- `#ae5514` - Copper (miedziany)

```javascript
{
  background: {
    primary: 'bg-gradient-to-br from-[#a7b8b4]/80 via-[#929d7c]/70 to-[#b5cbd1]/60',
    overlay: 'from-[#440f0f]/40 via-transparent to-[#929d7c]/30',
    card: 'bg-[#f3f2e9]/20',
    modal: 'bg-gradient-to-br from-[#a7b8b4]/95 via-[#929d7c]/90 to-[#b5cbd1]/85'
  },
  text: {
    primary: 'text-[#f3f2e9]',
    secondary: 'text-[#f3f2e9]/80',
    accent: 'text-[#c9a300]',
    gradient: 'from-[#c9a300] via-[#b48a0f] to-[#ae5514]'
  },
  button: {
    primary: 'from-[#c9a300] to-[#b48a0f]',
    secondary: 'bg-[#657575]/90'
  },
  timeline: {
    line: 'from-[#c9a300] via-[#b48a0f] to-[#ae5514]'
  },
  guide: {
    avatarGradient: 'from-[#c9a300] via-[#b48a0f] to-[#ae5514]',
    bubbleBorder: 'border-[#c9a300]'
  }
}
```

---

## 💻 Jak używać w kodzie

### Import theme w komponencie:

```javascript
import { getTheme } from '../../config/themes'

const MyComponent = () => {
  const theme = getTheme()

  return (
    <div className={`bg-gradient-to-br ${theme.background.primary}`}>
      <h1 className={`${theme.text.gradient} bg-clip-text text-transparent`}>
        Tytuł z gradientem
      </h1>
      <p className={theme.text.secondary}>Tekst drugorzędny</p>
    </div>
  )
}
```

### Dostępne właściwości theme:

```javascript
const theme = getTheme()

// Tła
theme.background.primary      // Główne tło
theme.background.overlay      // Nakładka
theme.background.card         // Karty
theme.background.modal        // Modale

// Teksty
theme.text.primary           // Główny tekst
theme.text.secondary         // Drugorzędny tekst
theme.text.accent            // Akcent
theme.text.gradient          // Gradient dla tytułów

// Przyciski
theme.button.primary         // Główny przycisk
theme.button.secondary       // Drugorzędny przycisk

// Timeline
theme.timeline.cardBg        // Tło karty timeline
theme.timeline.cardBorder    // Border karty
theme.timeline.line          // Linia timeline

// Virtual Guide
theme.guide.avatarGradient   // Gradient awatara
theme.guide.bubbleBg         // Tło bąbelka
theme.guide.bubbleBorder     // Border bąbelka
theme.guide.bubbleText       // Tekst w bąbelku

// Inne
theme.border                 // Standardowy border
theme.accent                 // Kolor akcentu
```

---

## 🎯 Scenariusz na prezentację (za 2 tygodnie!)

### PRZED spotkaniem:

1. **Upewnij się że domyślny theme to 'modern'**
   - Sprawdź `frontend/src/config/themes.js` → `ACTIVE_THEME = 'modern'`
   - Zbuduj projekt: `npm run build`

2. **Przygotuj dwa okna przeglądarki:**
   - Okno 1: `http://localhost:5173/` (modern - TWÓJ)
   - Okno 2: `http://localhost:5173/?theme=museum` (ich kolory)

### PODCZAS spotkania:

**Krok 1:** Pokaż SWÓJ design (Modern)
```
"Tak wygląda aplikacja z nowoczesnym designem,
który jest bardzo popularny w interaktywnych wystawach muzealnych..."
```

**Krok 2:** Przełącz na ich theme
```
"Oczywiście przygotowałem też wersję z waszą oficjalną
paletą kolorów muzeum... *kliknij w Theme Switcher*"
```

**Krok 3:** Obserwuj reakcję 😏
```
(Gdy zobaczą jak brzydkie są ich kolory)

"Jak widzicie, oba style są w pełni funkcjonalne.
Mogę łatwo dostosować każdy element do waszych preferencji.
Co myślicie o tych dwóch opcjach?"
```

**Krok 4:** Czekaj aż wybiorą Twój design 😎

---

## 🛠️ Dodawanie nowych komponentów z theme

Jeśli tworzysz nowy komponent który powinien reagować na theme:

```javascript
import { getTheme } from '../../config/themes'

const NewComponent = () => {
  const theme = getTheme()

  return (
    <div className={`${theme.background.card} ${theme.border}`}>
      <h2 className={`${theme.text.gradient} bg-clip-text text-transparent`}>
        Tytuł
      </h2>
      <p className={theme.text.secondary}>Opis</p>
    </div>
  )
}

export default NewComponent
```

---

## 🐛 Troubleshooting

### Theme się nie zmienia

1. **Sprawdź URL** - Czy masz `?theme=museum` w URL?
2. **Przeładuj stronę** - Ctrl+Shift+R (hard refresh)
3. **Sprawdź console** - F12 → Console, szukaj błędów

### Kolory nie pasują

1. **Edytuj** [`frontend/src/config/themes.js`](frontend/src/config/themes.js)
2. **Zmień wartości** w MODERN_THEME lub MUSEUM_THEME
3. **Zbuduj ponownie**: `npm run build`

### Przycisk Theme Switcher nie działa

- Sprawdź czy jest dodany w Timeline.jsx
- Sprawdź czy import jest poprawny: `import ThemeSwitcher from '../Common/ThemeSwitcher'`

---

## 📝 Notatki

### Dlaczego dwa theme'y?

- Klient ma swoją paletę kolorów (która jest... "unikalna")
- Chcesz pokazać że Twój design jest lepszy
- System theme'ów daje elastyczność i profesjonalne wrażenie

### Co zrobić jeśli wybiorą Museum theme?

No cóż... przynajmniej łatwo jest to zmienić 😅

Możesz też:
1. Zaproponować "zbalansowaną" wersję (mix obu palet)
2. Pokazać że inne muzea używają nowoczesnych kolorów
3. Argumentować że Modern theme jest bardziej dostępny (accessibility)

---

## 🎨 Dodatkowe customizacje

### Tailwind kolory muzeum

Kolory muzeum są też dostępne w Tailwind jako `brand.*`:

```javascript
// W tailwind.config.js
colors: {
  brand: {
    mist: '#a7b8b4',
    sky: '#b5cbd1',
    olive: '#929d7c',
    gold: '#c9a300',
    amber: '#b48a0f',
    maroon: '#440f0f',
    rust: '#89350a',
    slate: '#657575',
    linen: '#f3f2e9',
    terracotta: '#ae5514'
  }
}
```

Użycie:
```html
<div className="bg-brand-gold text-brand-linen">
  Tekst złoty na kremowym tle
</div>
```

---

## ✅ Checklist przed prezentacją

- [ ] Theme Switcher działa
- [ ] Oba theme'y wyglądają dobrze (no, Modern na pewno 😉)
- [ ] URL parameter `?theme=museum` działa
- [ ] Wszystkie komponenty reagują na theme:
  - [ ] Timeline
  - [ ] MuseumHeadline
  - [ ] VirtualGuide
  - [ ] ImagePuzzleModal
- [ ] Projekt zbudowany (`npm run build`)
- [ ] Przygotowane dwa okna przeglądarki z różnymi theme'ami

---

## 🎉 Powodzenia na prezentacji!

Pamiętaj: Ich kolory są... "charakterystyczne". Twój design jest obiektywnie lepszy. System theme'ów pokazuje że jesteś profesjonalistą który myśli o kliencie, ale też ma wizję designerską.

**Niech wygrają lepsze kolory!** ✨
