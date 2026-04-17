import { useState } from 'preact/hooks';
import { useArticles } from '../hooks/useArticles';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { MarkdownViewer } from '../components/MarkdownViewer';
import { LoginForm } from '../components/admin/LoginForm';
import { SetupForm } from '../components/admin/SetupForm';
import { ArticleEditor } from '../components/admin/ArticleEditor';
import { ArticleList } from '../components/admin/ArticleList';

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
          <div class="sticky top-28 border border-brown/10 rounded-[3rem] overflow-hidden bg-[var(--bg-primary)] shadow-2xl p-4 max-h-[85vh] overflow-y-auto">
             <div class="aspect-video bg-gray-100 rounded-[2rem] overflow-hidden mb-6">
               <img src={articleData.image || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800'} class="w-full h-full object-cover" />
             </div>
             <div class="px-4 pb-4">
               <span class="text-[10px] font-black uppercase text-pastelGreen">{articleData.type}</span>
               <h3 class="font-bold text-2xl font-serif leading-tight mt-1 text-[var(--text-primary)]">{articleData.title || t.preview}</h3>
               <div class="text-sm text-[var(--text-secondary)] mt-6 prose prose-slate dark:prose-invert prose-headings:font-serif prose-headings:font-black prose-a:text-pastelGreen prose-img:rounded-3xl prose-img:mx-auto prose-img:block max-w-none">
                 <MarkdownViewer content={articleData.content || ''} />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
