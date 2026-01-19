
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

    // Check for key at runtime
    const key = (process.env as any)?.API_KEY;
    if (!key || key === "undefined") {
      setError("MAINTENANCE_REQUIRED: Deployment Node Incomplete. Environmental variable 'API_KEY' is not detected in the current stack. Ensure you have added the key to Vercel and performed a REDEPLOY.");
      return;
    }

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

      const response = await Promise.race([
        searchHotels(activeQuery),
        new Promise((_, reject) => setTimeout(() => reject(new Error("MISSION_TIMEOUT: The AI Crew is experiencing high latency. Verify API quota and network stability.")), 45000))
      ]) as any;
      
      clearInterval(stepTimer);
      setAgentLogs(prev => prev.map(l => ({ ...l, status: 'completed' })));
      
      const hotels = response.hotels || [];
      setResults(hotels);
      setGroundingSources(response.sources || []);
      
      const locationName = hotels[0]?.location ? hotels[0].location.split(',')[0] : 'your destination';

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Crew mission success. Analyzed ${response.sources?.length || 0} datasets. Recommendations for ${locationName} mapped to your intent.`,
        timestamp: new Date().toLocaleTimeString()
      }]);

      setAppState(AppState.RESULTS);
    } catch (err: any) {
      console.error("handleSearch Error:", err);
      setError(err.message || "DEPLOYMENT_FAULT: The AI Agents could not synchronize. Mission aborted.");
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
        content: response || "The crew is verifying details...",
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
      alert("Booking link unavailable for this property.");
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
                A monochrome, high-performance interface for deploying AI agents across the travel stack. 
                <span className="block text-zinc-500 mt-2 text-lg">Tell us your intent. Our AI crew handles the research.</span>
              </p>
            </div>

            {error && (
              <div className={`w-full max-w-2xl border p-6 rounded-2xl animate-in shake duration-500 flex flex-col items-center gap-4 ${
                error.includes("MAINTENANCE_REQUIRED") 
                ? "bg-red-500/10 border-red-500/40 text-red-400" 
                : "bg-red-500/5 border-red-500/20 text-red-400"
              }`}>
                <div className="flex items-center justify-between w-full">
                  <p className="text-xs font-black uppercase tracking-widest text-left">{error.includes("MAINTENANCE_REQUIRED") ? "Mission Control Offline" : error}</p>
                  <button onClick={() => setError(null)} className="shrink-0 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {error.includes("MAINTENANCE_REQUIRED") && (
                  <div className="text-left w-full space-y-4 pt-4 border-t border-red-500/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Recovery Protocol:</p>
                    <ol className="text-[10px] font-bold space-y-1 opacity-70">
                      <li>1. Navigate to Project Settings → Environment Variables.</li>
                      <li>2. Add Key: <span className="text-white">API_KEY</span> with your Gemini token.</li>
                      <li>3. Go to Deployments and select <span className="text-white">Redeploy</span>.</li>
                    </ol>
                    <p className="text-[9px] italic opacity-60">Re-deployment is mandatory to bundle variables into the client stack.</p>
                  </div>
                )}
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
                  {!isLoading && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  )}
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
                  <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
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
              <div className="w-64 h-1 bg-white/5 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((missionTimer / ESTIMATED_DEPLOY_TIME) * 100, 100)}%` }}
                  className="h-full bg-white"
                />
              </div>
            </div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Researching real-time market data across 50+ indices...</p>
            <AgentStatusPanel logs={agentLogs} />
          </div>
        );
      case AppState.RESULTS:
        return (
          <div className="flex flex-col gap-12 pb-32 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
              <div className="space-y-1">
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  onClick={() => onNavigate(AppState.LANDING)} 
                  className="flex items-center gap-2 text-zinc-400 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all mb-2 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg"
                >
                  Terminate Mission
                </motion.button>
                <h2 className="text-3xl font-black text-white">Active Intelligence Mission</h2>
              </div>
              <div className="flex items-center gap-4 glass px-6 py-3 rounded-xl border-white/10">
                <div className="flex -space-x-3">{[1,2,3,4,5].map(i => <div key={i} className="h-10 w-10 rounded-lg bg-zinc-700 border-2 border-black flex items-center justify-center text-[10px] font-black text-white shadow-xl">A{i}</div>)}</div>
                <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Operational</span>
              </div>
            </div>

            <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide custom-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-4`}>
                  <div className={`max-w-[75%] p-6 rounded-2xl shadow-2xl ${msg.role === 'user' ? 'bg-zinc-800 text-white' : 'glass border-white/10 text-zinc-200'}`}>
                    <p className="text-md leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
                    <span className={`text-[9px] font-black uppercase tracking-widest mt-4 block opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="space-y-20">
              <div className="text-center space-y-4">
                <h3 className="text-5xl font-black text-white tracking-tighter uppercase">Mission Results</h3>
                <p className="text-zinc-400 text-lg font-medium max-w-xl mx-auto">Research compiled and validated. Here are the top matches that align with your requirements.</p>
              </div>
              
              {groundingSources.length > 0 && (
                <div className="max-w-4xl mx-auto p-6 glass border-white/10 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-4">Verification Intelligence</h4>
                  <div className="flex flex-wrap gap-4">
                    {groundingSources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-2 group"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>
                        <span className="border-b border-white/10 group-hover:border-white transition-all">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-12">
                {results.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} onBook={handleBook} />
                ))}
              </div>
              
              <div className="fixed bottom-0 left-0 right-0 glass-dark border-t border-white/10 p-6 z-50 shadow-[0_-20px_50px_rgba(0,0,0,1)]">
                <div className="max-w-7xl mx-auto flex gap-4">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleChat()} 
                    placeholder="Refine Parameters or Ask Questions..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-8 py-5 outline-none focus:ring-1 focus:ring-white/30 transition-all text-white font-medium placeholder:text-zinc-600" 
                  />
                  <AgenticButton 
                    onClick={handleChat} 
                    disabled={isLoading} 
                    className="px-12 py-5 text-xs"
                  >
                    Process Command
                  </AgenticButton>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-4xl mx-auto py-12 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 glass rounded-2xl border-white/10">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">{appState.replace('_', ' ')}</h1>
            <p className="text-xl text-zinc-400 leading-relaxed font-medium">Node details incoming... Deploying framework components.</p>
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
