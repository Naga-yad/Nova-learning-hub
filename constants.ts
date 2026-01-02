import { ClassSession, Mark, AttendanceRecord, ChatMessage } from './types';

export const MOCK_SCHEDULE: ClassSession[] = [
  {
    id: 's1',
    title: 'Advanced React Patterns',
    module: 'Frontend Engineering',
    instructor: 'Dr. Sarah Smith',
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    durationMinutes: 60,
    type: 'Lecture',
    isLive: true,
  },
  {
    id: 's2',
    title: 'Data Structures Quiz',
    module: 'Computer Science 101',
    instructor: 'Prof. Alan Turing',
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    durationMinutes: 45,
    type: 'Quiz',
    isLive: false,
  },
  {
    id: 's3',
    title: 'System Design Interview',
    module: 'Career Prep',
    instructor: 'Jane Doe',
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    durationMinutes: 90,
    type: 'Test',
    isLive: false,
  },
];

export const MOCK_MARKS: Mark[] = [
  { id: 'm1', module: 'Frontend Engineering', title: 'Midterm Project', score: 85, total: 100, grade: 'A', date: '2023-10-15' },
  { id: 'm2', module: 'Computer Science 101', title: 'Algorithm Quiz', score: 92, total: 100, grade: 'A+', date: '2023-10-20' },
  { id: 'm3', module: 'Database Systems', title: 'SQL Exam', score: 78, total: 100, grade: 'B', date: '2023-10-25' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', sessionId: 's101', sessionTitle: 'Intro to React', date: '2023-11-01', status: 'Present', timeOnlineMinutes: 58 },
  { id: 'a2', sessionId: 's102', sessionTitle: 'Hooks Deep Dive', date: '2023-11-03', status: 'Present', timeOnlineMinutes: 60 },
  { id: 'a3', sessionId: 's103', sessionTitle: 'State Management', date: '2023-11-05', status: 'Absent', timeOnlineMinutes: 0 },
];

export const INITIAL_GROUP_CHAT: ChatMessage[] = [
  { id: '1', senderId: 'user2', senderName: 'Alice', text: 'Has anyone started the assignment?', timestamp: Date.now() - 100000 },
  { id: '2', senderId: 'user3', senderName: 'Bob', text: 'Yes, it is quite tough!', timestamp: Date.now() - 80000 },
];
