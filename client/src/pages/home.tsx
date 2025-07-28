import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { PulseBeams } from "@/components/ui/pulse-beams";
import { TokenRequestModal } from "@/components/ui/token-request-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles,
  Server,
  Database,
  Shield,
  Zap,
  GitBranch,
  Clock
} from "lucide-react";
import suiFxVideo from "@assets/sui fx_1753728098196.mp4";

const beams = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["0%", "0%", "200%"],
        x2: ["0%", "0%", "180%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
  },
  {
    path: "M269 220.5H500C505.523 220.5 510 224.977 510 230.5V398.5",
    gradientConfig: {
      initial: { x1: "100%", x2: "100%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["100%", "100%", "-100%"],
        x2: ["100%", "100%", "-80%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "linear",
        repeatDelay: 1.5,
        delay: Math.random() * 2,
      },
    },
  },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  // Handle video load
  useEffect(() => {
    const video = document.createElement('video');
    video.src = suiFxVideo;
    video.onloadeddata = () => setIsVideoLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-30"
          style={{ filter: 'blur(1px)' }}
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
            <a href="/docs" className="text-gray-300 hover:text-white transition-colors font-inter">Docs</a>
            <a href="/status" className="text-gray-300 hover:text-white transition-colors font-inter">Status</a>
            <a href="/admin" className="text-gray-300 hover:text-white transition-colors font-inter">Admin</a>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              {stats?.success ? 'Online' : 'Loading...'}
            </Badge>
          </motion.div>
        </nav>

        {/* Hero Section - Two Column Layout */}
        <div className="container mx-auto px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[70vh]">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-300 font-inter">
                  Sui Testnet • Live
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl md:text-8xl font-bold tracking-tight font-space-grotesk leading-none"
              >
                <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  SUI-FX
                </span>
                <br />
                <span className="text-4xl md:text-6xl text-gray-200">
                  Testnet Faucet
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-300 max-w-lg leading-relaxed font-inter"
              >
                Get SUI testnet tokens instantly for development and testing. 
                Fast, reliable, and secure token distribution.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-6 text-sm"
              >
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span className="text-gray-300 font-inter">
                    {stats?.data?.totalRequests || 0} requests served
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300 font-inter">Instant delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-gray-300 font-inter">Rate limited</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-8 py-6 text-lg transition-all duration-300 font-space-grotesk group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Request Tokens
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-gray-300 hover:text-white hover:bg-white/10 px-8 py-6 text-lg font-space-grotesk"
                  onClick={() => window.open('/docs', '_blank')}
                >
                  Learn More
                </Button>
              </motion.div>

              {/* Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center space-x-4 pt-4 text-sm text-gray-400 font-inter"
              >
                <span>✓ 0.1 SUI per request</span>
                <span>✓ 1 hour cooldown</span>
                <span>✓ No registration required</span>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual Elements */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              {/* Main Visual Container */}
              <div className="relative h-[600px] group">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-1000" />
                
                {/* Glass Card Container */}
                <div className="relative h-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                  {/* Animated Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" />
                  </div>

                  {/* Pulse Beams */}
                  <div className="absolute inset-0">
                    <PulseBeams beams={beams} />
                  </div>

                  {/* Canvas Reveal Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <CanvasRevealEffect
                      animationSpeed={3}
                      containerClassName="bg-transparent"
                      colors={[[24, 204, 252], [99, 68, 245]]}
                      showGradient={false}
                    />
                  </div>

                  {/* Central Logo/Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                      }}
                      className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl"
                    >
                      <Sparkles className="w-16 h-16 text-white" />
                    </motion.div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ 
                      y: [-20, 20, -20],
                      x: [-10, 10, -10]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0
                    }}
                    className="absolute top-20 left-20 w-16 h-16 bg-blue-500/20 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ 
                      y: [20, -20, 20],
                      x: [10, -10, 10]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 1
                    }}
                    className="absolute bottom-20 right-20 w-24 h-24 bg-purple-500/20 rounded-full blur-sm"
                  />
                  <motion.div
                    animate={{ 
                      y: [-10, 30, -10],
                      x: [15, -15, 15]
                    }}
                    transition={{ 
                      duration: 7, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 2
                    }}
                    className="absolute top-40 right-12 w-12 h-12 bg-cyan-500/20 rounded-full blur-sm"
                  />

                  {/* Subtle particles */}
                  <div className="absolute inset-0 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/30 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 3,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Decorative elements that "bleed" over */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-8 -right-8 w-24 h-24 border border-blue-500/30 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-8 -left-8 w-32 h-32 border border-purple-500/20 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Network Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="container mx-auto px-6 py-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white font-space-grotesk">
                {stats?.data?.totalRequests || '0'}
              </div>
              <div className="text-sm text-gray-400 font-inter">Total Requests</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white font-space-grotesk">0.1</div>
              <div className="text-sm text-gray-400 font-inter">SUI per Request</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white font-space-grotesk">1hr</div>
              <div className="text-sm text-gray-400 font-inter">Rate Limit</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-400 font-space-grotesk">Live</div>
              <div className="text-sm text-gray-400 font-inter">Network Status</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Token Request Modal */}
      <TokenRequestModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}