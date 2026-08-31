const fs = require('fs');
let code = fs.readFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

if (!code.includes("isSearchOpen")) {
  code = code.replace(
    /const \[isNotifOpen, setIsNotifOpen\] = useState\(false\);/,
    "const [isNotifOpen, setIsNotifOpen] = useState(false);\n  const [isSearchOpen, setIsSearchOpen] = useState(false);\n  const [searchQuery, setSearchQuery] = useState('');"
  );
  
  code = code.replace(
    /const fetchNotifications = async \(\) => \{/,
    "const handleSearch = (e) => {\n    e.preventDefault();\n    if(searchQuery.trim()) {\n      navigate(`/shop?search=${searchQuery}`);\n      setIsSearchOpen(false);\n      setSearchQuery('');\n    }\n  };\n\n  const fetchNotifications = async () => {"
  );

  code = code.replace(
    /<button className="p-1\.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full\s+hover:bg-white\/50">/g,
    "<button onClick={() => setIsSearchOpen(true)} className=\"p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50\">"
  );
  
  code = code.replace(
    /<button className="p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50\s+transition-colors rounded-xl shadow-sm border border-camel-100">/g,
    "<button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className=\"p-3 bg-white text-espresso-600 hover:text-camel-800 hover:bg-camel-50 transition-colors rounded-xl shadow-sm border border-camel-100\">"
  );

  // Add the search modal JSX right before the closing </header> or at the end of the return
  const searchModalJSX = `
      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-espresso-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-camel-100"
            >
              <form onSubmit={handleSearch} className="flex items-center p-4">
                <Search className="text-camel-400 ml-2" size={24} />
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for pets, products, or vets..." 
                  className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg text-espresso-900 placeholder:text-camel-300"
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 text-camel-300 hover:text-red-500 transition-colors rounded-full hover:bg-red-50">
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
  console.log("Patched search logic");
} else {
  console.log("Already patched");
}
