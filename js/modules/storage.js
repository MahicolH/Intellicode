const LS = {
  users: 'ic_users',
  projects: 'ic_projects',
  current: 'ic_current',
  theme: 'ic_theme'
};

export function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch (e) { return []; }
}

export function write(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function getCurrentUser() {
  const id = localStorage.getItem(LS.current);
  if (!id) return null;
  const users = read(LS.users);
  return users.find(u => u.id === id) || null;
}

export function saveUser(user) {
  const users = read(LS.users);
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  write(LS.users, users);
}

export { LS };