const fs = require('fs');
let code = fs.readFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', 'utf8');

// 1. Add notificationService import
if (!code.includes("notificationService")) {
  code = code.replace(
    "import { AnimatePresence, motion } from 'framer-motion';",
    "import { AnimatePresence, motion } from 'framer-motion';\nimport notificationService from '../../services/notification.service';\nimport { useNavigate } from 'react-router-dom';"
  );
}

// 2. Add state inside Navbar component
if (!code.includes("const [notifications")) {
  code = code.replace(
    "const location = useLocation();",
    "const location = useLocation();\n  const navigate = useNavigate();\n  const [notifications, setNotifications] = useState([]);\n  const [isNotifOpen, setIsNotifOpen] = useState(false);\n\n  useEffect(() => {\n    if (user) {\n      fetchNotifications();\n    }\n  }, [user, location.pathname]);\n\n  const fetchNotifications = async () => {\n    try {\n      const res = await notificationService.getNotifications();\n      if (res.success) setNotifications(res.data);\n    } catch (e) { console.error(e); }\n  };\n\n  const handleNotifClick = async (notif) => {\n    if (!notif.isRead) {\n      await notificationService.markAsRead(notif._id);\n      setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));\n    }\n    setIsNotifOpen(false);\n    navigate(notif.actionUrl);\n  };\n\n  const markAllRead = async () => {\n    await notificationService.markAllAsRead();\n    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));\n  };\n\n  const unreadCount = notifications.filter(n => !n.isRead).length;"
  );
}

// 3. Replace the Bell icon with the new Dropdown
const bellRegex = /<button className="relative p-1\.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white\/50">[\s\S]*?<\/button>/;

const notifDropdown = `
                <div className="relative">
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-1.5 lg:p-2 text-espresso-500 hover:text-camel-700 transition-colors rounded-full hover:bg-white/50"
                  >
                    <Bell size={18} strokeWidth={2.5} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 lg:top-1.5 right-1.5 lg:right-2 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(90,56,37,0.15)] border border-camel-100 z-50 overflow-hidden flex flex-col max-h-[28rem]"
                        >
                          <div className="p-4 border-b border-camel-100 flex justify-between items-center bg-[#FAF8F5]">
                            <h3 className="font-black text-espresso-900 text-sm uppercase tracking-widest">Notifications</h3>
                            {unreadCount > 0 && (
                              <button onClick={markAllRead} className="text-[10px] font-bold text-camel-600 hover:text-camel-800 uppercase">Mark All Read</button>
                            )}
                          </div>
                          
                          <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {notifications.length === 0 ? (
                              <div className="p-6 text-center text-xs font-medium text-camel-600">
                                No new notifications.
                              </div>
                            ) : (
                              notifications.map(notif => (
                                <div 
                                  key={notif._id} 
                                  onClick={() => handleNotifClick(notif)}
                                  className={\`cursor-pointer p-3 rounded-2xl flex items-start gap-3 transition-colors \${notif.isRead ? 'hover:bg-camel-50' : 'bg-camel-50/50 hover:bg-camel-100'}\`}
                                >
                                  <div className={\`mt-0.5 p-2 rounded-full shrink-0 \${notif.isRead ? 'bg-camel-100 text-camel-600' : 'bg-camel-200 text-camel-800'}\`}>
                                    {notif.type === 'APPOINTMENT' && <Calendar size={14} />}
                                    {notif.type === 'ORDER' && <ShoppingBag size={14} />}
                                    {notif.type === 'VACCINE' && <Activity size={14} />}
                                    {notif.type === 'SYSTEM' && <Bell size={14} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={\`text-xs mb-0.5 truncate \${notif.isRead ? 'font-bold text-espresso-700' : 'font-black text-espresso-900'}\`}>{notif.title}</p>
                                    <p className="text-[11px] text-espresso-500 leading-tight line-clamp-2">{notif.message}</p>
                                    <span className="text-[9px] font-bold text-camel-500 mt-1 block">
                                      {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  {!notif.isRead && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-2"></div>}
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
`;

code = code.replace(bellRegex, notifDropdown);

fs.writeFileSync('d:/Pet-Care/frontend/src/components/molecules/Navbar.jsx', code);
console.log("Navbar patched successfully");
