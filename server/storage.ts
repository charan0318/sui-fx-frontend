import { type User, type InsertUser, type FaucetRequest, type InsertFaucetRequest, type SystemStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createFaucetRequest(request: InsertFaucetRequest): Promise<FaucetRequest>;
  getFaucetRequestsByWallet(walletAddress: string): Promise<FaucetRequest[]>;
  getFaucetRequestsByIP(ipAddress: string): Promise<FaucetRequest[]>;
  updateFaucetRequest(id: string, updates: Partial<FaucetRequest>): Promise<FaucetRequest | undefined>;
  getRecentFaucetRequests(limit?: number): Promise<FaucetRequest[]>;
  
  getSystemStats(): Promise<SystemStats>;
  updateSystemStats(stats: Partial<SystemStats>): Promise<SystemStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private faucetRequests: Map<string, FaucetRequest>;
  private systemStats: SystemStats;

  constructor() {
    this.users = new Map();
    this.faucetRequests = new Map();
    this.systemStats = {
      id: randomUUID(),
      totalRequests: 0,
      successfulRequests: 0,
      totalDistributed: "0",
      uptime: new Date(),
      isHealthy: true,
    };
    
    // Create default admin user
    this.createUser({ username: "admin", password: "admin123" });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createFaucetRequest(request: InsertFaucetRequest): Promise<FaucetRequest> {
    const id = randomUUID();
    const faucetRequest: FaucetRequest = {
      id,
      ...request,
      amount: "100000000", // 0.1 SUI in mist
      transactionHash: null,
      status: "pending",
      createdAt: new Date(),
      errorMessage: null,
    };
    this.faucetRequests.set(id, faucetRequest);
    
    // Update system stats
    this.systemStats.totalRequests += 1;
    
    return faucetRequest;
  }

  async getFaucetRequestsByWallet(walletAddress: string): Promise<FaucetRequest[]> {
    return Array.from(this.faucetRequests.values()).filter(
      (req) => req.walletAddress === walletAddress
    );
  }

  async getFaucetRequestsByIP(ipAddress: string): Promise<FaucetRequest[]> {
    return Array.from(this.faucetRequests.values()).filter(
      (req) => req.ipAddress === ipAddress
    );
  }

  async updateFaucetRequest(id: string, updates: Partial<FaucetRequest>): Promise<FaucetRequest | undefined> {
    const request = this.faucetRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.faucetRequests.set(id, updatedRequest);
    
    // Update success stats if status changed to success
    if (updates.status === "success" && request.status !== "success") {
      this.systemStats.successfulRequests += 1;
      const currentTotal = BigInt(this.systemStats.totalDistributed);
      const amount = BigInt(request.amount);
      this.systemStats.totalDistributed = (currentTotal + amount).toString();
    }
    
    return updatedRequest;
  }

  async getRecentFaucetRequests(limit: number = 50): Promise<FaucetRequest[]> {
    return Array.from(this.faucetRequests.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getSystemStats(): Promise<SystemStats> {
    return this.systemStats;
  }

  async updateSystemStats(stats: Partial<SystemStats>): Promise<SystemStats> {
    this.systemStats = { ...this.systemStats, ...stats };
    return this.systemStats;
  }
}

export const storage = new MemStorage();
