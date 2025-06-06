import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Shield, AlertTriangle, Activity, Clock, Bot, Ban } from "lucide-react";
import { format } from "date-fns";

interface BotAnalyticsData {
  summary: {
    total24h: number;
    blocked24h: number;
    legitimate24h: number;
    totalLastHour: number;
    blockedLastHour: number;
  };
  hourlyStats: Array<{
    hour: string;
    total: number;
    blocked: number;
    legitimate: number;
  }>;
  topBlockedPaths: Array<{
    path: string;
    count: number;
  }>;
  topUserAgents: Array<{
    userAgent: string;
    count: number;
  }>;
  topBlockedIps: Array<{
    ip: string;
    count: number;
  }>;
  recentActivity: Array<{
    timestamp: number;
    ip: string;
    path: string;
    userAgent: string;
    method: string;
    blocked: boolean;
    reason?: string;
  }>;
}

export default function BotAnalytics() {
  const { data, isLoading, refetch } = useQuery<BotAnalyticsData>({
    queryKey: ["/api/bot-analytics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const clearAnalytics = async () => {
    await fetch("/api/bot-analytics/clear", {
      method: "POST",
    });
    refetch();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading bot analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500">
        No analytics data available
      </div>
    );
  }

  const blockedPercentage = data.summary.total24h > 0 
    ? Math.round((data.summary.blocked24h / data.summary.total24h) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.total24h}</div>
            <p className="text-xs text-muted-foreground">
              {data.summary.totalLastHour} in the last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Requests</CardTitle>
            <Ban className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.summary.blocked24h}</div>
            <p className="text-xs text-muted-foreground">
              {blockedPercentage}% of total traffic
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legitimate Traffic</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.summary.legitimate24h}</div>
            <p className="text-xs text-muted-foreground">
              Safe user requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Last Hour</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{data.summary.blockedLastHour}</div>
            <p className="text-xs text-muted-foreground">
              Recent bot activity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Blocked Paths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Most Targeted Paths
          </CardTitle>
          <CardDescription>
            Paths most frequently attacked by bots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.topBlockedPaths.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {item.path}
                </code>
                <Badge variant="destructive">{item.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Blocked IPs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-red-500" />
            Most Active Bot IPs
          </CardTitle>
          <CardDescription>
            IP addresses with the most blocked requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.topBlockedIps.slice(0, 10).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {item.ip}
                </code>
                <Badge variant="destructive">{item.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Last 50 requests (legitimate and blocked)
            </CardDescription>
          </div>
          <Button onClick={clearAnalytics} variant="outline" size="sm">
            Clear Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.recentActivity.map((activity, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border text-sm ${
                  activity.blocked 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={activity.blocked ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {activity.method}
                    </Badge>
                    <code className="text-xs">{activity.path}</code>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(activity.timestamp), 'HH:mm:ss')}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  IP: {activity.ip} | UA: {activity.userAgent.slice(0, 80)}...
                  {activity.reason && (
                    <div className="text-red-600 font-medium mt-1">
                      Reason: {activity.reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}