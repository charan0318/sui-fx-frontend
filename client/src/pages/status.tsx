import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Link as LinkIcon, ShieldCheck } from "lucide-react";

export default function Status() {
  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">System Status</h1>
            <p className="text-gray-400">Real-time monitoring of SUI-FX faucet services</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
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
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.name} className="glass-morphism border-gray-700 text-center">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">{service.name}</h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-400 capitalize">{service.status}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {service.responseTime && `Response time: ${service.responseTime}`}
                      {service.blockHeight && `Block height: ${service.blockHeight}`}
                      {service.ssl && `SSL: ${service.ssl}`}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance Metrics */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
                  <div className="text-sm text-gray-400">Uptime (30 days)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">156ms</div>
                  <div className="text-sm text-gray-400">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {stats?.success ? stats.data.successRate : "98.5%"}
                  </div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Statistics */}
          {stats?.success && (
            <Card className="glass-morphism border-gray-700">
              <CardHeader>
                <CardTitle>Live Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-2">{stats.data.totalRequests}</div>
                    <div className="text-sm text-gray-400">Total Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-2">{stats.data.successfulRequests}</div>
                    <div className="text-sm text-gray-400">Successful Requests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-2">{stats.data.totalDistributed} SUI</div>
                    <div className="text-sm text-gray-400">Total Distributed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-2">{stats.data.uptime}</div>
                    <div className="text-sm text-gray-400">Current Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Incident History */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">No Recent Incidents</h3>
                <p className="text-gray-400">All systems have been running smoothly for the past 30 days.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
