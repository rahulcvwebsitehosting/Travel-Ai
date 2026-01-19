
import React from 'react';
import { AgentLog } from '../types';
import AgentIcon from './AgentIcon';

interface AgentStatusPanelProps {
  logs: AgentLog[];
}

const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({ logs = [] }) => {
  return (
    <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">
            Agent Network Connectivity
          </h3>
          <h2 className="text-xl font-black text-white tracking-widest uppercase">Mission Analytics</h2>
        </div>
        <div className="text-right">
          <span className="text-4xl font-black text-white leading-none">
            {logs.filter(l => l && l.status === 'completed').length * 20}%
          </span>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Execution Index</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {logs.map((log, idx) => (
          <div key={idx} className={`p-4 rounded-xl border transition-all duration-500 ${
            log?.status === 'completed' ? 'bg-zinc-800/60 border-zinc-600' : 
            log?.status === 'working' ? 'bg-white/10 border-white/20' : 'bg-transparent border-white/5 opacity-15'
          }`}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center transition-all shadow-lg ${
                log?.status === 'completed' ? 'bg-white text-black' : 
                log?.status === 'working' ? 'bg-zinc-300 text-black agent-pulse' : 'bg-white/5 text-zinc-700'
              }`}>
                {log?.status === 'completed' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <AgentIcon type={log?.agent} className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] font-black uppercase tracking-wider ${log?.status === 'working' ? 'text-white' : 'text-zinc-300'}`}>
                  {log?.agent ? log.agent.split(' ')[0] : 'Agent'}
                </p>
                <p className={`text-[8px] font-bold uppercase tracking-widest ${log?.status === 'completed' ? 'text-zinc-400' : log?.status === 'working' ? 'text-white' : 'text-zinc-600'}`}>
                  {log?.status === 'completed' ? 'SYNCED' : log?.status === 'working' ? 'ACTIVE' : 'IDLE'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          style={{ width: `${(logs.filter(l => l && l.status === 'completed').length / (logs.length || 1)) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default AgentStatusPanel;
