import { signal, effect } from '@preact/signals';

const getInitialTheme = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch (e) {
    return 'light';
  }
};

const theme = signal(getInitialTheme());

// Effect to apply theme class to <html>
effect(() => {
  try {
    const root = typeof window !== 'undefined' ? window.document.documentElement : null;
    if (root) {
      if (theme.value === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      localStorage.setItem('theme', theme.value);
    }
  } catch (e) {
    console.error('Theme effect failed', e);
  }
});

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  return { theme, toggleTheme };
}
