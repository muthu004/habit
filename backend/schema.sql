CREATE DATABASE IF NOT EXISTS mood_tracker;
USE mood_tracker;

CREATE TABLE IF NOT EXISTS moods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mood ENUM('happy', 'sad', 'angry', 'neutral', 'excited') NOT NULL,
    note TEXT,
    created_at DATE NOT NULL
);
