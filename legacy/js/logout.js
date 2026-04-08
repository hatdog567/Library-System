// logout.js

// Function to handle user logout
function logout() {
  try {
    // Clear saved user session data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();

    // Optional: simple confirmation
    alert("You have been logged out successfully.");

    // Redirect to login or homepage
    window.location.href = "index.php"; // change this to your desired page
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

// Automatically attach logout handler to your button if it exists
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.querySelector(".logout-btn-modal");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});
