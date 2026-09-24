import { API } from '../config/api';

export function installLegacyBridge() {
  window.INSUREASSIST_API = API;

  window.__iaCall = (event, code) => {
    const element = event && (event.currentTarget || event.target);
    const rewritten = String(code).replace(/\bthis\b/g, '_this');
    const runner = new Function('event', 'window', '_this', `with (window) {\n${rewritten}\n}`);
    return runner(event, window, element);
  };
}

export function loadPortalScript() {
  if (window.__insureAssistScriptRequested) return;
  window.__insureAssistScriptRequested = true;

  const script = document.createElement('script');
  script.src = '/js/script.js';
  script.async = false;
  document.body.appendChild(script);
}
