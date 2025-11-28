<?php

/**
 * Database Connection Configuration
 *
 * This file handles the connection to the MySQL database.
 * Update the credentials below to match your database setup.
 */

class Database
{
    // Database credentials
    private $host = "localhost";  // localhost when API runs on same server as database
    private $db_name = "timeline";
    private $username = "timeline";
    private $password = "1234Time";
    private $conn;

    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";port=3306;dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );

            // Set PDO error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Set default fetch mode to associative array
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Log error for debugging
            error_log("Database connection error: " . $e->getMessage());
            error_log("Host: " . $this->host . ", DB: " . $this->db_name . ", User: " . $this->username);
            $this->conn = null;
        }

        return $this->conn;
    }
}
