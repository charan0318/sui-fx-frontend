import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFaucetRequestSchema, adminLoginSchema, insertApiClientSchema } from "@shared/schema";
import { randomBytes } from "crypto";

// Simple session storage for admin authentication
const adminSessions = new Map<string, { userId: string; expires: Date }>();

// Rate limiting maps
const walletRateLimit = new Map<string, Date>();
const ipRateLimit = new Map<string, { count: number; resetTime: Date }>();

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to get client IP
  const getClientIP = (req: any) => {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           '127.0.0.1';
  };

  // Check rate limits
  const checkRateLimit = (walletAddress: string, ipAddress: string) => {
    const now = new Date();
    
    // Check wallet rate limit (1 per hour)
    const walletLastRequest = walletRateLimit.get(walletAddress);
    if (walletLastRequest && (now.getTime() - walletLastRequest.getTime()) < 3600000) {
      const nextRequestTime = new Date(walletLastRequest.getTime() + 3600000);
      return {
        allowed: false,
        error: "Rate limit exceeded for wallet",
        nextRequestTime,
      };
    }
    
    // Check IP rate limit (100 per hour)
    const ipLimit = ipRateLimit.get(ipAddress);
    if (ipLimit && now < ipLimit.resetTime) {
      if (ipLimit.count >= 100) {
        return {
          allowed: false,
          error: "Rate limit exceeded for IP address",
          nextRequestTime: ipLimit.resetTime,
        };
      }
    }
    
    return { allowed: true };
  };

  // Simulate SUI transaction
  const simulateSUITransaction = async (walletAddress: string, amount: string) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Simulate occasional failures (5% failure rate)
    if (Math.random() < 0.05) {
      throw new Error("Network error: Unable to broadcast transaction");
    }
    
    // Generate mock transaction hash
    const txHash = "0x" + randomBytes(32).toString('hex');
    return {
      transactionHash: txHash,
      explorerUrl: `https://suiscan.xyz/testnet/tx/${txHash}`,
    };
  };

  // Admin authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const session = adminSessions.get(sessionId);
    if (!session || session.expires < new Date()) {
      adminSessions.delete(sessionId);
      return res.status(401).json({ error: "Session expired" });
    }
    
    req.userId = session.userId;
    next();
  };

  // API Routes
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const sessionId = randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      adminSessions.set(sessionId, { userId: user.id, expires });
      
      res.json({ 
        success: true, 
        sessionId,
        user: { id: user.id, username: user.username }
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", requireAuth, (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      adminSessions.delete(sessionId);
    }
    res.json({ success: true });
  });

  // Faucet request
  app.post("/api/faucet/request", async (req, res) => {
    try {
      const ipAddress = getClientIP(req);
      const requestData = insertFaucetRequestSchema.parse({
        ...req.body,
        ipAddress,
      });
      
      // Check rate limits
      const rateLimitCheck = checkRateLimit(requestData.walletAddress, ipAddress);
      if (!rateLimitCheck.allowed) {
        return res.status(429).json({
          error: rateLimitCheck.error,
          nextRequestTime: rateLimitCheck.nextRequestTime,
        });
      }
      
      // Create pending request
      const request = await storage.createFaucetRequest(requestData);
      
      try {
        // Simulate SUI transaction
        const txResult = await simulateSUITransaction(
          requestData.walletAddress, 
          request.amount
        );
        
        // Update request with success
        const updatedRequest = await storage.updateFaucetRequest(request.id, {
          status: "success",
          transactionHash: txResult.transactionHash,
        });
        
        // Update rate limits
        walletRateLimit.set(requestData.walletAddress, new Date());
        const ipLimit = ipRateLimit.get(ipAddress);
        const now = new Date();
        const resetTime = new Date(now.getTime() + 3600000); // 1 hour from now
        
        if (!ipLimit || now >= ipLimit.resetTime) {
          ipRateLimit.set(ipAddress, { count: 1, resetTime });
        } else {
          ipLimit.count += 1;
        }
        
        res.json({
          success: true,
          data: {
            transactionHash: txResult.transactionHash,
            amount: request.amount,
            explorerUrl: txResult.explorerUrl,
            requestId: request.id,
          },
        });
        
      } catch (txError: any) {
        // Update request with failure
        await storage.updateFaucetRequest(request.id, {
          status: "failed",
          errorMessage: txError.message,
        });
        
        res.status(500).json({
          error: "Transaction failed",
          details: txError.message,
        });
      }
      
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get system stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      const recentRequests = await storage.getRecentFaucetRequests(100);
      
      const successRate = stats.totalRequests > 0 
        ? (stats.successfulRequests / stats.totalRequests * 100).toFixed(2)
        : "0";
      
      const uptime = Date.now() - stats.uptime.getTime();
      const uptimeHours = Math.floor(uptime / (1000 * 60 * 60));
      const uptimeMinutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      
      res.json({
        success: true,
        data: {
          totalRequests: stats.totalRequests,
          successfulRequests: stats.successfulRequests,
          totalDistributed: (parseInt(stats.totalDistributed) / 1000000000).toFixed(1), // Convert from mist to SUI
          successRate: `${successRate}%`,
          uptime: `${uptimeHours}h ${uptimeMinutes}m`,
          isHealthy: stats.isHealthy,
          recentRequests: recentRequests.slice(0, 10).map(req => ({
            id: req.id,
            walletAddress: `${req.walletAddress.slice(0, 6)}...${req.walletAddress.slice(-4)}`,
            amount: (parseInt(req.amount) / 1000000000).toFixed(1),
            status: req.status,
            createdAt: req.createdAt.toISOString(),
            transactionHash: req.transactionHash ? `${req.transactionHash.slice(0, 6)}...${req.transactionHash.slice(-4)}` : null,
          })),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get admin dashboard data
  app.get("/api/admin/dashboard", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getSystemStats();
      const recentRequests = await storage.getRecentFaucetRequests(50);
      
      const walletBalance = "50.5"; // Mock wallet balance
      const responseTime = Math.floor(Math.random() * 100 + 20); // Mock response time
      
      res.json({
        success: true,
        data: {
          system: {
            uptime: `${Math.floor((Date.now() - stats.uptime.getTime()) / (1000 * 60 * 60))}h ${Math.floor(((Date.now() - stats.uptime.getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m`,
            version: "v1.0.0",
            isHealthy: stats.isHealthy,
          },
          wallet: {
            balance: walletBalance,
            status: parseFloat(walletBalance) > 10 ? "Sufficient" : "Low",
          },
          stats: {
            totalRequests: stats.totalRequests,
            successfulRequests: stats.successfulRequests,
            successRate: stats.totalRequests > 0 ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(2) : "0",
            totalDistributed: (parseInt(stats.totalDistributed) / 1000000000).toFixed(1),
          },
          performance: {
            responseTime: `${responseTime}ms`,
            uptime: "99.9%",
            successRate: "98.5%",
          },
          recentTransactions: recentRequests.map(req => ({
            id: req.id,
            time: req.createdAt.toLocaleTimeString('en-US', { hour12: false }),
            address: `${req.walletAddress.slice(0, 6)}...${req.walletAddress.slice(-4)}`,
            amount: `${(parseInt(req.amount) / 1000000000).toFixed(1)} SUI`,
            status: req.status,
            hash: req.transactionHash,
          })),
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get rate limit info for a wallet
  app.get("/api/faucet/rate-limit/:walletAddress", (req, res) => {
    const { walletAddress } = req.params;
    const lastRequest = walletRateLimit.get(walletAddress);
    
    if (!lastRequest) {
      return res.json({
        success: true,
        data: { canRequest: true, nextRequestTime: null },
      });
    }
    
    const now = new Date();
    const nextRequestTime = new Date(lastRequest.getTime() + 3600000); // 1 hour later
    const canRequest = now >= nextRequestTime;
    
    res.json({
      success: true,
      data: {
        canRequest,
        nextRequestTime: canRequest ? null : nextRequestTime.toISOString(),
        timeRemaining: canRequest ? 0 : Math.ceil((nextRequestTime.getTime() - now.getTime()) / 1000),
      },
    });
  });

  // ===== API CLIENT MANAGEMENT ROUTES =====

  // Generate unique API credentials
  const generateApiCredentials = () => {
    const clientId = "suifx_" + randomBytes(8).toString('hex');
    const apiKey = "suifx_" + randomBytes(32).toString('hex');
    return { clientId, apiKey };
  };

  // Register API client
  app.post("/api/v1/clients/register", async (req, res) => {
    try {
      const validatedData = insertApiClientSchema.parse(req.body);
      const { clientId, apiKey } = generateApiCredentials();

      const client = await storage.createApiClient({
        ...validatedData,
        clientId,
        apiKey,
      });

      // Track usage
      await storage.logClientUsage(clientId, "/api/v1/clients/register", "POST", 201, 0);

      res.status(201).json({
        success: true,
        data: {
          client_id: clientId,
          api_key: apiKey, // Only shown once!
          name: client.name,
          created_at: client.createdAt,
        },
      });
    } catch (error: any) {
      res.status(400).json({ 
        success: false,
        error: error.message || "Failed to register API client" 
      });
    }
  });

  // Get client dashboard data
  app.get("/api/v1/clients/:clientId", async (req, res) => {
    try {
      const { clientId } = req.params;
      
      const client = await storage.getApiClientByClientId(clientId);
      if (!client) {
        return res.status(404).json({ 
          success: false,
          error: "Client not found" 
        });
      }

      const usage = await storage.getClientUsageStats(clientId);
      const recentRequests = await storage.getRecentClientRequests(clientId, 20);

      res.json({
        success: true,
        data: {
          client: {
            id: client.clientId,
            name: client.name,
            description: client.description,
            created_at: client.createdAt,
            is_active: client.isActive,
            last_used: client.lastUsed,
          },
          stats: {
            total_requests: usage.totalRequests,
            requests_today: usage.requestsToday,
            avg_response_time: usage.avgResponseTime,
            success_rate: usage.successRate,
          },
          recent_requests: recentRequests.map(req => ({
            timestamp: req.createdAt,
            endpoint: req.endpoint,
            method: req.method,
            status_code: req.statusCode,
            response_time: req.responseTime,
          })),
        },
      });
    } catch (error: any) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  });

  // API key authentication middleware
  const authenticateApiKey = async (req: any, res: any, next: any) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ 
        success: false,
        error: "API key required in X-API-Key header" 
      });
    }

    try {
      const client = await storage.getApiClientByApiKey(apiKey);
      if (!client || !client.isActive) {
        return res.status(401).json({ 
          success: false,
          error: "Invalid or inactive API key" 
        });
      }

      // Update last used timestamp
      await storage.updateApiClientLastUsed(client.clientId);
      
      req.apiClient = client;
      next();
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: "Authentication error" 
      });
    }
  };

  // Enhanced faucet request with API key support
  app.post("/api/v1/faucet/request", authenticateApiKey, async (req, res) => {
    const startTime = Date.now();
    
    try {
      const { walletAddress } = req.body;
      const ipAddress = getClientIP(req);
      const client = (req as any).apiClient;

      // Validate wallet address
      const validatedData = insertFaucetRequestSchema.parse({ walletAddress, ipAddress });
      
      // Check rate limits
      const rateLimitResult = checkRateLimit(walletAddress, ipAddress);
      if (!rateLimitResult.allowed) {
        const responseTime = Date.now() - startTime;
        await storage.logClientUsage(client.clientId, "/api/v1/faucet/request", "POST", 429, responseTime);
        
        return res.status(429).json({
          success: false,
          error: rateLimitResult.error,
          nextRequestTime: rateLimitResult.nextRequestTime,
        });
      }

      // Create faucet request
      const request = await storage.createFaucetRequest(validatedData);

      try {
        // Simulate SUI transaction
        const transaction = await simulateSUITransaction(walletAddress, request.amount);
        
        // Update request with transaction details
        await storage.updateFaucetRequest(request.id, {
          status: "success",
          transactionHash: transaction.transactionHash,
        });

        // Update rate limits
        walletRateLimit.set(walletAddress, new Date());
        const now = new Date();
        const ipLimit = ipRateLimit.get(ipAddress);
        if (!ipLimit || now >= ipLimit.resetTime) {
          ipRateLimit.set(ipAddress, { count: 1, resetTime: new Date(now.getTime() + 3600000) });
        } else {
          ipLimit.count++;
        }

        // Update system stats
        await storage.updateSystemStats();

        const responseTime = Date.now() - startTime;
        await storage.logClientUsage(client.clientId, "/api/v1/faucet/request", "POST", 200, responseTime);

        res.json({
          success: true,
          data: {
            transactionHash: transaction.transactionHash,
            explorerUrl: transaction.explorerUrl,
            amount: (parseInt(request.amount) / 1000000000).toFixed(1),
            walletAddress: walletAddress,
          },
        });
      } catch (txError: any) {
        // Update request as failed
        await storage.updateFaucetRequest(request.id, {
          status: "failed",
          errorMessage: txError.message,
        });

        const responseTime = Date.now() - startTime;
        await storage.logClientUsage(client.clientId, "/api/v1/faucet/request", "POST", 500, responseTime);

        res.status(500).json({
          success: false,
          error: "Transaction failed: " + txError.message,
        });
      }
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      if ((req as any).apiClient) {
        await storage.logClientUsage((req as any).apiClient.clientId, "/api/v1/faucet/request", "POST", 400, responseTime);
      }
      
      res.status(400).json({
        success: false,
        error: error.message || "Invalid request",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
