console.log('App.js cargado');

// ========== UTILIDADES BÁSICAS ==========
const $ = (s) => document.querySelector(s);

const LS = {
  users: 'ic_users',
  projects: 'ic_projects',
  current: 'ic_current',
  theme: 'ic_theme'
};

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
}

function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

function getCurrentUser() {
  const id = localStorage.getItem(LS.current);
  if (!id) return null;
  const users = read(LS.users);
  return users.find(u => u.id === id) || null;
}

function show(el) {
  if (el) {
    el.classList.remove('hidden');
    console.log('show:', el.id);
  }
}

function hide(el) {
  if (el) {
    el.classList.add('hidden');
    console.log('hide:', el.id);
  }
}

// ========== TEMA ==========
const root = document.documentElement;

function initTheme() {
  const theme = localStorage.getItem(LS.theme) || 'light';
  if (theme === 'dark') root.classList.add('dark');
}

function toggleTheme() {
  root.classList.toggle('dark');
  localStorage.setItem(LS.theme, root.classList.contains('dark') ? 'dark' : 'light');
}

// ========== MODALES ==========
function showLoginModal() {
  console.log('showLoginModal');
  show($('#modalLogin'));
  hide($('#modalRegister'));
  hide($('#userView'));
  hide($('#adminView'));
  hide($('#sellerView'));
}

function showRegisterModal() {
  console.log('showRegisterModal');
  hide($('#modalLogin'));
  show($('#modalRegister'));
  hide($('#userView'));
  hide($('#adminView'));
  hide($('#sellerView'));
}

function hideAllModals() {
  hide($('#modalLogin'));
  hide($('#modalRegister'));
}

// ========== AUTENTICACIÓN ==========
function onRegister(e) {
  e.preventDefault();
  console.log('onRegister');
  const f = new FormData(e.target);
  const name = f.get('name').trim();
  const email = f.get('email').trim().toLowerCase();
  const password = f.get('password');
  const age = f.get('age');
  const occupation = f.get('occupation');
  const role = f.get('role');
  const adminCode = f.get('adminCode').trim();

  if (!name || !email || !password) {
    alert('Completa los campos requeridos');
    return;
  }

  const users = read(LS.users);
  if (users.some(u => u.email === email)) {
    alert('Ya existe una cuenta con ese correo');
    return;
  }

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
  bootstrapForUser(user);
}

function onLogin(e) {
  e.preventDefault();
  console.log('onLogin');
  const f = new FormData(e.target);
  const email = f.get('email').trim().toLowerCase();
  const password = f.get('password');

  const users = read(LS.users);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert('Credenciales inválidas');
    return;
  }

  localStorage.setItem(LS.current, user.id);
  e.target.reset();
  hideAllModals();
  bootstrapForUser(user);
}

function logout() {
  localStorage.removeItem(LS.current);
  alert('Sesión cerrada');
  updateHeaderForAuth(null);
  showLoginModal();
}

function bootstrapForUser(user) {
  console.log('bootstrapForUser', user.role);
  if (user.role === 'admin') {
    showAdmin(user);
  } else if (user.role === 'seller') {
    showSeller(user);
  } else {
    showUser(user);
  }
  // actualizar header para estado autenticado
  try{ updateHeaderForAuth(user); }catch(e){console.warn('updateHeaderForAuth missing',e)}
}

// Actualiza el header: oculta botones de login/register y muestra nombre/avatar cuando hay sesión
function updateHeaderForAuth(user){
  const openLogin = $('#openLogin');
  const openRegister = $('#openRegister');
  const headerUser = $('#headerUser');
  const headerName = $('#headerName');
  const headerAvatar = $('#headerAvatar');
  const headerLogout = $('#headerLogout');

  if(user){
    if(openLogin) hide(openLogin);
    if(openRegister) hide(openRegister);
    if(headerUser){
      show(headerUser);
      if(headerName) headerName.textContent = user.name || user.email;
      if(user.profile && user.profile.photo && headerAvatar){ headerAvatar.src = user.profile.photo; show(headerAvatar);} else if(headerAvatar){ hide(headerAvatar); }
    }
    if(headerLogout){ headerLogout.removeEventListener('click', logout); headerLogout.addEventListener('click', logout); }
  } else {
    if(openLogin) show(openLogin);
    if(openRegister) show(openRegister);
    if(headerUser) hide(headerUser);
    if(headerAvatar) headerAvatar.src = '';
  }
}

// ========== ADMIN ==========
function showAdmin(user) {
  hide($('#sellerView'));
  hide($('#userView'));
  hide($('#hero'));
  hide($('#features'));
  show($('#adminView'));
  renderAdminProjects();
}

function onAdminUpload(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  createProjectFromForm(f, true);
  e.target.reset();
  renderAdminProjects();
  alert('Proyecto publicado');
}

function renderAdminProjects() {
  const projects = read(LS.projects);
  const node = $('#adminProjects');
  if (node) {
    node.innerHTML = '';
    projects.forEach(p => {
      const div = document.createElement('div');
      div.className = 'project-item';
      div.innerHTML = `<div><strong>${p.title}</strong><div class="muted">${p.category} • $${p.price}</div></div>`;
      node.appendChild(div);
    });
  }
}

// ========== VENDEDOR ==========
function showSeller(user) {
  hide($('#adminView'));
  hide($('#userView'));
  hide($('#hero'));
  hide($('#features'));
  show($('#sellerView'));
  const sellerName = $('#sellerName');
  if (sellerName) sellerName.textContent = user.name;
  const sellerExp = $('#sellerExp');
  if (sellerExp) sellerExp.textContent = user.profile.experience || '';
  const sellerPhoto = $('#sellerPhoto');
  if (sellerPhoto && user.profile.photo) {
    sellerPhoto.src = user.profile.photo;
    show(sellerPhoto);
  }
  renderSellerStats(user);
  renderSellerProjects(user);
}

function onSellerUpload(e) {
  e.preventDefault();
  const f = new FormData(e.target);
  const user = getCurrentUser();
  if (!user) {
    alert('Inicia sesión');
    return;
  }
  createProjectFromForm(f, false, user.id);
  e.target.reset();
  renderSellerProjects(user);
  renderSellerStats(user);
  alert('Proyecto publicado');
}

function renderSellerProjects(user) {
  const projects = read(LS.projects).filter(p => p.ownerId === user.id);
  const node = $('#userProjects');
  if (node) {
    node.innerHTML = '';
    projects.forEach(p => {
      const div = document.createElement('div');
      div.className = 'project-item';
      div.innerHTML = `<div><strong>${p.title}</strong><div class="muted">${p.category} • $${p.price}</div></div>`;
      node.appendChild(div);
    });
  }
}

function renderSellerStats(user) {
  const projects = read(LS.projects).filter(p => p.ownerId === user.id);
  const earnings = projects.reduce((s, p) => s + (parseFloat(p.price) || 0), 0);
  const earnEl = $('#sellerEarnings');
  if (earnEl) earnEl.textContent = `$${earnings.toFixed(2)}`;
  const countEl = $('#sellerCount');
  if (countEl) countEl.textContent = projects.length;
}

function onSaveSellerProfile() {
  const user = getCurrentUser();
  if (!user) return;
  const expEl = $('#sellerExperience');
  const exp = expEl ? expEl.value : '';
  const photoInput = $('#sellerPhotoInput');
  const file = photoInput && photoInput.files[0];
  
  if (file) {
    const r = new FileReader();
    r.onload = () => {
      user.profile.photo = r.result;
      user.profile.experience = exp;
      saveUser(user);
      const sellerPhoto = $('#sellerPhoto');
      if (sellerPhoto) {
        sellerPhoto.src = r.result;
        show(sellerPhoto);
      }
      alert('Perfil guardado');
    };
    r.readAsDataURL(file);
  } else {
    user.profile.experience = exp;
    saveUser(user);
    alert('Perfil guardado');
  }
}

function saveUser(user) {
  const users = read(LS.users);
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  write(LS.users, users);
}

// ========== USUARIO ==========
function showUser(user) {
  hide($('#adminView'));
  hide($('#sellerView'));
  hide($('#hero'));
  hide($('#features'));
  show($('#userView'));
  const greetEl = $('#userGreeting');
  if (greetEl) greetEl.textContent = 'Hola, bienvenido';
  renderUserProjects(user);
}

function renderUserProjects(user) {
  const projects = read(LS.projects);
  const node = $('#userProjects');
  if (node) {
    node.innerHTML = '';
    if (projects.length === 0) {
      node.innerHTML = '<div class="card">No hay proyectos publicados todavía.</div>';
      return;
    }
    projects.forEach(p => {
      const div = document.createElement('div');
      div.className = 'project-item';
      div.innerHTML = `<div><strong>${p.title}</strong><div class="muted">${p.category} • $${p.price}</div></div>`;
      node.appendChild(div);
    });
  }
}

// ========== PROYECTOS ==========
async function createProjectFromForm(form, isAdmin = false, ownerId = null) {
  const title = form.get('title');
  const category = form.get('category');
  const description = form.get('description');
  const price = form.get('price') || 0;
  const zip = form.get('zip');
  const mediaFiles = form.getAll('media');
  const media = await Promise.all(
    mediaFiles.filter(Boolean).map(file => fileToDataURL(file))
  );
  const zipData = zip && zip.size ? await fileToDataURL(zip) : null;
  
  const project = {
    id: Date.now().toString(),
    title, category, description, price,
    ownerId: ownerId || (getCurrentUser() ? getCurrentUser().id : null),
    zip: zipData, media,
    created: Date.now()
  };
  
  const projects = read(LS.projects);
  projects.push(project);
  write(LS.projects, projects);
}

function fileToDataURL(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = () => rej();
    r.readAsDataURL(file);
  });
}

// ========== INICIALIZACIÓN ==========
function init() {
  console.log('Inicializando app...');
  initTheme();
  
  // Event listeners para tema
  const btnTheme = $('#btnTheme');
  if (btnTheme) btnTheme.addEventListener('click', toggleTheme);
  
  // Event listeners para modales - Header
  const openLogin = $('#openLogin');
  if (openLogin) openLogin.addEventListener('click', (e) => { e.preventDefault(); showLoginModal(); });
  
  const openRegister = $('#openRegister');
  if (openRegister) openRegister.addEventListener('click', (e) => { e.preventDefault(); showRegisterModal(); });
  
  // Event listeners para botones dentro de modales
  const toggleModals = document.querySelectorAll('.toggleModal');
  console.log('Encontrados', toggleModals.length, 'botones toggleModal');
  toggleModals.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modalId = btn.getAttribute('data-show');
      console.log('Toggle modal:', modalId);
      
      // Ocultar todos los modales
      hide($('#modalLogin'));
      hide($('#modalRegister'));
      
      // Mostrar el modal especificado
      if (modalId === 'modalLogin') {
        showLoginModal();
      } else if (modalId === 'modalRegister') {
        showRegisterModal();
      }
    });
  });
  
  const closeLogin = $('#closeLogin');
  if (closeLogin) closeLogin.addEventListener('click', (e) => { e.preventDefault(); hide($('#modalLogin')); });
  
  const closeRegister = $('#closeRegister');
  if (closeRegister) closeRegister.addEventListener('click', (e) => { e.preventDefault(); showLoginModal(); });
  
  const ctaRegister = $('#ctaRegister');
  if (ctaRegister) ctaRegister.addEventListener('click', (e) => { e.preventDefault(); showRegisterModal(); });
  
  // Event listeners para formularios
  const registerForm = $('#registerForm');
  if (registerForm) registerForm.addEventListener('submit', onRegister);
  
  const loginForm = $('#loginForm');
  if (loginForm) loginForm.addEventListener('submit', onLogin);
  
  const adminUploadForm = $('#adminUploadForm');
  if (adminUploadForm) adminUploadForm.addEventListener('submit', onAdminUpload);
  
  const sellerUploadForm = $('#sellerUploadForm');
  if (sellerUploadForm) sellerUploadForm.addEventListener('submit', onSellerUpload);
  
  const saveSellerProfileBtn = $('#saveSellerProfile');
  if (saveSellerProfileBtn) saveSellerProfileBtn.addEventListener('click', onSaveSellerProfile);
  
  // Event listeners para logout
  const logoutBtn = $('#logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  
  const logoutBtn2 = $('#logoutBtn2');
  if (logoutBtn2) logoutBtn2.addEventListener('click', logout);
  
  const logoutBtn3 = $('#logoutBtn3');
  if (logoutBtn3) logoutBtn3.addEventListener('click', logout);
  
  // Mostrar login o panel según sesión
  const user = getCurrentUser();
  if (user) {
    console.log('Usuario encontrado:', user.name);
    bootstrapForUser(user);
  } else {
    console.log('No hay usuario, mostrando login');
    showLoginModal();
  }
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Debug
window._ic = { read, write, getCurrentUser };
