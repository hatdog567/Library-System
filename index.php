<?php
session_start();

$errors = [
  'login'    => $_SESSION['login_error']    ?? '',
  'register' => $_SESSION['register_error'] ?? '',
];
$activeTab = $_SESSION['active_form'] ?? 'login';   // 'login' or 'register'
$success   = $_SESSION['success'] ?? '';
$openModal = ($errors['login'] || $errors['register'] || $success); // auto-open modal if any message
?>
<!DOCTYPE html>
<html lang="en" class="<?= $openModal ? 'auth-open' : '' ?>">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ArkLib</title>
  <link rel="stylesheet" href="main.css?v=2">
  <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="icon" href="/img/arklib.png">
</head>
<body>

  <!-- Header -->
  <header class="container">
    <a href="#" class="logo"><img src="img/arklib.png" alt="ArkLib Logo"></a>
    <nav class="nav-buttons">
      <div class="about-btn">
        <button type="button" class="about-btn-modal">
          <a href="#members" class="about-btn-modal">About</a>
        </button>
      </div>
      <div class="login-btn">
        <button type="button" class="login-btn-modal" data-open="login">Login</button>
      </div>
      <div class="signup-btn">
        <button type="button" class="signup-btn-modal" data-open="signup">Sign Up</button>
      </div>
    </nav>
  </header>

  <!-- Overlay -->
  <div class="auth-overlay" data-close="true"></div>

  <!-- Auth Modal -->
  <div class="auth-modal" id="authModal" role="dialog" aria-modal="true">
    <button class="auth-close" data-close="true" aria-label="Close">✕</button>

    <!-- Tabs -->
    <div class="auth-tabs">
      <button class="tab <?= $activeTab==='login' ? 'is-active':'' ?>" data-tab="login">Login</button>
      <button class="tab <?= $activeTab==='register' ? 'is-active':'' ?>" data-tab="signup">Sign Up</button>
    </div>

    <div class="form-wrapper">
      <!-- LOGIN -->

      <form class="form-box <?= $activeTab==='login' ? 'is-active':'' ?>" id="loginForm" method="post" action="login-auth.php">
        <h2>Login</h2>
        <?php if (!empty($errors['login'])): ?>
          <div class="auth-error"><?= htmlspecialchars($errors['login']) ?></div>
        <?php endif; ?>
        <?php if (!empty($success) && $activeTab==='login'): ?>
          <div class="auth-success"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>
        <div class="input-box">
          <input type="email" name="email" placeholder="Email" required>
        </div>
        <div class="input-box">
          <input type="password" id="loginPw" name="password" placeholder="Password" required>
        </div>
        <button class="btn" type="submit" name="login">Login</button>
        <div class="forgot-row">
          <button type="button" class="forgot-link" id="openForgot">Forgot password?</button>
        </div>
      </form>

      <!-- SIGN UP -->
      <form class="form-box <?= $activeTab==='register' ? 'is-active':'' ?>" id="signupForm" method="post" action="login-auth.php">
        <h2>Sign Up</h2>
        <?php if (!empty($errors['register'])): ?>
          <div class="auth-error"><?= htmlspecialchars($errors['register']) ?></div>
        <?php endif; ?>
        <?php if (!empty($success) && $activeTab==='register'): ?>
          <div class="auth-success"><?= htmlspecialchars($success) ?></div>
        <?php endif; ?>
        <div class="input-box">
          <input type="text" name="username" placeholder="Username" required>
        </div>
        <div class="input-box">
          <input type="email" name="email" placeholder="Email" required>
        </div>
        <div class="input-box">
          <input type="password" id="signupPw" name="password" placeholder="Password" required>
        </div>
        <button class="btn" type="submit" name="register">Sign Up</button>
      </form>
    </div>

    <!-- ── Forgot Password Panel (hidden inside modal) ── -->
    <div class="forgot-panel" id="forgotPanel" style="display:none">
      <button type="button" class="forgot-back" id="closeForgot">&#8592; Back to Login</button>
      <h2>Reset Password</h2>
      <p class="forgot-sub">Enter your account email and we'll update your password right away.</p>
      <div id="forgotMsg"></div>
      <form id="forgotForm" class="forgot-form" novalidate>
        <div class="input-box">
          <input type="email" id="forgotEmail" name="email" placeholder="Your email address" required>
        </div>
        <div class="input-box">
          <input type="password" id="newPw" name="new_password" placeholder="New password" required>
        </div>
        <div class="input-box">
          <input type="password" id="confirmPw" name="confirm_password" placeholder="Confirm new password" required>
        </div>
        <button class="btn" type="submit" id="forgotSubmitBtn">Reset Password</button>
      </form>
    </div>

  </div>

  <!-- Main content -->
  <main>
    <section class="frame">
      <div class="grid">
        <article class="feature">
          <div class="covers">
            <img class="cover cover-1" src="img/image (1).png" alt="To Kill a Mockingbird">
          </div>
          <div class="details">
            <h1 class="author">Harper Lee</h1>
            <p class="blurb">
              From innocence under reckoning in <em>Mockingbird</em> to the uneasy return of Maycomb in
              <em>Watchman</em>—Lee wrote not just of justice, but of the journey to see it clearly.
            </p>
            <a class="cta" href="https://www.goodreads.com/author/show/1825.Harper_Lee" target="_blank" rel="noopener">Read Now</a>
          </div>
        </article>

        <aside class="aside">
          <h2>Turn Pages, Turn Minds.</h2>
          <img class="photo" src="img/image (2).png" alt="Readers in a library">
          <p>
            Reading isn’t just turning pages—it’s slipping between worlds. A book can take you farther than any
            plane ticket, into lives you’ve never lived and places you’ve never seen. It’s the cheapest form of
            travel and the richest form of escape. All you need is a quiet corner and an open mind.
          </p>
        </aside>
      </div>
    </section>
  </main>

  <section id="members" class="member-frames">
    <h1 style="text-align: center; font-family: 'Anton'; font-size: clamp(28px, 4vw, 44px);">Meet the Group 4</h1>
    <div class="grid">
      <div class="frame"><div class="member"><img src="img/download (3).jpg" alt="Member 1" class="photo"><h2>Aldrin Clark Adino</h2><p>Project Manager – Oversees team operations and ensures smooth delivery.</p></div></div>
      <div class="frame"><div class="member"><img src="img/chaewon.jpg" alt="Member 2" class="photo"><h2>Antonette Formento</h2><p>Lead Developer – Builds and maintains the core platform features.</p></div></div>
      <div class="frame"><div class="member"><img src="img/eunchae.jpg" alt="Member 3" class="photo"><h2>Mikaella Licup</h2><p>Lead Developer – Builds and maintains the core platform features.</p></div></div>
      <div class="frame"><div class="member"><img src="img/sakura.jpg" alt="Member 4" class="photo"><h2>Savina Lilagan</h2><p>Lead Developer – Builds and maintains the core platform features.</p></div></div>
      <div class="frame"><div class="member"><img src="img/kazuha.jpg" alt="Member 5" class="photo"><h2>Wency Geraldo</h2><p>Lead Developer – Builds and maintains the core platform features.</p></div></div>
      <div class="frame"><div class="member"><img src="img/hanni icon.jpg" alt="Member 6" class="photo"><h2>Gabriel Palattao</h2><p>Lead Developer – Builds and maintains the core platform features.</p></div></div>
    </div>
  </section>

  <footer class="footer-sec">
    <div class="footer-text">
      <p>&copy; 2025 ArkLib. All rights reserved. Group 4</p>
      <p class="tagline">Turn Pages, Turn Minds.</p>
    </div>
  </footer>

  <script src="script.js"></script>
  <script>
    // Ensure correct tab is shown on initial load if modal is open from server flash
    <?php if ($openModal): ?>
      document.addEventListener('DOMContentLoaded', function(){ showTab('<?= $activeTab === 'register' ? 'signup' : 'login' ?>'); });
    <?php endif; ?>


    // ── Forgot password panel ────────────────────────────────────────────
    const forgotPanel = document.getElementById('forgotPanel');
    const formWrapper = document.querySelector('.form-wrapper');
    const authTabs    = document.querySelector('.auth-tabs');

    document.getElementById('openForgot').addEventListener('click', () => {
      formWrapper.style.display = 'none';
      authTabs.style.display    = 'none';
      forgotPanel.style.display = 'block';
    });
    document.getElementById('closeForgot').addEventListener('click', () => {
      forgotPanel.style.display = 'none';
      formWrapper.style.display = '';
      authTabs.style.display    = '';
    });

    // AJAX reset
    document.getElementById('forgotForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const msgEl  = document.getElementById('forgotMsg');
      const btn    = document.getElementById('forgotSubmitBtn');
      const email  = document.getElementById('forgotEmail').value.trim();
      const newPw  = document.getElementById('newPw').value;
      const confPw = document.getElementById('confirmPw').value;
      msgEl.className = 'forgot-msg';
      msgEl.textContent = '';

      if (!email) { showForgotMsg('Please enter your email.', false); return; }
      if (newPw.length < 6) { showForgotMsg('Password must be at least 6 characters.', false); return; }
      if (newPw !== confPw) { showForgotMsg('Passwords do not match.', false); return; }

      btn.disabled = true; btn.textContent = 'Resetting…';
      try {
        const fd = new FormData();
        fd.append('email', email);
        fd.append('new_password', newPw);
        const res  = await fetch('forgot_password.php', { method: 'POST', body: fd });
        const data = await res.json();
        showForgotMsg(data.message, data.success);
        if (data.success) { this.reset(); }
      } catch { showForgotMsg('Network error. Please try again.', false); }
      finally { btn.disabled = false; btn.textContent = 'Reset Password'; }
    });

    function showForgotMsg(msg, ok) {
      const el = document.getElementById('forgotMsg');
      el.textContent = msg;
      el.className   = 'forgot-msg ' + (ok ? 'forgot-msg--ok' : 'forgot-msg--err');
    }
  </script>
  <?php
  
  // Clear flash after rendering
  unset($_SESSION['login_error'], $_SESSION['register_error'], $_SESSION['active_form'], $_SESSION['success']);
  ?>
</body>
</html>
