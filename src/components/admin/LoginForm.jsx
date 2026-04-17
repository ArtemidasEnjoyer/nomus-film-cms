import { useState } from 'preact/hooks';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

export function LoginForm() {
  const { t } = useLanguage();
  const { login, isSetup } = useAuth();
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [status, setStatus] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(passwordInput, usernameInput);
    if (!success) setStatus(t.error);
    else setStatus('');
  };

  return (
    <div class="max-w-md mx-auto mt-32 p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-brown/10 text-[var(--text-primary)] opacity-0 animate-fade-in-scale">
      <h1 class="text-3xl font-bold mb-8 text-center font-serif">{t.adminAccess}</h1>
      <form onSubmit={handleLogin} class="space-y-6">
        {isSetup.value && (
          <input 
            type="text" 
            value={usernameInput} 
            onInput={(e) => setUsernameInput(e.target.value)} 
            class="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-brown/10 outline-none" 
            placeholder={t.username} 
          />
        )}
        <input 
          type="password" 
          value={passwordInput} 
          onInput={(e) => setPasswordInput(e.target.value)} 
          class="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-brown/10 outline-none" 
          placeholder={isSetup.value ? t.password : t.defaultPassword} 
        />
        <button class="w-full py-4 bg-pastelGreen text-gray-900 font-bold rounded-2xl">{t.unlock}</button>
        {!isSetup.value && <p class="text-xs text-center opacity-60">{t.initialLoginDesc}</p>}
        {status && <p class="text-red-500 text-center text-sm font-bold">{status}</p>}
      </form>
    </div>
  );
}
