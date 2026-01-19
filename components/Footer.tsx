
import React from 'react';
import { AppState } from '../types';

interface FooterProps {
  onNavigate: (view: AppState) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="glass-dark border-t border-white/10 py-20 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Branding */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            onClick={() => onNavigate(AppState.LANDING)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-black shadow-2xl text-lg font-black group-hover:scale-110 transition-all">
              TC
            </div>
            <span className="text-2xl font-black text-white">TravelCrew <span className="text-zinc-500 italic">AI</span></span>
          </div>
          <div className="space-y-2">
            <p className="text-zinc-400 leading-relaxed font-medium text-sm">
              Revolutionizing travel through autonomous agent intelligence. Engineered for mission-critical travel planning.
            </p>
            <button 
              onClick={() => onNavigate(AppState.PROFILE)}
              className="text-xs text-white font-black uppercase tracking-widest hover:text-zinc-400 transition-colors border-b border-white/20 pb-0.5"
            >
              Rahul Shyam — CTO & Lead Builder
            </button>
          </div>
        </div>

        {/* Agent Framework */}
        <div className="space-y-6">
          <h3 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Agentic Stack</h3>
          <ul className="space-y-3 text-sm font-bold text-zinc-400">
            <li><button onClick={() => onNavigate(AppState.AGENTS_RESEARCH)} className="hover:text-white transition-colors text-left uppercase text-xs tracking-wider">Research Specialist</button></li>
            <li><button onClick={() => onNavigate(AppState.AGENTS_REVIEWS)} className="hover:text-white transition-colors text-left uppercase text-xs tracking-wider">Review Analyst</button></li>
            <li><button onClick={() => onNavigate(AppState.HOW_IT_WORKS)} className="hover:text-white transition-colors text-left uppercase text-xs tracking-wider">System Flow</button></li>
          </ul>
        </div>

        {/* Security */}
        <div className="space-y-6">
          <h3 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Security Protocol</h3>
          <ul className="space-y-3 text-sm font-bold text-zinc-400">
            <li><button onClick={() => onNavigate(AppState.SECURITY_PRIVACY)} className="hover:text-white transition-colors text-left uppercase text-xs tracking-wider">Quantum Isolation</button></li>
            <li><button onClick={() => onNavigate(AppState.SECURITY_PAYMENTS)} className="hover:text-white transition-colors text-left uppercase text-xs tracking-wider">Payment Shield</button></li>
            <li><button onClick={() => onNavigate(AppState.PRIVACY)} className="hover:text-white transition-colors text-left uppercase text-xs tracking-wider">Identity Privacy</button></li>
          </ul>
        </div>

        {/* Connect Hub */}
        <div className="space-y-6">
          <h3 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Integration</h3>
          <div className="glass p-5 rounded-xl border-white/10">
            <p className="mb-3 text-[10px] text-white font-black uppercase tracking-widest">Protocol Support</p>
            <p className="text-xs text-zinc-400 mb-4 font-medium leading-snug">Abandon "Tab Fatigue". Deploy Agentic Intelligence today.</p>
            <a href="mailto:rahulshyam2006@outlook.com" className="block text-center p-3 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all rounded">
              Contact Engineering
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">
          © 2026 TravelCrew Platform | Chennai Intelligence Hub
        </p>
        <button 
          onClick={() => onNavigate(AppState.PROFILE)}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all"
        >
          Engineered by Rahul Shyam
        </button>
      </div>
    </footer>
  );
};

export default Footer;
