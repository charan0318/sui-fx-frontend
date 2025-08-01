
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logoFm from '@/components/background/logo_fm.png';
import suiFxLoadingVideo from '@/components/background/sui_fx_loading.mp4';

interface LoadingPageProps {
  onComplete?: () => void;
  duration?: number;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingTexts = [
    'Initializing...',
    'Connecting to SUI Network...',
    'Loading Faucet Services...',
    'Preparing Your Experience...',
    'Almost Ready...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 50));
        
        // Update loading text based on progress
        const textIndex = Math.floor((newProgress / 100) * (loadingTexts.length - 1));
        setLoadingText(loadingTexts[Math.min(textIndex, loadingTexts.length - 1)]);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 500);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={suiFxLoadingVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12"
        >
          <img 
            src={logoFm} 
            alt="SUI FX Logo" 
            className="w-24 h-24 opacity-90"
          />
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight font-space-grotesk leading-none mb-4">
            <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
              SUI FX
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 font-space-grotesk tracking-wide">
            TESTNET FAUCET
          </p>
        </motion.div>

        {/* Loading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Loading Text */}
          <div className="text-center mb-6">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-lg text-gray-300 font-inter"
            >
              {loadingText}
            </motion.p>
          </div>

          {/* Progress Bar Container */}
          <div className="relative mb-4">
            {/* Background Bar */}
            <div className="w-full h-2 bg-gray-800/50 rounded-full backdrop-blur-sm border border-gray-700/30">
              {/* Progress Bar */}
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "easeOut" }}
              />
            </div>
            
            {/* Glow Effect */}
            <motion.div
              className="absolute top-0 h-2 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60 blur-sm"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </div>

          {/* Progress Percentage */}
          <div className="text-center">
            <span className="text-sm text-gray-400 font-mono">
              {Math.round(progress)}%
            </span>
          </div>
        </motion.div>

        {/* Animated Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex space-x-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

      </div>

      {/* Bottom Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <p className="text-gray-500 font-inter text-sm text-center">
          Built with 🤍 from ch04niverse
        </p>
      </motion.div>
    </div>
  );
};
