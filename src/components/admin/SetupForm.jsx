import { useState } from 'preact/hooks';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';

export function SetupForm() {
  const { t } = useLanguage();
  const { setupCredentials } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  const handleSetup = async (e) => {
    e.preventDefault();
    const success = await setupCredentials(newUsername, newPassword);
    if (success) setStatus(t.success);
    else setStatus(t.error);
  };

  return (
    <div class="max-w-md mx-auto mt-32 p-10 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-brown/10 text-center space-y-8 opacity-0 animate-fade-in-scale">
      <h1 class="text-3xl font-serif font-bold text-pastelGreen">{t.accountSetup}</h1>
      <p class="text-sm opacity-60 text-[var(--text-primary)]">{t.setupDesc}</p>
      <form onSubmit={handleSetup} class="space-y-4">
        <input 
          type="text" 
          value={newUsername} 
          onInput={(e) => setNewUsername(e.target.value)} 
          class="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-brown/10 outline-none" 
          placeholder={t.chooseUser} 
          required 
        />
        <input 
          type="password" 
          value={newPassword} 
          onInput={(e) => setNewPassword(e.target.value)} 
          class="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-brown/10 outline-none" 
          placeholder={t.choosePass} 
          required 
        />
        <button class="w-full py-4 bg-gray-900 text-white rounded-2xl font-black">{t.finalizeSetup}</button>
        {status && <p class="text-red-500 text-center text-sm font-bold">{status}</p>}
      </form>
    </div>
  );
}
