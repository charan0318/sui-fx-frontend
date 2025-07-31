import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ShieldCheck, LogIn, LogOut, Server, Wallet, BarChart3, ExternalLink, Book, HelpCircle, Activity, Shield, Droplets, ArrowLeft } from "lucide-react";
import logoFm from "@/components/background/logo_fm.png";

const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginForm = z.infer<typeof adminLoginSchema>;

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sessionId, setSessionId] = useState<string | null>(localStorage.getItem('adminSession'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!sessionId);

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

  const form = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: AdminLoginForm) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      setSessionId(data.sessionId);
      setIsAuthenticated(true);
      localStorage.setItem('adminSession', data.sessionId);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.username}!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard"] });
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (sessionId) {
        await apiRequest("POST", "/api/admin/logout", {});
      }
    },
    onSuccess: () => {
      setSessionId(null);
      setIsAuthenticated(false);
      localStorage.removeItem('adminSession');
      queryClient.clear();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    },
  });

  // Dashboard data query
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    enabled: isAuthenticated && !!sessionId,
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${sessionId}` }
      });
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          setSessionId(null);
          localStorage.removeItem('adminSession');
        }
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    },
    refetchInterval: 30000,
  });

  const onSubmit = (data: AdminLoginForm) => {
    loginMutation.mutate(data);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isAuthenticated) {
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
        <div className="relative z-10 pt-16 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full mx-4">
          <Card className="glass-morphism border-gray-700">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Username</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-black/20 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            className="bg-black/20 border-gray-600 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <LogIn className="w-5 h-5" />
                      <span>{loginMutation.isPending ? "Logging in..." : "Login"}</span>
                    </div>
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
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
        <div className="relative z-10 pt-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
        </div>
      </div>
    );
  }

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
        <div className="container mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <h1 className="text-3xl font-bold font-space-grotesk bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-black/20 backdrop-blur-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>
        </div>

      <div className="container mx-auto px-6 py-8">
        {dashboardData?.success && (
          <>
            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="glass-morphism border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-300">System Status</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-400">Healthy</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Uptime:</span>
                      <span className="text-white">{dashboardData.data.system.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Version:</span>
                      <span className="text-white">{dashboardData.data.system.version}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-300">Wallet Info</h4>
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white font-semibold">{dashboardData.data.wallet.balance} SUI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <Badge variant={dashboardData.data.wallet.status === "Sufficient" ? "default" : "destructive"}>
                        {dashboardData.data.wallet.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-morphism border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-300">Statistics</h4>
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Success Rate:</span>
                      <span className="text-green-400 font-semibold">{dashboardData.data.stats.successRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Requests:</span>
                      <span className="text-white">{dashboardData.data.stats.totalRequests}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="glass-morphism border-gray-700 mb-8">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">{dashboardData.data.performance.uptime}</div>
                    <div className="text-sm text-gray-400">Uptime (30 days)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{dashboardData.data.performance.responseTime}</div>
                    <div className="text-sm text-gray-400">Avg Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">{dashboardData.data.performance.successRate}</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="glass-morphism border-gray-700">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 text-gray-400">Time</th>
                        <th className="text-left py-3 text-gray-400">Address</th>
                        <th className="text-left py-3 text-gray-400">Amount</th>
                        <th className="text-left py-3 text-gray-400">Status</th>
                        <th className="text-left py-3 text-gray-400">Hash</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.data.recentTransactions.map((tx: any) => (
                        <tr key={tx.id} className="border-b border-gray-800">
                          <td className="py-3 text-gray-300">{tx.time}</td>
                          <td className="py-3 font-mono text-xs">{tx.address}</td>
                          <td className="py-3 text-blue-400">{tx.amount}</td>
                          <td className="py-3">
                            <Badge 
                              variant={tx.status === "success" ? "default" : tx.status === "failed" ? "destructive" : "secondary"}
                            >
                              {tx.status}
                            </Badge>
                          </td>
                          <td className="py-3">
                            {tx.hash && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
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
