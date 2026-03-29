// lib/notify.js
export async function sendNotification({ userIds, title, body }) {
  try {
    await fetch('/route/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds, title, body }),
    });
  } catch (err) {
    console.error('sendNotification failed:', err);
  }
}