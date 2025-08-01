import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const faucetRequests = pgTable("faucet_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  amount: text("amount").notNull().default("100000000"), // 0.1 SUI in mist
  transactionHash: text("transaction_hash"),
  status: text("status").notNull().default("pending"), // pending, success, failed
  ipAddress: text("ip_address").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  errorMessage: text("error_message"),
});

export const systemStats = pgTable("system_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalRequests: integer("total_requests").notNull().default(0),
  successfulRequests: integer("successful_requests").notNull().default(0),
  totalDistributed: text("total_distributed").notNull().default("0"),
  uptime: timestamp("uptime").defaultNow().notNull(),
  isHealthy: boolean("is_healthy").notNull().default(true),
});

export const apiClients = pgTable("api_clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: text("client_id").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  homepageUrl: text("homepage_url"),
  callbackUrl: text("callback_url"),
  apiKey: text("api_key").notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used"),
});

export const clientUsage = pgTable("client_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: text("client_id").notNull(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time").notNull(), // in milliseconds
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFaucetRequestSchema = createInsertSchema(faucetRequests).pick({
  walletAddress: true,
  ipAddress: true,
}).extend({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid SUI wallet address format"),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertApiClientSchema = createInsertSchema(apiClients).pick({
  name: true,
  description: true,
  homepageUrl: true,
  callbackUrl: true,
}).extend({
  name: z.string().min(1, "Application name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").optional(),
  homepageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  callbackUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFaucetRequest = z.infer<typeof insertFaucetRequestSchema>;
export type FaucetRequest = typeof faucetRequests.$inferSelect;
export type SystemStats = typeof systemStats.$inferSelect;
export type AdminLogin = z.infer<typeof adminLoginSchema>;
export type InsertApiClient = z.infer<typeof insertApiClientSchema>;
export type ApiClient = typeof apiClients.$inferSelect;
export type ClientUsage = typeof clientUsage.$inferSelect;
