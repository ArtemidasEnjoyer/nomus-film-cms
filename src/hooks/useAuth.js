import { signal, effect } from '@preact/signals';

const isAuthenticated = signal(localStorage.getItem('admin_token') !== null);
const isSetup = signal(localStorage.getItem('admin_setup') === 'true');
const authStatus = signal(null);

export const refreshAuthStatus = async () => {
  try {
    const res = await fetch(`/api/auth/status?t=${Date.now()}`);
    const data = await res.json();
    isSetup.value = data.setup;
    localStorage.setItem('admin_setup', data.setup);
  } catch (e) {
    console.error('Failed to check auth status', e);
  }
};

export function useAuth() {
  const login = async (password, username = '') => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        isAuthenticated.value = true;
        isSetup.value = data.setup;
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const setupCredentials = async (username, password) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/auth/setup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_setup', 'true');
        isSetup.value = true;
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    isAuthenticated.value = false;
  };

  return { isAuthenticated, isSetup, login, logout, setupCredentials };
}
