const fs = require('fs');
let code = fs.readFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

if (!code.includes("Search Modal")) {
  const searchModalJSX = `
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-espresso-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-camel-100"
            >
              <form onSubmit={handleSearch} className="flex items-center p-4">
                <Search className="text-camel-400 ml-4" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, pets, or care articles..." 
                  className="w-full bg-transparent border-none outline-none px-6 py-4 text-xl font-medium text-espresso-900 placeholder:text-camel-300"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="p-3 text-camel-300 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 mr-2">
                  <X size={24} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  `;
  
  code = code.replace(
    /<\/header>/,
    "</header>\n" + searchModalJSX
  );

  fs.writeFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
  console.log("Patched search JSX");
} else {
  console.log("Already has JSX");
}
