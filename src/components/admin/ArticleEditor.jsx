import { useState, useRef } from 'preact/hooks';
import { useLanguage } from '../../hooks/useLanguage';

export function ArticleEditor({ 
  articleData, 
  setArticleData, 
  editingId, 
  saveArticle, 
  resetForm 
}) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef(null);

  const { title, excerpt, content, category, image, type } = articleData;

  const updateField = (field, value) => setArticleData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(t.saving);
    const dataToSave = { ...articleData, date: new Date().toISOString().split('T')[0] };
    const success = await saveArticle(dataToSave, editingId);
    if (success) { setStatus(t.success); resetForm(); }
    else setStatus(t.error);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setStatus(t.uploading);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      
      if (!res.ok) {
        setStatus(data.error || t.error);
        return;
      }
      
      if (data.url) { 
        updateField('image', data.url);
        setStatus(t.uploaded); 
      }
    } catch (err) { 
      setStatus(t.error); 
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-8 bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-xl border border-brown/5 relative">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-serif font-bold text-[var(--text-primary)]">{editingId ? t.editDraft : t.newStory}</h2>
        <button type="button" onClick={() => setShowHelp(!showHelp)} class="text-xs font-black uppercase text-pastelGreen border border-pastelGreen/20 px-4 py-2 rounded-full">{t.markdownGuide}</button>
      </div>

      <div class={`overflow-hidden transition-all duration-500 ease-in-out ${showHelp ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div class="p-8 bg-brown/5 dark:bg-brown/10 rounded-[2.5rem] text-sm border border-brown/10 grid grid-cols-2 gap-6 text-[var(--text-primary)]">
          <div class="space-y-3">
            <p><strong># Heading 1</strong></p>
            <p><strong>## Heading 2</strong></p>
            <p><strong>**Bold**</strong> | <em>*Italic*</em></p>
            <p><strong>[Link](url)</strong></p>
          </div>
          <div class="space-y-3">
            <p><strong>- List</strong></p>
            <p><strong>&gt; Quote</strong></p>
            <p><strong>![Img](url)</strong></p>
            <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" class="block pt-2 text-pastelGreen font-bold underline">Full Guide →</a>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-1 bg-gray-100 dark:bg-gray-900 rounded-2xl text-[var(--text-primary)]">
          <button type="button" onClick={() => updateField('type', 'news')} class={`py-3 rounded-xl font-bold transition-all ${type === 'news' ? 'bg-white dark:bg-gray-800 text-pastelGreen shadow-sm' : 'opacity-40'}`}>{t.articles}</button>
          <button type="button" onClick={() => updateField('type', 'portfolio')} class={`py-3 rounded-xl font-bold transition-all ${type === 'portfolio' ? 'bg-white dark:bg-gray-800 text-pastelGreen shadow-sm' : 'opacity-40'}`}>{t.portfolio}</button>
          <button type="button" onClick={() => updateField('type', 'partner')} class={`py-3 rounded-xl font-bold transition-all ${type === 'partner' ? 'bg-white dark:bg-gray-800 text-pastelGreen shadow-sm' : 'opacity-40'}`}>{t.partnerType}</button>
        </div>
        <input type="text" value={title} onInput={(e) => updateField('title', e.target.value)} class="w-full text-3xl font-bold bg-transparent border-b-2 border-brown/10 focus:border-pastelGreen outline-none pb-4 text-[var(--text-primary)]" placeholder={t.title} required />
        <textarea value={excerpt} onInput={(e) => updateField('excerpt', e.target.value)} class="w-full p-6 rounded-[1.5rem] bg-gray-50 dark:bg-gray-900 border border-brown/10 h-24 outline-none text-[var(--text-primary)]" placeholder={t.summary} required />
        <textarea value={content} onInput={(e) => updateField('content', e.target.value)} class="w-full p-6 rounded-[2rem] bg-gray-50 dark:bg-gray-900 border border-brown/10 h-80 outline-none font-mono text-sm text-[var(--text-primary)]" placeholder={t.contentLabel} />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <select value={category} onChange={(e) => updateField('category', e.target.value)} class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-brown/10 font-bold text-sm outline-none text-[var(--text-primary)]">
            <option>Scriptwriting</option><option>Direction</option><option>Oscars</option><option>Production</option><option>Cinematography</option><option>None</option>
          </select>
          <div class="flex gap-2">
            <input value={image} onInput={(e) => updateField('image', e.target.value)} class="flex-1 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-brown/10 text-sm outline-none text-[var(--text-primary)]" placeholder={t.coverImage} />
            <button type="button" onClick={() => fileInputRef.current.click()} class="p-4 bg-brown/10 rounded-2xl text-xl text-[var(--text-primary)]">🖼️</button>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} class="hidden" accept="image/*" />
          </div>
        </div>
      </div>
      <div class="flex gap-4">
        <button class="flex-1 py-5 bg-gray-900 text-white dark:bg-pastelGreen dark:text-gray-900 font-black rounded-3xl">{editingId ? t.update : t.publish}</button>
        {editingId && <button type="button" onClick={resetForm} class="px-8 py-5 bg-gray-100 dark:bg-gray-700 rounded-3xl font-bold text-[var(--text-primary)]">{t.cancel}</button>}
      </div>
      {status && <p class="text-center font-bold text-pastelGreen">{status}</p>}
    </form>
  );
}
