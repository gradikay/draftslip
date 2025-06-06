import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Clock, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface SecurityLog {
  id: number;
  timestamp: string;
  path: string;
  ip: string;
  type: 'honeypot' | 'attack' | 'php';
  userAgent?: string | null;
  method: string;
}

interface SecurityStats {
  totalAttempts: number;
  uniqueIPs: number;
  lastHour: number;
  topPaths: { path: string; count: number }[];
}

export default function AdminPage() {
  const { data: logs = [], isLoading: logsLoading } = useQuery<SecurityLog[]>({
    queryKey: ['/api/security/logs'],
    refetchInterval: 5000, // Refresh every 5 seconds for real-time updates
  });

  const { data: stats, isLoading: statsLoading } = useQuery<SecurityStats>({
    queryKey: ['/api/security/stats'],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const defaultStats = {
    totalAttempts: 0,
    uniqueIPs: 0,
    lastHour: 0,
    topPaths: []
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'honeypot': return 'bg-yellow-100 text-yellow-800';
      case 'attack': return 'bg-red-100 text-red-800';
      case 'php': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'honeypot': return <Shield className="w-4 h-4" />;
      case 'attack': return <AlertTriangle className="w-4 h-4" />;
      case 'php': return <Activity className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Dashboard</h1>
          <p className="text-gray-600">Monitor bot activity and honeypot effectiveness</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attempts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAttempts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Blocked malicious requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique IPs</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.uniqueIPs || 0}</div>
              <p className="text-xs text-muted-foreground">
                Different attackers identified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Hour</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.lastHour || 0}</div>
              <p className="text-xs text-muted-foreground">
                Recent attack attempts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                Honeypot is operational
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="logs">Recent Activity</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="protection">Protection Status</TabsTrigger>
          </TabsList>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Live feed of blocked attempts and honeypot activations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(log.type)}
                          <Badge className={getTypeColor(log.type)}>
                            {log.type.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <div className="font-medium">{log.path}</div>
                          <div className="text-sm text-gray-500">From {log.ip}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Targeted Paths</CardTitle>
                  <CardDescription>Most frequently attacked endpoints</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(stats?.topPaths || []).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {item.path}
                          </span>
                        </div>
                        <Badge variant="secondary">{item.count} attempts</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attack Patterns</CardTitle>
                  <CardDescription>Common bot behaviors detected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>WordPress Exploits</span>
                      <Badge className="bg-red-100 text-red-800">High</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Config File Access</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Admin Panel Probing</span>
                      <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Database Access</span>
                      <Badge className="bg-red-100 text-red-800">High</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="protection">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Honeypot Configuration</CardTitle>
                  <CardDescription>Current protection settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>WordPress Honeypots</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>PHP File Protection</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Attack Pattern Detection</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Time Delay (5-15s)</span>
                      <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Protected Endpoints</CardTitle>
                  <CardDescription>Monitored attack vectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="font-mono bg-gray-100 p-2 rounded">
                      /wp-admin/*, /xmlrpc.php, /wp-config.php
                    </div>
                    <div className="font-mono bg-gray-100 p-2 rounded">
                      /phpmyadmin/*, /.env, /config.php
                    </div>
                    <div className="font-mono bg-gray-100 p-2 rounded">
                      /cgi-bin/*, /shell, /cmd, /exec
                    </div>
                    <div className="font-mono bg-gray-100 p-2 rounded">
                      *.php (generic catch-all)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}