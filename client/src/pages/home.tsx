
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
import logoFm from "@/components/background/logo_fm.png";

const beams = [
  {
    path: "M80 100H20C14.4772 100 10 104.477 10 110V170",
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
      { cx: 10, cy: 170, r: 4 },
      { cx: 80, cy: 100, r: 4 }
    ]
  },
  {
    path: "M320 90H370C375.523 90 380 85.523 380 80V30",
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
      { cx: 380, cy: 30, r: 4 },
      { cx: 320, cy: 90, r: 4 }
    ]
  },
  {
    path: "M200 120V150C200 155.523 195.523 160 190 160H50C44.477 160 40 164.477 40 170V190",
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
      { cx: 40, cy: 190, r: 4 },
      { cx: 200, cy: 120, r: 4 }
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
    { name: 'APIs', url: '/api-clients', icon: Shield },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Status', url: '/status', icon: Activity }
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
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
              </motion.div>

              {/* Enhanced CTA Button with PulseBeams */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4 flex flex-col items-start space-y-4 relative right-20 bottom-16"
              >
                <PulseBeams
                  beams={beams}
                  gradientColors={{
                    start: "#18CCFC",
                    middle: "#6344F5",
                    end: "#AE48FF"
                  }}
                  className="w-[400px] h-[200px] bg-transparent "
                  width={400}
                  height={200}
                >
                  <a href="/faucet" className="block">
                    <button className="bg-black/80 backdrop-blur-sm w-[240px] z-40 h-[70px] no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block hover:bg-gray-900/80 transition-all duration-300">
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex justify-center w-[240px] text-center space-x-2 h-[70px] items-center z-10 rounded-full bg-black/90 py-0.5 px-4 ring-1 ring-white/10">
                        <span className="flex items-center space-x-3">
                          <span className="md:text-xl text-lg font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-300 to-purple-300">
                            GO TO FAUCET
                          </span>
                          <ArrowRight className="w-6 h-6 text-blue-400" />
                        </span>
                      </div>
                    </button>
                  </a>
                </PulseBeams>
                
                {/* Get your API button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="ml-24 relative bottom-10"
                >
                  <a href="/api-docs" className="block">
                    <button className="bg-black/60 border border-white/20 backdrop-blur-sm w-[200px] h-[60px] no-underline group cursor-pointer relative shadow-2xl shadow-black/50 rounded-full text-white transition-all duration-300 hover:bg-black/80 hover:border-cyan-400/50 hover:shadow-cyan-500/20">
                      <div className="relative flex justify-center w-full text-center h-full items-center z-10 rounded-full px-4">
                        <span className="flex items-center space-x-2">
                          <span className="text-lg font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-cyan-300 to-blue-300 group-hover:from-white group-hover:via-cyan-200 group-hover:to-blue-200 transition-all duration-300">
                            Get your API
                          </span>
                          <Book className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" />
                        </span>
                      </div>
                    </button>
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="container mx-auto px-8 py-8 flex items-center justify-between"
        >
          <img 
            src={logoFm} 
            alt="FM Logo" 
            className="w-12 h-12 opacity-80"
          />
          <p className="text-gray-400 font-inter text-sm flex-1 text-center">
            Built with 🤍 from ch04niverse
          </p>
          <a 
            href="https://docs.sui.io/guides/developer/getting-started/connect"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-black/20 border border-white/10 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 text-sm font-inter"
          >
            Built with Sui
          </a>
        </motion.div>
      </div>
    </div>
  );
}
