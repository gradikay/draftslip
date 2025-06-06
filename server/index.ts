import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes, logBotActivity } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Bot protection middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  const path = req.path.toLowerCase();
  const method = req.method;
  
  // Block common bot patterns and malicious requests
  const blockedPaths = [
    '/wp-admin', '/wordpress', '/wp-login', '/wp-content', '/wp-includes',
    '/xmlrpc.php', '/wp-config.php', '/wp-admin/setup-config.php',
    '/.env', '/.git', '/admin', '/administrator', '/phpmyadmin',
    '/mysql', '/database', '/db', '/backup', '/config',
    '/robots.txt', '/sitemap.xml'
  ];
  
  const suspiciousBots = [
    'python-requests', 'curl', 'wget', 'scrapy', 'bot', 'crawler',
    'spider', 'scan', 'test', 'exploit', 'hack', 'attack'
  ];
  
  // Check for blocked paths
  if (blockedPaths.some(blocked => path.includes(blocked))) {
    const reason = `Blocked path: ${path}`;
    log(`${reason} - ${method} ${req.path} from ${req.ip} - User-Agent: ${userAgent}`);
    logBotActivity({
      timestamp: Date.now(),
      ip: req.ip,
      path: req.path,
      userAgent,
      method,
      blocked: true,
      reason
    });
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Check for suspicious user agents
  if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    const reason = `Suspicious user agent`;
    log(`${reason}: ${method} ${req.path} from ${req.ip} - User-Agent: ${userAgent}`);
    logBotActivity({
      timestamp: Date.now(),
      ip: req.ip,
      path: req.path,
      userAgent,
      method,
      blocked: true,
      reason
    });
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Rate limiting - simple IP-based tracking
  const clientIp = req.ip;
  const now = Date.now();
  
  if (!app.locals.rateLimiter) {
    app.locals.rateLimiter = new Map();
  }
  
  const clientData = app.locals.rateLimiter.get(clientIp) || { requests: 0, resetTime: now + 60000 };
  
  if (now > clientData.resetTime) {
    clientData.requests = 1;
    clientData.resetTime = now + 60000; // Reset every minute
  } else {
    clientData.requests++;
  }
  
  app.locals.rateLimiter.set(clientIp, clientData);
  
  // Block if more than 50 requests per minute
  if (clientData.requests > 50) {
    const reason = `Rate limited: ${clientData.requests} requests per minute`;
    log(`${reason}: ${clientIp}`);
    logBotActivity({
      timestamp: Date.now(),
      ip: req.ip,
      path: req.path,
      userAgent,
      method,
      blocked: true,
      reason
    });
    return res.status(429).json({ error: 'Too many requests' });
  }
  
  // Log legitimate requests
  if (path.startsWith('/api') || path === '/') {
    logBotActivity({
      timestamp: Date.now(),
      ip: req.ip,
      path: req.path,
      userAgent,
      method,
      blocked: false
    });
  }
  
  next();
});

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; img-src 'self' data: blob: https:;");
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
