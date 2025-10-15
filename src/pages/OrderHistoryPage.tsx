import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Download, 
  Eye, 
  Building, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign,
  RefreshCw,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type OrderType = 'subscription' | 'one-time' | 'upgrade' | 'downgrade';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  type: OrderType;
  status: OrderStatus;
  amount: number;
  currency: string;
  description: string;
  plan?: string;
  billingPeriod?: string;
  paymentMethod: string;
  invoiceUrl: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export function OrderHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock order data
  const mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-20T10:30:00Z',
      type: 'subscription',
      status: 'completed',
      amount: 99,
      currency: 'USD',
      description: 'Professional Plan - Monthly',
      plan: 'Professional',
      billingPeriod: 'Monthly',
      paymentMethod: 'Visa •••• 4242',
      invoiceUrl: '/invoices/ORD-2024-001.pdf',
      items: [
        {
          id: '1',
          name: 'Professional Plan',
          description: 'Monthly subscription with advanced features',
          quantity: 1,
          unitPrice: 99,
          total: 99
        }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-15T14:20:00Z',
      type: 'upgrade',
      status: 'completed',
      amount: 200,
      currency: 'USD',
      description: 'Upgrade to Enterprise Plan',
      plan: 'Enterprise',
      billingPeriod: 'Monthly',
      paymentMethod: 'Visa •••• 4242',
      invoiceUrl: '/invoices/ORD-2024-002.pdf',
      items: [
        {
          id: '1',
          name: 'Enterprise Plan',
          description: 'Monthly subscription with enterprise features',
          quantity: 1,
          unitPrice: 299,
          total: 299
        },
        {
          id: '2',
          name: 'Pro-rated Credit',
          description: 'Credit for unused Professional plan',
          quantity: 1,
          unitPrice: -99,
          total: -99
        }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-10T09:15:00Z',
      type: 'one-time',
      status: 'completed',
      amount: 500,
      currency: 'USD',
      description: 'Custom Training Package',
      paymentMethod: 'Bank Transfer',
      invoiceUrl: '/invoices/ORD-2024-003.pdf',
      items: [
        {
          id: '1',
          name: 'Custom Training Package',
          description: '10 hours of custom video production',
          quantity: 1,
          unitPrice: 500,
          total: 500
        }
      ]
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      date: '2024-01-05T16:45:00Z',
      type: 'subscription',
      status: 'pending',
      amount: 99,
      currency: 'USD',
      description: 'Professional Plan - Monthly',
      plan: 'Professional',
      billingPeriod: 'Monthly',
      paymentMethod: 'Visa •••• 4242',
      invoiceUrl: '/invoices/ORD-2024-004.pdf',
      items: [
        {
          id: '1',
          name: 'Professional Plan',
          description: 'Monthly subscription with advanced features',
          quantity: 1,
          unitPrice: 99,
          total: 99
        }
      ]
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      date: '2023-12-20T11:30:00Z',
      type: 'subscription',
      status: 'refunded',
      amount: 29,
      currency: 'USD',
      description: 'Starter Plan - Monthly',
      plan: 'Starter',
      billingPeriod: 'Monthly',
      paymentMethod: 'Visa •••• 4242',
      invoiceUrl: '/invoices/ORD-2024-005.pdf',
      items: [
        {
          id: '1',
          name: 'Starter Plan',
          description: 'Monthly subscription with basic features',
          quantity: 1,
          unitPrice: 29,
          total: 29
        }
      ]
    }
  ];

  const filteredOrders = mockOrders.filter(order => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesOrderNumber = order.orderNumber.toLowerCase().includes(query);
      const matchesDescription = order.description.toLowerCase().includes(query);
      if (!matchesOrderNumber && !matchesDescription) return false;
    }

    // Status filter
    if (statusFilter !== 'all') {
      if (order.status !== statusFilter) return false;
    }

    // Type filter
    if (typeFilter !== 'all') {
      if (order.type !== typeFilter) return false;
    }

    return true;
  }).sort((a, b) => {
    const aValue = new Date(a.date).getTime();
    const bValue = new Date(b.date).getTime();
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };


  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="text-green-600 bg-green-50 border-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="text-gray-600 border-gray-600"><RefreshCw className="h-3 w-3 mr-1" />Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: OrderType) => {
    switch (type) {
      case 'subscription':
        return <Badge variant="secondary">Subscription</Badge>;
      case 'one-time':
        return <Badge variant="outline">One-time</Badge>;
      case 'upgrade':
        return <Badge variant="default" className="text-blue-600 bg-blue-50 border-blue-600">Upgrade</Badge>;
      case 'downgrade':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Downgrade</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getTotalAmount = () => {
    return mockOrders.reduce((total, order) => {
      if (order.status === 'completed') {
        return total + order.amount;
      }
      return total;
    }, 0);
  };

  const getTotalOrders = () => {
    return mockOrders.length;
  };

  const getCompletedOrders = () => {
    return mockOrders.filter(order => order.status === 'completed').length;
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your billing history
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalOrders()}</div>
              <p className="text-xs text-muted-foreground">
                All time orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedOrders()}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((getCompletedOrders() / getTotalOrders()) * 100)}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalAmount().toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                All time spending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Professional</div>
              <p className="text-xs text-muted-foreground">
                $99/month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="upgrade">Upgrade</SelectItem>
                  <SelectItem value="downgrade">Downgrade</SelectItem>
                </SelectContent>
              </Select>
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                const [field, order] = value.split('-') as [string, 'asc' | 'desc'];
                setSortBy(field);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Date (Newest)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                  <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                  <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>
              Your complete order and billing history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg">
                  <div
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {expandedOrder === order.id ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div>
                            <div className="font-medium">{order.orderNumber}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDateTime(order.date)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${order.amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {order.currency}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getTypeBadge(order.type)}
                        {getStatusBadge(order.status)}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-muted-foreground">
                      {order.description}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div className="border-t p-4 bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Order Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Order Number:</span>
                              <span className="font-mono">{order.orderNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span>{formatDateTime(order.date)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Payment Method:</span>
                              <span>{order.paymentMethod}</span>
                            </div>
                            {order.plan && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Plan:</span>
                                <span>{order.plan}</span>
                              </div>
                            )}
                            {order.billingPeriod && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Billing Period:</span>
                                <span>{order.billingPeriod}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Items</h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <div>
                                  <div className="font-medium">{item.name}</div>
                                  <div className="text-muted-foreground">{item.description}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">
                                    ${item.unitPrice.toLocaleString()}
                                    {item.quantity > 1 && ` × ${item.quantity}`}
                                  </div>
                                  <div className="text-muted-foreground">
                                    Total: ${item.total.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span>${order.amount.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Invoice
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        {order.status === 'completed' && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Request Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setTypeFilter('all');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
