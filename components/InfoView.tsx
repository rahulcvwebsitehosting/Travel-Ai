
import React from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types';
import AgenticButton from './AgenticButton';
import AgentIcon from './AgentIcon';

interface InfoViewProps {
  type: AppState;
  onNavigate: (view: AppState) => void;
}

const InfoView: React.FC<InfoViewProps> = ({ type, onNavigate }) => {
  const getContent = () => {
    switch (type) {
      case AppState.AGENTS_RESEARCH:
        return {
          title: "Research Specialist",
          subtitle: "AGENT NODE A-01",
          description: "Our core research node deployed across global travel indices. It executes recursive search protocols to identify real-time availability and verified property data.",
          points: [
            { label: "GROUNDING", desc: "Utilizes Google Search for up-to-the-minute market reality check." },
            { label: "CROSS-PLATFORM", desc: "Simultaneously queries MMT, Booking.com, Agoda, and Direct Channels." },
            { label: "SEMANTIC FILTER", desc: "Filters results based on latent user intent rather than simple keywords." }
          ]
        };
      case AppState.AGENTS_REVIEWS:
        return {
          title: "Review Analyst",
          subtitle: "AGENT NODE A-02",
          description: "An advanced NLP engine specialized in sentiment extraction from thousands of fragmented user reviews. It looks past the rating to find the truth.",
          points: [
            { label: "SENTIMENT DEPTH", desc: "Analyzes over 1,000 reviews per property to find consensus on cleanliness and food." },
            { label: "AUTHENTICITY CHECK", desc: "Detects non-organic review patterns and bot-generated feedback." },
            { label: "INDIAN CONTEXT", desc: "Specifically prioritizes feedback on vegetarian quality and family safety." }
          ]
        };
      case AppState.HOW_IT_WORKS:
        return {
          title: "System Flow",
          subtitle: "OPERATIONAL PROTOCOL",
          description: "A multi-agent sequential process that transforms your natural language intent into a secured travel mission.",
          points: [
            { label: "INTENT CAPTURE", desc: "User provides raw mission parameters in plain English or Hinglish." },
            { label: "CREW DEPLOYMENT", desc: "Specialized agents are spun up in parallel to execute specific search tasks." },
            { label: "CONSENSUS SYNTHESIS", desc: "Agents debate and rank the top 3 options based on validated scorecards." }
          ]
        };
      case AppState.SECURITY_PRIVACY:
        return {
          title: "Quantum Isolation",
          subtitle: "SECURITY PROTOCOL S-01",
          description: "Data privacy engineered at the architectural level. We utilize sandbox isolation for every user session to prevent data leakage.",
          points: [
            { label: "ZERO STORAGE", desc: "Sensitive mission data is processed in-memory and purged post-completion." },
            { label: "ENCRYPTED PIPES", desc: "All agent-to-server communication is handled via TLS 1.3 secured tunnels." },
            { label: "ID ANONYMIZATION", desc: "Property queries are executed through an anonymous proxy to hide user identity." }
          ]
        };
      case AppState.SECURITY_PAYMENTS:
        return {
          title: "Payment Shield",
          subtitle: "SECURITY PROTOCOL S-02",
          description: "Integration with India's most secure gateways, ensuring PCI-DSS compliance and seamless UPI verification.",
          points: [
            { label: "MULTI-GATEWAY", desc: "Dynamic routing between Razorpay and Stripe for maximum uptime." },
            { label: "FRAUD DETECTION", desc: "Real-time AI monitoring of transaction patterns to prevent unauthorized charges." },
            { label: "INSTANT REFUNDS", desc: "Automated protocol for immediate reversal of failed mission payments." }
          ]
        };
      case AppState.PRIVACY:
        return {
          title: "Identity Privacy",
          subtitle: "LEGAL COMPLIANCE",
          description: "Your digital footprint is your own. TravelCrew AI complies with Digital Personal Data Protection (DPDP) standards.",
          points: [
            { label: "DPDP COMPLIANCE", desc: "Aligned with Indian IT regulations regarding digital data sovereignty." },
            { label: "CONSENT-BASED", desc: "We only access data explicitly provided for the current mission mission." },
            { label: "DATA PORTABILITY", desc: "Export your mission history or request immediate node erasure at any time." }
          ]
        };
      default:
        return {
          title: "System Node",
          subtitle: "DOCUMENTATION PENDING",
          description: "This part of the platform is currently being indexed by the engineering team.",
          points: []
        };
    }
  };

  const content = getContent();

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="shrink-0 p-6 glass rounded-3xl border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
          <AgentIcon type={content.title} className="w-20 h-20 text-white relative z-10" />
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex px-3 py-1 glass rounded text-[9px] font-black uppercase tracking-widest text-zinc-400 border-white/5">
            {content.subtitle}
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">{content.title}</h1>
          <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-2xl">{content.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {content.points.map((p, idx) => (
          <div key={idx} className="glass p-8 rounded-2xl border-white/5 group hover:border-white/20 transition-all">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-2">{p.label}</h3>
            <p className="text-zinc-400 font-medium text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="pt-10 flex justify-center">
        <AgenticButton onClick={() => onNavigate(AppState.LANDING)}>Return to Hub</AgenticButton>
      </div>
    </div>
  );
};

export default InfoView;
