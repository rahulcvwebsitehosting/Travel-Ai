
import React from 'react';
import { motion } from 'framer-motion';

interface AgenticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AgenticButton: React.FC<AgenticButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}) => {
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`agentic-btn ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {/* 
        The CSS in index.html sets z-index: 2 on direct children (*). 
        Plain text nodes are not caught by *. Wrapping in a flex span 
        ensures visibility and maintains layout gaps.
      */}
      <span className="flex items-center justify-center gap-[inherit] w-full h-full pointer-events-none">
        {children}
      </span>
    </motion.button>
  );
};

export default AgenticButton;
