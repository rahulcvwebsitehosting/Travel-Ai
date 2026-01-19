
import React from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types';
import AgenticButton from './AgenticButton';

interface HeaderProps {
  onNavigate: (view: AppState) => void;
  currentView: AppState;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
  return (
    <header className="glass-dark border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={() => onNavigate(AppState.LANDING)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-all duration-300 text-xl font-black">
            TC
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            TravelCrew <span className="text-zinc-500 italic">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-widest font-bold">
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            onClick={() => onNavigate(AppState.FLIGHTS)} 
            className={`px-4 py-2 rounded-lg transition-colors relative group ${currentView === AppState.FLIGHTS ? 'text-white' : 'text-zinc-500'}`}
          >
            Flights
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            onClick={() => onNavigate(AppState.LANDING)} 
            className={`px-4 py-2 rounded-lg transition-colors relative ${currentView === AppState.LANDING ? 'text-white' : 'text-zinc-500'}`}
          >
            Hotels
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            onClick={() => onNavigate(AppState.DESTINATIONS)} 
            className={`px-4 py-2 rounded-lg transition-colors relative ${currentView === AppState.DESTINATIONS ? 'text-white' : 'text-zinc-500'}`}
          >
            Destinations
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            onClick={() => onNavigate(AppState.SUPPORT)} 
            className={`px-4 py-2 rounded-lg transition-colors relative ${currentView === AppState.SUPPORT ? 'text-white' : 'text-zinc-500'}`}
          >
            Support
          </motion.button>
        </nav>

        <div className="flex items-center gap-6">
          <AgenticButton 
            onClick={() => onNavigate(AppState.LANDING)}
            className="hidden sm:flex text-[11px]"
          >
            Launch Mission
          </AgenticButton>
          <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-white/60">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
