import { useEffect, useRef } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';
import { useArticles } from '../hooks/useArticles';

export function Articles() {
  const { t } = useLanguage();
  const { articles, loading } = useArticles();
  const observerRef = useRef(null);

  useEffect(() => {
    if (articles.value.length > 0) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-x-0');
            entry.target.classList.remove('opacity-0', '-translate-x-10');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.article-animate').forEach((el) => {
        observerRef.current.observe(el);
      });

      return () => observerRef.current.disconnect();
    }
  }, [articles.value]);

  if (loading.value) {
    return (
      <div class="h-96 flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pastelGreen"></div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 py-20">
      <div class="mb-16 text-center">
        <h1 class="text-4xl md:text-6xl font-black mb-4 font-serif">{t.newsPageTitle}</h1>
        <p class="text-[var(--text-secondary)] max-w-2xl mx-auto">
          {t.newsPageDesc}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        {articles.value.map((article, i) => (
          <article 
            class="article-animate opacity-0 -translate-x-10 transition-all duration-700 ease-out flex flex-col md:flex-row gap-8 group"
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div class="w-full md:w-1/2 aspect-[4/3] overflow-hidden rounded-3xl border border-brown/5">
              <img src={article.image} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div class="w-full md:w-1/2 flex flex-col justify-center">
              <div class="flex items-center gap-3 mb-4">
                <span class="px-3 py-1 bg-pastelGreen/20 text-pastelGreen text-xs font-bold uppercase tracking-wider rounded-full">
                  {article.category}
                </span>
                <span class="text-xs text-[var(--text-secondary)] opacity-60 font-bold">{article.date}</span>
              </div>
              <h2 class="text-2xl font-bold mb-4 font-serif group-hover:text-pastelGreen transition-colors line-clamp-2">
                {article.title}
              </h2>
              <p class="text-[var(--text-secondary)] mb-6 line-clamp-2 font-light">
                {article.excerpt}
              </p>
              <a href={`/articles/${article.id}`} class="flex items-center gap-2 text-sm font-bold group-hover:gap-4 transition-all">
                {t.readMore} <span class="text-pastelGreen">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
