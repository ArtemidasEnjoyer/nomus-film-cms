import { useState, useEffect } from 'preact/hooks';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Articles } from './pages/Articles';
import { Portfolio } from './pages/Portfolio';
import { ArticleDetail } from './pages/ArticleDetail';
import { Admin } from './pages/Admin';
import { Contact } from './pages/Contact';
import { useArticles } from './hooks/useArticles';
import { refreshAuthStatus } from './hooks/useAuth';

function InitialLoader({ onComplete }) {
  const { loading } = useArticles();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // When API finishes loading, we wait an extra second for cinematic effect, then fade out
    if (!loading.value) {
      const timer1 = setTimeout(() => setIsFading(true), 1200);
      const timer2 = setTimeout(() => onComplete(), 2000); // 800ms for fade transition
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [loading.value, onComplete]);

  return (
    <div class={`fixed inset-0 z-[9999] bg-black text-white flex flex-col items-center justify-center transition-all duration-[800ms] ease-in-out ${isFading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      <div class="relative w-32 h-32 mb-12">
        <div class="absolute inset-0 border-t-2 border-pastelGreen rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        <div class="absolute inset-2 border-r-2 border-white/40 rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        <div class="absolute inset-4 border-b-2 border-pastelGreen/40 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="font-serif text-3xl font-black tracking-tighter">N<span class="text-pastelGreen">F</span></span>
        </div>
      </div>
      <div class="space-y-6 text-center">
        <h1 class="text-2xl font-bold tracking-[0.5em] uppercase animate-fade-in-up">Nomus<span class="text-pastelGreen">Film</span></h1>
        <div class="w-48 h-px bg-white/10 mx-auto relative overflow-hidden">
          <div class="absolute top-0 left-0 h-full bg-pastelGreen animate-pulse" style={{ width: loading.value ? '30%' : '100%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        </div>
        <p class="text-[10px] font-black uppercase tracking-[0.3em] text-pastelGreen/60 animate-pulse">
          {loading.value ? 'Loading Assets...' : 'Ready'}
        </p>
      </div>
    </div>
  );
}

export function App() {
  console.log('App: Rendering component');
  const [route, setRoute] = useState(window.location.pathname);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    refreshAuthStatus();
    
    const handleLocationChange = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Intercept link clicks
    const handleLinkClick = (e) => {
      // Ignore clicks with modifier keys (let them open in new tab/window)
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      
      const link = e.target.closest('a');
      if (link && link.href && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        window.history.pushState(null, '', link.getAttribute('href'));
        handleLocationChange();
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  const renderPage = () => {
    const path = route.split('/');
    const page = path[1];
    const id = path[2];

    switch (page) {
      case '': return <Home />;
      case 'about': return <About />;
      case 'portfolio': return <Portfolio />;
      case 'articles': 
        if (id) return <ArticleDetail id={id} />;
        return <Articles />;
      case 'admin': return <Admin />;
      case 'contact': return <Contact />;
      default: return <Home />;
    }
  };

  return (
    <>
      {!appReady && <InitialLoader onComplete={() => setAppReady(true)} />}
      
      {appReady && (
        <div class="animate-fade-in-up">
          <Layout>
            {renderPage()}
          </Layout>
        </div>
      )}
    </>
  );
}
