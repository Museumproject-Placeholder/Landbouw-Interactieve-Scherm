# User Story: Admin Panel Design & Planning

**Als** beheerder van het Fries Landbouwmuseum
**Wil ik** een eenvoudig admin panel hebben
**Zodat ik** timeline gebeurtenissen kan toevoegen, bewerken en verwijderen

---

## Acceptance Criteria

✅ Design mockups voor alle pagina's (login, dashboard, add, edit)
✅ Duidelijke layout structuur
✅ Navigatie flow diagram
✅ Bestandsstructuur plan
✅ Database velden mapping
✅ Goedkeuring van team

---

## Benodigde Pagina's

1. **login.php** - Inlog pagina
2. **index.php** - Dashboard met lijst van events
3. **add.php** - Nieuw event toevoegen
4. **edit.php** - Event bewerken
5. **delete.php** - Event verwijderen
6. **logout.php** - Uitloggen

---

## Navigatie Flow

```
[Login] → [Dashboard]
            ↓
            ├→ [Add Event] → [Submit] → [Dashboard]
            ├→ [Edit Event] → [Submit] → [Dashboard]
            └→ [Delete] → [Confirmatie] → [Dashboard]
```

---

## Dashboard Layout

**Header:**
- Logo/Titel: "Timeline Admin - Fries Landbouwmuseum"
- Gebruiker info + Logout knop

**Main:**
- "Nieuw Event Toevoegen" knop (groen)
- Tabel met alle events

**Tabel kolommen:**
| Jaar | Titel | Stage | Puzzle? | Actief? | Acties |
|------|-------|-------|---------|---------|--------|
| 1925 | Oprichting... | 1 | ✓ | ✓ | ✏️ 🗑️ 👁️ |

---

## Formulier Velden (Add/Edit)

**Verplichte velden:**
1. Jaar (text) *
2. Titel (text) *
3. Beschrijving (textarea) *
4. Volgorde (number) *

**Optionele velden:**
5. Icon (text) - default: 🌾
6. Gradient (text)
7. Museum Gradient (text)
8. Stage (dropdown: 1, 2, 3)
9. Heeft Puzzle? (checkbox)
10. Puzzel Afbeelding (file upload)
11. Gebruik Detailed Modal? (checkbox)
12. Historische Context (textarea)
13. Actief? (checkbox - default: checked)

---

## Technologie

- **Backend:** PHP (simpel, geen framework)
- **Database:** MySQL via PDO
- **Frontend:** HTML + CSS (Tailwind optioneel)
- **Authenticatie:** Session-based
- **Upload:** PHP file upload naar `/uploads/timeline/`

---

## Bestandsstructuur

```
/admin
  /assets
    /css
      - style.css
    /uploads
      /timeline
  /includes
    - db.php          (database connectie)
    - auth.php        (authenticatie)
  - index.php         (dashboard)
  - login.php         (login)
  - add.php           (toevoegen)
  - edit.php          (bewerken)
  - delete.php        (verwijderen)
  - logout.php        (uitloggen)
  - .htaccess         (security)
```

---

## Deliverables voor Design Phase

- [ ] Login pagina mockup
- [ ] Dashboard mockup met tabel
- [ ] Add/Edit formulier mockup
- [ ] Navigatie flow diagram
- [ ] Kleurenschema (hex codes)
- [ ] Bestandsstructuur documentatie

---

## Geschatte Tijd

⏱️ **Design: 2-3 dagen**
⏱️ **Development: 3-5 dagen**

---

## Definition of Done (Design Phase)

✅ Alle mockups zijn gemaakt
✅ Navigatie flow is gedocumenteerd
✅ Velden mapping is compleet
✅ Design is goedgekeurd door team
✅ Klaar voor development

---

**→ Deze user story is ALLEEN voor design & planning!**
**Development komt later, na goedkeuring.**
