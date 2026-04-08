<?php
// update_book.php — handles AJAX POST to edit a book
session_start();
header('Content-Type: application/json');

// Must be logged in
if (empty($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

require_once 'database.php';

$userEmail   = $_SESSION['email'] ?? '';
$user_id     = (int)($_SESSION['user_id'] ?? 0);

// Patch user_id if null or 0 from previous DB issue
if ($user_id === 0 && !empty($userEmail)) {
    $patchRes = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if ($patchRes) {
        $patchRes->bind_param('s', $userEmail);
        $patchRes->execute();
        $patchRow = $patchRes->get_result()->fetch_assoc();
        if ($patchRow && !empty($patchRow['id'])) {
            $user_id = (int)$patchRow['id'];
            $_SESSION['user_id'] = $user_id;
        }
        $patchRes->close();
    }
}
$book_id     = (int)($_POST['book_id'] ?? 0);
$title       = trim($_POST['title']       ?? '');
$author      = trim($_POST['author']      ?? '');
$genre       = trim($_POST['genre']       ?? '');
$description = trim($_POST['description'] ?? '');
$pdf_url     = trim($_POST['pdf_url']     ?? '');
if ($pdf_url === '') $pdf_url = null;

if ($book_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid book ID.']);
    exit();
}

// Any logged-in user can edit any book in this version

$errors = [];
if (strlen($title)  < 1)   $errors[] = 'Book title is required.';
if (strlen($title)  > 255) $errors[] = 'Title must be 255 characters or less.';
if (strlen($author) < 1)   $errors[] = 'Author name is required.';
if (strlen($author) > 255) $errors[] = 'Author must be 255 characters or less.';
if (strlen($genre)  > 100) $errors[] = 'Genre must be 100 characters or less.';
if (strlen($pdf_url)> 500) $errors[] = 'URL must be 500 characters or less.';

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
    exit();
}

// Handle file upload
$cover_image = null;
$hasNewCover = false;
if (isset($_FILES['cover_image']) && $_FILES['cover_image']['error'] === UPLOAD_ERR_OK) {
    $tmp_name = $_FILES['cover_image']['tmp_name'];
    $name     = basename($_FILES['cover_image']['name']);
    $ext      = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $allowed  = ['jpg','jpeg','png','gif','webp'];

    if (in_array($ext, $allowed)) {
        if (!is_dir('uploads/covers')) {
            mkdir('uploads/covers', 0777, true);
        }
        $new_filename = uniqid('cover_', true) . '.' . $ext;
        $dest = 'uploads/covers/' . $new_filename;
        if (move_uploaded_file($tmp_name, $dest)) {
            $cover_image = $dest;
            $hasNewCover = true;
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Failed to save uploaded cover image.']);
            exit();
        }
    } else {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Invalid image type. Only JPG, PNG, GIF, WEBP are allowed.']);
        exit();
    }
}

if ($hasNewCover) {
    $stmt = $conn->prepare(
        "UPDATE books SET title = ?, author = ?, genre = ?, description = ?, pdf_url = ?, cover_image = ? WHERE id = ?"
    );
    $stmt->bind_param('ssssssi', $title, $author, $genre, $description, $pdf_url, $cover_image, $book_id);
} else {
    $stmt = $conn->prepare(
        "UPDATE books SET title = ?, author = ?, genre = ?, description = ?, pdf_url = ? WHERE id = ?"
    );
    $stmt->bind_param('sssssi', $title, $author, $genre, $description, $pdf_url, $book_id);
}

if ($stmt->execute()) {
    $stmt->close();
    echo json_encode([
        'success' => true,
        'message' => 'Book updated successfully!'
    ]);
} else {
    $stmt->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error. Please try again.']);
}
?>
