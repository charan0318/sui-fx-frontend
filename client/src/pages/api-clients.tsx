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
    { name: 'API Clients', url: '/api-clients', icon: Key },
    { name: 'Docs', url: '/docs', icon: Book },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Status', url: '/status', icon: Activity },
    { name: 'Admin', url: '/admin', icon: Shield }
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
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-blue-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
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

        {/* Hero Section */}
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-space-grotesk">
                <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  API Clients
                </span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
              Register your application to get dedicated API keys, track usage analytics, and integrate seamlessly with SUI-FX faucet services.
            </p>
          </motion.div>

          {/* Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {[
              {
                icon: BarChart3,
                title: "Usage Analytics",
                description: "Track API usage, response times, and success rates in real-time",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Shield,
                title: "Dedicated Keys", 
                description: "Get your own API keys with rate limiting and usage quotas",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Easy Integration",
                description: "Simple REST API with comprehensive documentation and examples",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((benefit, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{benefit.title}</h3>
                  <p className="text-gray-300 font-inter">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto"
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
          transition={{ delay: 1 }}
          className="container mx-auto px-6 py-8 mt-16"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logoFm} alt="Logo" className="w-8 h-8" />
              <span className="text-xl font-bold font-space-grotesk bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SUI-FX
              </span>
            </div>
            <p className="text-gray-400 font-inter text-sm">
              Built with 🤍 from 0n0niverse
            </p>
          </div>
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