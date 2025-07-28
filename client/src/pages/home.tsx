import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Droplets, ArrowRight } from "lucide-react";
import suiFxVideo from "@assets/sui fx_1753728098196.mp4";

export default function Home() {
  const scrollToFaucet = () => {
    // Navigate to faucet section or show faucet form
    window.location.href = "#faucet";
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-10]"
        style={{ zIndex: -10 }}
      >
        <source src={suiFxVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Subtle dark overlay for better text readability */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-[-5]" style={{ zIndex: -5 }} />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center" style={{ zIndex: 10 }}>
        <div className="container mx-auto px-6 text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Network Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-300">Sui Testnet</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl md:text-8xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                SUI-FX
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-gray-200">
                Testnet Faucet
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Get SUI testnet tokens instantly for development and testing purposes. 
              Fast, reliable, and completely free.
            </motion.p>

            {/* Call to Action */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
            >
              <Button
                onClick={scrollToFaucet}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-6 px-12 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30 backdrop-blur-sm"
              >
                <div className="flex items-center space-x-3">
                  <Droplets className="w-6 h-6" />
                  <span>Request Tokens</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-gray-400/30 text-gray-300 hover:text-white hover:bg-white/10 py-6 px-8 text-lg backdrop-blur-sm"
                onClick={() => window.open("https://docs.sui.io", "_blank")}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-400"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Instant Transfer</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>0.1 SUI per Request</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Rate Limited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>No Registration</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}