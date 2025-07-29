
import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { PulseBeams } from "@/components/ui/pulse-beams";
import { 
  ArrowRight, 
  Book,
  HelpCircle,
  Activity,
  Shield,
  Droplets
} from "lucide-react";
import suiFxVideo from "@/components/background/sui_fx_background.mp4";

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
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 }
    ]
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: Math.random() * 2,
      },
    },
    connectionPoints: [
      { cx: 851, cy: 34, r: 6.5 },
      { cx: 568, cy: 200, r: 6 }
    ]
  }
];

export default function Home(){
  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  const navItems = [
    { name: 'Home', url: '/', icon: ArrowRight },
    { name: 'Faucet', url: '/faucet', icon: Droplets },
    { name: 'Docs', url: '/docs', icon: Book },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Status', url: '/status', icon: Activity },
    { name: 'Admin', url: '/admin', icon: Shield }
  ];

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

      {/* Premium Navigation */}
      <NavBar items={navItems} />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Status Badge - Top Right */}
        <div className="absolute top-8 right-8 z-20">
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-black/20 backdrop-blur-sm">
            {stats?.success ? 'Online' : 'Loading...'}
          </Badge>
        </div>

        {/* Hero Section - Swapped Layout */}
        <div className="container mx-auto px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[85vh]">
            
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10 order-1 lg:order-1 text-left"
            >
              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-300 font-inter tracking-wide">
                  Fuel the Future. One SUI at a time
                </span>
              </motion.div>

              {/* Main Headline - Enhanced Typography */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight font-space-grotesk leading-none">
                  <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    SUI FX
                  </span>
                </h1>
                <p className="text-3xl md:text-4xl text-gray-300 font-space-grotesk tracking-wide">
                  TESTNET FAUCET
                </p>
              </motion.div>

              {/* Enhanced Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6 max-w-2xl"
              >
                <p className="text-xl text-gray-300 leading-relaxed font-inter">
                  Get SUI testnet tokens instantly for development and testing purposes. 
                  Build, test, and deploy on the fastest growing blockchain ecosystem.
                </p>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-white font-space-grotesk">0.1</div>
                    <div className="text-sm text-gray-400 font-inter">SUI per request</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-white font-space-grotesk">1hr</div>
                    <div className="text-sm text-gray-400 font-inter">Cooldown</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-white font-space-grotesk">24/7</div>
                    <div className="text-sm text-gray-400 font-inter">Available</div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-8 flex justify-start"
              >
                <a href="/faucet" className="block">
                  <div className="relative inline-block overflow-hidden rounded-full p-[2px] w-auto">
                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#18CCFC_0%,#6344F5_50%,#AE48FF_100%)]" />
                    <Button
                      size="lg"
                      className="relative bg-black hover:bg-gray-900 text-white font-semibold py-6 px-12 text-lg transition-all duration-300 font-space-grotesk rounded-full border-0"
                    >
                      <span className="flex items-center justify-center space-x-3">
                        <span>REQUEST TOKENS</span>
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </Button>
                  </div>
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
          className="container mx-auto px-8 py-8 text-center"
        >
          <p className="text-gray-400 font-inter text-sm">
            Built with 🤍 from0n0niverse
          </p>
        </motion.div>
      </div>
    </div>
  );
}
