import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles
} from "lucide-react";
import suiFxVideo from "@/components/background/sui_fx_background.mp4"; // Ensure this points to your desired video

export default function Home(){
  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-100"
        >
          <source src={suiFxVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <nav className="flex justify-between items-center px-6 py-4 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold font-space-grotesk">SUI-FX</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-6"
          >
            <a href="/faucet" className="text-gray-300 hover:text-white transition-colors font-inter">Faucet</a>
            <a href="/docs" className="text-gray-300 hover:text-white transition-colors font-inter">Docs</a>
            <a href="/faq" className="text-gray-300 hover:text-white transition-colors font-inter">FAQ</a>
            <a href="/status" className="text-gray-300 hover:text-white transition-colors font-inter">Status</a>
            <a href="/admin" className="text-gray-300 hover:text-white transition-colors font-inter">Admin</a>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              {stats?.success ? 'Online' : 'Loading...'}
            </Badge>
          </motion.div>
        </nav>

        {/* Hero Section - Two Column Layout */}
        <div className="container mx-auto px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-blue-300 font-inter"
              >
                Fuel the Future. One SUI at a time
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-6xl md:text-8xl font-bold tracking-tight font-space-grotesk leading-none mb-4">
                  <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    SUI FX
                  </span>
                </h1>
                <p className="text-2xl md:text-3xl text-gray-300 font-space-grotesk">
                  TESTNET FAUCET
                </p>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-300 max-w-lg leading-relaxed font-inter"
              >
                Get SUI testnet tokens instantly for development and testing purposes
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <a href="/faucet">
                  <Button
                    size="lg"
                    className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-8 py-6 text-lg transition-all duration-300 font-space-grotesk rounded-full"
                  >
                    REQUEST TOKENS
                  </Button>
                </a>
              </motion.div>
            </motion.div>
              </div>
            </div>
            

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="container mx-auto px-6 py-8 text-center"
        >
          <p className="text-gray-400 font-inter text-sm">
            Built with 🤍 from0n0niverse
          </p>
        </motion.div>
      </div>
    </div>
  );
}