import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Bot tracking storage
interface BotActivity {
  timestamp: number;
  ip: string;
  path: string;
  userAgent: string;
  method: string;
  blocked: boolean;
  reason?: string;
}

const botActivities: BotActivity[] = [];
const MAX_ACTIVITIES = 1000; // Keep last 1000 activities

export function logBotActivity(activity: BotActivity) {
  botActivities.unshift(activity);
  if (botActivities.length > MAX_ACTIVITIES) {
    botActivities.pop();
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Honeypot routes - waste bot time with fake WordPress/PHP endpoints
  const honeypotPaths = [
    '/wp-admin/setup-config.php',
    '/wp-config.php', 
    '/xmlrpc.php',
    '/wp-login.php',
    '/wp-admin/admin-ajax.php',
    '/wp-content/plugins/wp-file-manager/readme.txt',
    '/phpmyadmin/index.php',
    '/.env',
    '/config.php',
    '/database.php'
  ];

  honeypotPaths.forEach(path => {
    app.all(path, async (req, res) => {
      const userAgent = req.get('User-Agent') || '';
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      
      logBotActivity({
        timestamp: Date.now(),
        ip: clientIp,
        path: req.path,
        userAgent,
        method: req.method,
        blocked: true,
        reason: 'Honeypot triggered'
      });

      // Fake processing delay to waste bot time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 2000));
      
      // Return fake WordPress errors to confuse bots
      if (path.includes('wp-')) {
        return res.status(500).send(`
          <!DOCTYPE html>
          <html>
          <head><title>Database Error</title></head>
          <body>
            <h1>Error establishing a database connection</h1>
            <p>This either means that the username and password information in your wp-config.php file is incorrect or we can't contact the database server.</p>
            <!-- Keep scanning, there's more content below -->
            ${Array.from({length: 100}, (_, i) => `<!-- fake comment ${i} -->`).join('\n')}
          </body>
          </html>
        `);
      }
      
      if (path.includes('.env')) {
        return res.status(403).send('Forbidden - Access denied');
      }
      
      res.status(404).send('Not Found');
    });
  });

  // Catch-all for other PHP requests
  app.all('*.php', (req, res) => {
    const userAgent = req.get('User-Agent') || '';
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    
    logBotActivity({
      timestamp: Date.now(),
      ip: clientIp,
      path: req.path,
      userAgent,
      method: req.method,
      blocked: true,
      reason: 'PHP file request blocked'
    });

    res.status(404).json({ 
      error: 'Not Found',
      message: 'PHP files are not supported on this server'
    });
  });

  // Bot analytics endpoint
  app.get("/api/bot-analytics", (req, res) => {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const lastHour = now - (60 * 60 * 1000);
    
    const recent = botActivities.filter(a => a.timestamp > last24h);
    const hourly = botActivities.filter(a => a.timestamp > lastHour);
    
    // Group by hour for the last 24 hours
    const hourlyStats = Array.from({ length: 24 }, (_, i) => {
      const hourStart = now - (i * 60 * 60 * 1000);
      const hourEnd = hourStart + (60 * 60 * 1000);
      const hourData = recent.filter(a => a.timestamp >= hourStart && a.timestamp < hourEnd);
      
      return {
        hour: new Date(hourStart).toISOString(),
        total: hourData.length,
        blocked: hourData.filter(a => a.blocked).length,
        legitimate: hourData.filter(a => !a.blocked).length
      };
    }).reverse();
    
    // Top blocked paths
    const blockedActivities = recent.filter(a => a.blocked);
    const pathCounts = blockedActivities.reduce((acc, activity) => {
      acc[activity.path] = (acc[activity.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topBlockedPaths = Object.entries(pathCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([path, count]) => ({ path, count }));
    
    // Top user agents
    const userAgentCounts = blockedActivities.reduce((acc, activity) => {
      const ua = activity.userAgent.slice(0, 100); // Truncate long UAs
      acc[ua] = (acc[ua] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topUserAgents = Object.entries(userAgentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([userAgent, count]) => ({ userAgent, count }));
    
    // IP addresses with most blocked requests
    const ipCounts = blockedActivities.reduce((acc, activity) => {
      acc[activity.ip] = (acc[activity.ip] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topBlockedIps = Object.entries(ipCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));
    
    res.json({
      summary: {
        total24h: recent.length,
        blocked24h: recent.filter(a => a.blocked).length,
        legitimate24h: recent.filter(a => !a.blocked).length,
        totalLastHour: hourly.length,
        blockedLastHour: hourly.filter(a => a.blocked).length
      },
      hourlyStats,
      topBlockedPaths,
      topUserAgents,
      topBlockedIps,
      recentActivity: botActivities.slice(0, 50) // Last 50 activities
    });
  });

  // Clear bot analytics (admin function)
  app.post("/api/bot-analytics/clear", (req, res) => {
    botActivities.length = 0;
    res.json({ message: "Analytics cleared" });
  });

  // Clear rate limiter cache (admin function)
  app.post("/api/rate-limiter/clear", (req, res) => {
    if (req.app.locals.rateLimiter) {
      req.app.locals.rateLimiter.clear();
    }
    res.json({ message: "Rate limiter cache cleared" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
