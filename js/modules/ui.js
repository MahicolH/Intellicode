// js/modules/ui.js
import { showLoginModal, showRegisterModal, hideAllModals } from './modals.js';
import { onLogin, onRegister, logout } from './auth.js';
import { toggleTheme } from './theme.js';
import { getCurrentUser } from './storage.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

export function initUI() {
  // Tema
  $('#btnTheme')?.addEventListener('click', toggleTheme);

  // Header
  $('#openLogin')?.addEventListener('click', showLoginModal);
  $('#openRegister')?.addEventListener('click', showRegisterModal);
  $('#ctaRegister')?.addEventListener('click', showRegisterModal);

  // Cerrar modales
  $('#closeLogin')?.addEventListener('click', hideAllModals);
  $('#closeRegister')?.addEventListener('click', hideAllModals);

  // Toggle entre modales
  $$('.toggleModal').forEach(btn => {
    btn.addEventListener('click', () => {
      hideAllModals();
      if (btn.dataset.show === 'modalLogin') showLoginModal();
      if (btn.dataset.show === 'modalRegister') showRegisterModal();
    });
  });

  // Formularios
  $('#loginForm')?.addEventListener('submit', onLogin);
  $('#registerForm')?.addEventListener('submit', onRegister);

  // Logout
  $$('#logoutBtn, #logoutBtn2, #logoutBtn3, #headerLogout').forEach(btn => {
    btn?.addEventListener('click', logout);
  });

  // Usuario actual
  const user = getCurrentUser();
  if (user) {
    updateHeader(user);
  } else {
    showLoginModal();
  }
}

export function updateHeader(user) {
  if (user) {
    $('#openLogin')?.classList.add('hidden');
    $('#openRegister')?.classList.add('hidden');
    $('#headerUser')?.classList.remove('hidden');
    $('#headerName').textContent = user.name || user.email.split('@')[0];
    if (user.profile?.photo) {
      $('#headerAvatar').src = user.profile.photo;
      $('#headerAvatar').classList.remove('hidden');
    }
  } else {
    $('#openLogin')?.classList.remove('hidden');
    $('#openRegister')?.classList.remove('hidden');
    $('#headerUser')?.classList.add('hidden');
  }
}