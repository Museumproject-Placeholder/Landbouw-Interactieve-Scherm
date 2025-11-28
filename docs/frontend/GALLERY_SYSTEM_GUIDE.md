# Timeline Gallery System - Handleiding

## Overzicht

Dit systeem beheert alle foto's, video's en 3D modellen voor de Timeline gebeurtenissen. Elke gebeurtenis heeft zijn eigen folder en configuratie.

## Folder Structuur

```
frontend/src/assets/images/timeline/
├── museum-foundation/          # 1925 - Oprichting van het museum
├── eysingahuis-expansion/      # 1930-1956 - Eysingahuis en Stania State
├── postwar-growth/             # 1945-1987 - Na de oorlog
├── exmorra-restart/            # 1987 - Nieuwe start in Exmorra
├── earnewald-professionalization/ # 2006 - Verhuizing naar Earnewâld
├── leeuwarden-location/        # 2018 - Nieuwe locatie Leeuwarden
├── collection-expansion/       # 2020 - Uitbreiding van de collectie
├── renewal-jubilee/            # 2023-2025 - Vernieuwing en jubileum
└── future-exhibitions/         # 2026 - Toekomstgerichte exposities
```

## Hoe Voeg Je Foto's Toe?

### Stap 1: Voeg Foto's Toe aan de Juiste Folder

1. Navigeer naar `frontend/src/assets/images/timeline/`
2. Kies de folder die overeenkomt met de gebeurtenis
3. Kopieer je foto's naar deze folder
4. Gebruik duidelijke bestandsnamen (bijv: `opening-museum.jpg`, `nanne-ottema-portrait.jpg`)

**Aanbevolen formaten:**
- JPEG voor foto's (goede compressie)
- PNG voor afbeeldingen met transparantie
- WebP voor optimale performance

**Aanbevolen afmetingen:**
- Hoofdfoto: 1920x1080px (16:9 ratio)
- Gallery foto's: 1200x800px
- Thumbnails worden automatisch geschaald

### Stap 2: Update de Configuratie

Open `frontend/src/config/timelineGalleries.js` en zoek de gebeurtenis die je wilt updaten.

#### Import de foto's bovenaan het bestand:

```javascript
// Voeg imports toe aan de top van het bestand
import museum1925_opening from '../assets/images/timeline/museum-foundation/opening-museum.jpg'
import museum1925_ottema from '../assets/images/timeline/museum-foundation/nanne-ottema.jpg'
// ... meer imports
```

#### Update de gallery configuratie:

```javascript
'museum-foundation': {
  mainImage: museum1925_opening,  // Hoofdfoto die als eerste verschijnt
  gallery: [
    {
      id: 1,
      src: museum1925_opening,      // Geïmporteerde foto
      caption: 'Opening museum, December 1925',
      description: 'Het museum opent zijn deuren in de kelders van het Eysingahuis'
    },
    {
      id: 2,
      src: museum1925_ottema,
      caption: 'Nanne Ottema met eerste collectie',
      description: 'Conservator Nanne Ottema tussen de eerste verzameling zuivelwerktuigen'
    },
    // Voeg meer foto's toe...
  ],
  video: null,    // Video URL (optioneel)
  model3d: null   // 3D model URL (optioneel)
}
```

### Stap 3: Test Je Wijzigingen

```bash
cd frontend
npm run dev
```

Open de Timeline pagina en klik op de gebeurtenis om de gallery te bekijken.

## Video's Toevoegen

### Optie 1: Lokale Video

```javascript
import videoFile from '../assets/videos/museum-history.mp4'

// In de configuratie:
video: videoFile
```

### Optie 2: YouTube/Vimeo

```javascript
// In de configuratie:
video: 'https://www.youtube.com/embed/VIDEO_ID'
// of
video: 'https://player.vimeo.com/video/VIDEO_ID'
```

## 3D Modellen Toevoegen

Voor 3D modellen gebruik je een viewer zoals Sketchfab:

```javascript
// In de configuratie:
model3d: 'https://sketchfab.com/models/MODEL_ID/embed'
```

## Best Practices

### Optimalisatie

1. **Comprimeer foto's** voor het toevoegen:
   - Online tools: TinyPNG, Squoosh
   - Desktop: Photoshop, GIMP
   - Target: <500KB per foto

2. **Gebruik WebP formaat** wanneer mogelijk:
   ```bash
   # Converteer JPEG naar WebP
   cwebp input.jpg -q 80 -o output.webp
   ```

3. **Lazy loading** is al ingebouwd - grote foto's worden pas geladen wanneer nodig

### Bestandsnamen

✅ **Goed:**
- `opening-museum-1925.jpg`
- `nanne-ottema-portrait.jpg`
- `eysingahuis-exterior.jpg`

❌ **Vermijd:**
- `IMG_1234.jpg`
- `foto.jpg`
- `DSC_0001.jpg`

### Alt Text & Captions

Altijd beschrijvende captions en descriptions toevoegen:

```javascript
{
  caption: 'Opening museum, December 1925',  // Kort en duidelijk
  description: 'Het museum opent zijn deuren in de kelders van het Eysingahuis aan de Turfmarkt in Leeuwarden'  // Meer context
}
```

## Voorbeeld: Complete Update

### 1. Foto's Toevoegen

```
frontend/src/assets/images/timeline/museum-foundation/
├── opening-ceremony.jpg
├── nanne-ottema.jpg
├── first-collection.jpg
└── eysingahuis-cellar.jpg
```

### 2. Imports Toevoegen

```javascript
// Bovenaan timelineGalleries.js
import museum1925_1 from '../assets/images/timeline/museum-foundation/opening-ceremony.jpg'
import museum1925_2 from '../assets/images/timeline/museum-foundation/nanne-ottema.jpg'
import museum1925_3 from '../assets/images/timeline/museum-foundation/first-collection.jpg'
import museum1925_4 from '../assets/images/timeline/museum-foundation/eysingahuis-cellar.jpg'
```

### 3. Configuratie Updaten

```javascript
'museum-foundation': {
  mainImage: museum1925_1,
  gallery: [
    {
      id: 1,
      src: museum1925_1,
      caption: 'Openingsceremonie December 1925',
      description: 'De officiële opening van het Fries Landbouwmuseum'
    },
    {
      id: 2,
      src: museum1925_2,
      caption: 'Nanne Ottema',
      description: 'Conservator en initiatiefnemer van het museum'
    },
    {
      id: 3,
      src: museum1925_3,
      caption: 'Eerste collectie',
      description: 'Traditionele zuivelwerktuigen uit de 19e eeuw'
    },
    {
      id: 4,
      src: museum1925_4,
      caption: 'Eysingahuis kelders',
      description: 'De eerste locatie van het museum aan de Turfmarkt'
    }
  ],
  video: 'https://www.youtube.com/embed/EXAMPLE_ID',
  model3d: null
}
```

## Troubleshooting

### Foto's worden niet weergegeven

1. **Check import path** - Zorg dat het pad klopt
2. **Check bestandsnaam** - Hoofdlettergevoelig!
3. **Check build** - Run `npm run dev` opnieuw
4. **Browser cache** - Hard refresh (Ctrl+Shift+R)

### Grote bestanden

Als foto's te groot zijn:
```bash
# Via command line (ImageMagick)
convert input.jpg -resize 1920x1080 -quality 85 output.jpg
```

### Performance Issues

- Max 10 foto's per gallery voor optimale performance
- Gebruik WebP formaat
- Comprimeer foto's tot <500KB

## Support

Voor vragen of problemen:
1. Check deze documentatie
2. Bekijk `timelineGalleries.js` voor voorbeelden
3. Test op lokale development server eerst

## Geavanceerde Opties

### Dynamisch Laden

Voor veel foto's kun je dynamic imports gebruiken:

```javascript
const gallery = await Promise.all(
  ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'].map(async (filename, index) => ({
    id: index + 1,
    src: await import(`../assets/images/timeline/museum-foundation/${filename}`),
    caption: `Foto ${index + 1}`
  }))
)
```

### Responsive Images

Voor verschillende schermformaten:

```javascript
{
  src: {
    mobile: mobileSrc,
    tablet: tabletSrc,
    desktop: desktopSrc
  },
  caption: 'Example'
}
```

---

**Laatste update:** Oktober 2024
**Versie:** 1.0
