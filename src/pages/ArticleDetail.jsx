import { useState, useEffect } from 'preact/hooks';
import { useLanguage } from '../hooks/useLanguage';
import { useArticles } from '../hooks/useArticles';
import { MarkdownViewer } from '../components/MarkdownViewer';

export function ArticleDetail({ id }) {
  const { t } = useLanguage();
  const { articles, loading } = useArticles();
  
  const article = articles.value.find(a => String(a.id) === String(id));

  if (loading.value) return (
    <div class="h-96 flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pastelGreen"></div>
    </div>
  );

  if (!article) return (
    <div class="h-96 flex flex-col items-center justify-center space-y-6">
      <h2 class="text-3xl font-serif">{t.contentNotFound}</h2>
      <a href="/" class="text-pastelGreen underline font-bold">{t.backToHome}</a>
    </div>
  );

  return (
    <article class="max-w-4xl mx-auto px-4 py-24 space-y-12 animate-fade-in">
      <div class="space-y-6 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-4">
          <span class="px-3 py-1 bg-pastelGreen/20 text-pastelGreen text-xs font-black uppercase tracking-widest rounded-md">
            {article.type} • {article.category}
          </span>
          <span class="text-xs text-[var(--text-secondary)] opacity-60 font-bold">{article.date}</span>
        </div>
        <h1 class="text-5xl md:text-8xl font-black font-serif leading-none tracking-tighter">
          {article.title}
        </h1>
      </div>

      <div class="aspect-video w-full overflow-hidden rounded-[3rem] shadow-2xl border border-brown/5">
        <img src={article.image} class="w-full h-full object-cover" />
      </div>

      <div class="space-y-12 text-xl text-[var(--text-secondary)] font-light leading-relaxed max-w-none">
        {/* Quote/Excerpt Section */}
        <p class="text-2xl font-serif italic text-[var(--text-primary)] border-l-4 border-pastelGreen pl-8 py-6 bg-brown/5 rounded-r-[2rem]">
          {article.excerpt}
        </p>
        
        {/* Rich Content Section (Markdown) */}
        {article.content ? (
          <MarkdownViewer 
            className="prose prose-xl dark:prose-invert max-w-none 
              prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tighter
              prose-p:font-light prose-p:leading-relaxed
              prose-a:text-pastelGreen prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-[2rem] prose-img:shadow-xl prose-img:mx-auto prose-img:block"
            content={article.content}
          />
        ) : (
          /* Fallback if no rich content exists */
          <div class="italic opacity-40 py-10 text-center">
            {t.noContent}
          </div>
        )}
      </div>

      <div class="pt-20 border-t border-brown/10 flex justify-between items-center">
        <a href={article.type === 'portfolio' ? '/portfolio' : '/articles'} class="group flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] hover:text-pastelGreen transition-colors">
          <span class="text-xl group-hover:-translate-x-2 transition-transform">←</span>
          {article.type === 'portfolio' ? t.backToPortfolio : t.backToArticles}
        </a>
      </div>
    </article>
  );
}
