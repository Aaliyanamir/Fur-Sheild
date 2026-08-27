const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/pages/VetAppointments.jsx', 'utf8');

// Replace static data with state and fetch logic
const replacement = `
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { default: vetService } = await import('../services/vet.service');
        const res = await vetService.getQueue();
        if (res.success) {
          // Group by Date
          const grouped = {};
          res.data.forEach(appt => {
            const date = new Date(appt.scheduledAt);
            // Format as YYYY-MM-DD for grouping
            const dateStr = date.toISOString().split('T')[0];
            
            if (!grouped[dateStr]) {
              // Create friendly label
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              
              let label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              if (dateStr === today.toISOString().split('T')[0]) {
                label = "Today, " + label;
              } else if (dateStr === tomorrow.toISOString().split('T')[0]) {
                label = "Tomorrow, " + label;
              } else {
                label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
              }
              
              grouped[dateStr] = {
                _id: dateStr,
                dateLabel: label,
                timestamp: date.getTime(),
                appointments: []
              };
            }
            
            const isWalkin = !appt.petId && appt.walkInDetails;
            const petAvatarUrl = isWalkin ? appt.walkInDetails.petAvatarUrl : appt.petId?.avatarUrl;
            
            grouped[dateStr].appointments.push({
              id: appt._id,
              time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              duration: "30 min", // default mock duration
              patient: { 
                name: isWalkin ? appt.walkInDetails.petName : (appt.petId?.name || 'Unknown'), 
                breed: isWalkin ? appt.walkInDetails.breed : (appt.petId?.breed || 'Unknown'), 
                image: petAvatarUrl ? (petAvatarUrl.startsWith('http') ? petAvatarUrl : \`http://localhost:5000\${petAvatarUrl}\`) : '/images/product-placeholder.jpg'
              },
              owner: { name: isWalkin ? appt.walkInDetails.ownerName : (appt.ownerId?.name || 'Unknown') },
              reason: appt.reason,
              severity: appt.severity,
              status: appt.status
            });
          });
          
          // Convert to array and sort by date
          const groupedArray = Object.values(grouped).sort((a, b) => a.timestamp - b.timestamp);
          setAppointmentsData(groupedArray);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);
`;

code = code.replace(
  /const \[selectedDate, setSelectedDate\] = useState\(new Date\(\)\);[\s\S]*?const getSeverityBadge = \(severity\) => \{/,
  replacement + "\n\n  const getSeverityBadge = (severity) => {"
);

// Add Avatar component inside file since we need it for fallback
const avatarComponent = `
const Avatar = ({ src, alt, name, className }) => {
  const [error, setError] = useState(false);
  if (error || !src || src.includes('product-placeholder')) {
    return (
      <div className={\`flex items-center justify-center font-bold text-espresso-500 bg-camel-100 \${className}\`}>
        {name ? name.charAt(0).toUpperCase() : 'U'}
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};
`;

code = code.replace("export default function VetAppointments() {", avatarComponent + "\nexport default function VetAppointments() {");

// Change map iteration to appointmentsData
code = code.replace(/mockSchedule\.map/g, "appointmentsData.map");

// Update image tag to Avatar tag
code = code.replace(
  /<img src=\{appt\.patient\.image\} alt=\{appt\.patient\.name\} className="w-14 h-14 rounded-full object-cover border-2 border-camel-50 shadow-sm" \/>/g,
  `<Avatar src={appt.patient.image} alt={appt.patient.name} name={appt.patient.name} className="w-14 h-14 rounded-full object-cover border-2 border-camel-50 shadow-sm" />`
);

// Add loading state
code = code.replace(
  /<div className="space-y-8">/,
  `<div className="space-y-8">
            {loading ? (
              <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-camel-600"></div></div>
            ) : appointmentsData.length === 0 ? (
              <div className="text-center p-8 bg-white border border-camel-100 rounded-[1.5rem] shadow-sm text-espresso-500 text-sm font-medium">No upcoming appointments.</div>
            ) : null}`
);

fs.writeFileSync('d:/Pet-Care/frontend/src/pages/VetAppointments.jsx', code);
