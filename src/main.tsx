import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add any global polyfills that might be needed
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  window.requestIdleCallback = function(cb: any) {
    const start = Date.now();
    return setTimeout(function() {
      cb({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1) as any;
  };
}

createRoot(document.getElementById("root")!).render(<App />);
