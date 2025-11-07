import App from './pages/app';
import '../styles/styles.css';
import { getActiveRoute } from './routes/url-parser';

// Helper: update nav (Login -> Logout)
function updateNav() {
  const navList = document.querySelector('.nav-list');
  if (!navList) return;

  // Try find existing login li by class
  let loginLi = navList.querySelector('li.login-li');
  if (!loginLi) {
    // find the login link in the list (fallback) and mark it
    const existingLogin = navList.querySelector('a[href="#/login"]');
    if (existingLogin) {
      const parent = existingLogin.closest('li');
      if (parent) {
        parent.classList.add('login-li');
        loginLi = parent;
      }
    }
  }

  if (!loginLi) {
    // if still not found, create one at end
    loginLi = document.createElement('li');
    loginLi.classList.add('login-li');
    navList.appendChild(loginLi);
  }

  const token = localStorage.getItem('token');
  if (token) {
    loginLi.innerHTML = `<a href="#/logout" id="logout-link">Logout ${localStorage.getItem('name') ? '(' + localStorage.getItem('name') + ')' : ''}</a>`;
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        window.dispatchEvent(new CustomEvent('auth:changed', { detail: { loggedIn: false } }));
        // go to login page after logout
        window.location.hash = '#/login';
      });
    }
  } else {
    loginLi.innerHTML = `<a href="#/login">Login</a>`;
  }
}

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App({
    navigationDrawer: document.getElementById('navigation-drawer'),
    drawerButton: document.getElementById('drawer-button'),
    content: document.getElementById('main-content'),
  });

  // Initial nav update (before first render)
  updateNav();

  // initial render
  app.renderPage();

  // handle hash change with optional startViewTransition
  window.addEventListener('hashchange', async () => {
    const main = document.getElementById('main-content');
    if (document.startViewTransition) {
      // Prefer view transition when available; App.renderPage handles rendering
      await app.renderPage();
    } else {
      // fallback UI fade
      main.classList.add('fade-out');
      setTimeout(async () => {
        await app.renderPage();
        main.classList.remove('fade-out');
        main.classList.add('fade-in');
        setTimeout(() => main.classList.remove('fade-in'), 400);
      }, 200);
    }
  });

  // update nav when auth state changes (login/logout)
  window.addEventListener('auth:changed', () => {
    updateNav();
  });

  // ... kode Anda yang lain

  // ...
  window.addEventListener('hashchange', async () => {
    const main = document.getElementById('main-content');
    if (document.startViewTransition) {
      // ✅ GUNAKAN VIEW TRANSITION API
      document.startViewTransition(async () => {
        await app.renderPage();
      });
    } else {
      // 💡 Fallback Manual (Pastikan 500ms)
      main.classList.add('fade-out');
      setTimeout(async () => {
        await app.renderPage();
        main.classList.remove('fade-out');
        main.classList.add('fade-in');
        setTimeout(() => main.classList.remove('fade-in'), 500);
      }, 500); 
    }
  });
// ...
  // accessibility: support keyboard open/close drawer
  const drawerBtn = document.getElementById('drawer-button');
  if (drawerBtn) {
    drawerBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        drawerBtn.click();
      }
    });
  }
}); // 💡 Penutup DOMContentLoaded

// index.js (entry)
if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('✅ SW terdaftar:', reg))
      .catch(err => console.error('❌ SW gagal register:', err));
  } else {
    // development: unregister any existing service workers to avoid reload loops
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(reg => {
        reg.unregister();
      });
    }).catch(() => {});
  }
}

