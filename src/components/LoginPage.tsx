import React, { useEffect, useState } from 'react';
import { Plane, ShieldCheck, Wifi, WifiOff, ChevronRight, Compass, Radio } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, soundEnabled, onToggleSound }) => {
  const fullSubtitle = "invented by radoan rasel";
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullSubtitle.length) {
        setTypedText(fullSubtitle.slice(0, index + 1));
        index++;
      } else {
        setIsTypingDone(true);
        clearInterval(interval);
      }
    }, 90);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 overflow-hidden select-none font-sans">
      {/* Background HUD Aviation Grid & Radar Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Status */}
      <div className="relative z-10 flex justify-between items-center text-xs tracking-widest text-slate-400 font-mono">
        <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-full">
          <Plane className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>US-BANGLA AIRLINES</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            className="px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-full hover:border-slate-700 transition text-[11px] flex items-center gap-1.5"
            title="Toggle Cockpit Audio Chimes"
          >
            <Radio className={`w-3 h-3 ${soundEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] ${
            isOnline ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' : 'bg-amber-950/60 border-amber-800 text-amber-400'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span>{isOnline ? 'ONLINE' : 'OFFLINE MODE'}</span>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-sm mx-auto w-full py-8">
        {/* Aviation Wings/Logo Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-emerald-400 p-0.5 shadow-2xl shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-3 border border-slate-800/80">
              <Compass className="w-10 h-10 text-cyan-400 animate-spin-slow mb-1" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400">B737-800</span>
            </div>
          </div>
          <div className="absolute -bottom-2 bg-slate-900 border border-slate-700 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
            Load & Trim
          </div>
        </motion.div>

        {/* Page Title */}
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-300 uppercase font-mono"
        >
          BOEING TRIM
        </motion.h1>

        {/* Subtitle with Animated Typewriter Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 min-h-[28px] flex items-center justify-center"
        >
          <span className="text-sm font-mono tracking-widest text-cyan-400/90 font-medium bg-slate-900/90 border border-cyan-900/50 px-3 py-1 rounded-md shadow-inner">
            {typedText}
            <span className={`inline-block w-2 h-4 ml-1 bg-cyan-400 align-middle ${isTypingDone ? 'animate-ping' : 'animate-pulse'}`} />
          </span>
        </motion.div>

        {/* App Description Tag */}
        <p className="mt-4 text-xs text-slate-400 max-w-xs leading-relaxed">
          US-Bangla Airlines Flight Dispatch & Load Control Application.
          Calculates ZFW, TOW, LW, %MAC & Stabilizer Trim settings offline.
        </p>

        {/* SINGLE LOGIN BUTTON AS REQUESTED */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full mt-10"
        >
          <button
            onClick={onLogin}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 p-px font-semibold text-white shadow-xl shadow-cyan-500/25 active:scale-[0.98] transition-all duration-200"
          >
            <div className="relative flex items-center justify-center gap-3 rounded-[15px] bg-slate-950 px-6 py-4 transition-all duration-200 group-hover:bg-opacity-80">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-mono text-base font-bold tracking-wider uppercase text-cyan-300">
                Log In
              </span>
              <ChevronRight className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Footer System Meta */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-[11px] font-mono text-slate-500 text-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>OFFLINE LOAD CONTROLLER ENGINE v3.2</span>
        </div>
        <div>OPERATIONAL FOR BOEING 737-800 FLEET (S2-AJA - S2-AJH)</div>
      </div>
    </div>
  );
};
