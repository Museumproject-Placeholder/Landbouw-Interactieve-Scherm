<?php
// Start sessie
session_start();

// Dummy gebruikersgegevens
$correct_username = "admin";
$correct_password = "1234";

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

    if ($username === $correct_username && $password === $correct_password) {
        $_SESSION["loggedin"] = true;
        header("Location: index.php");
        exit;
    } else {
        $error = "Ongeldige gebruikersnaam of wachtwoord.";
    }
}
?>
<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Pagina</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="backdrop">
        <div class="modal">
            <h2>Inloggen</h2>
            <form method="POST" action="">
                <input type="text" name="username" placeholder="Gebruikersnaam" required><br>
                <input type="password" name="password" placeholder="Wachtwoord" required><br>
                <button type="submit">Login</button>
            </form>
            <?php if (!empty($error)): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>
        </div>
    </div>
</body>

</html>