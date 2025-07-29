import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Droplets, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Loader2,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import suiFxVideo from "@assets/sui fx_1753728098196.mp4";

const faucetRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid SUI wallet address format"),
});

type FaucetRequestForm = z.infer<typeof faucetRequestSchema>;

export default function Faucet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastTransaction, setLastTransaction] = useState<any>(null);

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

  const requestTokensMutation = useMutation({
    mutationFn: async (data: FaucetRequestForm) => {
      return apiRequest("POST", "/api/faucet/request", data);
    },
    onSuccess: (data) => {
      setLastTransaction({ success: true, data, message: "Tokens sent successfully!" });
      form.reset();
      toast({
        title: "Success!",
        description: "SUI tokens have been sent to your wallet.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to process token request";
      setLastTransaction({ success: false, message: errorMessage });
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FaucetRequestForm) => {
    requestTokensMutation.mutate(data);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard.",
    });
  };

  const formatTimeRemaining = (timestamp: number) => {
    const now = Date.now();
    const remaining = Math.max(0, timestamp - now);
    const minutes = Math.floor(remaining / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

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
            <a href="/" className="flex items-center space-x-2 hover:opacity-80">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-space-grotesk">SUI-FX</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center space-x-6"
          >
            <a href="/" className="text-gray-300 hover:text-white transition-colors font-inter">Home</a>
            <a href="/docs" className="text-gray-300 hover:text-white transition-colors font-inter">Docs</a>
            <a href="/faq" className="text-gray-300 hover:text-white transition-colors font-inter">FAQ</a>
            <a href="/status" className="text-gray-300 hover:text-white transition-colors font-inter">Status</a>
            <a href="/admin" className="text-gray-300 hover:text-white transition-colors font-inter">Admin</a>
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              {stats?.success ? 'Online' : 'Loading...'}
            </Badge>
          </motion.div>
        </nav>

        {/* Main Content - Two Column Layout */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <a 
                  href="/" 
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-inter"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </a>
              </motion.div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-300 font-inter">
                  Fuel the Future. One SUI at a time
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-6xl md:text-7xl font-bold tracking-tight font-space-grotesk leading-none mb-4">
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
            </motion.div>

            {/* Right Column - Faucet Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Faucet Card */}
              <Card className="bg-black/30 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-space-grotesk">
                    <Droplets className="w-6 h-6 text-blue-400 mr-3" />
                    Request Testnet Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!lastTransaction ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="walletAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300 font-inter">Enter your SUI wallet address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="0x1234567890abcdef..."
                                    {...field}
                                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pr-10 font-mono"
                                    disabled={requestTokensMutation.isPending}
                                  />
                                  {field.value && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                      {form.formState.errors.walletAddress ? (
                                        <XCircle className="w-5 h-5 text-red-400" />
                                      ) : (
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Amount Display */}
                        <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                          <span className="text-gray-300 font-inter">Amount per request:</span>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                            0.1 SUI
                          </Badge>
                        </div>

                        {/* Request Button */}
                        <Button
                          type="submit"
                          disabled={requestTokensMutation.isPending}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-6 text-lg transition-all duration-300 font-space-grotesk"
                        >
                          {requestTokensMutation.isPending ? (
                            <div className="flex items-center space-x-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Droplets className="w-5 h-5" />
                              <span>Request Tokens</span>
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    /* Transaction Result */
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div className={`p-4 rounded-lg border ${
                        lastTransaction.success 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center mb-2">
                          {lastTransaction.success ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mr-2" />
                          )}
                          <span className={`font-semibold font-space-grotesk ${
                            lastTransaction.success ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {lastTransaction.success ? 'Transaction Successful' : 'Transaction Failed'}
                          </span>
                        </div>
                        <p className="text-gray-300 font-inter text-sm">{lastTransaction.message}</p>
                      </div>

                      {lastTransaction.success && lastTransaction.data && (
                        <div className="space-y-3">
                          {/* Transaction Hash */}
                          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                            <div className="min-w-0 flex-1">
                              <span className="text-sm text-gray-400 font-inter">Transaction Hash:</span>
                              <p className="font-mono text-sm text-white break-all">
                                {lastTransaction.data.transactionHash}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(lastTransaction.data.transactionHash)}
                              className="ml-2 shrink-0"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Explorer Link */}
                          <Button
                            variant="outline"
                            className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-white/10 font-space-grotesk"
                            onClick={() => window.open(lastTransaction.data.explorerUrl, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View on Explorer
                          </Button>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        className="w-full text-gray-400 hover:text-white font-inter"
                        onClick={() => {
                          setLastTransaction(null);
                          form.reset();
                        }}
                      >
                        Request More Tokens
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Rate Limiting Info */}
              <Card className="bg-black/30 border-gray-700 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-white font-space-grotesk">
                    <Clock className="w-6 h-6 text-yellow-400 mr-3" />
                    Rate Limits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 font-inter">1 request per hour per wallet</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 font-inter">100 requests per hour per IP</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 font-inter">No registration required</span>
                    </div>
                  </div>
                  {rateLimitInfo && (
                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center space-x-2 text-yellow-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-inter">
                          Next request available in: {formatTimeRemaining(rateLimitInfo.nextRequest)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
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