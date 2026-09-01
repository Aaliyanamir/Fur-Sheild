import api from './api';

const articleService = {
  getApprovedArticles: async () => {
    const res = await api.get('/articles');
    return res.data;
  },
  getAllArticles: async () => {
    const res = await api.get('/articles/admin');
    return res.data;
  },
  createArticle: async (articleData) => {
    const res = await api.post('/articles', articleData);
    return res.data;
  },
  updateArticleStatus: async (id, status) => {
    const res = await api.patch(`/articles/${id}/status`, { status });
    return res.data;
  },
  deleteArticle: async (id) => {
    const res = await api.delete(`/articles/${id}`);
    return res.data;
  }
};

export default articleService;
