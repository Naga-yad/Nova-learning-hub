import React, { useState, useEffect } from 'react';
import { ViewState, User, ClassSession, AttendanceRecord } from './types';
import { Layout } from './components/Layout';
import { Chatbot } from './components/Chatbot';
import { LiveSession } from './components/LiveSession';
import { MOCK_SCHEDULE, MOCK_MARKS, MOCK_ATTENDANCE, INITIAL_GROUP_CHAT } from './constants';
import { 
  User as UserIcon, 
  BookOpen, 
  Award, 
  Clock, 
  PlayCircle,
  CheckCircle2,
  XCircle,
  Search,
  MoreVertical,
  Send,
  Image as ImageIcon,
  Smile,
  LogOut,
  Bell,
  Save,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';

// --- Sub-Components ---

// 1. Landing Page
const LandingPage: React.FC<{ 
  onLogin: () => void; 
  onSignUp: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}> = ({ onLogin, onSignUp, isDarkMode, toggleTheme }) => (
  <div className="relative min-h-screen flex flex-col overflow-hidden font-sans">
    {/* Background Video */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-slate-900/70 z-10"></div> {/* Dark Overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
      >
        <source src="https://cdn.coverr.co/videos/coverr-futuristic-lines-background-loop-5586/1080p.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    {/* Header */}
    <header className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">N</div>
        <span className="text-xl font-bold text-white tracking-wide">NOVA</span>
      </div>
      
      <div className="flex gap-4 items-center">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={onLogin} 
          className="hidden sm:block px-6 py-2.5 text-white font-medium hover:bg-white/10 rounded-xl transition-all"
        >
          Sign In
        </button>
        <button 
          onClick={onSignUp} 
          className="px-6 py-2.5 bg-nova-500 hover:bg-nova-600 text-white font-bold rounded-xl shadow-lg shadow-nova-500/30 transition-all transform hover:scale-105 active:scale-95"
        >
          Get Started
        </button>
      </div>
    </header>

    {/* Main Content */}
    <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto w-full -mt-20">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-nova-200 text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        AI-Powered Learning
      </div>
      
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        Learn Smarter, <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-nova-300 via-blue-200 to-accent-300">Not Harder.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 fill-mode-both">
        Experience the next generation of education. Automated attendance, real-time analytics, and your own personal AI tutor.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 fill-mode-both">
        <button 
          onClick={onSignUp} 
          className="px-8 py-4 bg-white text-slate-900 text-lg font-bold rounded-2xl hover:bg-nova-50 transition-all transform hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2 group"
        >
          Join Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button 
          onClick={onLogin}
          className="px-8 py-4 bg-transparent border border-white/30 text-white text-lg font-bold rounded-2xl hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
        >
          Student Login
        </button>
      </div>
    </main>

    {/* Footer Strip */}
    <div className="relative z-20 border-t border-white/10 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap justify-center md:justify-between items-center gap-4 text-sm text-slate-400">
         <p>© 2024 NOVA Platform</p>
         <div className="flex gap-6">
           <div className="flex items-center gap-2">
             <CheckCircle2 size={16} className="text-emerald-400" />
             <span>Face ID Attendance</span>
           </div>
           <div className="flex items-center gap-2">
             <CheckCircle2 size={16} className="text-emerald-400" />
             <span>Live Classes</span>
           </div>
           <div className="flex items-center gap-2">
             <CheckCircle2 size={16} className="text-emerald-400" />
             <span>AI Support</span>
           </div>
         </div>
      </div>
    </div>
  </div>
);

// 2. Auth Components
const AuthPage: React.FC<{ type: 'login' | 'signup', onAuth: (user: User) => void, onSwitch: () => void }> = ({ type, onAuth, onSwitch }) => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', dept: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock Auth
    onAuth({
      id: 'u1',
      fullName: formData.name || 'Student User',
      email: formData.email,
      username: formData.email.split('@')[0],
      department: formData.dept || 'Computer Science',
      role: 'student',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 transition-colors duration-300">
        <h2 className="text-3xl font-bold text-center mb-2 text-slate-800 dark:text-white">
          {type === 'login' ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-center text-slate-400 dark:text-slate-500 mb-8">
          {type === 'login' ? 'Enter your details to sign in.' : 'Join the NOVA community today.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
             <>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nova-400 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Department</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nova-400 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="Engineering"
                  value={formData.dept}
                  onChange={e => setFormData({...formData, dept: e.target.value})}
                />
              </div>
             </>
          )}
          
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nova-400 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="student@nova.edu"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
             <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-nova-400 transition-all font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className="w-full py-4 mt-4 bg-nova-500 text-white font-bold rounded-xl shadow-lg shadow-nova-200 dark:shadow-none hover:bg-nova-600 active:scale-[0.98] transition-all">
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={onSwitch} className="text-slate-500 hover:text-nova-500 dark:text-slate-400 dark:hover:text-nova-400 font-bold text-sm transition-colors">
            {type === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Main Dashboard Widgets
const Dashboard: React.FC<{ user: User, onNavigate: (view: ViewState) => void }> = ({ user, onNavigate }) => {
  const nextClass = MOCK_SCHEDULE.find(s => new Date(s.startTime) > new Date()) || MOCK_SCHEDULE[0];
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-nova-500 to-accent-500 rounded-3xl p-8 text-white shadow-xl shadow-nova-200 dark:shadow-none relative overflow-hidden transition-all hover:shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.fullName.split(' ')[0]}! 👋</h1>
          <p className="text-nova-100 mb-6 max-w-lg">You have a live session coming up. Don't forget to check your camera before joining.</p>
          <div className="flex gap-3">
             <button onClick={() => onNavigate('live')} className="px-6 py-2 bg-white text-nova-600 font-bold rounded-xl shadow-md hover:bg-nova-50 transition-colors">
               Join Next Class
             </button>
             <button onClick={() => onNavigate('schedule')} className="px-6 py-2 bg-nova-600 text-white font-bold rounded-xl border border-nova-400 hover:bg-nova-700 transition-colors">
               View Schedule
             </button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center hover:shadow-md transition-all hover:-translate-y-1">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-lg">Attendance</h3>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white my-2">92%</p>
          <p className="text-sm text-slate-400">Great job! Keep it up.</p>
        </div>

        {/* Next Class Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
               <Clock size={24} />
             </div>
             <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Next Up</span>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-xl mb-1">{nextClass.title}</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{nextClass.module}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <span>{new Date(nextClass.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span>•</span>
            <span>{nextClass.durationMinutes} min</span>
          </div>
        </div>

        {/* Marks Summary */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
               <Award size={24} />
             </div>
             <button onClick={() => onNavigate('marks')} className="text-slate-400 hover:text-nova-500 dark:hover:text-nova-400 transition-colors">
               <MoreVertical size={20} />
             </button>
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-xl mb-1">Recent Grades</h3>
          <div className="space-y-3 mt-4">
             {MOCK_MARKS.slice(0, 2).map(m => (
               <div key={m.id} className="flex justify-between items-center text-sm">
                 <span className="text-slate-600 dark:text-slate-300 truncate max-w-[120px]">{m.title}</span>
                 <span className="font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-md">{m.grade}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. Schedule Page
const SchedulePage: React.FC = () => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Schedule</h2>
      <div className="flex gap-2">
         <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Day</button>
         <button className="px-4 py-2 bg-nova-500 text-white rounded-xl font-bold">Week</button>
      </div>
    </div>
    
    <div className="space-y-4">
      {MOCK_SCHEDULE.map(session => (
        <div key={session.id} className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex flex-col items-center justify-center min-w-[80px] text-center">
             <span className="text-slate-400 font-bold text-sm uppercase">{new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'short' })}</span>
             <span className="text-2xl font-black text-slate-800 dark:text-white">{new Date(session.startTime).getDate()}</span>
          </div>
          
          <div className="h-12 w-1 bg-slate-100 dark:bg-slate-700 rounded-full hidden md:block group-hover:bg-nova-400 transition-colors"></div>
          
          <div className="flex-1">
             <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{session.title}</h3>
                {session.isLive && <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase rounded-md animate-pulse">Live</span>}
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
               <BookOpen size={14} /> {session.module} 
               <span className="mx-2">•</span>
               <UserIcon size={14} /> {session.instructor}
             </p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
             <div className="text-right flex-1 md:flex-none">
                <p className="font-bold text-slate-700 dark:text-slate-200">{new Date(session.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                <p className="text-xs text-slate-400">{session.durationMinutes} min</p>
             </div>
             {session.isLive ? (
               <button className="flex-1 md:flex-none px-6 py-3 bg-nova-500 text-white font-bold rounded-xl hover:bg-nova-600 hover:scale-105 transition-all flex items-center justify-center gap-2">
                 <PlayCircle size={18} /> Join
               </button>
             ) : (
                <div className="w-[100px]"></div>
             )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 5. Group Chat Mock
const GroupChat: React.FC = () => {
  const [msgText, setMsgText] = useState('');
  
  return (
    <div className="h-[calc(100vh-140px)] bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex overflow-hidden transition-colors animate-in fade-in duration-500">
      {/* Sidebar List */}
      <div className="w-80 border-r border-slate-100 dark:border-slate-700 flex flex-col hidden md:flex">
         <div className="p-4 border-b border-slate-100 dark:border-slate-700">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <input type="text" placeholder="Search groups..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-nova-200 text-slate-800 dark:text-white" />
           </div>
         </div>
         <div className="flex-1 overflow-y-auto">
            {['Frontend Engineering', 'CS 101', 'Project Alpha'].map((name, i) => (
              <div key={name} className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${i===0 ? 'bg-nova-50 dark:bg-nova-900/20 border-r-4 border-nova-500' : ''}`}>
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                   {name.substring(0,2).toUpperCase()}
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <h4 className="font-bold text-slate-700 dark:text-slate-200 truncate">{name}</h4>
                   <p className="text-xs text-slate-400 truncate">Alice: Thanks for the help!</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30 dark:bg-slate-900/50">
        <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center shadow-sm z-10">
           <h3 className="font-bold text-lg text-slate-800 dark:text-white">Frontend Engineering Group</h3>
           <div className="flex -space-x-2">
              {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800"></div>)}
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">+12</div>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
           {INITIAL_GROUP_CHAT.map(msg => (
             <div key={msg.id} className={`flex gap-3 ${msg.senderId === 'me' ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0"></div>
                <div>
                   <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                      <span className="text-[10px] text-slate-400">10:42 AM</span>
                   </div>
                   <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-600 dark:text-slate-200 text-sm max-w-md border border-slate-100 dark:border-slate-600">
                      {msg.text}
                   </div>
                </div>
             </div>
           ))}
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
           <div className="flex gap-2">
              <button className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"><ImageIcon size={20} /></button>
              <button className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"><Smile size={20} /></button>
              <input 
                className="flex-1 bg-slate-50 dark:bg-slate-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-nova-200 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all"
                placeholder="Type a message..."
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
              />
              <button className="p-3 bg-nova-500 text-white rounded-xl hover:bg-nova-600 transition-colors shadow-lg shadow-nova-200 dark:shadow-none"><Send size={20} /></button>
           </div>
        </div>
      </div>
    </div>
  );
}

// 6. Settings Page
const SettingsPage: React.FC<{isDarkMode: boolean; toggleTheme: () => void}> = ({isDarkMode, toggleTheme}) => {
  const [prefs, setPrefs] = useState({
    liveSession: true,
    attendanceUpdates: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <Bell className="text-nova-500" /> Preferences
        </h3>

        <div className="space-y-8">
           {/* Theme Toggle in Settings */}
           <div className="flex items-center justify-between group cursor-pointer" onClick={toggleTheme}>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-nova-600 dark:group-hover:text-nova-400 transition-colors">Theme</p>
                <p className="text-sm text-slate-400">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
              </div>
              <div className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}>
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
           </div>

           <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

           <div className="flex items-center justify-between group cursor-pointer" onClick={() => setPrefs(p => ({...p, liveSession: !p.liveSession}))}>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-nova-600 dark:group-hover:text-nova-400 transition-colors">Live Class Reminders</p>
                <p className="text-sm text-slate-400">Get notified 15 minutes before class starts.</p>
              </div>
              <div
                className={`w-14 h-8 rounded-full transition-all duration-300 relative flex items-center ${prefs.liveSession ? 'bg-nova-500' : 'bg-slate-200 dark:bg-slate-600'}`}
              >
                <span className={`absolute left-1 bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300 transform ${prefs.liveSession ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
           </div>
           
           <div className="w-full h-px bg-slate-50 dark:bg-slate-700"></div>

           <div className="flex items-center justify-between group cursor-pointer" onClick={() => setPrefs(p => ({...p, attendanceUpdates: !p.attendanceUpdates}))}>
              <div>
                <p className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-nova-600 dark:group-hover:text-nova-400 transition-colors">Attendance Updates</p>
                <p className="text-sm text-slate-400">Receive alerts when your attendance status changes.</p>
              </div>
              <div
                className={`w-14 h-8 rounded-full transition-all duration-300 relative flex items-center ${prefs.attendanceUpdates ? 'bg-nova-500' : 'bg-slate-200 dark:bg-slate-600'}`}
              >
                 <span className={`absolute left-1 bg-white w-6 h-6 rounded-full shadow-md transition-all duration-300 transform ${prefs.attendanceUpdates ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
           </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-end">
          <button 
            onClick={handleSave}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              saved 
                ? 'bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none shadow-lg' 
                : 'bg-slate-900 dark:bg-slate-700 text-white shadow-lg hover:bg-slate-800 dark:hover:bg-slate-600'
            }`}
          >
            {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {saved ? 'Changes Saved' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [activeSession, setActiveSession] = useState<ClassSession | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);
  
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
       return localStorage.getItem('theme') === 'dark' || 
              (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Simple Router Logic
  const handleAuth = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setActiveSession(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onLogin={() => setCurrentView('login')} onSignUp={() => setCurrentView('signup')} isDarkMode={darkMode} toggleTheme={toggleTheme} />;
      case 'login':
        return <AuthPage type="login" onAuth={handleAuth} onSwitch={() => setCurrentView('signup')} />;
      case 'signup':
        return <AuthPage type="signup" onAuth={handleAuth} onSwitch={() => setCurrentView('login')} />;
      case 'dashboard':
        return <Dashboard user={user!} onNavigate={setCurrentView} />;
      case 'profile':
        return (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-700 mb-6 overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                <img src={user?.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{user?.fullName}</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-6">@{user?.username} • {user?.department}</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                 <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-400 uppercase font-bold">Email</p>
                    <p className="font-medium text-slate-700 dark:text-slate-200">{user?.email}</p>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-400 uppercase font-bold">Role</p>
                    <p className="font-medium text-slate-700 dark:text-slate-200 capitalize">{user?.role}</p>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'chatbot':
        return <Chatbot />;
      case 'schedule':
        return <SchedulePage />;
      case 'live':
        // Find a mock session if none selected, or just use the first live one
        const sessionToJoin = activeSession || MOCK_SCHEDULE.find(s => s.isLive) || MOCK_SCHEDULE[0];
        return (
          <LiveSession 
            session={sessionToJoin} 
            onLeave={() => {
              setActiveSession(null);
              setCurrentView('dashboard');
            }}
            onAttendanceUpdate={(status, time) => {
              const newRecord: AttendanceRecord = {
                id: Date.now().toString(),
                sessionId: sessionToJoin.id,
                sessionTitle: sessionToJoin.title,
                date: new Date().toLocaleDateString(),
                status: status,
                timeOnlineMinutes: time
              };
              setAttendanceRecords(prev => [newRecord, ...prev]);
            }}
          />
        );
      case 'groupchat':
        return <GroupChat />;
      case 'marks':
        return (
           <div className="space-y-6 animate-in fade-in duration-500">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Performance</h2>
             <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                    <tr>
                      <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Module</th>
                      <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Assessment</th>
                      <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Date</th>
                      <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Score</th>
                      <th className="p-6 font-bold text-slate-600 dark:text-slate-300">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {MOCK_MARKS.map(mark => (
                      <tr key={mark.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="p-6 font-medium text-slate-800 dark:text-white">{mark.module}</td>
                        <td className="p-6 text-slate-600 dark:text-slate-300">{mark.title}</td>
                        <td className="p-6 text-slate-500 dark:text-slate-400 text-sm">{mark.date}</td>
                        <td className="p-6 font-bold text-slate-800 dark:text-white">{mark.score}/{mark.total}</td>
                        <td className="p-6">
                          <span className={`px-3 py-1 rounded-lg text-sm font-bold ${mark.grade.startsWith('A') ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
                            {mark.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        );
      case 'attendance':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Dashboard</h2>
               <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-4 py-2 rounded-xl font-bold text-sm">
                 Overall: 92% Present
               </div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
               {attendanceRecords.map(record => (
                 <div key={record.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                   <div>
                     <h4 className="font-bold text-slate-800 dark:text-white">{record.sessionTitle}</h4>
                     <p className="text-sm text-slate-500 dark:text-slate-400">{record.date}</p>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-xs text-slate-400 uppercase font-bold">Duration</p>
                        <p className="font-mono text-slate-700 dark:text-slate-300">{record.timeOnlineMinutes} mins</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 ${
                        record.status === 'Present' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}>
                        {record.status === 'Present' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        {record.status}
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        );
      case 'settings':
        return <SettingsPage isDarkMode={darkMode} toggleTheme={toggleTheme} />;
      default:
        return <Dashboard user={user!} onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={setCurrentView} 
      user={user} 
      onLogout={handleLogout}
      isDarkMode={darkMode}
      onToggleTheme={toggleTheme}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;