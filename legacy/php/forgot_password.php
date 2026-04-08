<?php
// forgot_password.php — direct password reset via email lookup (no email sending needed)
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit();
}

require_once 'database.php';

$email       = trim($_POST['email']        ?? '');
$newPassword = trim($_POST['new_password'] ?? '');

// Basic validation
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit();
}
if (strlen($newPassword) < 6) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit();
}

// Check email exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param('s', $email);
$check->execute();
$check->store_result();

if ($check->num_rows === 0) {
    $check->close();
    // Return generic message to not expose whether email exists
    echo json_encode(['success' => false, 'message' => 'No account found with that email address.']);
    exit();
}
$check->close();

// Update password
$hashed = password_hash($newPassword, PASSWORD_DEFAULT);
$update = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
$update->bind_param('ss', $hashed, $email);

if ($update->execute()) {
    $update->close();
    echo json_encode(['success' => true, 'message' => 'Password reset successful! You can now log in with your new password.']);
} else {
    $update->close();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Something went wrong. Please try again.']);
}
?>
