const fs = require('fs');
let code = fs.readFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

// 1. Add state for search
if (!code.includes("isSearchOpen")) {
  code = code.replace(
    "const [isNotifOpen, setIsNotifOpen] = useState(false);",
    "const [isNotifOpen, setIsNotifOpen] = useState(false);\n    const [isSearchOpen, setIsSearchOpen] = useState(false);\n    const [searchQuery, setSearchQuery] = useState('');"
  );
  
  // 2. Add handleSearch function
  code = code.replace(
    "const fetchNotifications = async () => {",
    "const handleSearch = (e) => {\n      e.preventDefault();\n      if(searchQuery.trim()) {\n        navigate(`/shop?search=${searchQuery}`);\n        setIsSearchOpen(false);\n        setSearchQuery('');\n      }\n    };\n\n    const fetchNotifications = async () => {"
  );

  // 3. Make desktop button open search
  code = code.replace(
    "<button className=\"p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full \nhover:bg-white/50\">",
    "<button onClick={() => setIsSearchOpen(true)} className=\"p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50\">"
  );
  // sometimes powershell formatting messes up the newline in replacement, let's use regex
}
fs.writeFileSync('D:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
