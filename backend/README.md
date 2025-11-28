# Timeline Events REST API

REST API backend voor het Fries Landbouwmuseum tijdlijn applicatie.

## Technologie Stack

- **PHP 7.4+** met PDO
- **MySQL** database
- **REST** architectuur
- **JSON** response format

## Folder Structuur

```
backend/
├── api/
│   ├── config/
│   │   └── database.php          # Database connectie configuratie
│   ├── endpoints/
│   │   ├── get_events.php        # GET alle events (voor React frontend)
│   │   └── event_crud.php        # CRUD operaties (voor adminpanel)
│   └── index.php                 # API router
├── adminpanel/                   # Admin panel (PHP/HTML/JS)
│   ├── includes/                 # auth.php, db.php, functions.php
│   ├── assets/                   # CSS, uploads
│   ├── index.php                 # Dashboard - lijst van events
│   ├── edit_add.php              # Formulier voor toevoegen/bewerken
│   ├── delete.php                # Verwijderen van events
│   └── login.php, logout.php     # Authenticatie
├── .htaccess                     # URL rewriting voor API
└── README.md
```

**Let op:** Het admin panel bevindt zich nu in `backend/adminpanel/` (alles is samengevoegd in één backend folder).

## Database Configuratie

Update de database credentials in `api/config/database.php`:

```php
private $host = "localhost";
private $db_name = "timeline";
private $username = "root";
private $password = "";
```

## API Endpoints

### Public Endpoints (voor React frontend)

#### GET /api/events

Haal alle actieve timeline events op.

**Response:**

```json
{
  "success": true,
  "count": 9,
  "data": [
    {
      "id": 1,
      "year": 1925,
      "title": "Oprichting Museum",
      "subtitle": "Het begin van een nieuw tijdperk",
      "description": "...",
      "image_url": "...",
      "video_url": null,
      "gallery_images": [...],
      "category": "museum",
      "importance_level": 3,
      "fun_fact": "...",
      "location": "Leeuwarden",
      "is_active": true
    }
  ]
}
```

### Admin Endpoints (voor admin panel)

#### GET /api/event?id={id}

Haal een enkele event op.

**Query Parameters:**

- `id` (required) - Event ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "year": 1925,
    "title": "Oprichting Museum",
    ...
  }
}
```

#### POST /api/event

Maak een nieuwe event aan.

**Request Body:**

```json
{
  "year": 1925,
  "title": "Oprichting Museum",
  "subtitle": "Het begin van een nieuw tijdperk",
  "description": "...",
  "image_url": "...",
  "category": "museum",
  "importance_level": 3,
  "is_active": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Event created successfully",
  "id": 10
}
```

#### PUT /api/event

Update een bestaande event.

**Request Body:**

```json
{
  "id": 1,
  "year": 1925,
  "title": "Oprichting Museum (Updated)",
  ...
}
```

**Response:**

```json
{
  "success": true,
  "message": "Event updated successfully"
}
```

#### DELETE /api/event?id={id}

Verwijder een event.

**Query Parameters:**

- `id` (required) - Event ID

**Response:**

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

## Testen van de API

### Lokaal testen met XAMPP/WAMP

1. Kopieer de `backend` folder naar je webserver root (bijv. `htdocs`)
2. Start Apache en MySQL
3. Test de endpoints met een browser of Postman:

```
http://localhost/backend/api/events
http://localhost/backend/api/event?id=1
```

### Test met cURL

```bash
# Get all events
curl http://localhost/backend/api/events

# Get single event
curl http://localhost/backend/api/event?id=1

# Create event
curl -X POST http://localhost/backend/api/event \
  -H "Content-Type: application/json" \
  -d '{"year":2025,"title":"Test Event"}'

# Update event
curl -X PUT http://localhost/backend/api/event \
  -H "Content-Type: application/json" \
  -d '{"id":1,"year":1925,"title":"Updated Title"}'

# Delete event
curl -X DELETE http://localhost/backend/api/event?id=1
```

## CORS

De API heeft CORS ingeschakeld voor alle origins (`Access-Control-Allow-Origin: *`). Dit maakt het mogelijk om de API aan te roepen vanuit de React frontend tijdens development.

**Voor productie:** Wijzig dit naar het specifieke domein van je frontend.

## Error Handling

Alle endpoints retourneren een consistent JSON format:

**Success:**

```json
{
  "success": true,
  "data": {...}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description"
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

## Volgende Stappen

1. ✅ REST API aangemaakt
2. ⏳ API testen met Postman/cURL
3. ⏳ React frontend verbinden met API
4. ⏳ Admin panel bouwen
