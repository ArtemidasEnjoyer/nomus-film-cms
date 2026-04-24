import { useLanguage } from '../hooks/useLanguage';
import { useArticles } from '../hooks/useArticles';

export function Partners() {
  const { t } = useLanguage();
  const { articles } = useArticles();
  
  const partners = articles.value.filter(a => a.type === 'partner');

  if (partners.length === 0) return null;

  return (
    <section class="max-w-7xl mx-auto px-4 py-24 space-y-16">
      <div class="text-center space-y-4">
        <h2 class="text-5xl md:text-6xl font-black font-serif tracking-tighter opacity-0 animate-fade-in-up">{t.partnersTitle}</h2>
        <div class="w-24 h-1 bg-pastelGreen mx-auto rounded-full opacity-0 animate-fade-in-up"></div>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
        {partners.map((partner, idx) => (
          <a 
            key={partner.id} 
            href={`/articles/${partner.id}`}
            class="group relative bg-white dark:bg-gray-800 border border-brown/5 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div class="w-32 h-32 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-700">
              <img 
                src={partner.image || '/assets/logo.jpg'} 
                alt={partner.title} 
                class="max-w-full max-h-full object-contain"
              />
            </div>
            <h3 class="text-lg font-serif font-bold text-[var(--text-primary)] group-hover:text-pastelGreen transition-colors">{partner.title}</h3>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-pastelGreen opacity-0 group-hover:opacity-100 transition-opacity">Read Story</span>
          </a>
        ))}
      </div>
    </section>
  );
}
