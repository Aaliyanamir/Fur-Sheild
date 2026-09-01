import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Star, X, Plus, Loader2, ShieldCheck, Truck, Trash2, PackagePlus, Pencil } from 'lucide-react';
import shopService from '../services/shop.service';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getImageUrl } from '../lib/imageUtils';

export default function ShopCatalog() {
  const [searchParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('featured');
  const [quickView, setQuickView] = useState(null);

  // Product Modal State for Admin/Owner
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Food',
    stock: '20',
    image: '/images/food.jpg',
    isPrescriptionRequired: false
  });

  const categories = ['All', 'Food', 'Health', 'Toys', 'Accessories', 'Birds'];

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await shopService.getProducts(activeCategory, searchQuery);
      if (res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: 'Food',
      stock: '20',
      image: '/images/food.jpg',
      isPrescriptionRequired: false
    });
    setImageFile(null);
    setImagePreview('');
  };

  const openAddProductModal = () => {
    resetProductForm();
    setEditingProductId(null);
    setIsEditModalOpen(false);
    setIsAddModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product._id);
    setIsAddModalOpen(false);
    setIsEditModalOpen(true);
    setNewProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Food',
      stock: product.stock || '0',
      image: product.image || product.imageUrl || '/images/food.jpg',
      isPrescriptionRequired: Boolean(product.isPrescriptionRequired)
    });
    setImagePreview(product.image || product.imageUrl ? getImageUrl(product.image || product.imageUrl, '/images/food.jpg') : '');
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(newProduct.image ? getImageUrl(newProduct.image, '/images/food.jpg') : '');
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const buildProductFormData = () => {
    const formData = new FormData();

    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', String(newProduct.price));
    formData.append('category', newProduct.category);
    formData.append('stock', String(newProduct.stock));
    formData.append('isPrescriptionRequired', String(Boolean(newProduct.isPrescriptionRequired)));

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (newProduct.image) {
      formData.append('image', newProduct.image);
    }

    return formData;
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const formData = buildProductFormData();
      const res = await shopService.createProduct(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        resetProductForm();
        fetchProducts();
        toast('Product added to catalog.');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast(error.response?.data?.message || 'Failed to add product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProductId) return;

    try {
      setIsSubmitting(true);
      const formData = buildProductFormData();
      const res = await shopService.updateProduct(editingProductId, formData);
      if (res.success) {
        setIsEditModalOpen(false);
        setEditingProductId(null);
        resetProductForm();
        fetchProducts();
        toast('Product updated successfully.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast(error.response?.data?.message || 'Failed to update product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await shopService.deleteProduct(id);
        fetchProducts();
        toast('Product removed.');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast('Could not delete product', 'error');
      }
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    toast(`${product.name} added to cart`);
  };

  const displayedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
    if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const canManageProducts = user && ['SUPER_ADMIN', 'SYSTEM_ADMIN', 'OWNER'].includes(user.role);

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] min-h-screen">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        <div className="bg-espresso-900 rounded-[2.5rem] p-12 text-center text-camel-50 relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h1 className="text-5xl font-display font-black tracking-tight mb-4">Nutrition, Toys & Accessories</h1>
            <p className="text-camel-200 max-w-xl mx-auto mb-8 font-medium">Curated products for dogs, cats, and birds. Quality assured by FurShield.</p>
            <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products..." 
                className="w-full bg-white/10 border border-white/20 text-white placeholder-camel-200/50 rounded-full py-4 pl-6 pr-12 focus:outline-none focus:ring-2 focus:ring-camel-400 backdrop-blur-sm"
              />
              <button type="submit" className="absolute right-4 text-camel-200 hover:text-white transition-colors">
                <Search size={20} />
              </button>
            </form>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-camel-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-espresso-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-[2rem] p-6 border border-camel-100 shadow-sm sticky top-24">
            <h3 className="text-sm font-black text-espresso-900 uppercase tracking-widest mb-6">Categories</h3>
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeCategory === cat ? 'bg-camel-100 text-espresso-900' : 'text-camel-600 hover:bg-camel-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <hr className="my-6 border-camel-100" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs font-bold text-espresso-600">
                <ShieldCheck size={16} className="text-camel-500" />
                Vet Approved Quality
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-espresso-600">
                <Truck size={16} className="text-camel-500" />
                Free Shipping over $50
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-espresso-900">
              {activeCategory === 'All' ? 'All Products' : activeCategory}
            </h2>
            
            <div className="flex items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold bg-white border border-camel-200 rounded-full px-3 py-2 text-espresso-700"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top rated</option>
              </select>
              {canManageProducts && (
                <button 
                  onClick={openAddProductModal}
                  className="bg-camel-600 hover:bg-camel-700 text-white px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-2 transition-all"
                >
                  <PackagePlus size={16} /> Add Product
                </button>
              )}
              {canManageProducts && (
                <button onClick={() => shopService.seedProducts().then(() => { fetchProducts(); toast('Catalog seeded'); })} className="text-xs font-bold text-camel-500 hover:text-camel-700 underline">Seed Mock Data</button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-camel-600" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-camel-100 p-12 text-center shadow-sm">
              <ShoppingBag className="w-16 h-16 text-camel-200 mx-auto mb-4" />
              <p className="text-lg font-bold text-espresso-900">No products found.</p>
              <p className="text-camel-600">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map(product => (
                <div key={product._id} className="bg-white rounded-[2rem] border border-camel-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-camel-300 transition-all group flex flex-col relative">
                  
                  {canManageProducts && (
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                      <button 
                        onClick={() => openEditProductModal(product)}
                        className="w-8 h-8 bg-camel-100 hover:bg-camel-600 text-camel-700 hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                        title="Edit Product"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product._id)}
                        className="w-8 h-8 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                        title="Delete Product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  <div className="aspect-square bg-camel-50 relative p-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={getImageUrl(product.image || product.imageUrl, '/images/food.jpg')} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 mix-blend-multiply cursor-pointer" 
                      onClick={() => setQuickView(product)}
                      onError={(e) => { e.target.src = '/images/food.jpg'; }}
                    />
                    {product.isPrescriptionRequired && (
                      <div className="absolute top-3 left-3 bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">
                        Rx Required
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h3 className="font-black text-espresso-900 leading-tight truncate">{product.name}</h3>
                    </div>
                    <p className="text-xs font-bold text-camel-600 uppercase tracking-widest mb-3">{product.category}</p>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-bold text-espresso-600">{product.rating || 5.0} ({product.reviewsCount || 1})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-black text-espresso-900">${Number(product.price).toFixed(2)}</span>
                      <button onClick={() => handleAddToCart(product)} className="w-10 h-10 rounded-full bg-camel-100 hover:bg-camel-600 text-camel-700 hover:text-white flex items-center justify-center transition-colors shadow-sm group-hover:-translate-y-1">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal (For Admin / Owner) */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setEditingProductId(null); resetProductForm(); }} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl pointer-events-auto flex flex-col overflow-hidden">
                <div className="p-6 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                  <h2 className="text-xl font-display font-black text-espresso-900 flex items-center gap-2">
                    {isEditModalOpen ? <Pencil size={20} className="text-camel-600" /> : <PackagePlus size={20} className="text-camel-600" />} {isEditModalOpen ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); setEditingProductId(null); resetProductForm(); }} className="w-8 h-8 rounded-full bg-white border border-camel-200 flex items-center justify-center text-espresso-400 hover:text-espresso-900 transition-colors shadow-sm"><X size={16}/></button>
                </div>
                
                <form onSubmit={isEditModalOpen ? handleEditProductSubmit : handleAddProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                  <div>
                    <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1">Product Title</label>
                    <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-medium" placeholder="e.g. Parakeet Bird Seed Mix" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1">Category</label>
                      <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-bold">
                        <option value="Food">Food</option>
                        <option value="Health">Health</option>
                        <option value="Toys">Toys</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Birds">Birds</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1">Price ($)</label>
                      <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-medium" placeholder="24.99" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1">Stock Quantity</label>
                      <input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-medium" placeholder="50" />
                    </div>

                    <div className="flex items-center pt-7">
                      <label className="inline-flex items-center gap-2 text-sm font-bold text-espresso-700">
                        <input type="checkbox" checked={newProduct.isPrescriptionRequired} onChange={e => setNewProduct({...newProduct, isPrescriptionRequired: e.target.checked})} className="h-4 w-4 rounded border-camel-300 text-camel-600 focus:ring-camel-500" />
                        Rx Required
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1">Product Image</label>

                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-camel-100 text-camel-800 font-bold text-xs uppercase tracking-widest hover:bg-camel-200 transition-colors">
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      <span className="text-xs text-espresso-500">or keep current URL fallback</span>
                    </div>

                    <input type="text" value={newProduct.image} onChange={e => {
                      setNewProduct({...newProduct, image: e.target.value});
                      if (!imageFile) setImagePreview(e.target.value ? getImageUrl(e.target.value, '/images/food.jpg') : '');
                    }} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-medium" placeholder="/images/food.jpg or https://example.com/image.jpg" />

                    {(imagePreview || newProduct.image) && (
                      <div className="rounded-2xl border border-camel-200 bg-camel-50 p-3">
                        <img src={imagePreview || getImageUrl(newProduct.image, '/images/food.jpg')} alt="Product preview" className="max-h-28 mx-auto object-contain mix-blend-multiply" onError={(e) => { e.target.src = '/images/food.jpg'; }} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-espresso-900 uppercase tracking-widest mb-1">Description</label>
                    <textarea rows="3" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-[#FAF8F5] border border-camel-200 rounded-xl px-4 py-3 text-sm focus:border-camel-500 font-medium resize-none" placeholder="Provide product features..." />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full bg-espresso-900 hover:bg-espresso-800 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2 flex justify-center items-center gap-2">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : isEditModalOpen ? 'Update Product' : 'Save Product to Database'}
                  </button>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Quick view */}
      <AnimatePresence>
        {quickView && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-[200]" onClick={() => setQuickView(null)} />
            <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl pointer-events-auto overflow-hidden grid md:grid-cols-2">
                <div className="bg-camel-50 p-8 flex items-center justify-center">
                  <img src={getImageUrl(quickView.image || quickView.imageUrl, '/images/food.jpg')} alt={quickView.name} className="max-h-64 object-contain mix-blend-multiply" />
                </div>
                <div className="p-8 relative">
                  <button onClick={() => setQuickView(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full border border-camel-200 flex items-center justify-center"><X size={16} /></button>
                  <p className="text-[10px] font-black uppercase tracking-widest text-camel-600 mb-2">{quickView.category}</p>
                  <h3 className="text-2xl font-display font-black text-espresso-900 mb-2">{quickView.name}</h3>
                  <p className="text-sm text-espresso-500 mb-6">{quickView.description || 'Premium FurShield curated product.'}</p>
                  <p className="text-3xl font-black text-espresso-900 mb-6">${Number(quickView.price).toFixed(2)}</p>
                  <button
                    onClick={() => { handleAddToCart(quickView); setQuickView(null); }}
                    className="w-full bg-camel-600 hover:bg-camel-700 text-white py-3.5 rounded-xl font-bold"
                  >
                    Add to cart
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

