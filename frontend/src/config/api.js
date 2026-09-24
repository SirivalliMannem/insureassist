const env = import.meta.env;

export const API = {
  auth: env.VITE_AUTH_SERVICE_URL || 'http://127.0.0.1:8001',
  customer: env.VITE_CUSTOMER_SERVICE_URL || 'http://127.0.0.1:8002',
  agent: env.VITE_AGENT_SERVICE_URL || 'http://127.0.0.1:8003',
  underwriter: env.VITE_UNDERWRITER_SERVICE_URL || 'http://127.0.0.1:8004',
  admin: env.VITE_ADMIN_SERVICE_URL || 'http://127.0.0.1:8005',
  ai: env.VITE_AI_SERVICE_URL || 'http://127.0.0.1:8006',
};
