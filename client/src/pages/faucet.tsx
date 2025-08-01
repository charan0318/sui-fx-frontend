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
import { NavBar } from "@/components/ui/tubelight-navbar";
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
  ArrowRight,
  Book,
  HelpCircle,
  Activity,
  Shield,
  Sparkles
} from "lucide-react";
import suiFxVideo from "@/components/background/sui_fx_background.mp4";
import logoFm from "@/components/background/logo_fm.png";

const faucetRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid SUI wallet address format"),
});

type FaucetRequestForm = z.infer<typeof faucetRequestSchema>;

export default function Faucet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const navItems = [
    { name: 'Home', url: '/', icon: ArrowLeft },
    { name: 'Faucet', url: '/faucet', icon: Droplets },
    { name: 'API Clients', url: '/api-clients', icon: Shield },
    { name: 'Docs', url: '/docs', icon: Book },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Status', url: '/status', icon: Activity },
    { name: 'Admin', url: '/admin', icon: Shield }
  ];

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
          className="w-full h-full object-cover opacity-100"
        >
          <source src={suiFxVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
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

        {/* Main Content - Two Column Layout */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
            
            {/* Left Column - Faucet Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
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

                        {/* Enhanced Request Button */}
                        <div className="relative inline-block overflow-hidden rounded-full p-[2px] w-full">
                          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#18CCFC_0%,#6344F5_50%,#AE48FF_100%)]" />
                          <Button
                            type="submit"
                            disabled={requestTokensMutation.isPending}
                            className="relative w-full bg-black hover:bg-gray-900 text-white font-semibold py-6 text-lg transition-all duration-300 font-space-grotesk rounded-full border-0"
                          >
                            {requestTokensMutation.isPending ? (
                              <div className="flex items-center justify-center space-x-3">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>PROCESSING...</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center space-x-3">
                                <span>SEND 1 SUI</span>
                                <ArrowRight className="w-5 h-5" />
                              </div>
                            )}
                          </Button>
                        </div>
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

              {/* API Info Box */}
              <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white mb-2 font-space-grotesk">Need Your Own API Key?</h4>
                      <p className="text-gray-300 mb-4 font-inter">
                        Register your application to get dedicated API keys and usage analytics. Perfect for production applications!
                      </p>
                      <Button
                        onClick={() => window.location.href = '/api-clients'}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold"
                      >
                        Register App
                      </Button>
                    </div>
                  </div>
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