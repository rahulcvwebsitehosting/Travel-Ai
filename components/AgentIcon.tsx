
import React from 'react';

export type AgentType = 'Research Specialist' | 'Review Analyst' | 'Price Specialist' | 'Amenity Checker' | 'Booking Coordinator' | string;

interface AgentIconProps {
  type: AgentType;
  className?: string;
}

const AgentIcon: React.FC<AgentIconProps> = ({ type, className = "w-6 h-6" }) => {
  const getIcon = () => {
    switch (type) {
      case 'Research Specialist':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" strokeOpacity="0.5" />
            <path d="M12 12L16 8M12 12L8 16" strokeLinecap="round" className="animate-pulse" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        );
      case 'Review Analyst':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M12 4L4 8l8 4 8-4-8-4z" />
            <path d="M4 12l8 4 8-4" strokeOpacity="0.5" />
            <path d="M4 16l8 4 8-4" strokeOpacity="0.3" />
            <circle cx="12" cy="8" r="1" fill="currentColor" />
          </svg>
        );
      case 'Price Specialist':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 7h7v7" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
            <circle cx="3" cy="17" r="1" fill="currentColor" />
            <circle cx="21" cy="7" r="1" fill="currentColor" />
          </svg>
        );
      case 'Amenity Checker':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeOpacity="0.5" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'Booking Coordinator':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <rect x="3" y="4" width="18" height="16" rx="2" strokeOpacity="0.2" />
            <path d="M7 8h10M7 12h10M7 16h6" strokeLinecap="round" strokeOpacity="0.6" />
            <path d="M18 16l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" className="animate-bounce" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
            <circle cx="12" cy="12" r="10" strokeDasharray="4 4" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        );
    }
  };

  return getIcon();
};

export default AgentIcon;
