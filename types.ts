export type UserRole = 'student' | 'guest';

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  department: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface ClassSession {
  id: string;
  title: string;
  module: string;
  instructor: string;
  startTime: string; // ISO string
  durationMinutes: number;
  type: 'Lecture' | 'Quiz' | 'Test';
  isLive: boolean;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  sessionTitle: string;
  date: string;
  status: 'Present' | 'Absent';
  timeOnlineMinutes: number;
}

export interface Mark {
  id: string;
  module: string;
  title: string;
  score: number;
  total: number;
  grade: string;
  date: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
}

export type ViewState = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'profile' 
  | 'schedule' 
  | 'live' 
  | 'attendance' 
  | 'marks' 
  | 'chatbot' 
  | 'groupchat'
  | 'settings';
