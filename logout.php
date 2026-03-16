<?php
// logout.php — destroys the server-side PHP session and redirects to index
session_start();
session_unset();
session_destroy();
header('Location: index.php');
exit();
?>
