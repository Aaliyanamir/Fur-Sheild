const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetAppointments.jsx', 'utf8');

const dynamicStats = `
            <div className="space-y-5 relative z-10">
              <div>
                <p className="text-3xl font-black tracking-tight">{appointmentsData.reduce((acc, day) => acc + day.appointments.length, 0)}</p>
                <p className="text-sm font-medium text-white/70">Total Scheduled</p>
              </div>
              <div className="w-full h-px bg-white/10"></div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <p className="text-sm font-medium text-white/90">Routine</p>
                </div>
                <p className="text-sm font-bold">{appointmentsData.reduce((acc, day) => acc + day.appointments.filter(a => a.severity === 'ROUTINE').length, 0)}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                  <p className="text-sm font-medium text-white/90">Urgent</p>
                </div>
                <p className="text-sm font-bold">{appointmentsData.reduce((acc, day) => acc + day.appointments.filter(a => a.severity === 'URGENT').length, 0)}</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                  <p className="text-sm font-medium text-white/90">Emergency</p>
                </div>
                <p className="text-sm font-bold">{appointmentsData.reduce((acc, day) => acc + day.appointments.filter(a => a.severity === 'EMERGENCY').length, 0)}</p>
              </div>
            </div>
`;

code = code.replace(
  /<div className="space-y-5 relative z-10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  dynamicStats + "\n          </div>\n\n        </div>"
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetAppointments.jsx', code);
