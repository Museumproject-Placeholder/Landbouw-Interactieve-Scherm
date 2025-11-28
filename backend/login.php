<?php
session_start();
require_once './config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if (!empty($email) && !empty($password)) {
        try {
            $stmt = $conn->prepare("SELECT id, password FROM login_users WHERE email = :email");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                if (password_verify($password, $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    header("Location: index.php");
                    exit;
                } else {
                    $login_error = "Ongeldig wachtwoord.";
                }
            } else {
                $login_error = "Gebruiker niet gevonden.";
            }
        } catch (PDOException $e) {
            $login_error = "Databasefout: " . $e->getMessage();
        }
    } else {
        $login_error = "Vul alle velden in.";
    }
}
?>

<!DOCTYPE html>
<html lang="nl">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="icon" type="image/x-icon" href="./assets/images/logo_landbouw.png">
    <link rel="stylesheet" href="styles/css/styles.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">

    <title>Landbouwmuseum - Login</title>
</head>

<body class="login">
    <div class="login-container">
        <form action="" method="POST" class="login-form">
            <h2>Inloggen</h2>
            <div class="form__group">
                <label for="email">E-mailadres:</label>
                <input type="email" id="email" name="email" required>
            </div>

            <div class="form__group">
                <label for="password">Wachtwoord:</label>
                <input type="password" id="password" name="password" required>
            </div>

            <button type="submit">Inloggen</button>
        </form>
    </div>
</body>

</html>