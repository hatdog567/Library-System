-- ArkLib Database Schema for Neon PostgreSQL
-- This creates the users and books tables with seed data

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) DEFAULT '',
    description TEXT,
    pdf_url VARCHAR(500),
    cover_image VARCHAR(255),
    cover_color VARCHAR(200) DEFAULT 'linear-gradient(135deg,#7f9aa2,#4a6b75)',
    submitted_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert a default admin user (password: admin123 - bcrypt hash)
INSERT INTO users (username, email, password) VALUES
('admin', 'admin@arklib.com', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOeY7H8GdCqS0gXxH7JCXV.qR8J7ZYXMS')
ON CONFLICT (email) DO NOTHING;

-- Seed books data (from original MySQL seed)
INSERT INTO books (title, author, genre, description, pdf_url, cover_image, cover_color, submitted_by) VALUES
('To Kill a Mockingbird', 'Harper Lee', 'Classic Fiction', 'A gripping tale of racial injustice in the Deep South, seen through the eyes of young Scout Finch.', '', '', 'linear-gradient(135deg, #1a1a2e, #16213e)', 1),
('1984', 'George Orwell', 'Dystopian', 'A chilling prophecy about the future, exploring surveillance, government overreach, and truth.', '', '', 'linear-gradient(135deg, #4a0000, #000000)', 1),
('Pride and Prejudice', 'Jane Austen', 'Romance', 'A witty exploration of love, reputation, and class in Regency-era England.', '', '', 'linear-gradient(135deg, #f5e6d3, #c9b99a)', 1),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic Fiction', 'A portrait of the Jazz Age and the American Dream''s dark underbelly.', '', '', 'linear-gradient(135deg, #0a3d62, #1e5f74)', 1),
('Moby Dick', 'Herman Melville', 'Adventure', 'The epic tale of Captain Ahab''s obsessive quest to destroy the white whale.', '', '', 'linear-gradient(135deg, #1a5276, #2980b9)', 1),
('The Catcher in the Rye', 'J.D. Salinger', 'Coming-of-age', 'Holden Caulfield''s iconic journey through the phoniness of the adult world.', '', '', 'linear-gradient(135deg, #c0392b, #7b241c)', 1)
ON CONFLICT DO NOTHING;
