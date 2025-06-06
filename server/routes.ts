import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSecurityLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Security API endpoints
  app.get('/api/security/logs', async (req, res) => {
    try {
      const logs = await storage.getSecurityLogs(100);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch security logs' });
    }
  });

  app.get('/api/security/stats', async (req, res) => {
    try {
      const stats = await storage.getSecurityStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch security stats' });
    }
  });

  // Helper function to log security events
  const logSecurityEvent = async (req: any, path: string, type: string) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || null;
    const method = req.method;
    
    await storage.logSecurityEvent({
      path,
      ip,
      type,
      userAgent,
      method
    });
  };

  // Honeypot routes for common bot targets
  const botTargets = [
    '/wp-admin/setup-config.php',
    '/wordpress/wp-admin/setup-config.php',
    '/wp-config.php',
    '/wp-login.php',
    '/wp-admin/',
    '/wp-admin/install.php',
    '/wp-admin/admin-ajax.php',
    '/xmlrpc.php',
    '/wp-content/',
    '/wp-includes/',
    '/admin/',
    '/administrator/',
    '/phpmyadmin/',
    '/phpMyAdmin/',
    '/.env',
    '/config.php',
    '/database.php',
    '/db.php',
    '/backup.sql',
    '/dump.sql'
  ];

  // Create honeypot that wastes bot time
  botTargets.forEach(path => {
    app.get(path, async (req, res) => {
      const ip = req.ip || req.connection.remoteAddress;
      console.log(`🍯 Honeypot triggered: ${path} from ${ip}`);
      
      // Log the security event
      await logSecurityEvent(req, path, 'honeypot');
      
      // Simulate a slow, fake response to waste bot time
      await new Promise(resolve => setTimeout(resolve, 5000 + Math.random() * 10000));
      
      // Send a fake "loading" response that looks real
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Loading...</title>
          <meta http-equiv="refresh" content="30">
        </head>
        <body>
          <div style="text-align:center; margin-top:50px;">
            <h2>System Maintenance</h2>
            <p>Please wait while we process your request...</p>
            <div style="border:4px solid #f3f3f3; border-top:4px solid #3498db; border-radius:50%; width:50px; height:50px; animation:spin 2s linear infinite; margin:20px auto;"></div>
            <style>@keyframes spin{0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)}}</style>
            <p><small>This may take several minutes. Do not refresh this page.</small></p>
          </div>
        </body>
        </html>
      `);
    });

    // Also catch POST requests to these endpoints
    app.post(path, async (req, res) => {
      const ip = req.ip || req.connection.remoteAddress;
      console.log(`🍯 Honeypot POST triggered: ${path} from ${ip}`);
      
      // Log the security event
      await logSecurityEvent(req, path, 'honeypot');
      
      await new Promise(resolve => setTimeout(resolve, 8000 + Math.random() * 15000));
      
      res.status(500).send(`
        <html>
        <head><title>Database Error</title></head>
        <body>
          <h1>Database Connection Error</h1>
          <p>Unable to establish connection to database server.</p>
          <p>Error Code: DB_CONN_TIMEOUT_001</p>
          <p>Retrying in 30 seconds...</p>
          <script>setTimeout(() => window.location.reload(), 30000);</script>
        </body>
        </html>
      `);
    });
  });

  // Generic PHP file catcher
  app.get('*.php', async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`🍯 Generic PHP honeypot: ${req.path} from ${ip}`);
    
    // Log the security event
    await logSecurityEvent(req, req.path, 'php');
    
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 7000));
    
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>404 - File Not Found</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .error { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .code { background: #f8f8f8; padding: 10px; border-left: 4px solid #e74c3c; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>404 - File Not Found</h1>
          <p>The requested PHP file could not be found on this server.</p>
          <div class="code">
            <strong>Error:</strong> File "${req.path}" does not exist<br>
            <strong>Server:</strong> nginx/1.18.0<br>
            <strong>Time:</strong> ${new Date().toISOString()}
          </div>
          <p><em>If you believe this is an error, please contact the site administrator.</em></p>
        </div>
      </body>
      </html>
    `);
  });

  // Catch common attack patterns
  const attackPatterns = [
    /\/\.well-known\/.*\.php$/,
    /\/cgi-bin\//,
    /\/scripts\//,
    /\/shell/,
    /\/cmd/,
    /\/exec/,
    /\/eval/,
    /\/system/,
    /\/proc\//,
    /\/etc\//
  ];

  attackPatterns.forEach(pattern => {
    app.get(pattern, async (req, res) => {
      const ip = req.ip || req.connection.remoteAddress;
      console.log(`🚨 Attack pattern detected: ${req.path} from ${ip}`);
      
      // Log the security event
      await logSecurityEvent(req, req.path, 'attack');
      
      // Longer delay for attack patterns
      await new Promise(resolve => setTimeout(resolve, 15000 + Math.random() * 20000));
      
      res.status(403).send(`
        <html>
        <head><title>Access Forbidden</title></head>
        <body>
          <h1>403 Forbidden</h1>
          <p>Access to this resource is forbidden.</p>
          <p>Your request has been logged.</p>
          <hr>
          <small>Server: Apache/2.4.41 (Ubuntu)</small>
        </body>
        </html>
      `);
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
