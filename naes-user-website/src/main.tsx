import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n.ts';

// Ensure DEV uses proxy by default unless explicitly overridden
if (import.meta.env.DEV) {
  const w = (globalThis as any).window;
  const ls = w?.localStorage;
  const hasLS = !!ls?.getItem?.('API_BASE_URL');
  if (w && !w.__API_BASE_URL && !hasLS) {
    w.__API_BASE_URL = '/api';
  }
}

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
