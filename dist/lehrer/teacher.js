const login = document.querySelector('#login');
const materials = document.querySelector('#materials');
const password = document.querySelector('#password');
const error = document.querySelector('#error');
// A navigation gate on a public static site, not authentication for private data.
document.querySelector('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  try {
    const bytes = new TextEncoder().encode(password.value);
    const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2, '0')).join('');
    if (digest !== 'bd778891dbe86ede8cdb26c8d9c48419d7e5a8797cf1599cf58ee3087f514c7a') {
      error.textContent = 'Das Passwort stimmt nicht. Bitte versuche es erneut.';
      password.setAttribute('aria-invalid', 'true');
      password.select();
      return;
    }
    error.textContent = '';
    password.removeAttribute('aria-invalid');
    password.value = '';
    login.hidden = true;
    materials.hidden = false;
    document.querySelector('#materials-title').focus();
  } catch {
    error.textContent = 'Die Passwortabfrage konnte nicht gestartet werden. Bitte öffne die Seite über HTTPS in einem aktuellen Browser.';
  }
});
document.querySelector('#logout').addEventListener('click', () => {
  materials.hidden = true;
  login.hidden = false;
  password.value = '';
  password.focus();
});
