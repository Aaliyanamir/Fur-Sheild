import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Stethoscope, HeartHandshake, PawPrint, ShieldCheck, Ban, Loader2, CheckCircle2, AlertCircle, LayoutDashboard, Search, X } from 'lucide-react';
import adminService from '../services/admin.service';
import articleService from '../services/article.service';
import { BookOpen, Check, Trash2 } from 'lucide-react';

export default function SuperAdmin() {
  const [stats, setStats] = useState({ users: 0, vets: 0, shelters: 0, pets: 0, appointments: 0 });
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Toast State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, articlesRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
        articleService.getAllArticles().catch(() => ({ success: false }))
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (articlesRes && articlesRes.success) setArticles(articlesRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleStatusUpdate = async (articleId, status) => {
    try {
      const res = await articleService.updateArticleStatus(articleId, status);
      if (res.success) {
        setArticles(prev => prev.map(a => a._id === articleId ? { ...a, status } : a));
        showToast(`Article ${status === 'APPROVED' ? 'approved and published live!' : 'rejected.'}`, 'success');
      }
    } catch (error) {
      showToast('Failed to update article status', 'error');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Delete this article?')) return;
    try {
      const res = await articleService.deleteArticle(articleId);
      if (res.success) {
        setArticles(prev => prev.filter(a => a._id !== articleId));
        showToast('Article deleted', 'success');
      }
    } catch (error) {
      showToast('Failed to delete article', 'error');
    }
  };

  const fetchUsers = async (query) => {
    try {
      const res = await adminService.getUsers(query);
      if (res.success) setUsers(res.data);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusUpdate = async (userId, action) => {
    try {
      setActionLoading(userId);
      const res = await adminService.updateUserStatus(userId, action);
      
      if (res.success) {
        // INSTANT STATE UPDATE (No hard reload)
        setUsers(prevUsers => 
          prevUsers.map(u => u._id === res.data._id ? res.data : u)
        );
        
        let msg = 'User updated successfully';
        if (action === 'VERIFY') msg = `${res.data.name} has been verified.`;
        if (action === 'BAN') msg = `${res.data.name} has been banned.`;
        if (action === 'ACTIVATE') msg = `${res.data.name} account activated.`;
        
        showToast(msg, 'success');
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || 'Failed to update user', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return <span className="px-3 py-1 bg-espresso-900 text-camel-100 rounded-full text-[10px] font-black uppercase tracking-widest">Admin</span>;
      case 'SYSTEM_ADMIN': return <span className="px-3 py-1 bg-espresso-900 text-camel-100 rounded-full text-[10px] font-black uppercase tracking-widest">SysAdmin</span>;
      case 'VET': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">Vet</span>;
      case 'SHELTER_ADMIN': return <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest">Shelter</span>;
      default: return <span className="px-3 py-1 bg-camel-100 text-camel-700 rounded-full text-[10px] font-black uppercase tracking-widest">Owner</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] bg-[#FAF8F5]">
        <div className="flex flex-col items-center gap-4">
           <Loader2 className="w-12 h-12 animate-spin text-camel-600" />
           <p className="text-sm font-bold text-espresso-500 uppercase tracking-widest animate-pulse">Syncing Secure Core...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] min-h-screen relative">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-espresso-900 rounded-2xl flex items-center justify-center text-camel-100 shadow-md">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-espresso-900 leading-tight">Super Admin Hub</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-camel-600">Platform Control Center</p>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col hover:shadow-md hover:border-camel-300 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-camel-50 rounded-full flex items-center justify-center text-camel-600">
                <Users size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-espresso-500 uppercase tracking-widest mb-1">Total Users</p>
            <h3 className="text-4xl font-black text-espresso-900">{stats.users}</h3>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col hover:shadow-md hover:border-camel-300 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Stethoscope size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-espresso-500 uppercase tracking-widest mb-1">Total Vets</p>
            <h3 className="text-4xl font-black text-espresso-900">{stats.vets}</h3>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col hover:shadow-md hover:border-camel-300 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                <HeartHandshake size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-espresso-500 uppercase tracking-widest mb-1">Total Shelters</p>
            <h3 className="text-4xl font-black text-espresso-900">{stats.shelters}</h3>
          </div>
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm flex flex-col hover:shadow-md hover:border-camel-300 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <PawPrint size={20} />
              </div>
            </div>
            <p className="text-xs font-bold text-espresso-500 uppercase tracking-widest mb-1">Ecosystem Pets</p>
            <h3 className="text-4xl font-black text-espresso-900">{stats.pets}</h3>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-[2.5rem] border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.06)] overflow-hidden">
          
          <div className="p-8 border-b border-camel-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-black text-espresso-900">User Management</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-camel-400" size={16} />
              <input 
                type="text" 
                placeholder="Search globally..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 bg-[#FAF8F5] border border-camel-200 rounded-full text-sm focus:border-camel-500 focus:ring-2 focus:ring-camel-100 transition-all w-full sm:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-camel-100">
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500">User</th>
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500">Role</th>
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500">Status</th>
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-sm font-medium text-espresso-500">No users found.</td>
                    </tr>
                  ) : (
                    users.map((user, index) => (
                      <motion.tr 
                        key={user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-camel-50 hover:bg-camel-50/30 transition-colors group"
                      >
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-camel-100 border border-camel-200 flex items-center justify-center text-espresso-900 font-bold shrink-0 overflow-hidden">
                              {user.avatarUrl ? <img src={user.avatarUrl.startsWith('http') ? user.avatarUrl : `http://localhost:5000${user.avatarUrl}`} className="w-full h-full object-cover" alt=""/> : user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-black text-espresso-900">{user.name}</p>
                              <p className="text-xs text-camel-600 font-medium">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="py-5 px-8">
                          {user.status === 'BANNED' ? (
                            <div className="flex items-center gap-1.5 text-rose-600 text-xs font-bold">
                              <AlertCircle size={14} /> Banned
                            </div>
                          ) : user.isVerified ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                              <CheckCircle2 size={14} /> Verified
                            </div>
                          ) : (
                            <div className="text-espresso-400 text-xs font-bold flex items-center gap-1.5">
                              Unverified
                            </div>
                          )}
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex justify-end gap-2">
                            {user.role === 'SUPER_ADMIN' || user.role === 'SYSTEM_ADMIN' ? (
                              <span className="text-xs text-camel-400 italic">Protected</span>
                            ) : (
                              <>
                                {!user.isVerified && user.status !== 'BANNED' && (
                                  <button 
                                    onClick={() => handleStatusUpdate(user._id, 'VERIFY')}
                                    disabled={actionLoading === user._id}
                                    className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors shadow-sm disabled:opacity-50"
                                    title="Verify User"
                                  >
                                    {actionLoading === user._id ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                  </button>
                                )}
                                {user.status !== 'BANNED' ? (
                                  <button 
                                    onClick={() => handleStatusUpdate(user._id, 'BAN')}
                                    disabled={actionLoading === user._id}
                                    className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shadow-sm disabled:opacity-50"
                                    title="Ban User"
                                  >
                                    {actionLoading === user._id ? <Loader2 size={16} className="animate-spin" /> : <Ban size={16} />}
                                  </button>
                                ) : (
                                  <button 
                                    onClick={() => handleStatusUpdate(user._id, 'ACTIVATE')}
                                    disabled={actionLoading === user._id}
                                    className="p-2 rounded-xl bg-camel-100 text-espresso-900 hover:bg-camel-200 transition-colors shadow-sm disabled:opacity-50"
                                    title="Unban/Activate User"
                                  >
                                    {actionLoading === user._id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Blog Articles Moderation Section */}
        <div className="bg-white rounded-[2.5rem] border border-camel-100 shadow-[0_8px_30px_rgb(90,56,37,0.06)] overflow-hidden mt-12">
          <div className="p-8 border-b border-camel-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-espresso-900 flex items-center gap-2">
                <BookOpen size={22} className="text-camel-600" /> Blog Article Moderation
              </h2>
              <p className="text-xs text-espresso-500 font-medium mt-0.5">Review, approve, or manage blog submissions from users, vets, and owners</p>
            </div>
            <span className="bg-camel-100 text-camel-800 text-xs font-black px-3.5 py-1.5 rounded-full">
              {articles.filter(a => a.status === 'PENDING').length} Pending Review
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-camel-100">
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500">Article</th>
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500">Author</th>
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500">Status</th>
                  <th className="py-4 px-8 text-[10px] font-bold uppercase tracking-widest text-espresso-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-sm font-medium text-espresso-500">No blog articles found.</td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article._id} className="border-b border-camel-50 hover:bg-camel-50/30 transition-colors">
                      <td className="py-5 px-8 max-w-xs">
                        <p className="font-black text-espresso-900 line-clamp-1">{article.title}</p>
                        <p className="text-xs text-camel-600 font-medium line-clamp-1 mt-0.5">{article.category} &bull; {article.excerpt}</p>
                      </td>
                      <td className="py-5 px-8">
                        <p className="font-bold text-sm text-espresso-900">{article.author}</p>
                        <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest">{article.authorRole || 'User'}</p>
                      </td>
                      <td className="py-5 px-8">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          article.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : article.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="py-5 px-8">
                        <div className="flex justify-end gap-2">
                          {article.status !== 'APPROVED' && (
                            <button
                              onClick={() => handleArticleStatusUpdate(article._id, 'APPROVED')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
                            >
                              <Check size={14} /> Approve
                            </button>
                          )}
                          {article.status !== 'REJECTED' && (
                            <button
                              onClick={() => handleArticleStatusUpdate(article._id, 'REJECTED')}
                              className="px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteArticle(article._id)}
                            className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                            title="Delete Article"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-8 right-8 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="text-sm font-bold">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
