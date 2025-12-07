const root = document.documentElement;

export function initTheme() {
  const theme = localStorage.getItem('ic_theme') || 'light';
  if (theme === 'dark') root.classList.add('dark');
}

export function toggleTheme() {
  root.classList.toggle('dark');
  localStorage.setItem('ic_theme', root.classList.contains('dark') ? 'dark' : 'light');
}