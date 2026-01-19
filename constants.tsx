
import { BookingRecord, UserAccount } from './types';

export const INDIA_DEFAULTS = {
  country: 'India',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  language: 'en-IN',
  popularCities: [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Goa'
  ],
  internationalDestinations: [
    'Dubai', 'Singapore', 'Bangkok', 'Bali', 'Maldives',
    'Malaysia', 'Sri Lanka', 'Nepal', 'London', 'USA'
  ]
};

export const TRENDING_SEARCHES = [
  { label: 'Weekend getaway in Goa', budget: '₹3k-5k', query: 'Find me a 2-night stay in North Goa near the beach for 2 adults under ₹5000/night' },
  { label: 'Business stay in Bangalore', budget: '₹4k-6k', query: 'I need a business hotel in Whitefield, Bangalore with fast WiFi and gym, budget ₹6000' },
  { label: 'Family trip to Jaipur', budget: '₹5k-8k', query: 'Family vacation in Jaipur for 4 people, must have pool and vegetarian food' },
  { label: 'Honeymoon in Maldives', budget: '₹15k-25k', query: 'Romantic honeymoon resort in Maldives with private beach and all inclusive meals' }
];

export const INDIAN_PREFERENCES = [
  'Vegetarian food options',
  'Jain food available',
  'Family rooms (3-4 people)',
  'Close to railway station',
  'Close to airport',
  'Free WiFi',
  'Parking available',
  'Early check-in flexibility',
  'Gym facilities',
  'Swimming pool'
];

export const MOCK_USER: UserAccount = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@travelcrew.ai',
  phone: '+91 98765 43210',
  memberSince: 'March 2024',
  loyaltyTier: 'Titanium Voyager',
  preferences: ['Vegetarian food options', 'Free WiFi', 'Family rooms (3-4 people)'],
  stats: {
    missionsCompleted: 14,
    savingsGenerated: 12450,
    citiesExplored: 6
  }
};

export const MOCK_BOOKINGS: BookingRecord[] = [
  {
    id: 'TX-9901',
    hotelName: 'Taj Fort Aguada Resort',
    location: 'Candolim, Goa',
    checkIn: 'Jan 12, 2025',
    checkOut: 'Jan 15, 2025',
    totalPrice: 42500,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop',
    agentHash: '0x88...f2a1'
  },
  {
    id: 'TX-8842',
    hotelName: 'Lemon Tree Premier',
    location: 'Whitefield, Bangalore',
    checkIn: 'Feb 05, 2025',
    checkOut: 'Feb 07, 2025',
    totalPrice: 12400,
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop',
    agentHash: '0x42...d9e4'
  },
  {
    id: 'TX-1029',
    hotelName: 'The Leela Mumbai',
    location: 'Andheri East, Mumbai',
    checkIn: 'Dec 22, 2025',
    checkOut: 'Dec 25, 2025',
    totalPrice: 58000,
    status: 'confirmed',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&auto=format&fit=crop',
    agentHash: '0x11...b3c8'
  }
];

export const SAVED_DESTINATIONS = [
  { name: 'Ooty', region: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=400&auto=format&fit=crop' },
  { name: 'Leh', region: 'Ladakh', image: 'https://images.unsplash.com/photo-1566492342505-1845184b2e59?q=80&w=400&auto=format&fit=crop' },
  { name: 'Munnar', region: 'Kerala', image: 'https://images.unsplash.com/photo-1593055357429-62e84b286cd1?q=80&w=400&auto=format&fit=crop' }
];
