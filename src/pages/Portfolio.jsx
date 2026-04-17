import { useEffect, useRef } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';
import { useArticles } from '../hooks/useArticles';

export function Portfolio() {
  const { t } = useLanguage();
  const { articles, loading } = useArticles();
  const observerRef = useRef(null);

  // Filter only portfolio items
  const portfolioItems = articles.value.filter(a => a.type === 'portfolio');

  useEffect(() => {
    if (portfolioItems.length > 0) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.portfolio-animate').forEach((el) => {
        observerRef.current.observe(el);
      });

      return () => {
        if (observerRef.current) observerRef.current.disconnect();
      };
    }
  }, [portfolioItems]);

  if (loading.value) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pastelGreen"></div>
      </div>
    );
  }

  // Helper to determine aspect ratio based on index for a "Gallery" feel
  const getAspectRatio = (index) => {
    const ratios = ['aspect-[4/5]', 'aspect-square', 'aspect-[3/4]', 'aspect-[4/3]'];
    return ratios[index % ratios.length];
  };

  return (
    <div class="max-w-7xl mx-auto px-4 py-24 space-y-24">
      <div class="text-center space-y-4">
        <h1 class="text-7xl md:text-9xl font-black font-serif tracking-tighter text-[var(--text-primary)]">{t.portfolioPageTitle}</h1>
        <p class="font-calligraphy text-4xl text-pastelGreen opacity-80">{t.portfolioPageSubtitle}</p>
      </div>

      {portfolioItems.length > 0 ? (
        <div class="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          {portfolioItems.map((item, i) => (
            <a 
              href={`/articles/${item.id}`} 
              key={item.id}
              class="portfolio-animate opacity-0 translate-y-10 transition-all duration-1000 group block break-inside-avoid relative overflow-hidden rounded-[2.5rem] border border-brown/10 shadow-sm hover:shadow-2xl"
              style={{ transitionDelay: `${(i % 3) * 150}ms` }}
            >
              <div class={`${getAspectRatio(i)} overflow-hidden`}>
                <img 
                  src={item.image} 
                  class="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" 
                  alt={item.title}
                />
              </div>
              
              {/* Cinematic Overlay for Title on Hover */}
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-10">
                <h3 class="text-3xl font-serif font-bold text-white leading-tight translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.title}
                </h3>
                <p class="text-pastelGreen font-black uppercase tracking-[0.3em] text-[10px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                  {t.viewProject}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div class="py-40 text-center italic opacity-30 text-2xl font-serif text-[var(--text-primary)]">
          {t.portfolioEmpty}
        </div>
      )}
    </div>
  );
}
