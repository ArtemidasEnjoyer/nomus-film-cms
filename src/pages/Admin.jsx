import { useState } from 'preact/hooks';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { LoginForm } from '../components/admin/LoginForm';
import { SetupForm } from '../components/admin/SetupForm';
import { ArticleEditor } from '../components/admin/ArticleEditor';
import { ArticleList } from '../components/admin/ArticleList';

function DynamicPreview({ articleData, t }) {
  const { title, excerpt, content, category, image, type } = articleData;
  const previewImage = image || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800';

  if (type === 'portfolio') {
    return (
      <div class="space-y-6">
        <div class="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-brown/10 group shadow-lg bg-brown/5">
          <img src={previewImage} class="w-full h-full object-cover" alt="Portfolio Preview" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
            <h3 class="text-2xl font-serif font-bold text-white leading-tight">{title || t.preview}</h3>
            <p class="text-pastelGreen font-black uppercase tracking-[0.3em] text-[10px] mt-2">{t.viewProject}</p>
          </div>
        </div>
        <div class="px-4 space-y-4">
           <p class="text-sm text-[var(--text-secondary)] italic">{excerpt || 'Excerpt preview...'}</p>
           <div class="text-xs prose prose-slate dark:prose-invert max-w-none border-t border-brown/5 pt-4">
             <MarkdownViewer content={content || ''} />
           </div>
        </div>
      </div>
    );
  }

  if (type === 'partner') {
    return (
      <div class="space-y-8">
        <div class="bg-[var(--bg-primary)] rounded-[2.5rem] p-6 flex items-center gap-6 shadow-md border border-brown/10">
          <div class="w-20 h-20 flex-shrink-0 rounded-full overflow-hidden shadow-inner bg-brown/5">
            <img src={previewImage} alt="Partner Preview" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-serif font-bold text-[var(--text-primary)]">{title || t.preview}</h3>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-pastelGreen">{t.readStory} →</span>
          </div>
        </div>
        <div class="px-6 space-y-4">
          <p class="text-sm text-[var(--text-secondary)] font-light leading-relaxed">{excerpt || 'Excerpt preview...'}</p>
          <div class="text-xs prose prose-slate dark:prose-invert max-w-none bg-brown/5 p-6 rounded-3xl">
             <MarkdownViewer content={content || ''} />
          </div>
        </div>
      </div>
    );
  }

  // Default: News preview
  return (
    <div class="space-y-6">
      <div class="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden border border-brown/10 shadow-sm">
        <img src={previewImage} class="w-full h-full object-cover" alt="News Preview" />
      </div>
      <div class="px-4 pb-4 space-y-4">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 bg-pastelGreen/20 text-pastelGreen text-[10px] font-bold uppercase tracking-wider rounded-full">{category}</span>
          <span class="text-[10px] text-[var(--text-secondary)] opacity-60 font-bold">{new Date().toISOString().split('T')[0]}</span>
        </div>
        <h3 class="font-bold text-2xl font-serif leading-tight text-[var(--text-primary)]">{title || t.preview}</h3>
        <p class="text-sm text-[var(--text-secondary)] font-light border-l-2 border-pastelGreen/30 pl-4">{excerpt || 'Excerpt preview...'}</p>
        <div class="text-sm text-[var(--text-secondary)] mt-6 prose prose-slate dark:prose-invert prose-headings:font-serif prose-headings:font-black prose-a:text-pastelGreen prose-img:rounded-3xl prose-img:mx-auto prose-img:block max-w-none">
          <MarkdownViewer content={content || ''} />
        </div>
      </div>
    </div>
  );
}

export function Admin() {
  const { t } = useLanguage();
  const { isAuthenticated, isSetup, logout } = useAuth();
  const { articles, deleteArticle, saveArticle } = useArticles();

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [articleData, setArticleData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Scriptwriting',
    image: '',
    type: 'news'
  });

  const handleEdit = (article) => {
    setEditingId(article.id);
    setArticleData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'Scriptwriting',
      image: article.image || '',
      type: article.type || 'news'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setArticleData({
      title: '',
      excerpt: '',
      content: '',
      category: 'Scriptwriting',
      image: '',
      type: 'news'
    });
  };

  if (!isAuthenticated.value) return <LoginForm />;
  if (!isSetup.value) return <SetupForm />;

  return (
    <div class="max-w-6xl mx-auto py-20 px-4 space-y-24">
      <div class="flex justify-between items-center border-b border-brown/10 pb-10">
        <h1 class="text-5xl font-black font-serif tracking-tighter text-[var(--text-primary)]">{t.creatorStudio}</h1>
        <button onClick={logout} class="px-6 py-2 bg-red-50 text-red-500 rounded-full font-bold text-xs uppercase">{t.logout}</button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div class="lg:col-span-2 space-y-20 opacity-0 animate-slide-in-right">
          <ArticleEditor 
            articleData={articleData} 
            setArticleData={setArticleData}
            editingId={editingId}
            saveArticle={saveArticle}
            resetForm={resetForm}
          />
          <ArticleList 
            articles={articles.value} 
            deleteArticle={deleteArticle} 
            handleEdit={handleEdit} 
          />
        </div>

        <div class="hidden lg:block space-y-6">
          <div class="sticky top-28 border border-brown/10 rounded-[3rem] overflow-hidden bg-[var(--bg-primary)] shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
             <div class="flex items-center justify-between mb-8 pb-4 border-b border-brown/5">
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] opacity-40">Live Preview</span>
                <span class="px-3 py-1 bg-pastelGreen/10 text-pastelGreen text-[10px] font-black uppercase tracking-widest rounded-full">{articleData.type}</span>
             </div>
             <DynamicPreview articleData={articleData} t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}
