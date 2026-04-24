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
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {partners.map((partner, idx) => (
          <a 
            key={partner.id} 
            href={`/articles/${partner.id}`}
            class="group relative bg-[var(--bg-primary)] rounded-[2.5rem] p-6 flex items-center gap-6 shadow-sm hover:shadow-xl transition-all duration-500 opacity-0 animate-fade-in-up"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div class="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 shadow-inner">
              <img 
                src={partner.image || '/assets/logo.jpg'} 
                alt={partner.title} 
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 text-left flex flex-col justify-center">
              <h3 class="text-xl font-serif font-bold text-[var(--text-primary)] group-hover:text-pastelGreen transition-colors leading-tight">{partner.title}</h3>
              <div class="h-4"> {/* Spacer to prevent layout shift */}
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-pastelGreen opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 inline-block duration-500">{t.readStory} →</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
