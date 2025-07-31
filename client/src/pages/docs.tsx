import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Rocket, Clock, AlertTriangle, Code, ExternalLink, Copy, Book, HelpCircle, Activity, Shield, Droplets, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logoFm from "@/components/background/logo_fm.png";

export default function Docs() {
  const { toast } = useToast();

  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  const navItems = [
    { name: 'Home', url: '/', icon: ArrowLeft },
    { name: 'Faucet', url: '/faucet', icon: Droplets },
    { name: 'Docs', url: '/docs', icon: Book },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Status', url: '/status', icon: Activity },
    { name: 'Admin', url: '/admin', icon: Shield }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
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
                API Documentation
              </span>
            </h1>
            <p className="text-gray-400 font-inter">Complete guide to integrate with SUI-FX faucet</p>
          </motion.div>
        </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Start */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="w-6 h-6 text-blue-400 mr-3" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-blue-400">1. Request Tokens</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`curl -X POST "https://api.sui-fx.com/v1/faucet/request" \\
  -H "Content-Type: application/json" \\
  -d '{"walletAddress": "0x..."}'`)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                  <code>{`curl -X POST "/api/faucet/request" \\
  -H "Content-Type: application/json" \\
  -d '{"walletAddress": "0x..."}'`}</code>
                </pre>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-400">2. Response</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`{
  "success": true,
  "data": {
    "transactionHash": "0x5AbR...",
    "amount": "100000000",
    "explorerUrl": "https://suiscan.xyz/..."
  }
}`)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                  <code>{`{
  "success": true,
  "data": {
    "transactionHash": "0x5AbR...",
    "amount": "100000000",
    "explorerUrl": "https://suiscan.xyz/..."
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Rate Limits */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-6 h-6 text-yellow-400 mr-3" />
                Rate Limits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-300">Per wallet</span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  1 request/hour
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-700">
                <span className="text-gray-300">Per IP address</span>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                  100 requests/hour
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-300">Token amount</span>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                  0.1 SUI (fixed)
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Error Codes */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
                Error Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="destructive" className="font-mono text-xs">
                  400
                </Badge>
                <div>
                  <div className="font-semibold text-white">Bad Request</div>
                  <div className="text-sm text-gray-400">Invalid wallet address format</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 font-mono text-xs">
                  429
                </Badge>
                <div>
                  <div className="font-semibold text-white">Rate Limited</div>
                  <div className="text-sm text-gray-400">Request limit exceeded</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="destructive" className="font-mono text-xs">
                  500
                </Badge>
                <div>
                  <div className="font-semibold text-white">Server Error</div>
                  <div className="text-sm text-gray-400">Internal server error</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SDKs */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-6 h-6 text-purple-400 mr-3" />
                SDKs & Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="#" className="block p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">JavaScript SDK</div>
                    <div className="text-sm text-gray-400">npm install @sui-fx/sdk</div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </a>
              <a href="#" className="block p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Python SDK</div>
                    <div className="text-sm text-gray-400">pip install sui-fx</div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </a>
              <a href="#" className="block p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Rust SDK</div>
                    <div className="text-sm text-gray-400">cargo add sui-fx</div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400" />
                </div>
              </a>
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints */}
        <div className="mt-12">
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Faucet Request */}
                <div className="border-b border-gray-700 pb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="default" className="bg-green-500/20 text-green-400">
                      POST
                    </Badge>
                    <code className="text-lg font-mono">/api/faucet/request</code>
                  </div>
                  <p className="text-gray-400 mb-4">Request testnet tokens for a wallet address.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Request Body</h4>
                      <div className="bg-black/30 rounded-lg p-3">
                        <pre className="text-sm text-gray-300 font-mono">
                          <code>{`{
  "walletAddress": "0x..."
}`}</code>
                        </pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-white">Response</h4>
                      <div className="bg-black/30 rounded-lg p-3">
                        <pre className="text-sm text-gray-300 font-mono">
                          <code>{`{
  "success": true,
  "data": {
    "transactionHash": "0x...",
    "amount": "100000000",
    "explorerUrl": "https://..."
  }
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rate Limit Check */}
                <div className="border-b border-gray-700 pb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      GET
                    </Badge>
                    <code className="text-lg font-mono">/api/faucet/rate-limit/:walletAddress</code>
                  </div>
                  <p className="text-gray-400 mb-4">Check rate limit status for a wallet address.</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Response</h4>
                    <div className="bg-black/30 rounded-lg p-3">
                      <pre className="text-sm text-gray-300 font-mono">
                        <code>{`{
  "success": true,
  "data": {
    "canRequest": false,
    "nextRequestTime": "2024-01-01T12:00:00Z",
    "timeRemaining": 2700
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                {/* System Stats */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      GET
                    </Badge>
                    <code className="text-lg font-mono">/api/stats</code>
                  </div>
                  <p className="text-gray-400 mb-4">Get system statistics and health information.</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2 text-white">Response</h4>
                    <div className="bg-black/30 rounded-lg p-3">
                      <pre className="text-sm text-gray-300 font-mono">
                        <code>{`{
  "success": true,
  "data": {
    "totalRequests": 1234,
    "successfulRequests": 1200,
    "totalDistributed": "123.4",
    "successRate": "97.24%",
    "uptime": "2h 30m",
    "isHealthy": true
  }
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

