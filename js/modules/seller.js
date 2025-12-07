import { getCurrentUser, saveUser, read } from './storage.js';
import { updateHeaderForAuth } from '../app.js';

export function updateSellerDashboard(user) {
  if (!user) return;

  $('#sellerNameDisplay').textContent = user.name || 'Sin nombre';
  $('#sellerOccupation').textContent = user.occupation || 'Sin definir';

  const photoEl = $('#sellerPhoto');
  if (user.profile?.photo) {
    photoEl.src = user.profile.photo;
    photoEl.classList.remove('hidden');
  } else {
    photoEl.src = '';
    photoEl.classList.add('hidden');
  }

  $('#sellerExperienceDisplay').textContent = user.profile?.experience || 'Sin experiencia registrada';

  const allProjects = read('ic_projects');
  const myProjects = allProjects.filter(p => p.ownerId === user.id);
  const totalEarnings = myProjects.reduce((sum, p) => sum + parseFloat(p.price || 0), 0);

  $('#sellerProjectsCount').textContent = myProjects.length;
  $('#sellerCount').textContent = myProjects.length;
  $('#sellerTotalEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
  $('#sellerEarnings').textContent = `$${totalEarnings.toFixed(2)}`;
}

export function openEditProfileModal() {
  const user = getCurrentUser();
  if (!user) return;

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `...`; // (el mismo modal que te pasé antes, lo pegas aquí completo)
  document.body.appendChild(modal);
  // ... eventos del modal (los pegas aquí también)
}