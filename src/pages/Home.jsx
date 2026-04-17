import { useEffect, useRef, useState } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';
import { useArticles } from '../hooks/useArticles';

export function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const observerRef = useRef(null);
  const { t } = useLanguage();
  const { articles } = useArticles();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      clearTimeout(timer);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  // Filter top 3 recent
  const recentNews = articles.value.slice(0, 3);

  return (
    <div class="space-y-32 pb-20">
      <section class="relative h-screen flex items-center justify-center overflow-hidden bg-black">
        <div 
          class={`absolute inset-0 z-0 bg-cover bg-center bg-fixed transition-opacity duration-[2000ms] ease-out ${isLoaded ? 'opacity-60' : 'opacity-0'}`}
          style={{ backgroundImage: 'url("/assets/portfolio/NomusPortfolio-024.jpg")' }}
        ></div>
        
        <div class="relative z-10 text-center text-white px-4 space-y-6">
          <p class={`font-calligraphy text-3xl md:text-5xl text-pastelGreen transition-all duration-1000 delay-500 transform ${isLoaded ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {t.heroTagline}
          </p>
          <h1 class={`text-7xl md:text-[10rem] font-black tracking-tighter font-serif leading-none transition-all duration-1000 delay-700 transform ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {t.heroTitle}<span class="text-pastelGreen">{t.heroSubtitle}</span>
          </h1>
          <p class={`text-lg md:text-xl max-w-xl mx-auto text-white font-light leading-relaxed transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            {t.heroDesc}
          </p>
          <div class={`pt-12 transition-all duration-1000 delay-[1200ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button class="group relative px-12 py-4 bg-transparent text-white font-bold rounded-full overflow-hidden border border-white/20 transition-all hover:border-pastelGreen">
              <span class="relative z-10 transition-colors group-hover:text-gray-900">{t.discover}</span>
              <div class="absolute inset-0 bg-pastelGreen translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
          </div>
        </div>
      </section>

      {recentNews.length > 0 && (
        <section class="max-w-7xl mx-auto px-4 py-20 space-y-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
          <div class="flex justify-between items-end border-b border-brown/10 pb-8">
            <div>
              <p class="font-calligraphy text-2xl text-pastelGreen">{t.recentNews}</p>
              <h2 class="text-5xl font-black font-serif tracking-tighter">{t.newsTitle}</h2>
            </div>
            <a href="/articles" class="text-sm font-bold uppercase tracking-widest hover:text-pastelGreen transition-colors pb-2">
              {t.viewAll} →
            </a>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
            {recentNews.map((article) => (
              <a href={`/articles/${article.id}`} class="group block space-y-4">
                <div class="aspect-[16/9] overflow-hidden rounded-2xl border border-brown/5 shadow-md">
                  <img src={article.image} class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                </div>
                <div class="space-y-2">
                  <span class="text-[10px] font-black uppercase tracking-widest text-pastelGreen">{article.category}</span>
                  <h3 class="text-xl font-bold font-serif leading-tight group-hover:text-pastelGreen transition-colors line-clamp-2">{article.title}</h3>
                  <p class="text-sm text-[var(--text-secondary)] line-clamp-2">{article.excerpt}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      <section class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[1, 2, 3].map((i) => (
            <div class="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 flex flex-col items-center text-center group" style={{ transitionDelay: `${i * 200}ms` }}>
              <div class="w-full aspect-[3/4] overflow-hidden rounded-[2.5rem] mb-8 border border-brown/10 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img src={`/assets/portfolio/NomusPortfolio-00${i * 2 + 1}.jpg`} class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out" />
              </div>
              <h3 class="text-4xl font-serif mb-4">{t.visionLabel} {i}</h3>
              <p class="text-[var(--text-secondary)] font-light max-w-[250px]">{t.visionDesc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
