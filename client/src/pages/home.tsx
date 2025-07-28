import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { PulseBeams } from "@/components/ui/pulse-beams";
import { HeroSection } from "@/components/ui/hero-section-dark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Droplets, Clock, CheckCircle, XCircle, Copy, ExternalLink, Wallet, BarChart3, Server, Database, Link as LinkIcon, ShieldCheck } from "lucide-react";
import suiFxVideo from "@assets/sui fx_1753726598133.mp4";

const faucetRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid SUI wallet address format"),
});

type FaucetRequestForm = z.infer<typeof faucetRequestSchema>;

const beams = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: {
        x1: "0%",
        x2: "0%",
        y1: "80%",
        y2: "100%",
      },
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
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 }
    ]
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: {
        x1: "0%",
        x2: "0%",
        y1: "80%",
        y2: "100%",
      },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
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
    connectionPoints: [
      { cx: 851, cy: 34, r: 6.5 },
      { cx: 568, cy: 200, r: 6 }
    ]
  }
];

const gradientColors = {
  start: "#18CCFC",
  middle: "#6344F5",
  end: "#AE48FF"
};

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [transactionResult, setTransactionResult] = useState<any>(null);

  const form = useForm<FaucetRequestForm>({
    resolver: zodResolver(faucetRequestSchema),
    defaultValues: {
      walletAddress: "",
    },
  });

  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  // Get rate limit info for current wallet
  const walletAddress = form.watch("walletAddress");
  const { data: rateLimitInfo } = useQuery<any>({
    queryKey: ["/api/faucet/rate-limit", walletAddress],
    enabled: !!walletAddress && /^0x[a-fA-F0-9]{64}$/.test(walletAddress),
  });

  // Faucet request mutation
  const faucetMutation = useMutation({
    mutationFn: async (data: FaucetRequestForm) => {
      const response = await apiRequest("POST", "/api/faucet/request", data);
      return response.json();
    },
    onSuccess: (data) => {
      setTransactionResult({ type: "success", data: data.data });
      toast({
        title: "Success!",
        description: "Tokens sent successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Request failed";
      setTransactionResult({ type: "error", message: errorMessage });
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FaucetRequestForm) => {
    setTransactionResult(null);
    faucetMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="fixed top-0 left-0 w-full h-full object-cover z-[-2]"
      >
        <source src={suiFxVideo} type="video/mp4" />
      </video>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900/80 via-gray-900/90 to-black/95 z-[-1]" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-morphism">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SUI-FX
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#faucet" className="text-gray-300 hover:text-white transition-colors">Faucet</a>
              <a href="#docs" className="text-gray-300 hover:text-white transition-colors">Docs</a>
              <a href="#status" className="text-gray-300 hover:text-white transition-colors">Status</a>
              <a href="/admin" className="text-gray-300 hover:text-white transition-colors">Admin</a>
              <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">Testnet Live</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative pt-20">
        <PulseBeams
          beams={beams}
          gradientColors={gradientColors}
          className="absolute inset-0 opacity-30"
        />
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Network Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-300">Sui Testnet</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                SUI-FX
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-gray-300">
                Testnet Faucet
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto"
            >
              Get SUI testnet tokens instantly for development and testing purposes
            </motion.p>

            {/* Stats */}
            {stats?.success && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap justify-center gap-8 mt-12"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{stats.data.totalDistributed}</div>
                  <div className="text-sm text-gray-400">SUI Distributed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{stats.data.totalRequests}</div>
                  <div className="text-sm text-gray-400">Requests Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{stats.data.successRate}</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Faucet Form */}
      <section id="faucet" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-morphism border-gray-700 group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Canvas Reveal Effect on Hover */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                <CanvasRevealEffect
                  animationSpeed={3}
                  containerClassName="bg-transparent"
                  colors={[[24, 204, 252], [99, 68, 245]]}
                  showGradient={false}
                />
              </div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="text-3xl font-bold text-center mb-4">Request Testnet Tokens</CardTitle>
                <p className="text-gray-400 text-center">Enter your SUI wallet address to receive 0.1 SUI tokens</p>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Wallet Address Input */}
                    <FormField
                      control={form.control}
                      name="walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Wallet Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="0x..."
                                className="bg-black/20 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-mono"
                                {...field}
                              />
                              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                {field.value && /^0x[a-fA-F0-9]{64}$/.test(field.value) && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {field.value && field.value.length > 0 && !/^0x[a-fA-F0-9]{64}$/.test(field.value) && (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <p className="text-sm text-gray-500">Address must be 64 hex characters</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Amount Display */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Amount</label>
                      <div className="px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl">
                        <span className="text-blue-400 font-bold">0.1 SUI</span>
                        <span className="text-gray-400 ml-2">(Fixed amount)</span>
                      </div>
                    </div>

                    {/* Rate Limiting Info */}
                    <Alert className="bg-yellow-500/10 border-yellow-500/30">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <AlertDescription className="text-yellow-300">
                        <div className="space-y-1">
                          <div>• 1 request per hour per wallet</div>
                          <div>• 100 requests per hour per IP</div>
                          {rateLimitInfo?.success && !rateLimitInfo.data.canRequest && (
                            <div>• Next request available in: {formatTimeRemaining(rateLimitInfo.data.timeRemaining)}</div>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={faucetMutation.isPending || (rateLimitInfo?.success && !rateLimitInfo.data.canRequest)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/30"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Droplets className="w-5 h-5" />
                        <span>{faucetMutation.isPending ? "Processing..." : "Request Tokens"}</span>
                      </div>
                    </Button>
                  </form>
                </Form>

                {/* Transaction Result */}
                <AnimatePresence>
                  {transactionResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8"
                    >
                      {transactionResult.type === "success" && (
                        <Alert className="bg-green-500/10 border-green-500/30">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <AlertDescription>
                            <div className="text-green-400">
                              <h4 className="font-medium mb-2">Tokens sent successfully!</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400">Amount:</span>
                                  <span className="text-white">0.1 SUI</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-400">Transaction:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-white font-mono text-xs">
                                      {transactionResult.data.transactionHash.slice(0, 6)}...{transactionResult.data.transactionHash.slice(-4)}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(transactionResult.data.transactionHash)}
                                      className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                                <a
                                  href={transactionResult.data.explorerUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                                >
                                  <span>View on SuiScan</span>
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}

                      {transactionResult.type === "error" && (
                        <Alert className="bg-red-500/10 border-red-500/30">
                          <XCircle className="h-4 w-4 text-red-400" />
                          <AlertDescription>
                            <div className="text-red-400">
                              <h4 className="font-medium mb-1">Request failed</h4>
                              <p className="text-sm text-red-300">{transactionResult.message}</p>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* System Status Preview */}
      <section id="status" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">System Status</h2>
            <p className="text-gray-400">Real-time monitoring of SUI-FX faucet services</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Overall Status */}
            <Card className="glass-morphism border-gray-700 text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center space-x-3 mb-4">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-2xl font-bold text-green-400">All Systems Operational</span>
                </div>
                <p className="text-gray-400">Last updated: 2 minutes ago</p>
              </CardContent>
            </Card>

            {/* Service Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="glass-morphism border-gray-700 text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Server className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">API Server</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Operational</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Response time: 45ms</p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-700 text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Database className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Database</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Connected</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Query time: 12ms</p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-700 text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LinkIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">SUI Network</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Connected</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Block height: #123456</p>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-700 text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Security</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-green-400">Secure</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">SSL: Valid</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  SUI-FX
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                The fastest and most reliable SUI testnet faucet for developers.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SDKs</a></li>
                <li><a href="/status" className="hover:text-white transition-colors">Status Page</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issue</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Network</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Sui Testnet</span>
                </li>
                <li>Network ID: <span className="font-mono">testnet</span></li>
                <li>RPC: <span className="font-mono">rpc.testnet.sui.io</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 SUI-FX. All rights reserved. Built for the SUI ecosystem.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
