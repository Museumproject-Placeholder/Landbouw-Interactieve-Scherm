<?php
session_start();
require_once './config.php';

// (Later voegen we hier PHP toe om data uit de database te laden)
?>

<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Events beheren</title>

    <link rel="stylesheet" href="styles/css/styles.css">
    <link rel="icon" type="image/x-icon" href="./assets/images/logo_landbouw.png">
</head>
<body class="dashboard">

    <header class="dashboard-header">
        <nav class="dashboard-nav">
            <div class="logo-container">
                <img src="./assets/images/logo_landbouw.png" alt="Logo">
                <h2>Landbouwmuseum Admin</h2>
            </div>
            <ul>
                <li><a href="index.php">Dashboard</a></li>
                <li><a href="admin_events.php" class="active">Events</a></li>
                <li><a href="timeline.php">Tijdlijn</a></li>
                <li><a href="logout.php">Uitloggen</a></li>
            </ul>
        </nav>
    </header>

    <main class="admin-container">
        <h1 class="admin-title">Events Beheren</h1>

        <!-- Knop om nieuw event toe te voegen -->
        <div class="actions-top">
            <button class="btn btn-primary">+ Nieuw Event</button>
        </div>

        <!-- Overzichtstabel -->
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Jaar</th>
                    <th>Titel</th>
                    <th>Korte Beschrijving</th>
                    <th>Acties</th>
                </tr>
            </thead>
            <tbody>
                <!-- Voor nu dummy data (later vullen we dit met PHP) -->
                <tr>
                    <td>1</td>
                    <td>1600</td>
                    <td>Gouden Eeuw Landbouw</td>
                    <td>De Friese landbouw bloeit tijdens de Nederlandse Gouden Eeuw...</td>
                    <td>
                        <button class="btn btn-secondary">Bewerken</button>
                        <button class="btn btn-danger">Verwijderen</button>
                    </td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>1650</td>
                    <td>Landaaanwinning Tijdperk</td>
                    <td>Grootschalige drainageprojecten transformeren het Friese landschap...</td>
                    <td>
                        <button class="btn btn-secondary">Bewerken</button>
                        <button class="btn btn-danger">Verwijderen</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>

</body>
</html>
