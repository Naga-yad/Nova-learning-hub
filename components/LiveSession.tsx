import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Mic, MicOff, LogOut, UserCheck, AlertTriangle, Clock, Wifi, RefreshCw } from 'lucide-react';
import { ClassSession } from '../types';

interface LiveSessionProps {
  session: ClassSession;
  onLeave: () => void;
  onAttendanceUpdate: (status: 'Present' | 'Absent', minutes: number) => void;
}

export const LiveSession: React.FC<LiveSessionProps> = ({ session, onLeave, onAttendanceUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCamOn, setIsCamOn] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  
  // Attendance logic state
  const [faceDetected, setFaceDetected] = useState(false);
  const [absenceTimer, setAbsenceTimer] = useState(0); // seconds absent
  const [totalPresenceTime, setTotalPresenceTime] = useState(0); // seconds present
  const [sessionStatus, setSessionStatus] = useState<'Active' | 'Terminated'>('Active');
  const [networkQuality, setNetworkQuality] = useState<number>(3); // 3 = Good, 2 = Fair, 1 = Poor
  
  const MAX_ABSENCE_SECONDS = 300; // 5 minutes

  // Start Camera
  const startCamera = async () => {
    setPermissionError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices not supported in this browser");
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCamOn(true);
      setIsMicOn(true);
      setFaceDetected(true); // Mock: Assume face detected if camera is on
    } catch (err: any) {
      console.error("Error accessing media devices:", err);
      let errorMessage = "Could not access camera/microphone.";
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = "Permission denied. Please allow camera and microphone access in your browser settings to join the class.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera or microphone found on this device.";
      }
      setPermissionError(errorMessage);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCamOn(false);
    setIsMicOn(false);
    setFaceDetected(false);
  };

  useEffect(() => {
    // Auto start on mount
    startCamera();
    return () => stopCamera();
  }, []);

  // Warning on tab close to ensure attendance is saved by clicking Leave button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; 
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Network Quality Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate mostly good connection with occasional drops
      const rand = Math.random();
      if (rand > 0.95) setNetworkQuality(1);
      else if (rand > 0.85) setNetworkQuality(2);
      else setNetworkQuality(3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Main Session Timer & Attendance Logic
  useEffect(() => {
    if (sessionStatus === 'Terminated' || permissionError) return;

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);

      if (faceDetected) {
        setTotalPresenceTime(prev => prev + 1);
        setAbsenceTimer(0);
      } else {
        setAbsenceTimer(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [faceDetected, sessionStatus, permissionError]);

  // Check for auto-termination
  useEffect(() => {
    if (absenceTimer > MAX_ABSENCE_SECONDS && sessionStatus === 'Active') {
      setSessionStatus('Terminated');
      stopCamera();
      onAttendanceUpdate('Absent', Math.floor(totalPresenceTime / 60));
    }
  }, [absenceTimer, sessionStatus, onAttendanceUpdate, totalPresenceTime]);

  // Manual toggle for simulation
  const toggleFaceSimulation = () => {
    setFaceDetected(!faceDetected);
  };

  const handleManualLeave = () => {
    if (sessionStatus === 'Terminated') {
        onLeave();
        return;
    }
    const minutesPresent = Math.floor(totalPresenceTime / 60);
    onAttendanceUpdate('Present', minutesPresent);
    stopCamera();
    alert(`Attendance Saved Successfully!\n\nYou were marked present for: ${minutesPresent} minutes.`);
    onLeave();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Remaining time calculation
  const totalDurationSeconds = session.durationMinutes * 60;
  const remainingSeconds = Math.max(0, totalDurationSeconds - sessionTime);

  const getNetworkStatus = () => {
    switch(networkQuality) {
      case 3: return { color: 'text-emerald-500', label: 'Excellent', bars: 3 };
      case 2: return { color: 'text-amber-500', label: 'Fair', bars: 2 };
      default: return { color: 'text-red-500', label: 'Poor', bars: 1 };
    }
  };

  const netStatus = getNetworkStatus();

  if (permissionError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 p-6">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
          <CameraOff size={48} />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Camera Access Required</h2>
          <p className="text-slate-500 dark:text-slate-400">{permissionError}</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={startCamera} 
            className="px-6 py-3 bg-nova-500 text-white rounded-xl font-bold hover:bg-nova-600 flex items-center gap-2"
          >
            <RefreshCw size={20} /> Retry Access
          </button>
          <button 
            onClick={onLeave} 
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (sessionStatus === 'Terminated') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
          <LogOut size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Session Ended</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">You were absent for too long. Your attendance has been recorded based on your active time.</p>
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl w-full max-w-xs">
          <div className="flex justify-between text-sm mb-2 text-slate-700 dark:text-slate-300">
            <span>Time Present:</span>
            <span className="font-bold">{Math.floor(totalPresenceTime / 60)} mins</span>
          </div>
          <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
            <span>Status:</span>
            <span className="font-bold text-red-500">Incomplete</span>
          </div>
        </div>
        <button onClick={onLeave} className="px-6 py-3 bg-nova-500 text-white rounded-xl font-bold hover:bg-nova-600">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900 dark:text-white">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            {session.title}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{session.instructor} • {session.module}</p>
        </div>
        <div className="flex items-center gap-4">
           {/* Network Indicator */}
           <div className="hidden md:flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-600">
             <Wifi size={16} className={netStatus.color} />
             <span className={`text-xs font-bold ${netStatus.color}`}>{netStatus.label}</span>
           </div>

           <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${faceDetected ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
            {faceDetected ? <UserCheck size={16} /> : <AlertTriangle size={16} />}
            <span className="hidden sm:inline">{faceDetected ? 'Face Detected' : 'No Face Detected'}</span>
          </div>
          
          <div className="font-mono text-slate-700 dark:text-slate-200 font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-200 dark:border-slate-600">
            <Clock size={16} className="text-slate-400" />
            <span className={remainingSeconds < 300 ? 'text-red-500 font-bold' : ''}>
              {remainingSeconds === 0 ? 'Overtime' : formatTime(remainingSeconds)}
            </span>
          </div>

          <button onClick={handleManualLeave} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 font-medium text-sm transition-colors">
            Leave Class
          </button>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 bg-slate-900 rounded-3xl overflow-hidden relative shadow-lg group">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${isCamOn ? 'opacity-100' : 'opacity-0'}`}
        />
        
        {!isCamOn && !permissionError && (
           <div className="absolute inset-0 flex items-center justify-center text-white/50">
             <div className="text-center">
                <CameraOff size={64} className="mx-auto mb-4 opacity-50"/>
                <p>Camera is off</p>
             </div>
           </div>
        )}

        {/* Absence Warning Overlay */}
        {!faceDetected && isCamOn && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full backdrop-blur-md shadow-lg animate-bounce flex items-center gap-2 z-10">
             <AlertTriangle size={20} />
             <span>Warning: Face not detected! Session ends in {formatTime(MAX_ABSENCE_SECONDS - absenceTimer)}</span>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 transition-transform duration-300 group-hover:-translate-y-2 z-10">
          <button 
            onClick={() => setIsMicOn(!isMicOn)}
            className={`p-4 rounded-xl transition-all ${isMicOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white hover:bg-red-600'}`}
            title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          
          <button 
            onClick={() => {
              if(isCamOn) stopCamera();
              else startCamera();
            }}
            className={`p-4 rounded-xl transition-all ${isCamOn ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-red-500 text-white hover:bg-red-600'}`}
            title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {isCamOn ? <Camera size={24} /> : <CameraOff size={24} />}
          </button>

          <button
            onClick={toggleFaceSimulation}
            className="px-4 py-2 bg-indigo-500/80 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg ml-2"
          >
            {faceDetected ? 'Simulate Look Away' : 'Simulate Look Back'}
          </button>
        </div>

        {/* Network Status Overlay (Mobile/Video overlay fallback) */}
        <div className="absolute top-4 right-4 md:hidden z-10">
           <div className="bg-black/30 backdrop-blur-sm p-2 rounded-lg">
              <Wifi size={20} className={netStatus.color} />
           </div>
        </div>
      </div>
    </div>
  );
};