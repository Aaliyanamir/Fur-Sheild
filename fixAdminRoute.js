const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/App.jsx', 'utf8');

const searchStr = `<Route path="/admin" element={
          <ProtectedRoute>
            <SuperAdmin />
          </ProtectedRoute>
        } />`;
        
const replaceStr = `</Route>\n\n            {/* Protected Routes - Strictly for Super Admins */}\n            <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'SYSTEM_ADMIN']} />}>\n              <Route path="/admin" element={<SuperAdmin />} />\n            </Route>\n\n            <Route element={<ProtectedRoute />}>`;

if (code.includes(searchStr)) {
  code = code.replace(searchStr, replaceStr);
  fs.writeFileSync('d:/Pet-Care/frontend/src/App.jsx', code);
}
