import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Target,
  Award,
  Zap,
  Clock,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-picker';
import ExportService from '@/services/exportService';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  bookings: {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    conversionRate: number;
  };
  users: {
    total: number;
    active: number;
    new: number;
    retention: number;
  };
  services: {
    total: number;
    popular: Array<{ name: string; bookings: number; revenue: number }>;
    performance: Array<{ name: string; rating: number; bookings: number }>;
  };
  geographic: Array<{ location: string; bookings: number; revenue: number }>;
  timeSeriesData: Array<{ 
    date: string; 
    revenue: number; 
    bookings: number; 
    users: number; 
  }>;
}

const COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#ca8a04', // Yellow
  '#9333ea', // Purple
  '#c2410c', // Orange
  '#0891b2', // Cyan
  '#be185d', // Pink
];

const mockAnalyticsData: AnalyticsData = {
  revenue: {
    total: 2500000,
    monthly: 450000,
    growth: 15.3,
    trend: 'up',
  },
  bookings: {
    total: 3450,
    completed: 2890,
    pending: 420,
    cancelled: 140,
    conversionRate: 83.8,
  },
  users: {
    total: 1847,
    active: 1456,
    new: 234,
    retention: 78.9,
  },
  services: {
    total: 48,
    popular: [
      { name: 'Bus Transportation', bookings: 1250, revenue: 875000 },
      { name: 'Cargo Services', bookings: 820, revenue: 640000 },
      { name: 'Construction Materials', bookings: 650, revenue: 520000 },
      { name: 'Tours & Packages', bookings: 480, revenue: 360000 },
      { name: 'Machinery Rental', bookings: 250, revenue: 180000 },
    ],
    performance: [
      { name: 'Bus Services', rating: 4.8, bookings: 1250 },
      { name: 'Tour Packages', rating: 4.7, bookings: 480 },
      { name: 'Cargo', rating: 4.6, bookings: 820 },
      { name: 'Construction', rating: 4.5, bookings: 650 },
      { name: 'Machinery', rating: 4.4, bookings: 250 },
    ],
  },
  geographic: [
    { location: 'Kathmandu', bookings: 1200, revenue: 850000 },
    { location: 'Pokhara', bookings: 680, revenue: 420000 },
    { location: 'Lamjung', bookings: 520, revenue: 320000 },
    { location: 'Chitwan', bookings: 380, revenue: 280000 },
    { location: 'Bhaktapur', bookings: 320, revenue: 240000 },
    { location: 'Others', bookings: 350, revenue: 180000 },
  ],
  timeSeriesData: [
    { date: '2024-01', revenue: 180000, bookings: 240, users: 45 },
    { date: '2024-02', revenue: 220000, bookings: 290, users: 52 },
    { date: '2024-03', revenue: 280000, bookings: 350, users: 68 },
    { date: '2024-04', revenue: 320000, bookings: 420, users: 78 },
    { date: '2024-05', revenue: 380000, bookings: 480, users: 89 },
    { date: '2024-06', revenue: 450000, bookings: 560, users: 112 },
    { date: '2024-07', revenue: 520000, bookings: 640, users: 134 },
    { date: '2024-08', revenue: 480000, bookings: 580, users: 125 },
  ],
};

export function PremiumAnalytics() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData({ ...mockAnalyticsData });
    setIsLoading(false);
  };

  const exportAnalytics = async () => {
    const analyticsExport = [
      { metric: 'Total Revenue', value: `₨ ${data.revenue.total.toLocaleString()}` },
      { metric: 'Monthly Revenue', value: `₨ ${data.revenue.monthly.toLocaleString()}` },
      { metric: 'Revenue Growth', value: `${data.revenue.growth}%` },
      { metric: 'Total Bookings', value: data.bookings.total.toString() },
      { metric: 'Completed Bookings', value: data.bookings.completed.toString() },
      { metric: 'Conversion Rate', value: `${data.bookings.conversionRate}%` },
      { metric: 'Total Users', value: data.users.total.toString() },
      { metric: 'Active Users', value: data.users.active.toString() },
      { metric: 'User Retention', value: `${data.users.retention}%` },
    ];

    await ExportService.exportData(analyticsExport, {
      format: 'csv',
      filename: `analytics_report_${new Date().toISOString().split('T')[0]}`,
      includeHeaders: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Premium Analytics</h2>
          <p className="text-gray-600">Advanced insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportAnalytics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`₨ ${data.revenue.total.toLocaleString()}`}
          change={`+${data.revenue.growth}%`}
          trend={data.revenue.trend}
          icon={DollarSign}
          color="blue"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${data.bookings.conversionRate}%`}
          change="+2.4%"
          trend="up"
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Active Users"
          value={data.users.active.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="User Retention"
          value={`${data.users.retention}%`}
          change="+5.8%"
          trend="up"
          icon={Award}
          color="orange"
        />
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="date"
                      type="category"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <YAxis
                      type="number"
                      axisLine={true}
                      tickLine={true}
                      tick={true}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₨ ${value.toLocaleString()}`, 'Revenue']}
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Booking Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: data.bookings.completed },
                        { name: 'Pending', value: data.bookings.pending },
                        { name: 'Cancelled', value: data.bookings.cancelled },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.timeSeriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Peak Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Daily Bookings</span>
                      <span className="text-sm text-gray-500">85/100</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Revenue Target</span>
                      <span className="text-sm text-gray-500">92/100</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm text-gray-500">96/100</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Real-time Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Sessions</span>
                    <Badge variant="secondary">234</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Live Bookings</span>
                    <Badge variant="secondary">18</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Online Support</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">System Load</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-500" />
                  Top Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gold text-white">🏆</Badge>
                    <span className="text-sm">Highest Monthly Revenue</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-silver text-white">🥈</Badge>
                    <span className="text-sm">Best Customer Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-bronze text-white">🥉</Badge>
                    <span className="text-sm">Most Bookings in a Day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalytics data={data} />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserAnalytics data={data} />
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <ServiceAnalytics data={data} />
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <GeographicAnalytics data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color 
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <div className="flex items-center">
              {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />}
              {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {change}
              </span>
              <span className="text-sm text-gray-500 ml-1">from last period</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RevenueAnalytics({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.services.popular}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                type="category"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <YAxis
                type="number"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <Tooltip
                formatter={(value: number) => [`₨ ${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" stroke="#3b82f6" strokeWidth={0} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="category"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <YAxis
                type="number"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function UserAnalytics({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>User Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="category"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <YAxis
                type="number"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#8b5cf6" fill="#a78bfa" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Active Users</span>
                <span className="text-sm text-gray-500">{data.users.active}/{data.users.total}</span>
              </div>
              <Progress value={(data.users.active / data.users.total) * 100} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">User Retention</span>
                <span className="text-sm text-gray-500">{data.users.retention}%</span>
              </div>
              <Progress value={data.users.retention} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">New Users This Month</span>
                <span className="text-sm text-gray-500">{data.users.new}</span>
              </div>
              <Progress value={75} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ServiceAnalytics({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.services.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                type="category"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <YAxis
                type="number"
                axisLine={true}
                tickLine={true}
                tick={true}
              />
              <Tooltip />
              <Bar dataKey="rating" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.services.popular.slice(0, 5).map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`}
                       style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₨ {service.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GeographicAnalytics({ data }: { data: AnalyticsData }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.geographic}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="revenue"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.geographic.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`₨ ${value.toLocaleString()}`, 'Revenue']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.geographic.map((location, index) => (
              <div key={location.location} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{location.location}</p>
                    <p className="text-sm text-gray-500">{location.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₨ {location.revenue.toLocaleString()}</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(location.revenue / Math.max(...data.geographic.map(l => l.revenue))) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PremiumAnalytics;
