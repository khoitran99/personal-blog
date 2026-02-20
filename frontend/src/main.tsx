import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App.tsx';

Sentry.init({
  dsn: 'https://18d911de731791874e58b19ff2f75f45@o4510917408129024.ingest.us.sentry.io/4510917410422784',
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  sendDefaultPii: true, // Collects IP addresses and other default PII

  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions (adjust in production if volume is high)

  // Session Replay
  replaysSessionSampleRate: 0.1, // Sample 10% of standard sessions
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions where errors occur
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
