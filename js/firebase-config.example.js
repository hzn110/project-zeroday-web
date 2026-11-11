// PROJECT: ZERO-DAY — Firebase connection template.
// Copy these public project identifiers into js/firebase-config.js after creating a Firebase project.
// Do not put a Firebase Admin SDK private key or service-account JSON in this repository.
window.PZD_FIREBASE_CONFIG = {
  apiKey: "PASTE_FIREBASE_WEB_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_DATABASE_HOST.firebasedatabase.app",
  projectId: "YOUR_PROJECT_ID",
  appId: "PASTE_FIREBASE_WEB_APP_ID"
};
// Firebase console: Authentication > Sign-in method > Anonymous and Email/Password.
// IMPORTANT: The existing in-game developer password is NOT a cloud authorization mechanism.
// Cloud admin actions must require Firebase Auth + database security rules.
