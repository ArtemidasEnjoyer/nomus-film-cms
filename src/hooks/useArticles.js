import { signal } from '@preact/signals';

const articles = signal([]);
const loading = signal(true);
const error = signal(null);

const fetchArticles = async () => {
  loading.value = true;
  try {
    const res = await fetch(`/api/articles?t=${Date.now()}`);
    const data = await res.json();
    articles.value = data;
    error.value = null;
  } catch (err) {
    error.value = "Failed to load articles";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

if (typeof window !== 'undefined') {
  fetchArticles();
}

export function useArticles() {
  const getAuthHeader = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const deleteArticle = async (id) => {
    const previousArticles = [...articles.value];
    articles.value = articles.value.filter(a => String(a.id) !== String(id));

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload();
        return false;
      }
      if (!res.ok) throw new Error('Delete failed');
      return true;
    } catch (err) {
      articles.value = previousArticles;
      alert('Failed to delete from server.');
      return false;
    }
  };

  const saveArticle = async (articleData, id = null) => {
    try {
      const url = id ? `/api/articles/${id}` : '/api/articles';
      const method = id ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(articleData)
      });
      
      if (res.status === 401) {
        localStorage.removeItem('admin_token');
        window.location.reload(); // Force re-auth
        return false;
      }
      
      if (res.ok) {
        await fetchArticles();
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return { articles, loading, error, fetchArticles, deleteArticle, saveArticle };
}
