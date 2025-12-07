// js/app.js
import { initTheme, toggleTheme } from './modules/theme.js';
import { showLoginModal, showRegisterModal, hideAllModals } from './modules/modals.js';
import { onRegister, onLogin, logout } from './modules/auth.js';
import { getCurrentUser } from './modules/storage.js';
import { updateSellerDashboard } from './modules/seller.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ====== HEADER: Ocultar/mostrar botones correctamente ======
export function updateHeaderForAuth(user) {
  const openLogin = $('#openLogin');
  const openRegister = $('#openRegister');
  const headerUser = $('#headerUser');

  if (user) {
    openLogin?.classList.add('hidden');
    openRegister?.classList.add('hidden');
    headerUser?.classList.remove('hidden');
    $('#headerName').textContent = user.name || user.email.split('@')[0];
    
    if (user.profile?.photo) {
      $('#headerAvatar').src = user.profile.photo;
      $('#headerAvatar').classList.remove('hidden');
    }
  } else {
    openLogin?.classList.remove('hidden');
    openRegister?.classList.remove('hidden');
    headerUser?.classList.add('hidden');
  }
}

// ====== MOSTRAR PANEL CORRECTO ======
window.bootstrapForUser = function(user) {
  const hero = $('#hero');
  const features = $('#features');

  if (user) {
    hero?.classList.add('hidden');
    features?.classList.add('hidden');

    $('#userView')?.classList.add('hidden');
    $('#sellerView')?.classList.add('hidden');
    $('#adminView')?.classList.add('hidden');

    if (user.role === 'seller') {
      $('#sellerView')?.classList.remove('hidden');
      updateSellerDashboard?.(user);
    } else if (user.role === 'admin') {
      $('#adminView')?.classList.remove('hidden');
    } else {
      $('#userView')?.classList.remove('hidden');
    }
  } else {
    hero?.classList.remove('hidden');
    features?.classList.remove('hidden');
    $('#userView')?.classList.add('hidden');
    $('#sellerView')?.classList.add('hidden');
    $('#adminView')?.classList.add('hidden');
  }

  updateHeaderForAuth(user);
};

// ====== INICIALIZACIÓN ======
async function loadComponentsAndInit() {
  const elements = document.querySelectorAll('[data-include]');
  
  for (const el of elements) {
    const url = el.dataset.include;
    if (!url.includes('user-panel') && !url.includes('admin-panel')) {
      try {
        const res = await fetch(url);
        const html = await res.text();
        el.outerHTML = html;
      } catch (err) {
        console.error('Error cargando:', url);
      }
    }
  }

  initTheme();

  $('#btnTheme')?.addEventListener('click', toggleTheme);
  $('#openLogin')?.addEventListener('click', showLoginModal);
  $('#openRegister')?.addEventListener('click', showRegisterModal);
  $('#ctaRegister')?.addEventListener('click', showRegisterModal);

  $('#closeLogin')?.addEventListener('click', hideAllModals);
  $('#closeRegister')?.addEventListener('click', hideAllModals);

  $$('.toggleModal').forEach(btn => {
    btn.addEventListener('click', () => {
      hideAllModals();
      if (btn.dataset.show === 'modalLogin') showLoginModal();
      if (btn.dataset.show === 'modalRegister') showRegisterModal();
    });
  });

  $('#loginForm')?.addEventListener('submit', onLogin);
  $('#registerForm')?.addEventListener('submit', onRegister);

  $$('#logoutBtn, #logoutBtn2, #logoutBtn3, #headerLogout').forEach(btn => {
    btn?.addEventListener('click', () => {
      localStorage.removeItem('ic_current');
      bootstrapForUser(null);
      showLoginModal();
    });
  });

  // ====== CARGAR SESIÓN ======
  const user = getCurrentUser();
  bootstrapForUser(user);
  if (!user) showLoginModal();
}

loadComponentsAndInit();