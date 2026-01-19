
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel } from '../types';
import { INDIA_DEFAULTS } from '../constants';
import AgenticButton from './AgenticButton';

interface HotelCardProps {
  hotel: Hotel;
  onBook: (hotel: Hotel) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onBook }) => {
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const isBestOverall = hotel.tag?.toUpperCase().includes("BEST");

  // Robust Price Formatter
  const formatPrice = (price: number | undefined | null) => {
    if (typeof price !== 'number' || price <= 0 || isNaN(price)) return "N/A";
    try {
      return price.toLocaleString('en-IN');
    } catch (e) {
      return "N/A";
    }
  };

  const getPriceWithSymbol = (price: number | undefined | null) => {
    const formatted = formatPrice(price);
    return formatted === "N/A" ? "N/A" : `${INDIA_DEFAULTS.currencySymbol}${formatted}`;
  };

  // Compute the best aggregator option
  const bestAggregator = useMemo(() => {
    if (!hotel.comparisons || hotel.comparisons.length === 0) return null;
    return hotel.comparisons.find(c => c.isBest) || [...hotel.comparisons].sort((a, b) => (a.price || 0) - (b.price || 0))[0];
  }, [hotel.comparisons]);

  const getFallbackImage = (name: string) => {
    const seed = name.length;
    const fallbacks = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'
    ];
    return fallbacks[seed % fallbacks.length];
  };

  const validateAndOpen = (url: string | undefined, platform?: string) => {
    const queryBase = `${hotel.name} ${hotel.location}`;
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(`${platform || 'book'} ${queryBase}`)}`;

    if (!url || url.trim().length < 10) {
      window.open(googleSearchUrl, '_blank');
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    const genericDomains = ['booking.com', 'makemytrip.com', 'agoda.com', 'expedia.com', 'hotels.com', 'trivago.com'];
    try {
      const urlObj = new URL(finalUrl);
      const isGeneric = genericDomains.some(domain => {
        const hostname = urlObj.hostname.toLowerCase();
        return (hostname === domain || hostname === `www.${domain}`) && (urlObj.pathname === '/' || urlObj.pathname === '');
      });

      if (isGeneric) {
        window.open(googleSearchUrl, '_blank');
      } else {
        window.open(finalUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (e) {
      window.open(googleSearchUrl, '_blank');
    }
  };

  return (
    <div className={`glass group relative rounded-2xl overflow-hidden border transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_40px_80px_-20px_rgba(255,255,255,0.1)] ${
      isBestOverall ? 'border-white/40 ring-1 ring-white/10' : 'border-white/10'
    }`}>
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/5 blur-[100px] group-hover:bg-white/10 transition-all duration-1000"></div>
      
      {hotel.tag && (
        <div className={`absolute top-6 right-6 z-10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.25em] rounded-md text-white shadow-2xl backdrop-blur-md
          ${isBestOverall ? 'bg-zinc-700/80 border border-white/30' : 'bg-black/80 border border-white/10'}`}>
          {hotel.tag}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[42%] relative overflow-hidden h-[300px] lg:h-auto border-r border-white/10">
          <img 
            src={hotel.image || getFallbackImage(hotel.name)} 
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallback = getFallbackImage(hotel.name + "fallback");
              if (target.src !== fallback) target.src = fallback;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80"></div>
          
          <div className="absolute bottom-8 left-8 flex flex-col gap-1">
            <div className="glass-dark px-4 py-2 rounded-lg flex items-center gap-2 border border-white/10 shadow-2xl">
              <span className="text-white font-black text-lg">{hotel.rating || '4.5'}</span>
              <div className="h-4 w-[1px] bg-white/20"></div>
              <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">AGENT SCORE</span>
            </div>
          </div>
        </div>

        <div className="lg:w-[58%] p-8 md:p-12 flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-black text-white leading-none tracking-tighter uppercase">
                {hotel.name}
              </h3>
              <p className="text-zinc-400 font-bold flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                <span className="text-white">●</span>
                {hotel.location}
              </p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/10 text-right min-w-[180px] shadow-inner">
              <p className="text-3xl font-black text-white">
                {getPriceWithSymbol(hotel.pricePerNight)}
              </p>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-2">AVG NIGHTLY</p>
              
              {hotel.totalPrice > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                   <p className="text-lg font-black text-zinc-300">
                     {getPriceWithSymbol(hotel.totalPrice)}
                   </p>
                   <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">MISSION TOTAL</p>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-zinc-400 leading-relaxed font-medium mb-6 max-w-xl">
            {hotel.description}
          </p>

          {/* Inclusions Checklist */}
          {hotel.inclusions && hotel.inclusions.length > 0 && (
            <div className="mb-10">
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-4 opacity-50">Inclusions</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {hotel.inclusions.map((inclusion, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-zinc-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5 text-zinc-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {inclusion}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            {/* Why this hotel? Section */}
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em] flex items-center gap-2 opacity-50">
                <span className="h-1 w-4 bg-white rounded-full"></span>
                Why this hotel?
              </h4>
              <ul className="space-y-3">
                {(hotel.whyPerfect && hotel.whyPerfect.length > 0 ? hotel.whyPerfect : (hotel.aiAnalysis?.positive || [])).slice(0, 3).map((p, i) => (
                  <li key={i} className="text-xs text-zinc-300 flex items-start gap-3 leading-relaxed">
                    <span className="text-zinc-600 font-black">/</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-5">
              <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] flex items-center gap-2 opacity-50">
                <span className="h-1 w-4 bg-zinc-600 rounded-full"></span>
                Crew Notes
              </h4>
              <ul className="space-y-3">
                {(hotel.aiAnalysis?.concerns || []).slice(0, 2).map((c, i) => (
                  <li key={i} className="text-xs text-zinc-500 flex items-start gap-3 italic leading-relaxed">
                    <span className="text-zinc-700 font-black">!</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-10 relative">
            <div className="flex flex-col gap-3">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Aggregator Index</p>
              <div className="flex gap-8">
                {(hotel.comparisons || []).slice(0, 3).map((comp, i) => (
                  <div 
                    key={i} 
                    className={`flex flex-col text-left ${comp.isBest ? 'text-white' : 'text-zinc-500 opacity-70'}`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest">{comp.platform}</span>
                    <span className="text-sm font-black underline underline-offset-4 decoration-white/20">
                      {getPriceWithSymbol(comp.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-auto">
              <AnimatePresence>
                {showBookingOptions && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -10, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full right-0 mb-4 glass-dark p-6 rounded-xl border border-white/20 w-80 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-4 border-b border-white/5 pb-2">Select Booking Channel</p>
                      
                      {bestAggregator && (
                        <button
                          onClick={() => { validateAndOpen(bestAggregator.url, bestAggregator.platform); setShowBookingOptions(false); }}
                          className="w-full flex flex-col items-start p-4 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all text-white group"
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white">Best Market Rate</span>
                            <span className="text-[10px] font-black px-1.5 py-0.5 bg-white text-black rounded uppercase">Save {bestAggregator.platform}</span>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-black uppercase tracking-tight">Market Aggregator</span>
                            <span className="text-sm font-black">{getPriceWithSymbol(bestAggregator.price)}</span>
                          </div>
                        </button>
                      )}

                      <button
                        onClick={() => { validateAndOpen(hotel.bookingUrl, 'Official Site'); setShowBookingOptions(false); }}
                        className="w-full flex flex-col items-start p-4 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-zinc-300 group"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300 mb-1">Direct Booking</span>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-black uppercase tracking-tight">Official Property Link</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </div>
                      </button>

                      <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center mt-2 px-4 leading-tight">
                        URLs are AI-verified. Falling back to search if links expire.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AgenticButton 
                onClick={() => setShowBookingOptions(!showBookingOptions)}
                className="w-full sm:w-auto px-14 py-5 text-[11px]"
              >
                {showBookingOptions ? 'Cancel Request' : 'Initialize Booking'}
              </AgenticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
