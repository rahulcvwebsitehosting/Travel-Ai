
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import AgentStatusPanel from './components/AgentStatusPanel';
import HotelCard from './components/HotelCard';
import ProfileView from './components/ProfileView';
import InfoView from './components/InfoView';
import AgenticButton from './components/AgenticButton';
import FloatingChat from './components/FloatingChat';
import { AppState, Hotel, AgentLog, ChatMessage, GroundingSource } from './types';
import { TRENDING_SEARCHES } from './constants';
import { searchHotels, chatWithCrew } from './services/geminiService';

const ESTIMATED_DEPLOY_TIME = 25; 

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([
    { agent: 'Research Specialist', status: 'pending', message: 'Searching multiple platforms...' },
    { agent: 'Review Analyst', status: 'pending', message: 'Analyzing sentiment from 1000s of reviews...' },
    { agent: 'Price Specialist', status: 'pending', message: 'Comparing rates across 8+ sources...' },
    { agent: 'Amenity Checker', status: 'pending', message: 'Verifying facilities & dietary options...' },
    { agent: 'Booking Coordinator', status: 'pending', message: 'Ready for final confirmation...' }
  ]);
  const [results, setResults] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [missionTimer, setMissionTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isLoading && (appState === AppState.SEARCHING)) {
      const start = Date.now();
      timerRef.current = window.setInterval(() => {
        setMissionTimer(Math.floor((Date.now() - start) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLoading, appState]);

  const handleSearch = async (customQuery?: string) => {
    const activeQuery = customQuery || query;
    if (!activeQuery.trim()) return;

    setError(null);
    setAppState(AppState.SEARCHING);
    setIsLoading(true);
    setMissionTimer(0);
    setMessages([{ 
      id: Date.now().toString(), 
      role: 'user', 
      content: activeQuery, 
      timestamp: new Date().toLocaleTimeString() 
    }]);

    setAgentLogs(prev => prev.map(l => ({ ...l, status: 'pending' })));

    try {
      const stepTimer = window.setInterval(() => {
        setAgentLogs(prev => {
          const firstPending = prev.findIndex(l => l.status === 'pending');
          if (firstPending === -1) return prev;
          const newLogs = [...prev];
          newLogs[firstPending].status = 'working';
          if (firstPending > 0) newLogs[firstPending - 1].status = 'completed';
          return newLogs;
        });
      }, 2000);

      const response = await searchHotels(activeQuery);
      
      clearInterval(stepTimer);
      setAgentLogs(prev => prev.map(l => ({ ...l, status: 'completed' })));
      
      const hotels = response.hotels || [];
      setResults(hotels);
      setGroundingSources(response.sources || []);
      
      const locationName = hotels[0]?.location ? hotels[0].location.split(',')[0] : 'your destination';

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Crew mission success. Recommendations for ${locationName} are ready for review.`,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error("handleSearch Error:", err);
      setError(err.message || "DEPLOYMENT_FAULT: Agent Synchronization Error.");
      setAppState(AppState.LANDING);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || isLoading) return;
    const userMsg = chatInput;
    setChatInput('');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date().toLocaleTimeString()
    }]);

    setIsLoading(true);
    try {
      const response = await chatWithCrew(userMsg, results);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || "System link active, waiting for agent data...",
        timestamp: new Date().toLocaleTimeString()
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onNavigate = (view: AppState) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setError(null);
    setAppState(view);
  };

  const handleBook = (hotel: Hotel) => {
    if (hotel.bookingUrl) {
      window.open(hotel.bookingUrl, '_blank');
    } else {
      alert("Booking link unavailable.");
    }
  };

  const renderContent = () => {
    const infoStates = [
      AppState.AGENTS_RESEARCH,
      AppState.AGENTS_REVIEWS,
      AppState.HOW_IT_WORKS,
      AppState.SECURITY_PRIVACY,
      AppState.SECURITY_PAYMENTS,
      AppState.PRIVACY
    ];

    if (infoStates.includes(appState)) {
      return <InfoView type={appState} onNavigate={onNavigate} />;
    }

    switch (appState) {
      case AppState.LANDING:
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-16 py-10 min-h-[70vh]">
            <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-3 px-6 py-2 glass rounded-full text-xs font-black uppercase tracking-[0.3em] text-zinc-200 border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                ⚙️ Autonomous Travel System
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
                Engineering Your <br/>
                <span className="text-gradient">Perfect Stay</span>
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
                High-performance interface for deploying AI agents across the travel stack. 
                <span className="block text-zinc-500 mt-2 text-lg">Tell us your intent. Our AI crew handles the research.</span>
              </p>
            </div>

            {error && (
              <div className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400 animate-in shake duration-500 flex flex-col items-start gap-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-[10px] font-black uppercase tracking-widest">Protocol Failure</p>
                  <button onClick={() => setError(null)} className="shrink-0 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <div className="w-full max-w-4xl glass p-4 rounded-2xl shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border-white/10 animate-in zoom-in-95 duration-700 delay-300 relative group">
              <div className="absolute inset-0 bg-white/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="flex flex-col md:flex-row gap-3 relative z-10">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder='Specify Mission Intent... e.g. "Mumbai, Bandra, Business, ₹5k"'
                  className="flex-1 bg-black/40 px-10 py-6 rounded-xl text-xl text-white outline-none focus:ring-1 focus:ring-white/30 transition-all placeholder:text-zinc-500 border border-white/10"
                />
                <AgenticButton 
                  onClick={() => handleSearch()}
                  disabled={isLoading}
                  className="px-12 py-6 text-sm"
                >
                  <span>{isLoading ? 'Processing...' : 'Deploy Crew'}</span>
                </AgenticButton>
              </div>
            </div>

            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 text-left animate-in fade-in duration-1000 delay-500">
              <h3 className="col-span-full text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">⚡ Quick Deployments</h3>
              {TRENDING_SEARCHES.map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  onClick={() => handleSearch(item.query)}
                  disabled={isLoading}
                  className="p-6 glass rounded-2xl border-white/10 transition-all group flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-zinc-300 group-hover:text-white transition-colors">{item.label}</span>
                    <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{item.budget}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case AppState.PROFILE: return <ProfileView onNavigate={onNavigate} />;
      case AppState.SEARCHING:
        return (
          <div className="flex flex-col items-center justify-center py-20 space-y-12 animate-in zoom-in-95 duration-700 glass rounded-2xl mx-auto max-w-2xl w-full border-white/10">
            <div className="relative h-48 w-48 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-transparent border-t-white/50 rounded-full animate-spin"
                style={{ animationDuration: '1s' }}
              ></div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white tracking-tighter">{missionTimer}s</span>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-1">Elapsed</span>
              </div>
            </div>
            
            <div className="space-y-4 text-center">
              <h3 className="text-xl font-black text-white uppercase tracking-[0.3em] animate-pulse">Synchronizing Agent Nodes...</h3>
              <p className="text-zinc-400 font-medium max-w-md mx-auto px-8">
                Estimated Mission Time: <span className="text-white font-black">{ESTIMATED_DEPLOY_TIME}s</span>
              </p>
            </div>
            <AgentStatusPanel logs={agentLogs} />
          </div>
        );
      case AppState.RESULTS:
        return (
          <div className="flex flex-col gap-12 pb-32 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-1">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  onClick={() => onNavigate(AppState.LANDING)} 
                  className="flex items-center gap-2 text-zinc-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mb-2 px-6 py-2 bg-white/5 border border-white/10 rounded-lg"
                >
                  Terminate Mission
                </motion.button>
                <h2 className="text-3xl font-black text-white">Active Intelligence Mission</h2>
              </div>
            </div>

            <div className="space-y-20">
              <div className="grid grid-cols-1 gap-12">
                {results.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} onBook={handleBook} />
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-4xl mx-auto py-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 glass rounded-2xl border-white/10">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{appState.replace('_', ' ')}</h1>
            <AgenticButton onClick={() => onNavigate(AppState.LANDING)}>Return to Hub</AgenticButton>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-white selection:text-black">
      <Header onNavigate={onNavigate} currentView={appState} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
        {renderContent()}
      </main>
      <Footer onNavigate={onNavigate} />
      <FloatingChat currentResults={results} />
    </div>
  );
};

export default App;
