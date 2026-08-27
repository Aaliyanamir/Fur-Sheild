const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

// 1. Add whitespace-nowrap to the desktop navigation span
code = code.replace(
  '"relative z-10 text-[12px] lg:text-[13px] tracking-wide transition-colors duration-300",',
  '"relative z-10 text-[12px] lg:text-[13px] tracking-wide transition-colors duration-300 whitespace-nowrap",'
);

// 2. Reduce the gap slightly in the navigation container to make room for the new items
code = code.replace(
  '<nav className="hidden md:flex items-center gap-1 md:gap-2 lg:gap-6 h-full pt-1">',
  '<nav className="hidden md:flex items-center gap-1 md:gap-2 lg:gap-4 h-full pt-1">'
);

// 3. Make sure the left container (Logo) shrinks appropriately or right container is flexible
code = code.replace(
  '<div className="hidden md:flex items-center gap-1 lg:gap-3 pr-2 pl-2 lg:pl-8 h-full shrink-0">',
  '<div className="hidden md:flex items-center gap-1 lg:gap-2 pr-2 pl-2 lg:pl-6 h-full shrink-0">'
);

fs.writeFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
console.log("Patched Navbar.jsx");
