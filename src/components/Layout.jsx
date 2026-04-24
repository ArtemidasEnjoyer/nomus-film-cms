import { Navbar } from './Navbar';
import { BackToTop } from './BackToTop';
import { Partners } from './Partners';
import { useLanguage } from '../hooks/useLanguage';

export function Layout({ children }) {
  const { t } = useLanguage();
  const isInternalPage = window.location.pathname.startsWith('/admin');

  return (
    <div class="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Navbar />
      <main class="pt-16">
        {children}
      </main>
      
      {!isInternalPage && <Partners />}
      
      <BackToTop />
      <footer class="mt-20 py-16 border-t border-brown/10 text-center space-y-4 text-[var(--text-secondary)]">
        <div class="flex flex-col items-center space-y-2">
          <a href="https://www.instagram.com/nomusfilm/" target="_blank" class="text-2xl hover:text-pastelGreen transition-colors font-bold tracking-tighter">@nomusfilm</a>
          <p class="text-xs uppercase tracking-widest opacity-60 italic">{t.footerLocation}</p>
        </div>
        <p class="pt-8 opacity-40 text-[10px]">&copy; {new Date().getFullYear()} NomusFilm. {t.builtWith}</p>
      </footer>
    </div>
  );
}
