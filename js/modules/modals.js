const $ = (s) => document.querySelector(s);

export function show(el) { if (el) el.classList.remove('hidden'); }
export function hide(el) { if (el) el.classList.add('hidden'); }

export function showLoginModal() {
  show($('#modalLogin'));
  hide($('#modalRegister'));
  hide($('#userView'));
  hide($('#adminView'));
  hide($('#sellerView'));
}

export function showRegisterModal() {
  hide($('#modalLogin'));
  show($('#modalRegister'));
}

export function hideAllModals() {
  hide($('#modalLogin'));
  hide($('#modalRegister'));
}