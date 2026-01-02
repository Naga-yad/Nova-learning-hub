import React from 'react';
import { ViewState, User } from '../types';
import { 
  Home, 
  User as UserIcon, 
  MessageCircle, 
  Users, 
  Calendar, 
  Video, 
  CheckSquare, 
  BarChart2, 
  LogOut,
  Menu,
  X,
  Settings,
  Moon,
  Sun
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onChangeView, 
  user, 
  onLogout,
  isDarkMode,
  onToggleTheme
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // If no user (landing/auth), just render children
  if (!user) {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">{children}</div>;
  }

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'chatbot', label: 'AI Helper', icon: MessageCircle },
    { id: 'groupchat', label: 'Groups', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'live', label: 'Live Class', icon: Video, highlight: true },
    { id: 'attendance', label: 'Attendance', icon: CheckSquare },
    { id: 'marks', label: 'Marks', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (view: string) => {
    onChangeView(view as ViewState);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-sm z-20 transition-colors duration-300">
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-nova-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-nova-200 dark:shadow-none">
              N
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">NOVA</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? 'bg-nova-50 dark:bg-nova-900/30 text-nova-600 dark:text-nova-400 shadow-sm ring-1 ring-nova-200 dark:ring-nova-800'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
                } ${item.highlight && !isActive ? 'text-accent-600 dark:text-accent-400' : ''}`}
              >
                <Icon size={20} className={isActive ? 'text-nova-500 dark:text-nova-400' : item.highlight ? 'text-accent-500' : 'text-slate-400 dark:text-slate-500'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button 
            onClick={onToggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-slate-800 z-30 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between transition-colors duration-300">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-nova-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            N
          </div>
          <span className="font-bold text-slate-800 dark:text-white">NOVA</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white dark:bg-slate-800 z-20 pt-16 flex flex-col animate-in fade-in slide-in-from-top-5 duration-200">
           <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-colors font-medium text-lg ${
                    isActive
                      ? 'bg-nova-50 dark:bg-nova-900/30 text-nova-600 dark:text-nova-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon size={24} className={isActive ? 'text-nova-500 dark:text-nova-400' : 'text-slate-400 dark:text-slate-500'} />
                  {item.label}
                </button>
              );
            })}
             <div className="border-t border-slate-100 dark:border-slate-700 my-4 pt-4 space-y-2">
               <button 
                onClick={onToggleTheme}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium text-lg"
              >
                {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>

               <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-lg"
              >
                <LogOut size={24} />
                Logout
              </button>
             </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};