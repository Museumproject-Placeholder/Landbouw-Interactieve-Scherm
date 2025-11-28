<?php
/**
 * CRUD Endpoints for Timeline Events
 *
 * Handles Create, Read (single), Update, and Delete operations.
 * Used by the admin panel to manage timeline events.
 */

// Set headers for JSON response and CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

// Include database configuration
include_once '../config/database.php';

// Create database connection
$database = new Database();
$db = $database->getConnection();

// Check if connection was successful
if ($db === null) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit();
}

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle preflight requests
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    switch ($method) {
        case 'GET':
            // Get single event by ID
            handleGetEvent($db);
            break;

        case 'POST':
            // Create new event
            handleCreateEvent($db);
            break;

        case 'PUT':
            // Update existing event
            handleUpdateEvent($db);
            break;

        case 'DELETE':
            // Delete event
            handleDeleteEvent($db);
            break;

        default:
            http_response_code(405);
            echo json_encode([
                "success" => false,
                "message" => "Method not allowed"
            ]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}

/**
 * GET - Retrieve single event by ID
 */
function handleGetEvent($db) {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Event ID is required"
        ]);
        return;
    }

    $id = intval($_GET['id']);

    $query = "SELECT * FROM timeline_events WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    $event = $stmt->fetch();

    if ($event) {
        // Decode JSON fields
        if (!empty($event['gallery_images'])) {
            $event['gallery_images'] = json_decode($event['gallery_images']);
        }
        if (!empty($event['related_events'])) {
            $event['related_events'] = json_decode($event['related_events']);
        }

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "data" => $event
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Event not found"
        ]);
    }
}

/**
 * POST - Create new event
 */
function handleCreateEvent($db) {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Validate required fields
    if (empty($data->year) || empty($data->title)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Year and title are required"
        ]);
        return;
    }

    // Validate year format (must be 4 digits, between 1820-2025)
    $year = trim($data->year);
    if (!preg_match('/^\d{4}$/', $year) || intval($year) < 1820 || intval($year) > 2025) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Year must be a 4-digit number between 1820 and 2025 (e.g., 1950)"
        ]);
        return;
    }

    $query = "INSERT INTO timeline_events SET
                year = :year,
                title = :title,
                subtitle = :subtitle,
                description = :description,
                image_url = :image_url,
                video_url = :video_url,
                gallery_images = :gallery_images,
                model_3d_url = :model_3d_url,
                category = :category,
                importance_level = :importance_level,
                fun_fact = :fun_fact,
                related_events = :related_events,
                location = :location,
                is_active = :is_active";

    $stmt = $db->prepare($query);

    // Bind parameters
    $stmt->bindParam(':year', $data->year);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':subtitle', $data->subtitle ?? null);
    $stmt->bindParam(':description', $data->description ?? null);
    $stmt->bindParam(':image_url', $data->image_url ?? null);
    $stmt->bindParam(':video_url', $data->video_url ?? null);

    // Convert arrays to JSON strings
    $gallery_images = !empty($data->gallery_images) ? json_encode($data->gallery_images) : null;
    $related_events = !empty($data->related_events) ? json_encode($data->related_events) : null;

    $stmt->bindParam(':gallery_images', $gallery_images);
    $stmt->bindParam(':model_3d_url', $data->model_3d_url ?? null);
    $stmt->bindParam(':category', $data->category ?? null);
    $stmt->bindParam(':importance_level', $data->importance_level ?? 1);
    $stmt->bindParam(':fun_fact', $data->fun_fact ?? null);
    $stmt->bindParam(':related_events', $related_events);
    $stmt->bindParam(':location', $data->location ?? null);

    $is_active = isset($data->is_active) ? ($data->is_active ? 1 : 0) : 1;
    $stmt->bindParam(':is_active', $is_active);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Event created successfully",
            "id" => $db->lastInsertId()
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to create event"
        ]);
    }
}

/**
 * PUT - Update existing event
 */
function handleUpdateEvent($db) {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Validate required fields
    if (empty($data->id)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Event ID is required"
        ]);
        return;
    }

    // Validate year format if provided (must be 4 digits, between 1820-2025)
    if (!empty($data->year)) {
        $year = trim($data->year);
        if (!preg_match('/^\d{4}$/', $year) || intval($year) < 1820 || intval($year) > 2025) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Year must be a 4-digit number between 1820 and 2025 (e.g., 1950)"
            ]);
            return;
        }
    }

    $query = "UPDATE timeline_events SET
                year = :year,
                title = :title,
                subtitle = :subtitle,
                description = :description,
                image_url = :image_url,
                video_url = :video_url,
                gallery_images = :gallery_images,
                model_3d_url = :model_3d_url,
                category = :category,
                importance_level = :importance_level,
                fun_fact = :fun_fact,
                related_events = :related_events,
                location = :location,
                is_active = :is_active
              WHERE id = :id";

    $stmt = $db->prepare($query);

    // Bind parameters
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':year', $data->year);
    $stmt->bindParam(':title', $data->title);
    $stmt->bindParam(':subtitle', $data->subtitle ?? null);
    $stmt->bindParam(':description', $data->description ?? null);
    $stmt->bindParam(':image_url', $data->image_url ?? null);
    $stmt->bindParam(':video_url', $data->video_url ?? null);

    // Convert arrays to JSON strings
    $gallery_images = !empty($data->gallery_images) ? json_encode($data->gallery_images) : null;
    $related_events = !empty($data->related_events) ? json_encode($data->related_events) : null;

    $stmt->bindParam(':gallery_images', $gallery_images);
    $stmt->bindParam(':model_3d_url', $data->model_3d_url ?? null);
    $stmt->bindParam(':category', $data->category ?? null);
    $stmt->bindParam(':importance_level', $data->importance_level ?? 1);
    $stmt->bindParam(':fun_fact', $data->fun_fact ?? null);
    $stmt->bindParam(':related_events', $related_events);
    $stmt->bindParam(':location', $data->location ?? null);

    $is_active = isset($data->is_active) ? ($data->is_active ? 1 : 0) : 1;
    $stmt->bindParam(':is_active', $is_active);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Event updated successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update event"
        ]);
    }
}

/**
 * DELETE - Delete event
 */
function handleDeleteEvent($db) {
    // Get posted data
    $data = json_decode(file_get_contents("php://input"));

    // Also check GET parameter for ID
    $id = $data->id ?? $_GET['id'] ?? null;

    if (empty($id)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Event ID is required"
        ]);
        return;
    }

    $query = "DELETE FROM timeline_events WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Event deleted successfully"
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Event not found"
            ]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to delete event"
        ]);
    }
}
?>
