import { read, write, getCurrentUser, saveUser, LS } from './storage.js';
import { hideAllModals, showLoginModal } from './modals.js';
import { updateHeaderForAuth } from '../app.js';

export function onRegister(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const name = f.get('name').trim();
  const email = f.get('email').trim().toLowerCase();
  const password = f.get('password');
  const age = f.get('age');
  const occupation = f.get('occupation');
  const role = f.get('role');
  const adminCode = f.get('adminCode').trim();

  if (!name || !email || !password) return alert('Completa los campos requeridos');

  const users = read(LS.users);
  if (users.some(u => u.email === email)) return alert('Ya existe una cuenta con ese correo');

  const isAdmin = role === 'admin' && adminCode === 'intellicode-admin-2025';
  const user = {
    id: Date.now().toString(),
    name, email, password, age, occupation,
    role: isAdmin ? 'admin' : role,
    created: Date.now(),
    profile: { photo: null, experience: null },
    sellerMeta: { membershipPaid: false, earnings: 0 }
  };

  users.push(user);
  write(LS.users, users);
  localStorage.setItem(LS.current, user.id);
  e.target.reset();
  hideAllModals();
  window.bootstrapForUser(user);
}

export function onLogin(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const email = f.get('email').trim().toLowerCase();
  const password = f.get('password');

  const users = read(LS.users);
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return alert('Credenciales inválidas');

  localStorage.setItem(LS.current, user.id);
  e.target.reset();
  hideAllModals();
  window.bootstrapForUser(user);
}

export function logout() {
  localStorage.removeItem(LS.current);
  alert('Sesión cerrada');
  updateHeaderForAuth(null);
  showLoginModal();
}