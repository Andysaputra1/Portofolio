// utils/scrollLock.ts
let locks = 0;

function apply() {
  document.documentElement.classList.add('modal-open');
  document.body.classList.add('modal-open');
}
function remove() {
  document.documentElement.classList.remove('modal-open');
  document.body.classList.remove('modal-open');
}

export function lockScroll() {
  locks += 1;
  if (locks === 1) apply();
}

export function unlockScroll() {
  locks = Math.max(locks - 1, 0);
  if (locks === 0) remove();
}

export function forceUnlockScroll() {
  locks = 0;
  remove();
}
