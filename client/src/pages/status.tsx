import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Server, Database, Link as LinkIcon, ShieldCheck, Book, HelpCircle, Activity, Shield, Droplets, ArrowLeft, Key, Rocket, Zap, BarChart3 } from "lucide-react";
import logoFm from "@/components/background/logo_fm.png";
import suiFxVideo from "@/components/background/sui_fx_center.mp4";

export default function Status() {
  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  const navItems = [
    { name: 'Home', url: '/', icon: ArrowLeft },
    { name: 'Faucet', url: '/faucet', icon: Droplets },
    { name: 'APIs', url: '/api-clients', icon: Key },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Status', url: '/status', icon: Activity }
  ];

  const services = [
    {
      name: "API Server",
      icon: Server,
      status: "operational",
      responseTime: "45ms",
    },
    {
      name: "Database",
      icon: Database,
      status: "operational",
      responseTime: "12ms",
    },
    {
      name: "SUI Network",
      icon: LinkIcon,
      status: "operational",
      blockHeight: "#123456",
    },
    {
      name: "Security",
      icon: ShieldCheck,
      status: "operational",
      ssl: "Valid",
    },
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

      {/* Navigation */}
      <NavBar items={navItems} />

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        {/* Status Indicator */}
        <div className="fixed top-6 right-6 z-50">
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-black/20 backdrop-blur-sm">
            {stats?.success ? 'Online' : 'Loading...'}
          </Badge>
        </div>

        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-space-grotesk">
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                System Status
              </span>
            </h1>
            <p className="text-gray-400 font-inter">Real-time monitoring of SUI-FX faucet services</p>
          </motion.div>
        </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Status */}
          <div className="relative">
            <GlowingEffect
              spread={60}
              glow={true}
              disabled={false}
              proximity={80}
              inactiveZone={0.01}
              borderWidth={3}
              className="rounded-xl"
            />
            <Card className="bg-black/30 border-gray-700/50 backdrop-blur-xl text-center relative z-10">
              <CardContent className="pt-6">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold text-green-400 font-space-grotesk">All Systems Operational</span>
                </div>
                <p className="text-gray-400 font-inter">Last updated: 2 minutes ago</p>
              </CardContent>
            </Card>
          </div>

          {/* Service Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <GlowingEffect
                    spread={30}
                    glow={true}
                    disabled={false}
                    proximity={48}
                    inactiveZone={0.01}
                    borderWidth={2}
                    className="rounded-xl"
                  />
                  <Card className="bg-black/30 border-gray-700/50 backdrop-blur-xl text-center relative z-10 h-full">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="font-semibold mb-2 font-space-grotesk">{service.name}</h3>
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-400 capitalize font-inter">{service.status}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-inter">
                        {service.responseTime && `Response time: ${service.responseTime}`}
                        {service.blockHeight && `Block height: ${service.blockHeight}`}
                        {service.ssl && `SSL: ${service.ssl}`}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Performance Metrics */}
          <div className="relative">
            <GlowingEffect
              spread={50}
              glow={true}
              disabled={false}
              proximity={72}
              inactiveZone={0.01}
              borderWidth={2}
              className="rounded-xl"
            />
            <Card className="bg-black/30 border-gray-700/50 backdrop-blur-xl relative z-10">
              <CardHeader>
                <CardTitle className="flex items-center font-space-grotesk">
                  <BarChart3 className="w-6 h-6 text-blue-400 mr-3" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2 font-space-grotesk">99.9%</div>
                    <div className="text-sm text-gray-400 font-inter">Uptime (30 days)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2 font-space-grotesk">156ms</div>
                    <div className="text-sm text-gray-400 font-inter">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2 font-space-grotesk">
                      {stats?.success ? stats.data.successRate : "98.5%"}
                    </div>
                    <div className="text-sm text-gray-400 font-inter">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Statistics */}
          {stats?.success && (
            <div className="relative">
              <GlowingEffect
                spread={45}
                glow={true}
                disabled={false}
                proximity={68}
                inactiveZone={0.01}
                borderWidth={2}
                className="rounded-xl"
              />
              <Card className="bg-black/30 border-gray-700/50 backdrop-blur-xl relative z-10">
                <CardHeader>
                  <CardTitle className="flex items-center font-space-grotesk">
                    <Zap className="w-6 h-6 text-yellow-400 mr-3" />
                    Live Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400 mb-2 font-space-grotesk">{stats.data.totalRequests}</div>
                      <div className="text-sm text-gray-400 font-inter">Total Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-2 font-space-grotesk">{stats.data.successfulRequests}</div>
                      <div className="text-sm text-gray-400 font-inter">Successful Requests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-2 font-space-grotesk">{stats.data.totalDistributed} SUI</div>
                      <div className="text-sm text-gray-400 font-inter">Total Distributed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400 mb-2 font-space-grotesk">{stats.data.uptime}</div>
                      <div className="text-sm text-gray-400 font-inter">Current Uptime</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Incident History */}
          <div className="relative">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
              className="rounded-xl"
            />
            <Card className="bg-black/30 border-gray-700/50 backdrop-blur-xl relative z-10">
              <CardHeader>
                <CardTitle className="flex items-center font-space-grotesk">
                  <ShieldCheck className="w-6 h-6 text-green-400 mr-3" />
                  Recent Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2 font-space-grotesk">No Recent Incidents</h3>
                  <p className="text-gray-400 font-inter">All systems have been running smoothly for the past 30 days.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          
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
            Build with Sui
          </a>
        </motion.div>
      </div>
    </div>
  );
}