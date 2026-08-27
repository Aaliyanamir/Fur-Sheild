import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Clock, User } from 'lucide-react';

const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'Understanding Dog Nutrition: A Complete Guide',
    excerpt: 'Learn the essentials of canine nutrition, from deciphering dog food labels to understanding macronutrients.',
    category: 'Nutrition',
    author: 'Dr. Sarah Jenkins',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">Proper nutrition is the cornerstone of your dog's health and longevity. Just like humans, dogs require a balanced diet of proteins, carbohydrates, fats, vitamins, and minerals to thrive.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">The Role of Protein</h3>
      <p class="mb-4">Proteins are the building blocks of life. They are essential for muscle growth, tissue repair, and a healthy immune system. Look for high-quality animal proteins like chicken, beef, or salmon as the first ingredient in your dog's food.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Deciphering Labels</h3>
      <p>Always read the ingredient list. Avoid foods with excessive fillers like corn or soy, and watch out for artificial colors and preservatives. A good diet translates directly to a shiny coat, clear eyes, and high energy levels.</p>
    `
  },
  {
    id: 2,
    title: 'Cat Behavioral Signs: What Is Your Feline Saying?',
    excerpt: 'Decoding your cat’s body language, from tail flicks to purring, to better understand their needs and emotions.',
    category: 'Behavior',
    author: 'Mark Thompson, Behaviorist',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">Cats are famously mysterious, but they constantly communicate their feelings through subtle body language. Understanding these cues can drastically improve your bond with your feline friend.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">The Tale of the Tail</h3>
      <p class="mb-4">A cat's tail is an emotional barometer. A high, straight tail indicates confidence and happiness. A puffed-up tail means fear or aggression, while a low, tucked tail signals submission or anxiety.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Ears and Eyes</h3>
      <p>Ears flattened against the head usually mean a cat is frightened or ready to defend itself. Slow blinking, on the other hand, is a sign of ultimate trust and affection—often called a "kitty kiss."</p>
    `
  },
  {
    id: 3,
    title: 'Puppy Training 101: The First 30 Days',
    excerpt: 'Set your puppy up for success with positive reinforcement, crate training basics, and a consistent routine.',
    category: 'Training',
    author: 'Dr. Emily Chen',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1591160690555-5debfba289f0?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">Bringing a new puppy home is incredibly exciting, but the first 30 days are crucial for establishing a solid foundation for their lifelong behavior.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Establishing Routine</h3>
      <p class="mb-4">Puppies thrive on predictability. Set a strict schedule for meals, potty breaks, play, and naps. Consistency helps them feel secure and accelerates potty training.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Positive Reinforcement</h3>
      <p>Reward good behavior immediately with treats, praise, or play. Never use physical punishment, as it breaks trust and can lead to anxiety-driven behavioral issues later in life.</p>
    `
  },
  {
    id: 4,
    title: 'Senior Pet Care: Comfort in the Golden Years',
    excerpt: 'How to adjust your home, diet, and veterinary visits to ensure your aging pet remains comfortable and happy.',
    category: 'Wellness',
    author: 'Dr. Robert Allen',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1537151608804-ea2d15a440e2?auto=format&fit=crop&w=600&q=80',
    content: `
      <p class="mb-4">As our pets age, their needs change significantly. Recognizing these changes and adapting your care strategy is the best way to ensure their golden years are comfortable.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">Joint Health & Mobility</h3>
      <p class="mb-4">Arthritis is common in older pets. Consider adding joint supplements (like Glucosamine) to their diet. Provide orthopedic beds and use ramps to help them get onto furniture or into the car without jumping.</p>
      <h3 class="text-xl font-bold mt-6 mb-3">More Frequent Vet Visits</h3>
      <p>Senior pets should see the vet twice a year for comprehensive blood work and wellness checks. Early detection of issues like kidney disease or diabetes can significantly extend their quality of life.</p>
    `
  }
];

export default function CareArticles() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="flex-1 w-full bg-[#FAF8F5] min-h-screen pb-20">
      
      {/* Hero Section */}
      <div className="bg-espresso-900 pt-20 pb-24 px-4 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-16 h-16 bg-camel-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-camel-200">
            <BookOpen size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">Pet Care Knowledge Base</h1>
          <p className="text-lg text-camel-100/80 font-medium">Empower yourself with expert-written articles to provide the best possible life for your furry companions.</p>
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-camel-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-espresso-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {MOCK_ARTICLES.map((article) => (
            <motion.div 
              key={article.id}
              whileHover={{ y: -8 }}
              className="bg-white rounded-[2rem] border border-camel-100 shadow-sm overflow-hidden flex flex-col group cursor-pointer transition-shadow hover:shadow-xl hover:border-camel-300"
              onClick={() => setSelectedArticle(article)}
            >
              <div className="h-64 relative overflow-hidden bg-camel-50">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-espresso-900 shadow-sm">
                  {article.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black text-espresso-900 leading-tight mb-4 group-hover:text-camel-700 transition-colors">
                  {article.title}
                </h3>
                <p className="text-espresso-500 font-medium leading-relaxed mb-6 flex-1">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-camel-100/50 mt-auto">
                  <div className="flex items-center gap-4 text-xs font-bold text-camel-600 uppercase tracking-wider">
                    <div className="flex items-center gap-1.5"><User size={14}/> {article.author}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14}/> {article.readTime}</div>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-camel-50 text-camel-700 flex items-center justify-center group-hover:bg-camel-600 group-hover:text-white transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Reading Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-espresso-900/60 backdrop-blur-md z-[200]"
              onClick={() => setSelectedArticle(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 md:top-10 md:bottom-10 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl bg-[#FDFBF7] md:rounded-[3rem] rounded-t-[3rem] shadow-2xl z-[210] flex flex-col overflow-hidden border border-camel-100"
            >
              {/* Modal Header Image */}
              <div className="relative h-64 md:h-80 shrink-0">
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-8 md:p-12 scrollbar-hide">
                <div className="max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-camel-600 mb-4">
                    <span>{selectedArticle.category}</span>
                    <span className="w-1 h-1 rounded-full bg-camel-300"></span>
                    <span>{selectedArticle.readTime}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-espresso-900 leading-tight mb-8">
                    {selectedArticle.title}
                  </h2>
                  
                  {/* The actual article content in Serif typography for premium readability */}
                  <div 
                    className="prose prose-lg prose-camel font-serif text-espresso-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />
                  
                  <div className="mt-12 pt-8 border-t border-camel-200 flex items-center gap-4">
                    <div className="w-12 h-12 bg-camel-100 rounded-full flex items-center justify-center text-camel-800 font-bold">
                      {selectedArticle.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-espresso-900 uppercase tracking-widest">Written By</p>
                      <p className="text-camel-700 font-medium">{selectedArticle.author}</p>
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
