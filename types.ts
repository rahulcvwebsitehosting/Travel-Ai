
export interface Hotel {
  id: string;
  name: string;
  rating: number;
  location: string;
  pricePerNight: number;
  totalPrice: number;
  image: string;
  bookingUrl: string; // Keep official as fallback
  description: string;
  whyPerfect: string[];
  aiAnalysis: {
    positive: string[];
    concerns: string[];
  };
  inclusions: string[];
  comparisons: {
    platform: string;
    price: number;
    url: string; // Direct link to this specific hotel on that platform
    isBest?: boolean;
  }[];
  tag?: string; // e.g., "BEST MATCH", "BUDGET OPTION"
}

export interface BookingRecord {
  id: string;
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'confirmed' | 'completed' | 'cancelled';
  image: string;
}

export interface UserAccount {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  memberSince: string;
  loyaltyTier: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AgentLog {
  agent: string;
  status: 'pending' | 'working' | 'completed';
  message: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export enum AppState {
  LANDING = 'landing',
  SEARCHING = 'searching',
  RESULTS = 'results',
  BOOKING = 'booking',
  FLIGHTS = 'flights',
  DESTINATIONS = 'destinations',
  SUPPORT = 'support',
  PROFILE = 'profile',
  DEPLOYMENT_MUMBAI = 'mumbai',
  DEPLOYMENT_BANGALORE = 'bangalore',
  DEPLOYMENT_CDN = 'cdn',
  DEPLOYMENT_EDGE = 'edge',
  AGENTS_RESEARCH = 'research',
  AGENTS_REVIEWS = 'reviews',
  AGENTS_PRICING = 'pricing',
  AGENTS_BOOKING = 'booking_agent',
  HOW_IT_WORKS = 'how-it-works',
  SECURITY_PRIVACY = 'quantum-privacy',
  SECURITY_PAYMENTS = 'payment-shield',
  SECURITY_VERIFICATION = 'verified-stays',
  TERMS = 'terms',
  PRIVACY = 'privacy',
  CONTACT = 'contact',
  DEVELOPERS = 'developers'
}
