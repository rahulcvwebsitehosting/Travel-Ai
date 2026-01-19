
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, BookingRecord } from '../types';
import AgenticButton from './AgenticButton';
import { MOCK_USER, MOCK_BOOKINGS, SAVED_DESTINATIONS, INDIA_DEFAULTS } from '../constants';

interface ProfileViewProps {
  onNavigate: (view: AppState) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'saved' | 'settings'>('history');

  const getBookingHistory = (): BookingRecord[] => {
    return MOCK_BOOKINGS;
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN');
  };

  const tabs = [
    { id: 'history', label: 'Booking History', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c1.052 0 2.062.18 3 .512v-14.25zM12 6.042A8.967 8.967 0 0118 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-1.052 0-2.062.18-3 .512v-14.25z' },
    { id: 'saved', label: 'Saved Destinations', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    { id: 'settings', label: 'Account Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ];

  return (
    <div className="space-y-16 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto px-6">
        <div className="relative group">
          <div className="h-40 w-40 rounded-3xl bg-zinc-900 p-1 overflow-hidden shadow-2xl relative z-10">
            <div className="w-full h-full glass rounded-2xl flex items-center justify-center text-5xl font-black text-white bg-gradient-to-br from-white/10 to-transparent">
              {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        </div>
        
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              {MOCK_USER.name}
            </h1>
            <span className="px-4 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white border-white/20">
              {MOCK_USER.loyaltyTier}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6 text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span>
              {MOCK_USER.email}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700"></span>
              {MOCK_USER.phone}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-700"></span>
              MEMBER SINCE {MOCK_USER.memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex border-b border-white/5 gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-6 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                </svg>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Mission Registry</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Showing {getBookingHistory().length} Records</span>
              </div>
              
              {getBookingHistory().map((booking) => (
                <div key={booking.id} className="glass p-6 md:p-8 rounded-2xl border-white/5 group hover:border-white/10 transition-all flex flex-col md:flex-row gap-8 items-center">
                  <div className="h-24 w-24 md:h-32 md:w-32 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <img src={booking.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={booking.hotelName} />
                  </div>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <h3 className="text-xl font-black text-white tracking-tight uppercase leading-none">{booking.hotelName}</h3>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                          booking.status === 'confirmed' ? 'border-zinc-400 text-white' : 
                          booking.status === 'completed' ? 'border-zinc-800 text-zinc-500' : 'border-red-900/50 text-red-500'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{booking.location} • ID: {booking.id}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-8">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Temporal Frame</p>
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{booking.checkIn} — {booking.checkOut}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Mission Value</p>
                        <p className="text-xs font-black text-white">₹{formatPrice(booking.totalPrice)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <AgenticButton className="px-8 py-3 text-[9px]">Retrieve Data</AgenticButton>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div 
              key="saved"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {SAVED_DESTINATIONS.map((dest, idx) => (
                <div key={idx} className="glass rounded-2xl overflow-hidden border border-white/5 group relative h-80">
                  <img src={dest.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" alt={dest.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-8 left-8 space-y-2">
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{dest.name}</h3>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">{dest.region}</p>
                    <button className="text-[9px] font-black text-white uppercase tracking-widest border-b border-white/20 pb-1 pt-4 hover:border-white transition-all">Launch Search</button>
                  </div>
                </div>
              ))}
              <button className="glass rounded-2xl border-white/5 border-dashed border-2 flex flex-col items-center justify-center gap-4 group hover:bg-white/5 transition-all h-80">
                <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-white/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white">Map New Intent</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl space-y-12"
            >
              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Security & Preferences</h3>
                
                <div className="space-y-6">
                  {[
                    { label: 'Autonomous Booking Alerts', desc: 'Allow AI agents to notify you of price drops on saved routes.' },
                    { label: 'Biometric Protocol', desc: 'Enable secondary authentication for mission confirmations.' },
                    { label: 'Dark Mode Override', desc: 'Maintain Midnight aesthetic across all device nodes.' }
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between p-6 glass rounded-xl border-white/5">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-white uppercase tracking-widest">{setting.label}</p>
                        <p className="text-[10px] text-zinc-500 font-medium">{setting.desc}</p>
                      </div>
                      <div className="h-6 w-11 bg-zinc-800 rounded-full relative cursor-pointer border border-white/5">
                        <div className="absolute top-1 left-1 h-3.5 w-3.5 bg-zinc-600 rounded-full transition-all group-hover:bg-white"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">System Integration</h3>
                <div className="flex flex-wrap gap-4">
                  <AgenticButton className="text-[9px] px-8">Export Mission History</AgenticButton>
                  <AgenticButton className="text-[9px] px-8 bg-zinc-900 border-red-900/30 text-red-500">Purge Local Storage</AgenticButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-center pt-10">
        <AgenticButton 
          onClick={() => onNavigate(AppState.LANDING)}
          className="px-12 py-5 text-[10px]"
        >
          Return to Mission Hub
        </AgenticButton>
      </div>
    </div>
  );
};

export default ProfileView;
