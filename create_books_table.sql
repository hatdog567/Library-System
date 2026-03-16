-- Run this in phpMyAdmin or MySQL CLI while connected to `library_system`

CREATE TABLE IF NOT EXISTS books (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL,
    author      VARCHAR(255)  NOT NULL,
    genre       VARCHAR(100)  NOT NULL DEFAULT '',
    description TEXT,
    pdf_url     VARCHAR(500)  DEFAULT NULL,
    cover_image VARCHAR(255)  DEFAULT NULL,
    cover_color VARCHAR(200)  DEFAULT 'linear-gradient(135deg,#7f9aa2,#4a6b75)',
    submitted_by INT          DEFAULT NULL,
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_books_user FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed with open-source/public-domain books
INSERT INTO books (title, author, genre, description, pdf_url, cover_color) VALUES
(
  'The Great Gatsby',
  'F. Scott Fitzgerald',
  'Classic',
  'A story of wealth, longing, and the elusive American Dream set in the Jazz Age. Fitzgerald''s masterpiece captures the glitter and moral decay of the Roaring Twenties.',
  'https://www.gutenberg.org/ebooks/64317',
  'linear-gradient(135deg,#a2947f,#756247)'
),
(
  'Pride and Prejudice',
  'Jane Austen',
  'Romance',
  'Sparkling with wit and social satire, Austen''s beloved novel follows Elizabeth Bennet as she navigates love, class, and the irresistible Mr. Darcy.',
  'https://www.gutenberg.org/ebooks/1342',
  'linear-gradient(135deg,#9a7fa2,#644775)'
),
(
  'Moby-Dick',
  'Herman Melville',
  'Adventure',
  'The epic tale of Captain Ahab''s obsessive quest to hunt the white whale across the open seas — a profound meditation on obsession, fate, and the human condition.',
  'https://www.gutenberg.org/ebooks/15',
  'linear-gradient(135deg,#7fa27f,#47754a)'
),
(
  'Nineteen Eighty-Four',
  'George Orwell',
  'Dystopia',
  'Winston Smith lives in a totalitarian nightmare where Big Brother watches every move. A chilling, prescient vision of surveillance, propaganda, and the death of truth.',
  'https://archive.org/details/orwell-1984',
  'linear-gradient(135deg,#a27f7f,#75364a)'
),
(
  'Brave New World',
  'Aldous Huxley',
  'Sci-Fi',
  'In a future of engineered happiness and consumer bliss, Bernard Marx dares to question the World State. A visionary classic that feels more urgent with every passing year.',
  'https://www.planetebook.com/brave-new-world/',
  'linear-gradient(135deg,#a29a7f,#756347)'
),
(
  'Alice in Wonderland',
  'Lewis Carroll',
  'Fantasy',
  'Follow Alice down the rabbit hole into a world of whimsy, wordplay, and delightful absurdity. Carroll''s timeless fantasy remains one of the greatest works of imaginative literature.',
  'https://www.gutenberg.org/ebooks/11',
  'linear-gradient(135deg,#7f9aa2,#4a8b99)'
);
