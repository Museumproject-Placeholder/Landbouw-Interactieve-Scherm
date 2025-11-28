# 🎨 Szybki Test Theme'ów

## Jak przetestować kolory muzeum:

### Metoda 1: URL Parameter (NAJŁATWIEJ!)

1. Uruchom projekt: `npm run dev`
2. Otwórz: `http://localhost:5173/?theme=museum`
3. Zobacz brzydkie kolory muzeum 😬

### Metoda 2: Przycisk Theme Switcher

1. Uruchom projekt: `npm run dev`
2. Otwórz: `http://localhost:5173/`
3. Kliknij przycisk "🎨" w lewym dolnym rogu
4. Strona się przeładuje z theme=museum

### Metoda 3: Zmiana w kodzie

W [`src/config/themes.js`](src/config/themes.js) linia 14:
```javascript
export const ACTIVE_THEME = 'museum' // zmień na 'museum'
```

## Kolory które powinieneś zobaczyć w Museum Theme:

### Tło główne:
- Sage green (#a7b8b4)
- Olive green (#929d7c)
- Light blue-gray (#b5cbd1)

### Karty Timeline:
- **BIAŁE** (bg-white) - jak na stronie muzeum!
- Bez przezroczystości
- Bez żółtego glow efektu
- Subtelny cień (drop-shadow)
- Tekst: Ciemny (#440f0f - maroon)

### Tekst:
- Nagłówki: Złoty gradient (#c9a300 → #b48a0f → #ae5514)
- Tekst na kartach: Ciemny maroon/gray (czytelny na białym!)

### Timeline linia:
- Gradient: Złoty → Brązowy → Miedzany

### Virtual Guide:
- Avatar: Złoty gradient
- Bąbelek: **BIAŁY** (jak na stronie)
- Border: Złoty
- Tekst: Ciemny (maroon)

## Porównanie:

### Modern (Twój):
✨ Cyan/Blue/Purple gradienty
✨ Przezroczyste karty z blur
✨ Wysoki kontrast
✨ Profesjonalny, nowoczesny design
✨ Glow efekty

### Museum (Jak ich strona):
🏛️ Białe karty (jak frieslandbouwmuseum.nl)
🎨 Złote akcenty (#c9a300)
📄 Czytelny tekst na białym tle
🎨 Subtelne cienie, bez glow
🏛️ Klasyczny, minimalistyczny styl
✅ Wygląda jak ich oficjalna strona!

## Troubleshooting:

### Kolory się nie zmieniają?
1. Hard refresh: `Ctrl + Shift + R`
2. Sprawdź URL - czy ma `?theme=museum`
3. Sprawdź console (F12) - czy są błędy?
4. Przebuduj projekt: `npm run build`

### Nadal nie działa?
1. Sprawdź [`src/config/themes.js`](src/config/themes.js) - upewnij się że MUSEUM_THEME używa `brand-*` klas
2. Sprawdź [`tailwind.config.js`](../tailwind.config.js) - czy są zdefiniowane kolory `brand.*`
3. Sprawdź czy safelist jest w Tailwind config (linia 4-10)

## Na prezentację (za 2 tygodnie):

Przygotuj **DWA okna** przeglądarki obok siebie:

```
┌─────────────────┬─────────────────┐
│   Modern ✨     │   Museum 🏛️    │
│ localhost:5173  │ ?theme=museum   │
│                 │                 │
│ (piękny!)       │ (brzydki...)    │
└─────────────────┴─────────────────┘
```

Podczas prezentacji:
1. Pokaż Modern - "To jest nowoczesny design..."
2. Przełącz na Museum - "A to z waszymi kolorami..."
3. Obserwuj reakcję 😏
4. Czekaj aż wybiorą Twój design 😎

## Kolory Tailwind (brand.*):

Dostępne w całym projekcie:

```javascript
bg-brand-mist       // #a7b8b4 - Sage green
bg-brand-sky        // #b5cbd1 - Light blue
bg-brand-olive      // #929d7c - Olive
bg-brand-gold       // #c9a300 - Gold
bg-brand-amber      // #b48a0f - Bronze
bg-brand-maroon     // #440f0f - Dark brown
bg-brand-rust       // #89350a - Rust
bg-brand-slate      // #657575 - Gray
bg-brand-linen      // #f3f2e9 - Cream
bg-brand-terracotta // #ae5514 - Copper
```

Użycie z opacity:
```html
<div className="bg-brand-gold/20">20% opacity</div>
<div className="text-brand-linen/80">80% opacity</div>
<div className="border-brand-mist/30">30% opacity</div>
```

Gradienty:
```html
<div className="bg-gradient-to-r from-brand-gold via-brand-amber to-brand-terracotta">
  Złoty gradient
</div>
```

---

**Powodzenia z pokazaniem im że ich kolory są... "interesujące"!** 😄
