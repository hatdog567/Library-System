<?php
session_start();
if (empty($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: index.php');
    exit();
}

require_once 'database.php';

$username  = htmlspecialchars($_SESSION['username'] ?? 'Reader');
$userEmail = $_SESSION['email'] ?? '';

// Patch the session user_id if it's 0 (due to previous DB schema issue)
$uid = (int)($_SESSION['user_id'] ?? 0);
if ($uid === 0 && !empty($userEmail)) {
    $patchRes = $conn->prepare("SELECT id FROM users WHERE email = ?");
    if ($patchRes) {
        $patchRes->bind_param('s', $userEmail);
        $patchRes->execute();
        $patchRow = $patchRes->get_result()->fetch_assoc();
        if ($patchRow && !empty($patchRow['id'])) {
            $uid = (int)$patchRow['id'];
            $_SESSION['user_id'] = $uid;
        }
        $patchRes->close();
    }
}
$myCount    = 0;
$myRes = $conn->prepare("SELECT COUNT(*) AS c FROM books WHERE submitted_by = ?");
if ($myRes) {
    $myRes->bind_param('i', $uid);
    $myRes->execute();
    $myCount = $myRes->get_result()->fetch_assoc()['c'];
    $myRes->close();
}

// All books
$books = [];
$result = $conn->query("SELECT * FROM books ORDER BY created_at DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) $books[] = $row;
}
$totalBooks = count($books);

// Flash
$flash = '';
if (!empty($_SESSION['book_success'])) {
    $flash = htmlspecialchars($_SESSION['book_success']);
    unset($_SESSION['book_success']);
}

// User initials for avatar
$initials = strtoupper(mb_substr($username, 0, 1));
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>ArkLib — <?= $username ?>'s Library</title>
  <meta name="description" content="ArkLib — your personal digital library dashboard.">
  <link rel="icon" href="/img/arklib.png">
  <link rel="stylesheet" href="main.css">
  <link rel="stylesheet" href="main_site.css">
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

  <!-- ═══ HEADER (mirrors index.php exactly) ═══════════════════════════════ -->
  <header class="container">
    <a href="#" class="logo"><img src="img/arklib.png" alt="ArkLib Logo"></a>
    <nav class="nav-buttons">
      <button type="button" class="ms-btn" id="submitBtn">Submit a Book</button>
      <button type="button" class="ms-btn ms-btn--ghost" id="logoutBtn">Logout</button>
    </nav>
  </header>

  <!-- ═══ OVERLAY ══════════════════════════════════════════════════════════ -->
  <div class="ms-overlay" id="msOverlay"></div>

  <!-- ═══ LOGOUT MODAL ═════════════════════════════════════════════════════ -->
  <div class="ms-modal" id="logoutModal" role="dialog" aria-modal="true">
    <h2 class="ms-modal__title">Leaving so soon?</h2>
    <p  class="ms-modal__body">Are you sure you want to log out, <?= $username ?>?</p>
    <div class="ms-modal__row">
      <button class="ms-modal__stay" id="cancelLogout">Stay</button>
      <a href="logout.php" class="ms-modal__go">Yes, Logout</a>
    </div>
  </div>

  <!-- ═══ SUBMIT BOOK MODAL ════════════════════════════════════════════════ -->
  <div class="ms-modal" id="submitModal" role="dialog" aria-modal="true">
    <button class="ms-modal__x" id="closeSubmit" aria-label="Close">&#10005;</button>
    <h2 class="ms-modal__title">Submit a Book</h2>
    <p  class="ms-modal__body">Share a title with the ArkLib community.</p>
    <div id="submitMsg" class="ms-flash" style="display:none;"></div>
    <form id="submitForm" class="ms-form" enctype="multipart/form-data" novalidate>
      <div class="ms-field">
        <label for="bkTitle">Book Title <span aria-hidden="true">*</span></label>
        <input type="text" id="bkTitle" name="title" placeholder="e.g. The Alchemist" required maxlength="255">
      </div>
      <div class="ms-field">
        <label for="bkAuthor">Author <span aria-hidden="true">*</span></label>
        <input type="text" id="bkAuthor" name="author" placeholder="e.g. Paulo Coelho" required maxlength="255">
      </div>
      <div class="ms-field">
        <label for="bkGenre">Genre</label>
        <select id="bkGenre" name="genre">
          <option value="">— Select genre —</option>
          <option>Classic</option><option>Romance</option><option>Sci-Fi</option>
          <option>Dystopia</option><option>Adventure</option><option>Fantasy</option>
          <option>Mystery</option><option>Non-Fiction</option>
          <option>Historical Fiction</option><option>Other</option>
        </select>
      </div>
      <div class="ms-field">
        <label for="bkDesc">Short Description</label>
        <textarea id="bkDesc" name="description" rows="3" placeholder="What is this book about?"></textarea>
      </div>
      <div class="ms-field">
        <label for="bkPdf">Book Link (URL)</label>
        <input type="text" id="bkPdf" name="pdf_url" placeholder="e.g. https://www.gutenberg.org/ebooks/1234" maxlength="500">
      </div>
      <div class="ms-field">
        <label for="bkCover">Cover Image (Optional)</label>
        <input type="file" id="bkCover" name="cover_image" accept="image/*">
      </div>
      <button type="submit" class="ms-submit-btn" id="submitFormBtn">Submit Book</button>
    </form>
  </div>

    <!-- ═══ EDIT BOOK MODAL ══════════════════════════════════════════════════ -->
  <div class="ms-modal" id="editModal" role="dialog" aria-modal="true">
    <button class="ms-modal__x" id="closeEdit" aria-label="Close">&#10005;</button>
    <h2 class="ms-modal__title">Edit Book</h2>
    <div id="editMsg" class="ms-flash" style="display:none;"></div>
    <form id="editForm" class="ms-form" enctype="multipart/form-data" novalidate>
      <input type="hidden" id="editId" name="book_id">
      <div class="ms-field">
        <label for="editTitle">Book Title <span aria-hidden="true">*</span></label>
        <input type="text" id="editTitle" name="title" required maxlength="255">
      </div>
      <div class="ms-field">
        <label for="editAuthor">Author <span aria-hidden="true">*</span></label>
        <input type="text" id="editAuthor" name="author" required maxlength="255">
      </div>
      <div class="ms-field">
        <label for="editGenre">Genre</label>
        <select id="editGenre" name="genre">
          <option value="">— Select genre —</option>
          <option>Classic</option><option>Romance</option><option>Sci-Fi</option>
          <option>Dystopia</option><option>Adventure</option><option>Fantasy</option>
          <option>Mystery</option><option>Non-Fiction</option>
          <option>Historical Fiction</option><option>Other</option>
        </select>
      </div>
      <div class="ms-field">
        <label for="editDesc">Short Description</label>
        <textarea id="editDesc" name="description" rows="3"></textarea>
      </div>
      <div class="ms-field">
        <label for="editPdf">Book Link (URL)</label>
        <input type="text" id="editPdf" name="pdf_url" maxlength="500">
      </div>
      <div class="ms-field">
        <label for="editCover">Update Cover Image (Optional)</label>
        <input type="file" id="editCover" name="cover_image" accept="image/*">
        <small style="color:#666; font-size:12px; margin-top:4px; display:block;">Leave blank to keep existing cover</small>
      </div>
      <button type="submit" class="ms-submit-btn" id="editFormBtn">Save Changes</button>
    </form>
  </div>

  <!-- ═══ MAIN ══════════════════════════════════════════════════════════════ -->
  <main class="ms-main">

    <!-- ── WELCOME BANNER ─────────────────────────────────────────────────── -->
    <div class="ms-welcome">
      <div class="ms-welcome__inner">

        <!-- Left: Avatar + greeting text -->
        <div class="ms-welcome__left">
          <div class="ms-avatar" aria-hidden="true"><?= $initials ?></div>
          <div class="ms-welcome__text">
            <p class="ms-welcome__sup">Welcome back</p>
            <h1 class="ms-welcome__name"><?= $username ?></h1>
            <p class="ms-welcome__sub">Your reading journey continues. What will you discover today?</p>
          </div>
        </div>

        <!-- Right: Quick stats -->
        <div class="ms-welcome__stats">
          <div class="ms-wstat">
            <span class="ms-wstat__num"><?= $totalBooks ?></span>
            <span class="ms-wstat__lbl">Books<br>in Library</span>
          </div>
          <div class="ms-wstat__sep"></div>
          <div class="ms-wstat">
            <span class="ms-wstat__num"><?= $myCount ?></span>
            <span class="ms-wstat__lbl">Your<br>Submissions</span>
          </div>
          <div class="ms-wstat__sep"></div>
          <div class="ms-wstat">
            <span class="ms-wstat__num">∞</span>
            <span class="ms-wstat__lbl">Adventures<br>Awaiting</span>
          </div>
        </div>

      </div>
    </div>

    <?php if ($flash): ?>
    <div class="ms-page-flash"><?= $flash ?></div>
    <?php endif; ?>

    <!-- ── FEATURED BOOK (same .frame .grid as index.php) ─────────────────── -->
    <section class="frame ms-featured-frame">
      <div class="grid">
        <article class="feature">
          <div class="covers">
            <img class="cover cover-1" src="img/image (1).png" alt="To Kill a Mockingbird">
          </div>
          <div class="details">
            <span class="ms-badge">Editor's Pick</span>
            <h2 class="author">Harper Lee</h2>
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
            Reading isn't just turning pages—it's slipping between worlds. A book can take you
            farther than any plane ticket, into lives you've never lived. All you need is a quiet
            corner and an open mind.
          </p>
        </aside>
      </div>
    </section>

    <!-- ── BOOK COLLECTION ────────────────────────────────────────────────── -->
    <section class="ms-collection" id="books">
      <div class="ms-collection__hdr">
        <h2 class="ms-collection__title">Browse Collection</h2>
        <input type="search" id="bookSearch" placeholder="Search title or author…" class="ms-search">
      </div>

      <div class="ms-grid" id="bookGrid">
        <?php if (empty($books)): ?>
          <p class="ms-empty">No books yet — be the first to submit one!</p>
        <?php else: ?>
          <?php foreach ($books as $b): ?>
          <article class="ms-card"
            data-title="<?= htmlspecialchars(strtolower($b['title'])) ?>"
            data-author="<?= htmlspecialchars(strtolower($b['author'])) ?>">
            <div class="ms-card__spine" style="background:<?= htmlspecialchars($b['cover_color']) ?>">
              <?php if (!empty($b['cover_image'])): ?>
                <img src="<?= htmlspecialchars($b['cover_image']) ?>" alt="Cover" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">
              <?php else: ?>
                <span class="ms-card__initials"><?= mb_strtoupper(mb_substr($b['title'], 0, 2)) ?></span>
              <?php endif; ?>
            </div>
            <div class="ms-card__body">
              <span class="ms-card__genre"><?= htmlspecialchars($b['genre'] ?: 'General') ?></span>
              <h3 class="ms-card__title"><?= htmlspecialchars($b['title']) ?></h3>
              <p  class="ms-card__author"><?= htmlspecialchars($b['author']) ?></p>
              <?php if ($b['description']): ?>
              <p class="ms-card__desc"><?= htmlspecialchars(mb_substr($b['description'], 0, 90)) ?><?= mb_strlen($b['description']) > 90 ? '…' : '' ?></p>
              <?php endif; ?>
            </div>
            <div class="ms-card__foot" style="display:flex; justify-content:space-between; align-items:center;">
              <?php 
                $linkUrl = $b['pdf_url'];
                // Check if it's an Archive.org URN and convert it to a web URL
                if ($linkUrl && strpos($linkUrl, 'urn:lcp:') === 0) {
                    $parts = explode(':', $linkUrl);
                    if (isset($parts[2])) {
                        $linkUrl = 'https://archive.org/details/' . $parts[2] . '/mode/2up';
                    }
                }
              ?>
              <?php if ($linkUrl): ?>
              <a href="<?= htmlspecialchars($linkUrl) ?>" target="_blank" rel="noopener" class="ms-card__read">Read →</a>
              <?php else: ?>
              <span class="ms-card__nopdf">No link yet</span>
              <?php endif; ?>

              <button class="ms-card__edit-btn" 
                data-id="<?= htmlspecialchars($b['id']) ?>"
                data-title="<?= htmlspecialchars($b['title']) ?>"
                data-author="<?= htmlspecialchars($b['author']) ?>"
                data-genre="<?= htmlspecialchars($b['genre'] ?? '') ?>"
                data-desc="<?= htmlspecialchars($b['description'] ?? '') ?>"
                data-pdf="<?= htmlspecialchars($b['pdf_url'] ?? '') ?>"
                style="background:none; border:none; color:#7f9aa2; cursor:pointer; font-weight:600; text-decoration:underline; font-size:14px; padding:0;">Edit</button>
            </div>
          </article>
          <?php endforeach; ?>
        <?php endif; ?>
      </div>
    </section>

  </main>

  <!-- ═══ FOOTER ═══════════════════════════════════════════════════════════ -->
  <footer class="footer-sec">
    <div class="footer-text">
      <p>&copy; 2025 ArkLib. All rights reserved. Group 4</p>
      <p class="tagline">Turn Pages, Turn Minds.</p>
    </div>
  </footer>

  <script>
  // Modal helpers
  const overlay = document.getElementById('msOverlay');

  function openModal(id) {
    document.getElementById(id).classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('body-locked');
  }
  function closeAll() {
    document.querySelectorAll('.ms-modal.is-open').forEach(m => m.classList.remove('is-open'));
    overlay.classList.remove('is-open');
    document.body.classList.remove('body-locked');
  }

  document.getElementById('logoutBtn').addEventListener('click',  () => openModal('logoutModal'));
  document.getElementById('submitBtn').addEventListener('click',  () => openModal('submitModal'));
  document.getElementById('cancelLogout').addEventListener('click', closeAll);
  document.getElementById('closeSubmit').addEventListener('click', closeAll);
  document.getElementById('closeEdit').addEventListener('click', closeAll);
  overlay.addEventListener('click', closeAll);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  // Submit book via AJAX
  const submitForm = document.getElementById('submitForm');
  const submitMsg  = document.getElementById('submitMsg');
  const submitBtn  = document.getElementById('submitFormBtn');

  submitForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';
    submitMsg.style.display = 'none';
    submitMsg.className = 'ms-flash';

    try {
      const res  = await fetch('submit_book.php', { method: 'POST', body: new FormData(submitForm) });
      const data = await res.json();
      submitMsg.textContent = data.message;
      submitMsg.classList.add(data.success ? 'ms-flash--ok' : 'ms-flash--err');
      submitMsg.style.display = 'block';
      if (data.success) { 
        submitForm.reset(); 
        // Instantly update the DOM counters before the page reloads
        const counters = document.querySelectorAll('.ms-wstat__num');
        if (counters.length >= 2) {
          counters[0].textContent = parseInt(counters[0].textContent || 0) + 1;
          counters[1].textContent = parseInt(counters[1].textContent || 0) + 1;
        }
        setTimeout(() => location.reload(), 1800); 
      }
    } catch {
      submitMsg.textContent = 'Network error. Please try again.';
      submitMsg.classList.add('ms-flash--err');
      submitMsg.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Book';
    }
  });

  // Edit Form Logic
  document.querySelectorAll('.ms-card__edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('editId').value     = btn.dataset.id;
      document.getElementById('editTitle').value  = btn.dataset.title;
      document.getElementById('editAuthor').value = btn.dataset.author;
      document.getElementById('editGenre').value  = btn.dataset.genre;
      document.getElementById('editDesc').value   = btn.dataset.desc;
      document.getElementById('editPdf').value    = btn.dataset.pdf;
      document.getElementById('editCover').value  = '';
      document.getElementById('editMsg').style.display = 'none';
      openModal('editModal');
    });
  });

  const editForm = document.getElementById('editForm');
  const editMsg  = document.getElementById('editMsg');
  const editBtn  = document.getElementById('editFormBtn');

  editForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    editBtn.disabled = true;
    editBtn.textContent = 'Saving…';
    editMsg.style.display = 'none';
    editMsg.className = 'ms-flash';

    try {
      const res  = await fetch('update_book.php', { method: 'POST', body: new FormData(editForm) });
      const data = await res.json();
      editMsg.textContent = data.message;
      editMsg.classList.add(data.success ? 'ms-flash--ok' : 'ms-flash--err');
      editMsg.style.display = 'block';
      if (data.success) { 
        setTimeout(() => location.reload(), 1500); 
      }
    } catch {
      editMsg.textContent = 'Network error. Please try again.';
      editMsg.classList.add('ms-flash--err');
      editMsg.style.display = 'block';
    } finally {
      editBtn.disabled = false;
      editBtn.textContent = 'Save Changes';
    }
  });

  // Live search
  document.getElementById('bookSearch').addEventListener('input', function () {
    const q = this.value.toLowerCase();
    document.querySelectorAll('.ms-card').forEach(c => {
      c.style.display = (!q || c.dataset.title.includes(q) || c.dataset.author.includes(q)) ? '' : 'none';
    });
  });
  </script>

</body>
</html>