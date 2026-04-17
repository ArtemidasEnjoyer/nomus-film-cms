import { useState } from 'preact/hooks';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { lang, t, toggleLang } = useLanguage();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: t.home, href: '/' },
    { name: t.about, href: '/about' },
    { name: t.portfolio, href: '/portfolio' },
    { name: t.articles, href: '/articles' },
    { name: t.contact, href: '/contact' },
  ];

  // Dynamically add Admin link if authenticated
  if (isAuthenticated.value) {
    navLinks.push({ name: t.admin, href: '/admin' });
  }

  return (
    <nav class="fixed top-0 w-full z-50 bg-[var(--bg-primary)] border-b border-brown/20 h-20 flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div class="flex justify-between items-center">
          <div class="flex-shrink-0 flex items-center gap-3">
            <a href="https://www.instagram.com/nomusfilm/" target="_blank" class="block transition-transform duration-300 hover:scale-110 hover:rotate-6 active:scale-95 hover:shadow-[0_0_15px_rgba(181,224,167,0.5)] rounded-full">
              <img src="/assets/logo.jpg" alt="Logo" class="w-10 h-10 rounded-full object-cover border border-pastelGreen" />
            </a>
            <a href="/" class="group font-bold text-2xl font-serif tracking-tighter transition-colors duration-500 hover:text-pastelGreen cursor-pointer">
              Nomus<span class="text-pastelGreen transition-colors duration-500 group-hover:text-[var(--text-primary)]">Film</span>
            </a>
          </div>

          <div class="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a href={link.href} class="text-sm font-bold tracking-widest uppercase transition-all duration-300 text-[var(--text-primary)] hover:text-pastelGreen hover:scale-110 hover:-translate-y-0.5 hover:drop-shadow-[0_4px_6px_rgba(181,224,167,0.3)] inline-block">
                {link.name}
              </a>
            ))}
            
            <div class="flex items-center gap-4 border-l border-brown/20 pl-8">
              <button onClick={toggleLang} class="relative flex items-center justify-center text-xs font-black w-8 h-8 rounded-full border border-brown/10 uppercase text-[var(--text-primary)] transition-all duration-300 hover:scale-110 hover:bg-pastelGreen hover:text-gray-900 hover:border-pastelGreen hover:shadow-[0_0_15px_rgba(181,224,167,0.5)] active:scale-95 group overflow-hidden">
                <span class="absolute inset-0 bg-pastelGreen/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full"></span>
                <span class="relative z-10">{lang.value}</span>
              </button>
              <button onClick={toggleTheme} class="p-2 text-[var(--text-primary)] text-xl transition-all duration-500 hover:rotate-[360deg] hover:scale-125 hover:drop-shadow-[0_0_10px_rgba(181,224,167,0.5)]">
                {theme.value === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </div>

          <div class="md:hidden flex items-center gap-4">
            <button onClick={toggleLang} class="relative flex items-center justify-center text-xs font-black w-8 h-8 rounded-full border border-brown/10 uppercase text-[var(--text-primary)] transition-all duration-300 hover:scale-110 hover:bg-pastelGreen hover:text-gray-900 active:scale-95 group overflow-hidden">
              <span class="absolute inset-0 bg-pastelGreen/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full"></span>
              <span class="relative z-10">{lang.value}</span>
            </button>
            <button onClick={toggleTheme} class="p-2 text-[var(--text-primary)] text-xl transition-all duration-500 hover:rotate-[360deg] hover:scale-125">
              {theme.value === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} class="p-2 text-[var(--text-primary)] transition-transform hover:scale-110">
              <div class="space-y-1.5">
                <span class={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span class={`block w-6 h-0.5 bg-current transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
                <span class={`block w-6 h-0.5 bg-current transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div class={`md:hidden absolute top-20 left-0 w-full transition-all duration-300 overflow-hidden bg-[var(--bg-primary)] ${isOpen ? 'max-h-96 border-b border-brown/10 shadow-xl' : 'max-h-0'}`}>
        <div class="px-6 py-8 space-y-6">
          {navLinks.map((link) => (
            <a href={link.href} class="block text-xl font-bold font-serif" onClick={() => setIsOpen(false)}>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
