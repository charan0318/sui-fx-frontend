import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Key, 
  Code, 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  BarChart3,
  Globe,
  Sparkles,
  Rocket,
  Shield,
  Book,
  HelpCircle,
  Activity,
  Droplets,
  ArrowLeft,
  AlertTriangle,
  Zap
} from "lucide-react";
import logoFm from "@/components/background/logo_fm.png";
import suiFxVideo from "@/components/background/sui_fx_center.mp4";

const clientRegistrationSchema = z.object({
  name: z.string().min(1, "Application name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  homepage_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  callback_url: z.string().url("Invalid URL").optional().or(z.literal(""))
});

type ClientRegistrationForm = z.infer<typeof clientRegistrationSchema>;

export default function ApiClients() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Get system stats for status indicator
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

  const form = useForm<ClientRegistrationForm>({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      name: "",
      description: "",
      homepage_url: "",
      callback_url: "",
    },
  });

  // Registration mutation
  const registerMutation = useMutation({
    mutationFn: async (data: ClientRegistrationForm) => {
      const response = await apiRequest("POST", "/api/v1/clients/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      setRegistrationResult(data);
      setShowSuccessModal(true);
      form.reset();
      toast({
        title: "Application Registered!",
        description: "Your API client has been successfully created.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register application",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
  };

  const onSubmit = (data: ClientRegistrationForm) => {
    registerMutation.mutate(data);
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

        {/* Hero Section with Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[85vh]">

            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10 order-1 lg:order-1 text-left"
            >
              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight font-space-grotesk leading-none">
                  <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    API
                  </span>
                </h1>
                <p className="text-3xl md:text-4xl text-gray-300 font-space-grotesk tracking-wide">
                  CLIENT REGISTRATION
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
                  Register your application to get dedicated API keys, track usage analytics, and integrate seamlessly with SUI-FX faucet services.
                </p>
              </motion.div>

              {/* Feature Points */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-lg text-gray-300 font-inter">Dedicated API keys with custom rate limits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-lg text-gray-300 font-inter">Real-time usage analytics and monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-lg text-gray-300 font-inter">Production-ready integration support</span>
                </div>
              </motion.div>

              {/* API Docs Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-6"
              >
                <a href="/api-docs" className="block">
                  <button className="bg-black/60 border border-white/20 backdrop-blur-sm w-[220px] h-[50px] no-underline group cursor-pointer relative shadow-2xl shadow-black/50 rounded-lg text-white transition-all duration-300 hover:bg-black/80 hover:border-blue-400/50 hover:shadow-blue-500/20">
                    <div className="relative flex justify-center w-full text-center h-full items-center z-10 rounded-lg px-4">
                      <span className="flex items-center space-x-2">
                        <span className="text-base font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-blue-300 to-cyan-300 group-hover:from-white group-hover:via-blue-200 group-hover:to-cyan-200 transition-all duration-300">
                          View API Documentation
                        </span>
                        <Book className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                      </span>
                    </div>
                  </button>
                </a>
              </motion.div>
            </motion.div>

            {/* Right Column - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-2 lg:order-2 lg:-ml-16"
            >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-center mb-4">
                  <Rocket className="w-8 h-8 text-blue-400 mr-3" />
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Register Your Application
                  </CardTitle>
                </div>
                <p className="text-gray-400 font-inter">Get started with dedicated API keys in minutes</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-semibold flex items-center">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Application Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="bg-black/20 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-12"
                              placeholder="My Awesome DApp"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 font-semibold flex items-center">
                            <Code className="w-4 h-4 mr-2" />
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="bg-black/20 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 min-h-[100px] resize-none"
                              placeholder="Describe what your application does..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="homepage_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300 font-semibold flex items-center">
                              <Globe className="w-4 h-4 mr-2" />
                              Homepage URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-black/20 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-12"
                                placeholder="https://myapp.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="callback_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300 font-semibold flex items-center">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Callback URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-black/20 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 h-12"
                                placeholder="https://myapp.com/callback"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <Rocket className="w-6 h-6" />
                        <span>{registerMutation.isPending ? "Registering..." : "Register Application"}</span>
                      </div>
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
            </motion.div>
          </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
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

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-black/90 border-green-500/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl font-bold text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
              Application Registered Successfully!
            </DialogTitle>
          </DialogHeader>

          {registrationResult && (
            <div className="space-y-6">
              {/* Client ID */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  Client ID
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={registrationResult.client_id}
                    className="bg-gray-800/50 border-gray-600 text-white font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(registrationResult.client_id, "Client ID")}
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    {copiedField === "Client ID" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* API Key Warning */}
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400 mr-2" />
                  <span className="font-semibold text-orange-400">Save Your API Key Now!</span>
                </div>
                <p className="text-sm text-orange-300 mb-4">
                  This API key will only be shown once. Make sure to copy and save it securely.
                </p>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={registrationResult.api_key}
                    className="bg-orange-900/20 border-orange-500/30 text-white font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(registrationResult.api_key, "API Key")}
                    className="bg-orange-600 hover:bg-orange-500"
                  >
                    {copiedField === "API Key" ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Quick Integration Example */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-300 flex items-center">
                  <Code className="w-4 h-4 mr-2" />
                  Quick Integration Example
                </label>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 overflow-x-auto">
                    <code>{`curl -X POST "${window.location.origin}/api/faucet/request" \\
  -H "X-API-Key: ${registrationResult.api_key}" \\
  -H "Content-Type: application/json" \\
  -d '{"walletAddress": "0x..."}'`}</code>
                  </pre>
                  <Button
                    onClick={() => copyToClipboard(`curl -X POST "${window.location.origin}/api/faucet/request" \\
  -H "X-API-Key: ${registrationResult.api_key}" \\
  -H "Content-Type: application/json" \\
  -d '{"walletAddress": "0x..."}'`, "Integration Code")}
                    className="mt-3 bg-gray-700 hover:bg-gray-600 text-xs"
                  >
                    {copiedField === "Integration Code" ? <CheckCircle className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    Copy Code
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => window.open('/docs', '_blank')}
                  className="flex-1 bg-blue-600 hover:bg-blue-500"
                >
                  <Book className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}