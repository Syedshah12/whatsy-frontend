// import { useState } from 'react';
// import { Home, CircleDot, Video, User, Settings, Radio, BarChart3, Receipt, } from 'lucide-react';
// import ChatPage from '../pages/User/ChatPage';
// import StatusPage from '../pages/User/StatusPage';
// import SettingsPage from '../pages/User/SettingsPage';
// import BroadcastTemplate from '../pages/User/BroadcastTemplate';
// import Analytics from '../pages/User/Analytics';
// import BillingDashboard from '../pages/User/BillingDashboard';

// const TABS = [
//   {
//     id: "home",
//     icon: Home,
//     component: ChatPage,
//   },
//   {
//     id: "status",
//     icon: Radio,
//     component: BroadcastTemplate,
//   },
//   {
//     id: "analytics",
//     icon: BarChart3,
//     component: Analytics,
//   },
//   {
//     id: "Billing",
//     icon:  Receipt,
//     component: BillingDashboard,
//   },
// ];

// const MainLayout = () => {
//   const [activeTab, setActiveTab] = useState('home');

//   const ActiveComponent = [...TABS, { id: 'settings', component: SettingsPage }]
//     .find(t => t.id === activeTab)?.component || ChatPage;

//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] font-sans antialiased text-slate-700">
      
//       {/* Sidebar */}
//       <div className="flex h-full w-16 flex-col justify-between bg-[#04432e] py-4 items-center shrink-0">
//         <div className="flex flex-col items-center gap-5 w-full">
          
//           {/* Logo */}
//           <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#04432e] shadow-sm">
//             <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
//               <path d="M12.004 2C6.51 2 2.014 6.5 2.014 12c0 2.14.675 4.14 1.833 5.8l-1.167 4.27 4.37-1.14A9.948 9.948 0 0012.004 22c5.495 0 9.99-4.5 9.99-10S17.5 2 12.004 2zm5.72 14.12c-.24.68-1.4 1.24-1.93 1.32-.47.07-1.09.12-3.17-.74-2.65-1.1-4.35-3.8-4.48-3.98-.13-.17-1.04-1.39-1.04-2.65 0-1.26.65-1.88.88-2.13.23-.25.5-.32.67-.32.17 0 .34 0 .49.01.16 0 .37-.06.57.43.21.52.73 1.79.79 1.92.06.13.1.28.01.45-.09.18-.14.28-.28.45-.14.16-.3.37-.43.49-.15.15-.31.32-.13.63.18.3.8 1.32 1.72 2.14.18.16.83.68 1.48.9.32.1.62.08.85-.04.23-.13.73-.85.93-1.14.2-.29.4-.24.67-.14.27.09 1.72.81 2.02.96.3.15.5.22.57.34.08.13.08.75-.16 1.43z"/>
//             </svg>
//           </div>

//           {/* Main tabs */}
//           {TABS.map(({ id, icon: Icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveTab(id)}
//               className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
//                 activeTab === id
//                   ? 'bg-white/10 text-white'
//                   : 'text-emerald-100/60 hover:text-white hover:bg-white/5'
//               }`}
//             >
//               <Icon className="h-5 w-5" />
//             </button>
//           ))}
//         </div>

//         {/* Settings at bottom */}
//         <button
//           onClick={() => setActiveTab('settings')}
//           className={`flex h-11 w-11 items-center justify-center rounded-xl transition hover:text-white hover:bg-white/5 ${
//             activeTab === 'settings'
//               ? 'bg-white/10 text-white'
//               : 'text-emerald-100/60'
//           }`}
//         >
//           <Settings className="h-5 w-5" />
//         </button>
//       </div>

//       {/* Page content */}
//       <div className="flex flex-1 h-full overflow-hidden">
//         <ActiveComponent />
//       </div>

//     </div>
//   );
// };

// export default MainLayout;
import { useState } from 'react';
import { Home, Settings, Radio, BarChart3, Receipt, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

import ChatPage from '../pages/User/ChatPage';
import BroadcastTemplate from '../pages/User/BroadcastTemplate';
import Analytics from '../pages/User/Analytics';
import BillingDashboard from '../pages/User/BillingDashboard';

const TABS = [
  { id: 'home',      icon: Home,     component: ChatPage },
  { id: 'status',    icon: Radio,    component: BroadcastTemplate },
  { id: 'analytics', icon: BarChart3, component: Analytics },
  { id: 'billing',   icon: Receipt,  component: BillingDashboard },
];

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState('home');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component || ChatPage;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] font-sans antialiased text-slate-700">

      {/* Sidebar */}
      <div className="flex h-full w-16 flex-col justify-between bg-[#04432e] py-4 items-center shrink-0">
        <div className="flex flex-col items-center gap-5 w-full">

          {/* Logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#04432e] shadow-sm">
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current">
              <path d="M12.004 2C6.51 2 2.014 6.5 2.014 12c0 2.14.675 4.14 1.833 5.8l-1.167 4.27 4.37-1.14A9.948 9.948 0 0012.004 22c5.495 0 9.99-4.5 9.99-10S17.5 2 12.004 2zm5.72 14.12c-.24.68-1.4 1.24-1.93 1.32-.47.07-1.09.12-3.17-.74-2.65-1.1-4.35-3.8-4.48-3.98-.13-.17-1.04-1.39-1.04-2.65 0-1.26.65-1.88.88-2.13.23-.25.5-.32.67-.32.17 0 .34 0 .49.01.16 0 .37-.06.57.43.21.52.73 1.79.79 1.92.06.13.1.28.01.45-.09.18-.14.28-.28.45-.14.16-.3.37-.43.49-.15.15-.31.32-.13.63.18.3.8 1.32 1.72 2.14.18.16.83.68 1.48.9.32.1.62.08.85-.04.23-.13.73-.85.93-1.14.2-.29.4-.24.67-.14.27.09 1.72.81 2.02.96.3.15.5.22.57.34.08.13.08.75-.16 1.43z"/>
            </svg>
          </div>

          {/* Nav tabs */}
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                activeTab === id
                  ? 'bg-white/10 text-white'
                  : 'text-emerald-100/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>

        {/* Logout at bottom */}
        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex h-11 w-11 items-center justify-center rounded-xl text-emerald-100/60 transition hover:text-red-400 hover:bg-white/5"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>

      {/* Page content */}
      <div className="flex flex-1 h-full overflow-hidden">
        <ActiveComponent />
      </div>

    </div>
  );
};

export default MainLayout;