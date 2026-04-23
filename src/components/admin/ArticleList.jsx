import { useState, useMemo } from 'preact/hooks';
import { useLanguage } from '../../hooks/useLanguage';

export function ArticleList({ articles, deleteArticle, handleEdit }) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const displayArticles = useMemo(() => {
    let filtered = [...articles];
    if (filterType !== 'all') filtered = filtered.filter(a => a.type === filterType);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(a => a.title.toLowerCase().includes(term) || a.category.toLowerCase().includes(term));
    }
    filtered.sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
    return filtered;
  }, [articles, searchTerm, filterType, sortBy]);

  return (
    <div class="space-y-10">
      <h2 class="text-3xl font-bold font-serif text-[var(--text-primary)]">{t.manageContent}</h2>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onInput={(e) => setSearchTerm(e.target.value)} class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-gray-800 border border-brown/10 outline-none text-[var(--text-primary)]" />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-xl">🔍</span>
        </div>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} class="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-brown/10 font-bold text-sm text-[var(--text-primary)]">
          <option value="all">{t.allTypes}</option>
          <option value="news">{t.articles}</option>
          <option value="portfolio">{t.portfolio}</option>
          <option value="partner">{t.partnerType}</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} class="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-brown/10 font-bold text-sm text-[var(--text-primary)]">
          <option value="newest">{t.newest}</option><option value="oldest">{t.oldest}</option><option value="title">{t.byTitle}</option>
        </select>
      </div>
      <div class="grid grid-cols-1 gap-4">
        {displayArticles.map(a => (
          <div key={a.id} class="flex items-center justify-between p-8 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-brown/10 shadow-sm">
            <div class="flex gap-6 items-center">
              <div class="w-16 h-16 rounded-2xl overflow-hidden hidden sm:block"><img src={a.image} class="w-full h-full object-cover" /></div>
              <div>
                <h3 class="font-bold text-xl font-serif text-[var(--text-primary)]">{a.title}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                    a.type === 'portfolio' ? 'bg-purple-100 text-purple-600' : 
                    a.type === 'partner' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>{a.type}</span>
                  <span class="text-[9px] font-black uppercase text-pastelGreen opacity-60">{a.category}</span>
                </div>
              </div>
            </div>
            <div class="flex gap-4">
              {deleteConfirmId === a.id ? (
                <div class="flex gap-2">
                  <button onClick={() => { deleteArticle(a.id); setDeleteConfirmId(null); }} class="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold">{t.confirm}</button>
                  <button onClick={() => setDeleteConfirmId(null)} class="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)]">{t.cancel}</button>
                </div>
              ) : (
                <>
                  <button onClick={() => handleEdit(a)} class="text-xs font-black uppercase text-pastelGreen hover:underline">{t.edit}</button>
                  <button onClick={() => setDeleteConfirmId(a.id)} class="text-xs font-black uppercase text-red-400 hover:underline">{t.delete}</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
