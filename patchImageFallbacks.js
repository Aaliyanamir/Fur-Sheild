const fs = require('fs');

function patchFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Replace the patched image logic with robust logic using imageUrl as fallback
  code = code.replace(
    /<img src=\{\(product\.image \|\| ''\)\.startsWith\('http'\) \? product\.image : \`http:\/\/localhost:5000\$\{product\.image\}\`\} alt=\{product\.name\}/g,
    "<img src={((product.image || product.imageUrl) || '').startsWith('http') ? (product.image || product.imageUrl) : `http://localhost:5000${product.image || product.imageUrl}`} alt={product.name}"
  );

  code = code.replace(
    /<img src=\{\(item\.image \|\| ''\)\.startsWith\('http'\) \? item\.image : \`http:\/\/localhost:5000\$\{item\.image\}\`\} alt=\{item\.name\}/g,
    "<img src={((item.image || item.imageUrl) || '').startsWith('http') ? (item.image || item.imageUrl) : `http://localhost:5000${item.image || item.imageUrl}`} alt={item.name}"
  );

  // In Checkout.jsx where orderItems is created:
  code = code.replace(
    /image: item\.image/g,
    "image: item.image || item.imageUrl"
  );

  fs.writeFileSync(filePath, code);
}

patchFile('d:/Pet-Care/frontend/src/pages/ShopCatalog.jsx');
patchFile('d:/Pet-Care/frontend/src/pages/Checkout.jsx');

console.log("Patched image fallbacks successfully");
