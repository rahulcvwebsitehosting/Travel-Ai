
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, BookingRecord } from '../types';
import AgenticButton from './AgenticButton';
import { MOCK_USER, MOCK_BOOKINGS, SAVED_DESTINATIONS, INDIAN_PREFERENCES, INDIA_DEFAULTS } from '../constants';

interface ProfileViewProps {
  onNavigate: (view: AppState) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'history' | 'saved' | 'preferences'>('identity');
  const [userPrefs, setUserPrefs] = useState<string[]>(MOCK_USER.preferences);

  const togglePreference = (pref: string) => {
    setUserPrefs(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN');
  };

  const tabs = [
    { id: 'identity', label: 'Identity Node', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
    { id: 'history', label: 'Mission History', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'saved', label: 'Saved Coords', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z' },
    { id: 'preferences', label: 'AI Parameters', icon: 'M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3 6.006a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.008zm0 6a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.008zm0 6a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-.008z' }
  ];

  return (
    <div className="space-y-16 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Enhanced Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 max-w-6xl mx-auto px-6">
        <div className="relative group">
          <div className="h-44 w-44 rounded-[2rem] bg-zinc-900 p-1 overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] relative z-10 border border-white/5">
            <div className="w-full h-full glass rounded-[1.8rem] flex items-center justify-center text-6xl font-black text-white bg-gradient-to-br from-white/10 to-transparent">
              {MOCK_USER.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
        </div>
        
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
              {MOCK_USER.name}
            </h1>
            <div className="flex gap-2">
              <span className="px-4 py-1 glass rounded-full text-[10px] font-black uppercase tracking-widest text-white border-white/20">
                {MOCK_USER.loyaltyTier}
              </span>
              <span className="px-4 py-1 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest">
                VERIFIED
              </span>
            </div>
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
          </div>
        </div>
      </div>

      {/* Mission Stats Display */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Missions Completed', value: MOCK_USER.stats.missionsCompleted, sub: 'Confirmed Bookings' },
          { label: 'Savings Generated', value: `${INDIA_DEFAULTS.currencySymbol}${formatPrice(MOCK_USER.stats.savingsGenerated)}`, sub: 'AI Negotiations' },
          { label: 'Cities Explored', value: MOCK_USER.stats.citiesExplored, sub: 'Mission Targets' }
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-2xl border-white/5 flex flex-col items-center text-center gap-2 group hover:border-white/10 transition-all">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black text-white group-hover:scale-110 transition-transform">{stat.value}</p>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.2em]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs Navigation */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex border-b border-white/5 gap-12 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-6 text-[11px] font-black uppercase tracking-widest transition-all relative shrink-0 ${
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
          {activeTab === 'identity' && (
            <motion.div 
              key="identity"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="glass p-10 rounded-3xl border-white/5 space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Personal Metadata</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Node Legal Name', value: MOCK_USER.name },
                    { label: 'Secure Email Access', value: MOCK_USER.email },
                    { label: 'Encrypted Contact', value: MOCK_USER.phone },
                    { label: 'Member Since', value: MOCK_USER.memberSince }
                  ].map((field, i) => (
                    <div key={i} className="space-y-2 pb-6 border-b border-white/5">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{field.label}</p>
                      <p className="text-lg font-bold text-white tracking-tight">{field.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass p-10 rounded-3xl border-white/5 space-y-8">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Loyalty Protocol</h3>
                <div className="h-48 glass rounded-2xl flex flex-col items-center justify-center text-center gap-4 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div className="relative z-10 space-y-2">
                    <p className="text-sm font-black text-zinc-500 uppercase tracking-widest">Active Tier</p>
                    <p className="text-5xl font-black text-white uppercase tracking-tighter">{MOCK_USER.loyaltyTier}</p>
                  </div>
                  <div className="h-1.5 w-2/3 bg-zinc-800 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-white w-[85%]"></div>
                  </div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest relative z-10">85% to Zenith Voyager</p>
                </div>
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Available Perks</p>
                  <ul className="space-y-3">
                    {['Zero convenience fees', 'Early check-in priority', 'Complimentary lounge access'].map((perk, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-300">
                        <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Mission Registry</h2>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Showing {MOCK_BOOKINGS.length} Records</span>
              </div>
              
              {MOCK_BOOKINGS.map((booking) => (
                <div key={booking.id} className="glass p-8 rounded-3xl border-white/5 group hover:border-white/10 transition-all flex flex-col md:flex-row gap-8 items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <p className="text-[40px] font-black uppercase leading-none tracking-tighter">{booking.id}</p>
                  </div>
                  <div className="h-28 w-28 md:h-36 md:w-36 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    <img src={booking.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={booking.hotelName} />
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase leading-none">{booking.hotelName}</h3>
                        <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                          booking.status === 'confirmed' ? 'border-white text-white' : 
                          booking.status === 'completed' ? 'border-zinc-800 text-zinc-500' : 'border-red-900/50 text-red-500'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{booking.location}</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-12">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Timeframe</p>
                        <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">{booking.checkIn} — {booking.checkOut}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Mission Value</p>
                        <p className="text-sm font-black text-white">₹{formatPrice(booking.totalPrice)}</p>
                      </div>
                      {booking.agentHash && (
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Agent Verify</p>
                          <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{booking.agentHash}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 relative z-10">
                    <AgenticButton className="px-10 py-4 text-[10px]">View Logistics</AgenticButton>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div 
              key="saved"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {SAVED_DESTINATIONS.map((dest, idx) => (
                <div key={idx} className="glass rounded-[2rem] overflow-hidden border border-white/5 group relative h-96">
                  <img src={dest.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60" alt={dest.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 space-y-3">
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{dest.name}</h3>
                    <p className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em]">{dest.region}</p>
                    <button className="text-[10px] font-black text-white uppercase tracking-widest border-b border-white/30 pb-1 pt-6 hover:border-white transition-all">Launch AI Mission</button>
                  </div>
                </div>
              ))}
              <button className="glass rounded-[2rem] border-white/5 border-dashed border-2 flex flex-col items-center justify-center gap-6 group hover:bg-white/5 transition-all h-96">
                <div className="h-16 w-16 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-white/30 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-white">Pin New Coordinate</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'preferences' && (
            <motion.div 
              key="preferences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl space-y-12"
            >
              <div className="space-y-10">
                <div className="space-y-2">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">AI Filtering Parameters</h3>
                  <p className="text-sm text-zinc-500 font-medium">Configure your mission defaults. Our agents will prioritize these factors in every deployment.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INDIAN_PREFERENCES.map((pref, i) => (
                    <div 
                      key={i} 
                      onClick={() => togglePreference(pref)}
                      className={`flex items-center justify-between p-6 glass rounded-2xl border transition-all cursor-pointer group ${
                        userPrefs.includes(pref) ? 'border-white/30 bg-white/10' : 'border-white/5 hover:border-white/15'
                      }`}
                    >
                      <span className={`text-xs font-black uppercase tracking-widest transition-colors ${userPrefs.includes(pref) ? 'text-white' : 'text-zinc-500'}`}>{pref}</span>
                      <div className={`h-6 w-11 rounded-full relative transition-all border ${
                        userPrefs.includes(pref) ? 'bg-white border-white' : 'bg-zinc-900 border-white/5'
                      }`}>
                        <div className={`absolute top-1 h-3.5 w-3.5 rounded-full transition-all ${
                          userPrefs.includes(pref) ? 'right-1 bg-black' : 'left-1 bg-zinc-700'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Safety & Security</h3>
                <div className="flex flex-wrap gap-4">
                  <AgenticButton className="text-[10px] px-12 py-4">Save Parameters</AgenticButton>
                  <AgenticButton className="text-[10px] px-12 py-4 bg-zinc-900 border-white/5 text-zinc-600">Reset to Defaults</AgenticButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Return Hub */}
      <div className="flex justify-center pt-12">
        <AgenticButton 
          onClick={() => onNavigate(AppState.LANDING)}
          className="px-16 py-6 text-[11px]"
        >
          Return to Mission Hub
        </AgenticButton>
      </div>
    </div>
  );
};

export default ProfileView;
