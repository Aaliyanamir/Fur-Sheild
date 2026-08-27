const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetAppointments.jsx', 'utf8');

// Replace the end of the file
code = code.replace(
  `          </div>\n\n        </div>\n\n        </div>\n\n      </div>\n    </>\n  );\n}`,
  `          </div>\n\n        </div>\n\n      </div>\n    </>\n  );\n}`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetAppointments.jsx', code);
