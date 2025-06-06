import { users, type User, type InsertUser, type SecurityLog, type InsertSecurityLog } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  logSecurityEvent(log: InsertSecurityLog): Promise<SecurityLog>;
  getSecurityLogs(limit?: number): Promise<SecurityLog[]>;
  getSecurityStats(): Promise<{
    totalAttempts: number;
    uniqueIPs: number;
    lastHour: number;
    topPaths: { path: string; count: number }[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private securityLogs: Map<number, SecurityLog>;
  private currentUserId: number;
  private currentLogId: number;

  constructor() {
    this.users = new Map();
    this.securityLogs = new Map();
    this.currentUserId = 1;
    this.currentLogId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async logSecurityEvent(insertLog: InsertSecurityLog): Promise<SecurityLog> {
    const id = this.currentLogId++;
    const timestamp = new Date();
    const log: SecurityLog = { 
      ...insertLog, 
      id, 
      timestamp,
      userAgent: insertLog.userAgent || null
    };
    this.securityLogs.set(id, log);
    return log;
  }

  async getSecurityLogs(limit: number = 50): Promise<SecurityLog[]> {
    const logs = Array.from(this.securityLogs.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return logs;
  }

  async getSecurityStats(): Promise<{
    totalAttempts: number;
    uniqueIPs: number;
    lastHour: number;
    topPaths: { path: string; count: number }[];
  }> {
    const logs = Array.from(this.securityLogs.values());
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const totalAttempts = logs.length;
    const uniqueIPs = new Set(logs.map(log => log.ip)).size;
    const lastHour = logs.filter(log => log.timestamp >= oneHourAgo).length;

    // Calculate top paths
    const pathCounts = logs.reduce((acc, log) => {
      acc[log.path] = (acc[log.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPaths = Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalAttempts,
      uniqueIPs,
      lastHour,
      topPaths
    };
  }
}

export const storage = new MemStorage();
