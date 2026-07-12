export const API_ROOT = import.meta.env.VITE_API_ROOT || 'http://localhost:3000';
export const API_MESSAGES = `${API_ROOT}/api/messages`;
export const API_CONVERSATIONS = `${API_ROOT}/api/conversations`;
export const API_CAMPAIGN = `${API_ROOT}/api/campaign`;
export const API_BILLING = `${API_ROOT}/api/billing`;
export const API_AUTH = `${API_ROOT}/api/auth`;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_ROOT;
