
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Droplets, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Copy,
  ExternalLink,
  AlertTriangle,
  Loader2
} from "lucide-react";
import suiFxVideo from "@assets/sui fx_1753728098196.mp4";

interface FaucetResponse {
  success: boolean;
  message: string;
  data?: {
    transactionHash: string;
    amount: string;
    walletAddress: string;
    network: string;
    explorerUrl: string;
  };
}

interface HealthStatus {
  status: string;
  uptime: string;
  services: {
    database: string;
    redis: string;
    sui: string;
  };
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<FaucetResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{nextRequest: number} | null>(null);
  const { toast } = useToast();

  // Validate SUI wallet address
  const isValidAddress = (address: string): boolean => {
    const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;
    return /^[a-fA-F0-9]{64}$/.test(cleanAddress);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  // Request tokens
  const handleRequestTokens = async () => {
    if (!isValidAddress(walletAddress)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid 64-character SUI wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/faucet/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'suifx-production-api-key-12345-production'
        },
        body: JSON.stringify({
          walletAddress: walletAddress.startsWith('0x') ? walletAddress : `0x${walletAddress}`
        })
      });

      const data: FaucetResponse = await response.json();
      setLastTransaction(data);

      if (data.success) {
        toast({
          title: "Success!",
          description: "Tokens sent successfully to your wallet",
        });
        setWalletAddress("");
      } else {
        toast({
          title: "Request Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to faucet service",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch health status
  React.useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/v1/health');
        const data = await response.json();
        setHealthStatus(data);
      } catch (error) {
        console.error('Failed to fetch health status:', error);
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
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
      <div className="fixed top-0 left-0 w-full h-full bg-black/40 z-[-5]" style={{ zIndex: -5 }} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen" style={{ zIndex: 10 }}>
        <div className="container mx-auto px-6 py-12">
          
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Network Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full backdrop-blur-sm mb-6">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                healthStatus?.status === 'healthy' ? 'bg-green-400' : 'bg-red-400'
              }`}></div>
              <span className="text-sm text-blue-300">
                Sui Testnet {healthStatus?.status === 'healthy' ? '• Live' : '• Offline'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                SUI-FX
              </span>
              <br />
              <span className="text-3xl md:text-5xl text-gray-200">
                Testnet Faucet
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Get SUI testnet tokens instantly for development and testing purposes
            </p>
          </motion.div>

          {/* Main Faucet Interface */}
          <div className="max-w-4xl mx-auto grid gap-8">
            
            {/* Faucet Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-black/30 border-gray-700 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Droplets className="w-6 h-6 text-blue-400 mr-3" />
                    Request Testnet Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Wallet Address Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Enter your SUI wallet address
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="0x1234567890abcdef..."
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pr-10"
                        disabled={isLoading}
                      />
                      {walletAddress && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isValidAddress(walletAddress) ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {walletAddress && !isValidAddress(walletAddress) && (
                      <p className="text-sm text-red-400">
                        Invalid wallet address format. Must be 64 hex characters.
                      </p>
                    )}
                  </div>

                  {/* Amount Display */}
                  <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                    <span className="text-gray-300">Amount per request:</span>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                      0.1 SUI
                    </Badge>
                  </div>

                  {/* Request Button */}
                  <Button
                    onClick={handleRequestTokens}
                    disabled={!isValidAddress(walletAddress) || isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-6 text-lg transition-all duration-300"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-5 h-5" />
                        <span>Request Tokens</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rate Limiting Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-black/30 border-gray-700 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Clock className="w-6 h-6 text-yellow-400 mr-3" />
                    Rate Limits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">1 request per hour per wallet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300">100 requests per hour per IP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300">No registration required</span>
                    </div>
                  </div>
                  {rateLimitInfo && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">
                          Next request available in: {formatTimeRemaining(rateLimitInfo.nextRequest)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Transaction Result */}
            {lastTransaction && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className={`border backdrop-blur-lg ${
                  lastTransaction.success 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center text-white">
                      {lastTransaction.success ? (
                        <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400 mr-3" />
                      )}
                      {lastTransaction.success ? 'Transaction Successful' : 'Transaction Failed'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{lastTransaction.message}</p>
                    
                    {lastTransaction.success && lastTransaction.data && (
                      <div className="space-y-3">
                        {/* Transaction Hash */}
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div>
                            <span className="text-sm text-gray-400">Transaction Hash:</span>
                            <p className="font-mono text-sm text-white break-all">
                              {lastTransaction.data.transactionHash}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(lastTransaction.data!.transactionHash)}
                            className="ml-2"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Amount */}
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <span className="text-sm text-gray-400">Amount Sent:</span>
                          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                            0.1 SUI
                          </Badge>
                        </div>

                        {/* Explorer Link */}
                        <Button
                          variant="outline"
                          className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-white/10"
                          onClick={() => window.open(lastTransaction.data!.explorerUrl, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on SuiScan Explorer
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-2"></div>
                <span className="text-sm text-gray-300">Instant Transfer</span>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-2"></div>
                <span className="text-sm text-gray-300">0.1 SUI per Request</span>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-purple-400 rounded-full mx-auto mb-2"></div>
                <span className="text-sm text-gray-300">Rate Limited</span>
              </div>
              <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                <span className="text-sm text-gray-300">No Registration</span>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
