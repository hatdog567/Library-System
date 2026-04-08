// open/close overlay
const openAuth = () => {
  document.documentElement.classList.add('auth-open');
  document.body.classList.add('body-locked');
  showTab('login'); // default
};
const closeAuth = () => {
  document.documentElement.classList.remove('auth-open');
  document.body.classList.remove('body-locked');
};

// show login or signup
function showTab(which){
  const login  = document.getElementById('loginForm');
  const signup = document.getElementById('signupForm');
  if (!login || !signup) return;

  // Which = 'login' | 'signup'
  login.classList.toggle('is-active', which === 'login');
  signup.classList.toggle('is-active', which === 'signup');

  document.querySelectorAll('.auth-tabs .tab').forEach(btn=>{
    btn.classList.toggle('is-active', btn.dataset.tab === (which === 'signup' ? 'signup' : 'login'));
  });
}

// Header buttons open the modal
document.addEventListener('click', (e) => {
  if (e.target.closest('.login-btn-modal'))  { e.preventDefault(); openAuth(); showTab('login');  }
  if (e.target.closest('.signup-btn-modal')) { e.preventDefault(); openAuth(); showTab('signup'); }
  if (e.target.closest('.auth-overlay') || e.target.closest('[data-close]')) { closeAuth(); }

  const tabBtn = e.target.closest('.auth-tabs .tab');
  if (tabBtn?.dataset.tab){ e.preventDefault(); showTab(tabBtn.dataset.tab); }
});

// ESC to close
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeAuth(); });
