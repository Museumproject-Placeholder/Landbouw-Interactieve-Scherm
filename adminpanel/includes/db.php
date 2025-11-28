<?php
$conn = mysqli_connect("localhost", "timeline", "1234Time", "timeline");

if (!$conn) {
    die("Databaseverbinding mislukt: " . mysqli_connect_error());
}
?>
