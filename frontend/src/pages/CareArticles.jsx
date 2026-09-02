import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Clock, User, Plus, Loader2, CheckCircle2, Camera, Upload, AlertCircle } from 'lucide-react';
import articleService from '../services/article.service';
import { AuthContext } from '../context/AuthContext';
import { getImageUrl, fileToBase64 } from '../lib/imageUtils';

const FALLBACK_ARTICLE_IMAGE = '/images/pet-owner.jpg';

export default function CareArticles() {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Write Article Modal State
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Nutrition',
    readTime: '5 min read',
    excerpt: '',
    content: ''
  });
  const [articleImageFile, setArticleImageFile] = useState(null);
  const [articleImagePreview, setArticleImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await articleService.getApprovedArticles().catch(() => ({ success: false }));
      if (res && res.success && res.data) {
        setArticles(res.data);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArticleImageFile(file);
      const b64 = await fileToBase64(file);
      setArticleImagePreview(b64);
    }
  };

  const handleCreateArticleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a blog article.');
      return;
    }

    setIsSubmitting(true);
    try {
      let b64Image = articleImagePreview;
      if (articleImageFile && !b64Image) {
        b64Image = await fileToBase64(articleImageFile);
      }

      const safeImage = typeof b64Image === 'string' && b64Image.length > 700000
        ? '/images/pet-owner.jpg'
        : (b64Image || '/images/pet-owner.jpg');

      const res = await articleService.createArticle({
        ...articleForm,
        image: safeImage
      });

      if (res.success) {
        setSubmitSuccessMsg(res.message || 'Article submitted successfully!');
        await fetchArticles();
      }
    } catch (error) {
      console.error(error);
      alert('Error submitting article: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeWriteModal = () => {
    setIsWriteModalOpen(false);
    setSubmitSuccessMsg('');
    setArticleForm({
      title: '',
      category: 'Nutrition',
      readTime: '5 min read',
      excerpt: '',
      content: ''
    });
    setArticleImageFile(null);
    setArticleImagePreview(null);
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-camel-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] min-h-screen pb-20 font-sans">
      
      {/* Hero Header */}
      <div className="bg-espresso-900 pt-20 pb-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="w-16 h-16 bg-camel-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-camel-200 shadow-sm">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">
            Pet Care Knowledge Base
          </h1>
          <p className="text-base md:text-lg text-camel-100/90 font-medium max-w-2xl mx-auto mb-8">
            Empower yourself with expert articles or write and publish your own pet care insights.
          </p>

          <button 
            onClick={() => setIsWriteModalOpen(true)}
            className="bg-camel-500 hover:bg-camel-400 text-espresso-950 font-black px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
          >
            <Plus size={18} strokeWidth={3} /> Write & Submit Article
          </button>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-camel-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-espresso-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 -translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {articles.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 text-center border border-camel-100 shadow-sm text-espresso-500 font-bold">
            No approved articles found. Click "Write & Submit Article" to be the first author!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {articles.map((article) => {
              const articleImg = getImageUrl(article.image, FALLBACK_ARTICLE_IMAGE);

              return (
                <motion.article
                  key={article._id || article.id}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-[2rem] border border-camel-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer transition-all hover:shadow-xl hover:border-camel-300"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="h-64 relative overflow-hidden bg-camel-50">
                    <img
                      src={articleImg}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_ARTICLE_IMAGE; }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-espresso-900 shadow-sm">
                      {article.category || 'General'}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-2xl font-black text-espresso-900 leading-tight mb-3 group-hover:text-camel-700 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-espresso-500 font-medium leading-relaxed mb-6 flex-1 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-camel-100/50 mt-auto">
                      <div className="flex items-center gap-4 text-xs font-bold text-camel-600 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <User size={14}/> {article.author} {article.authorRole ? `(${article.authorRole})` : ''}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={14}/> {article.readTime || '5 min read'}
                        </div>
                      </div>
                      <button type="button" className="w-10 h-10 rounded-full bg-camel-50 text-camel-700 flex items-center justify-center group-hover:bg-camel-600 group-hover:text-white transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>

      {/* Write Article Modal */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={closeWriteModal} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-[#FAF8F5] rounded-[2rem] w-full max-w-2xl shadow-2xl pointer-events-auto flex flex-col overflow-hidden max-h-[90vh]">
                 
                 <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                      <h2 className="text-xl font-display font-black text-espresso-900 leading-tight">Write & Submit Article</h2>
                      <p className="text-[10px] font-bold text-camel-600 uppercase tracking-widest mt-0.5">Share pet care knowledge with the community</p>
                    </div>
                    <button onClick={closeWriteModal} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                 </div>
                 
                 <div className="p-8 overflow-y-auto">
                    {submitSuccessMsg ? (
                      <div className="text-center py-8">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-display font-black text-espresso-900 mb-2">Submission Received!</h3>
                        <p className="text-espresso-600 mb-6 max-w-md mx-auto text-sm font-medium">
                          {submitSuccessMsg}
                        </p>
                        <button onClick={closeWriteModal} className="bg-camel-600 hover:bg-camel-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-colors">Done</button>
                      </div>
                    ) : (
                      <form onSubmit={handleCreateArticleSubmit} className="space-y-4">
                         
                         {/* Image Upload */}
                         <div className="flex flex-col items-center justify-center mb-4">
                           <div className="relative w-full h-40 rounded-2xl border-2 border-dashed border-camel-300 flex items-center justify-center bg-white overflow-hidden group cursor-pointer shadow-sm">
                             {articleImagePreview ? (
                               <img src={articleImagePreview} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <div className="flex flex-col items-center text-camel-400">
                                 <Camera size={32} />
                                 <span className="text-xs font-bold mt-2 uppercase">Upload Banner Photo</span>
                               </div>
                             )}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Upload className="text-white" size={24} />
                             </div>
                             <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                           </div>
                         </div>

                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Article Title *</label>
                           <input type="text" required value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-medium" placeholder="E.g. 5 Signs Your Dog Loves You" />
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Category</label>
                             <select value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-medium">
                               <option>Nutrition</option>
                               <option>Behavior</option>
                               <option>Training</option>
                               <option>Wellness</option>
                               <option>General</option>
                             </select>
                           </div>
                           <div>
                             <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Estimated Read Time</label>
                             <input type="text" value={articleForm.readTime} onChange={e => setArticleForm({...articleForm, readTime: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm font-medium" placeholder="5 min read" />
                           </div>
                         </div>

                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Short Excerpt (Summary) *</label>
                           <textarea required rows="2" value={articleForm.excerpt} onChange={e => setArticleForm({...articleForm, excerpt: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm font-medium resize-none" placeholder="A brief summary that appears on the card..." />
                         </div>

                         <div>
                           <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1.5 px-1">Full Article Content *</label>
                           <textarea required rows="6" value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} className="w-full bg-white border border-camel-200 rounded-xl px-4 py-3 text-sm font-medium resize-none" placeholder="Write full article text here. You can use standard text or HTML paragraphs..." />
                         </div>

                         <button type="submit" disabled={isSubmitting} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-70 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2 flex justify-center items-center gap-2">
                           {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Article For Review'}
                         </button>
                      </form>
                    )}
                 </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Read Full Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-md z-[200]" onClick={() => setSelectedArticle(null)} />
            <motion.div initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-x-0 bottom-0 md:top-10 md:bottom-10 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[#FDFBF7] md:rounded-[3rem] rounded-t-[3rem] shadow-2xl z-[210] flex flex-col overflow-hidden border border-camel-100">
              
              <div className="relative h-64 md:h-80 shrink-0">
                <img src={getImageUrl(selectedArticle.image, FALLBACK_ARTICLE_IMAGE)} alt={selectedArticle.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_ARTICLE_IMAGE; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setSelectedArticle(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-camel-600 mb-4">
                    <span>{selectedArticle.category}</span>
                    <span className="w-1 h-1 rounded-full bg-camel-300"></span>
                    <span>{selectedArticle.readTime}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-espresso-900 leading-tight mb-6">
                    {selectedArticle.title}
                  </h2>

                  <div className="prose prose-lg font-sans text-espresso-700 leading-relaxed space-y-4">
                    {selectedArticle.content && selectedArticle.content.includes('<p') ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                    ) : (
                      selectedArticle.content ? selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      )) : <p>{selectedArticle.excerpt}</p>
                    )}
                  </div>

                  <div className="mt-12 pt-8 border-t border-camel-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-camel-100 rounded-full flex items-center justify-center text-camel-800 font-bold uppercase">
                      {selectedArticle.author ? selectedArticle.author.charAt(0) : 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-espresso-900 uppercase tracking-widest">Written By</p>
                      <p className="text-camel-700 font-medium">{selectedArticle.author} {selectedArticle.authorRole ? `(${selectedArticle.authorRole})` : ''}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
