
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Hotel } from '../types';
import { INDIA_DEFAULTS } from '../constants';
import AgenticButton from './AgenticButton';

interface BookingModalProps {
  hotel: Hotel;
  onClose: () => void;
  onComplete: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ hotel, onClose, onComplete }) => {
  const [step, setStep] = useState<'details' | 'guestInfo' | 'payment' | 'processing' | 'success' | 'failure'>('details');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [errorMessage, setErrorMessage] = useState('');
  const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' });
  const [processingTime, setProcessingTime] = useState(0);
  const processingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (step === 'processing') {
      const start = Date.now();
      processingTimerRef.current = window.setInterval(() => {
        setProcessingTime(Math.floor((Date.now() - start) / 100));
      }, 100);
    } else {
      if (processingTimerRef.current) clearInterval(processingTimerRef.current);
    }
    return () => { if (processingTimerRef.current) clearInterval(processingTimerRef.current); };
  }, [step]);

  const handlePayment = () => {
    setStep('processing');
    setErrorMessage('');
    setProcessingTime(0);
    
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.15;
      if (isSuccessful) {
        setStep('success');
      } else {
        setErrorMessage("Mission Protocol Terminated: Network Timeout.");
        setStep('failure');
      }
    }, 2500);
  };

  const formatPrice = (price: number | undefined) => {
    return (price ?? 0).toLocaleString('en-IN');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="glass w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border-white/5 animate-in zoom-in-95 duration-500">
        
        {step === 'details' && (
          <div className="p-10 md:p-12">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Order Summary</h2>
              <button onClick={onClose} className="h-10 w-10 glass border-white/5 rounded-lg flex items-center justify-center text-zinc-600 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex gap-6 mb-10 p-6 glass rounded-xl border-white/5">
              <img src={hotel.image} className="w-20 h-20 rounded object-cover border border-white/5" />
              <div className="flex flex-col justify-center">
                <h4 className="text-lg font-bold text-white tracking-tight">{hotel.name}</h4>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">{hotel.location}</p>
                <div className="mt-2 text-zinc-300 font-black text-sm uppercase">₹{formatPrice(hotel.pricePerNight)} / Unit</div>
              </div>
            </div>

            <div className="space-y-4 mb-10 px-2">
              <div className="flex justify-between items-center text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
                <span>Validated Charge</span>
                <span className="text-2xl font-black text-white">₹{formatPrice(hotel.totalPrice)}</span>
              </div>
            </div>

            <AgenticButton 
              onClick={() => setStep('guestInfo')}
              className="w-full py-6 text-xs"
            >
              Initialize Checkout
            </AgenticButton>
          </div>
        )}

        {step === 'guestInfo' && (
          <div className="p-10 md:p-12">
            <div className="flex items-center gap-6 mb-10">
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                onClick={() => setStep('details')} 
                className="h-10 w-10 bg-white/5 border border-white/5 rounded flex items-center justify-center text-zinc-500 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </motion.button>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">GUEST METADATA</h2>
            </div>
            
            <div className="space-y-6 mb-10">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Identity Record</label>
                <input 
                  type="text" 
                  value={guestInfo.name}
                  onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-6 py-4 outline-none focus:ring-1 focus:ring-white/20 text-white font-medium"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">Secure Email</label>
                <input 
                  type="email" 
                  value={guestInfo.email}
                  onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-6 py-4 outline-none focus:ring-1 focus:ring-white/20 text-white font-medium"
                  placeholder="email@node.com"
                />
              </div>
            </div>

            <AgenticButton 
              disabled={!guestInfo.name || !guestInfo.email}
              onClick={() => setStep('payment')}
              className="w-full py-6 text-xs"
            >
              Sync Payment Node
            </AgenticButton>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-10 md:p-12">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-10">SECURE GATEWAY</h2>

            <div className="space-y-4 mb-10">
              {['upi', 'card'].map((method) => (
                <label 
                  key={method}
                  className={`flex items-center gap-5 p-6 rounded-xl border cursor-pointer transition-all duration-300 ${paymentMethod === method ? 'border-zinc-400 bg-white/5' : 'border-white/5'}`}
                >
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span className="flex-1 font-bold text-[10px] uppercase tracking-widest text-zinc-400">{method === 'upi' ? 'Unified Payments Interface' : 'Encrypted Credit Hub'}</span>
                </label>
              ))}
            </div>

            <AgenticButton 
              onClick={handlePayment}
              className="w-full py-6 text-xs"
            >
              Verify Charge: ₹{formatPrice(hotel.totalPrice)}
            </AgenticButton>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-20 text-center space-y-8">
            <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-white/5 border-t-zinc-400 animate-spin"></div>
              <span className="text-[10px] font-black text-zinc-500">{(processingTime / 10).toFixed(1)}s</span>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-widest animate-pulse">Encoding Transaction...</h2>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 text-center space-y-8 animate-in zoom-in-95 duration-700">
            <div className="h-20 w-20 bg-zinc-800 text-zinc-200 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-10 h-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Mission Secured</h2>
              <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">Protocol completed for {guestInfo.name}. Confirmation indexed.</p>
            </div>
            <AgenticButton 
              onClick={onComplete} 
              className="w-full py-6 text-[10px]"
            >
              Terminate Session
            </AgenticButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
