<?php
include 'includes/db.php';
include 'includes/auth.php';
include 'includes/functions.php';

// Get category filter from URL
$categoryFilter = isset($_GET['category']) ? mysqli_real_escape_string($conn, $_GET['category']) : 'all';

// Get statistics
$statsQuery = "SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
    SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
    SUM(CASE WHEN category = 'museum' THEN 1 ELSE 0 END) as museum_count,
    SUM(CASE WHEN category = 'landbouw' THEN 1 ELSE 0 END) as landbouw_count,
    SUM(CASE WHEN category = 'maatschappelijk' THEN 1 ELSE 0 END) as maatschappelijk_count
FROM timeline_events";
$statsResult = mysqli_query($conn, $statsQuery);
$stats = mysqli_fetch_assoc($statsResult);

// Get all events from the database (table: timeline_events)
$query = "SELECT * FROM timeline_events";
if ($categoryFilter !== 'all') {
    $query .= " WHERE category = '$categoryFilter'";
}
$query .= " ORDER BY sort_order ASC, year ASC";
$result = mysqli_query($conn, $query);
?>

<!DOCTYPE html>
<html lang="nl">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="dashboard-container">
        <div class="header">
            <h1>Dashboard</h1>
            <a href="edit_add.php" class="btn btn-primary">+ Nieuw Event</a>
            <a href="logout.php" class="btn btn-logout">Logout</a>
        </div>

        <?php if (isset($_GET['success'])): ?>
            <div class="alert alert-success" style="background: #4CAF50; color: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <?= htmlspecialchars($_GET['success']) ?>
            </div>
        <?php endif; ?>
        
        <?php if (isset($_SESSION['upload_errors'])): ?>
            <div class="alert alert-error" style="background: #f44336; color: white; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <strong>Upload Fout:</strong> <?= htmlspecialchars($_SESSION['upload_errors']) ?>
            </div>
            <?php unset($_SESSION['upload_errors']); ?>
        <?php endif; ?>

        <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card stat-card-primary">
                <div class="stat-icon">
                    <i class="fa-solid fa-calendar-days"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value"><?= $stats['total'] ?? 0 ?></div>
                    <div class="stat-label">Totaal Events</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-success">
                <div class="stat-icon">
                    <i class="fa-solid fa-eye"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value"><?= $stats['active'] ?? 0 ?></div>
                    <div class="stat-label">Zichtbaar</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-warning">
                <div class="stat-icon">
                    <i class="fa-solid fa-eye-slash"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value"><?= $stats['inactive'] ?? 0 ?></div>
                    <div class="stat-label">Verborgen</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-info">
                <div class="stat-icon">
                    <i class="fa-solid fa-filter"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value"><?= $stats['museum_count'] ?? 0 ?></div>
                    <div class="stat-label">Museum</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-success-alt">
                <div class="stat-icon">
                    <i class="fa-solid fa-seedling"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value"><?= $stats['landbouw_count'] ?? 0 ?></div>
                    <div class="stat-label">Landbouw</div>
                </div>
            </div>
            
            <div class="stat-card stat-card-neutral">
                <div class="stat-icon">
                    <i class="fa-solid fa-users"></i>
                </div>
                <div class="stat-content">
                    <div class="stat-value"><?= $stats['maatschappelijk_count'] ?? 0 ?></div>
                    <div class="stat-label">Maatschappelijk</div>
                </div>
            </div>
        </div>

        <div class="table-container">
            <h2>Events Overzicht</h2>
            
            <!-- Category Filter Buttons -->
            <div class="filter-buttons">
                <a href="?category=all" 
                   class="filter-btn <?= $categoryFilter === 'all' ? 'active' : '' ?>">
                    <i class="fa-solid fa-list"></i> Alle
                </a>
                <a href="?category=museum" 
                   class="filter-btn <?= $categoryFilter === 'museum' ? 'active' : '' ?>" 
                   style="--active-color: #440f0f;">
                    <i class="fa-solid fa-building"></i> Museum
                </a>
                <a href="?category=landbouw" 
                   class="filter-btn <?= $categoryFilter === 'landbouw' ? 'active' : '' ?>" 
                   style="--active-color: #929d7c;">
                    <i class="fa-solid fa-seedling"></i> Landbouw
                </a>
                <a href="?category=maatschappelijk" 
                   class="filter-btn <?= $categoryFilter === 'maatschappelijk' ? 'active' : '' ?>" 
                   style="--active-color: #657575;">
                    <i class="fa-solid fa-users"></i> Maatschappelijk
                </a>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Jaar</th>
                        <th>Titel</th>
                        <th>Beschrijving</th>
                        <th>Categorie</th>
                        <th>Puzzle?</th>
                        <th>Actief?</th>
                        <th>Acties</th>
                    </tr>
                </thead>
                <tbody>
                    <?php while($row = mysqli_fetch_assoc($result)): ?>
                    <tr>
                        <td><?= htmlspecialchars($row['year']) ?></td>
                        <td><?= htmlspecialchars($row['title']) ?></td>
                        <td><?= htmlspecialchars(mb_substr($row['description'], 0, 100)) ?><?= mb_strlen($row['description']) > 100 ? '...' : '' ?></td>
                        <td><?= htmlspecialchars($row['category'] ?? 'museum') ?></td>
                        <td><?= $row['has_puzzle'] ? '✅' : '❌' ?></td>
                        <td><?= $row['is_active'] ? '✅' : '❌' ?></td>
                        <td class="actions">
                            <a href="edit_add.php?id=<?= $row['id'] ?>" class="btn-icon btn-edit" title="Bewerken">
                                <i class="fa-solid fa-pen"></i>
                            </a>
                        </td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
