
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Failure: Root element not found.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Mounting Error:", err);
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #fff; font-family: sans-serif; text-align: center; padding: 20px;">
        <h1 style="font-weight: 900; letter-spacing: -0.05em; font-size: 2rem;">SYSTEM FAULT</h1>
        <p style="color: #666; margin-top: 10px;">The TravelCrew core failed to initialize. Check console for logs.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; background: #fff; color: #000; border: none; padding: 10px 20px; font-weight: 800; cursor: pointer; border-radius: 4px;">REBOOT SYSTEM</button>
      </div>
    `;
  }
}
