# 🎨 Museum Theme - Mapa Kolorów

## Paleta Muzeum (Wszystkie kolory)

```
#a7b8b4 - Sage green (brand-mist)
#b5cbd1 - Light blue-gray (brand-sky)
#929d7c - Olive green (brand-olive)
#c9a300 - Gold (brand-gold) ⭐ GŁÓWNY AKCENT
#b48a0f - Bronze (brand-amber)
#440f0f - Dark brown/maroon (brand-maroon)
#89350a - Rust orange (brand-rust)
#657575 - Gray (brand-slate)
#f3f2e9 - Cream/off-white (brand-linen)
#ae5514 - Copper/burnt orange (brand-terracotta)
```

## Gdzie używamy kolorów w Museum Theme:

### Tło główne:
- `from-brand-mist/80` (#a7b8b4) - Sage green
- `via-brand-olive/70` (#929d7c) - Olive
- `to-brand-sky/60` (#b5cbd1) - Light blue

### Karty Timeline:
- **Tło**: `bg-white` (białe, jak na stronie muzeum)
- **Border**: `border-brand-slate/20` (#657575 z opacity)
- **Hover**: `hover:border-brand-gold` (#c9a300)

### Teksty:
- **Główny tekst**: `text-brand-maroon` (#440f0f)
- **Drugorzędny**: `text-brand-slate` (#657575)
- **Akcent**: `text-brand-gold` (#c9a300)

### Timeline Linia:
- `from-brand-gold` (#c9a300)
- `via-brand-amber` (#b48a0f)
- `to-brand-terracotta` (#ae5514)

### Virtual Guide:
- **Avatar gradient**: Gold → Amber → Terracotta
- **Bąbelek tło**: `bg-white`
- **Border**: `border-brand-gold` (#c9a300)
- **Tekst**: `text-brand-maroon` (#440f0f)

---

## Gradienty dla każdej karty timeline:

### 1925 - Oprichting van het museum
- Modern: `from-amber-600 to-orange-500`
- **Museum**: `from-brand-rust to-brand-terracotta`
  - (#89350a → #ae5514) 🟠 Rust/copper tones

### 1930-1956 - Eysingahuis
- Modern: `from-blue-600 to-cyan-500`
- **Museum**: `from-brand-sky to-brand-mist`
  - (#b5cbd1 → #a7b8b4) 🔵 Blue/sage tones

### 1945-1987 - Na de oorlog
- Modern: `from-slate-600 to-gray-500`
- **Museum**: `from-brand-slate to-brand-maroon`
  - (#657575 → #440f0f) ⚫ Gray/dark brown

### 1987 - Nieuwe start
- Modern: `from-green-600 to-emerald-500`
- **Museum**: `from-brand-olive to-brand-mist`
  - (#929d7c → #a7b8b4) 🟢 Olive/sage tones

### 2006 - Verhuizing Earnewâld
- Modern: `from-indigo-600 to-purple-500`
- **Museum**: `from-brand-amber to-brand-terracotta`
  - (#b48a0f → #ae5514) 🟤 Bronze/copper tones

### 2018 - Nieuwe locatie
- Modern: `from-rose-600 to-pink-500`
- **Museum**: `from-brand-rust to-brand-gold`
  - (#89350a → #c9a300) 🟠 Rust to gold

### 2020 - Collectie uitbreiding
- Modern: `from-teal-600 to-cyan-500`
- **Museum**: `from-brand-mist to-brand-sky`
  - (#a7b8b4 → #b5cbd1) 💚 Sage to blue

### 2023-2025 - Vernieuwing
- Modern: `from-yellow-500 to-amber-600`
- **Museum**: `from-brand-gold to-brand-amber`
  - (#c9a300 → #b48a0f) 🟡 Gold to bronze (PERFECT!)

### 2026 - Toekomst
- Modern: `from-violet-600 to-fuchsia-500`
- **Museum**: `from-brand-amber to-brand-rust`
  - (#b48a0f → #89350a) 🟤 Amber to rust

---

## Dlaczego te kombinacje?

Każdy gradient używa **TYLKO** kolorów z palety muzeum:
- ✅ Wszystkie kolory są z ich oficjalnej palety
- ✅ Gradienty są subtelne i klasyczne (jak na ich stronie)
- ✅ Dobry kontrast z białym tłem kart
- ✅ Czytelne na wszystkich urządzeniach

---

## Porównanie: Modern vs Museum

| Element | Modern | Museum |
|---------|--------|--------|
| Karty | Przezroczyste, blur | **Białe, solidne** |
| Rok (1925) | Amber→Orange | **Rust→Terracotta** |
| Tytuł | Gradient Modern | **Gradient Museum** |
| Tekst | Biały/Gray-200 | **Maroon/Slate** |
| Linia | Cyan→Blue→Purple | **Gold→Amber→Terracotta** |
| Glow | Mocny blur | **Subtelny cień** |

---

## Test:

```bash
npm run dev
```

Otwórz:
- Modern: `http://localhost:5173/`
- Museum: `http://localhost:5173/?theme=museum`

Teraz **WSZYSTKIE** kolory w Museum theme są z ich oficjalnej palety! 🎨✅
