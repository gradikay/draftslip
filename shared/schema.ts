import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const securityLogs = pgTable("security_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  path: text("path").notNull(),
  ip: text("ip").notNull(),
  type: text("type").notNull(), // 'honeypot', 'attack', 'php'
  userAgent: text("user_agent"),
  method: text("method").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSecurityLogSchema = createInsertSchema(securityLogs).pick({
  path: true,
  ip: true,
  type: true,
  userAgent: true,
  method: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSecurityLog = z.infer<typeof insertSecurityLogSchema>;
export type SecurityLog = typeof securityLogs.$inferSelect;
