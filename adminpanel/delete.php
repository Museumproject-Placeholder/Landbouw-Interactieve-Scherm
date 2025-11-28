<?php
include 'includes/db.php';

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit;
}

$id = intval($_GET['id']);
$query = "SELECT * FROM timeline_events WHERE id = $id";
$result = mysqli_query($conn, $query);
$event = mysqli_fetch_assoc($result);

if (!$event) {
    header("Location: index.php");
    exit;
}

// Delete after confirmation
if (isset($_POST['confirm'])) {
    $delete = "DELETE FROM timeline_events WHERE id = $id";
    mysqli_query($conn, $delete);
    header("Location: index.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <title>Bevestig verwijdering</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="confirm-box">
        <div class="warning-icon">⚠️</div>
        <h2>Bevestig verwijdering</h2>
        <p>Weet je zeker dat je dit item wilt verwijderen?</p>
        <div class="info">
            <p><strong>Jaar:</strong> <?= htmlspecialchars($event['year']) ?></p>
            <p><strong>Titel:</strong> <?= htmlspecialchars($event['title']) ?></p>
        </div>
        <p class="danger-text">Deze actie kan niet ongedaan worden gemaakt.</p>
        <form method="POST">
            <button type="submit" name="cancel" formaction="index.php" class="btn-cancel">Annuleren</button>
            <button type="submit" name="confirm" class="btn-danger">Ja, Verwijder</button>
        </form>
    </div>
</body>
</html>
