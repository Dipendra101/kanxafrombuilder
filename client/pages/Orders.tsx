import { useState } from "react";
import { 
  Package, 
  Calendar, 
  Clock, 
  MapPin,
  Truck,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Eye,
  RotateCcw,
  Phone,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";

export default function Orders() {
  const [orderFilter, setOrderFilter] = useState("all");

  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "delivered",
      total: 125000,
      items: [
        { name: "OPC 53 Grade Cement", quantity: 50, unit: "50kg bag", price: 850 },
        { name: "TMT Steel Rebar 12mm", quantity: 200, unit: "kg", price: 85 },
        { name: "Concrete Hollow Blocks", quantity: 100, unit: "pieces", price: 45 }
      ],
      deliveryAddress: "Construction Site, Kathmandu",
      deliveryDate: "2024-01-18",
      supplier: "Kanxa Safari Materials",
      trackingNumber: "KS-DEL-001234",
      paymentMethod: "Khalti",
      notes: "Delivered on time. Good quality materials."
    },
    {
      id: "ORD-2024-002", 
      date: "2024-01-20",
      status: "processing",
      total: 85000,
      items: [
        { name: "Red Clay Bricks", quantity: 1000, unit: "pieces", price: 18 },
        { name: "River Sand", quantity: 20, unit: "cubic ft", price: 1200 },
        { name: "Crushed Gravel 20mm", quantity: 15, unit: "cubic ft", price: 1100 }
      ],
      deliveryAddress: "Residential Project, Pokhara", 
      deliveryDate: "2024-01-25",
      supplier: "Kanxa Safari Materials",
      trackingNumber: "KS-DEL-001235",
      paymentMethod: "eSewa",
      notes: "Rush order for foundation work."
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-22",
      status: "shipped",
      total: 45000,
      items: [
        { name: "PVC Pipe 4 inch", quantity: 50, unit: "meter", price: 450 },
        { name: "Plastic Water Tank 1000L", quantity: 2, unit: "pieces", price: 12500 }
      ],
      deliveryAddress: "Hotel Project, Chitwan",
      deliveryDate: "2024-01-26", 
      supplier: "Kanxa Safari Materials",
      trackingNumber: "KS-DEL-001236",
      paymentMethod: "Bank Transfer",
      notes: "Plumbing materials for hotel renovation."
    },
    {
      id: "ORD-2024-004",
      date: "2024-01-25",
      status: "pending",
      total: 156000,
      items: [
        { name: "GI Roofing Sheet", quantity: 100, unit: "sq meter", price: 850 },
        { name: "Copper Electrical Wire 2.5sq", quantity: 500, unit: "meter", price: 280 }
      ],
      deliveryAddress: "Industrial Building, Bharatpur",
      deliveryDate: "2024-01-30",
      supplier: "Kanxa Safari Materials", 
      trackingNumber: "KS-DEL-001237",
      paymentMethod: "Cash on Delivery",
      notes: "Large order for industrial building construction."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "shipped": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "shipped": return <Truck className="h-4 w-4 text-blue-600" />;
      case "processing": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "pending": return <AlertCircle className="h-4 w-4 text-gray-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (orderFilter === "all") return true;
    return order.status === orderFilter;
  });

  const OrderDetails = ({ order }: { order: any }) => (
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="h-6 w-6 text-kanxa-orange" />
          Order Details - {order.id}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Order Date</p>
            <p className="font-semibold">{order.date}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <Badge className={getStatusColor(order.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Amount</p>
            <p className="font-semibold text-kanxa-orange">NPR {order.total.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Payment Method</p>
            <p className="font-semibold">{order.paymentMethod}</p>
          </div>
        </div>

        <Separator />

        {/* Items List */}
        <div>
          <h3 className="font-semibold text-kanxa-navy mb-4">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-kanxa-navy">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.quantity} {item.unit} × NPR {item.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-kanxa-orange">
                    NPR {(item.quantity * item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Delivery Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-kanxa-navy mb-2">Delivery Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-kanxa-blue mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
                  <p className="text-gray-600">{order.deliveryAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-kanxa-green" />
                <div>
                  <p className="font-medium">Expected Delivery</p>
                  <p className="text-gray-600">{order.deliveryDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-kanxa-orange" />
                <div>
                  <p className="font-medium">Tracking Number</p>
                  <p className="text-gray-600">{order.trackingNumber}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-kanxa-navy mb-2">Order Notes</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {order.notes}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 bg-kanxa-orange hover:bg-kanxa-orange/90">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          <Button variant="outline">
            <Truck className="mr-2 h-4 w-4" />
            Track Delivery
          </Button>
          {order.status === "delivered" && (
            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reorder
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-orange to-kanxa-navy text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              My Orders
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Track and manage your construction material orders
            </p>
          </div>
        </div>
      </section>

      {/* Order Summary */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-orange mb-2">{orders.length}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-green mb-2">
                  {orders.filter(o => o.status === "delivered").length}
                </div>
                <div className="text-sm text-gray-600">Delivered</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-blue mb-2">
                  {orders.filter(o => o.status === "shipped" || o.status === "processing").length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-kanxa-navy mb-2">
                  NPR {orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-kanxa-navy">Order History</h2>
            
            <div className="flex gap-4">
              <Select value={orderFilter} onValueChange={setOrderFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredOrders.map(order => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-kanxa-navy flex items-center gap-2">
                        <Package className="h-5 w-5 text-kanxa-orange" />
                        Order {order.id}
                      </h3>
                      <p className="text-sm text-gray-600">Placed on {order.date}</p>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </Badge>
                      <p className="text-lg font-bold text-kanxa-orange mt-1">
                        NPR {order.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Items ({order.items.length})</p>
                      <div className="text-sm">
                        {order.items.slice(0, 2).map((item: any, index: number) => (
                          <p key={index} className="text-gray-700">
                            {item.name} ({item.quantity} {item.unit})
                          </p>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-kanxa-blue">+{order.items.length - 2} more items</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600">Delivery</p>
                      <div className="text-sm">
                        <p className="text-gray-700">{order.deliveryAddress}</p>
                        <p className="text-gray-700">Expected: {order.deliveryDate}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Payment: {order.paymentMethod}</span>
                      <span>•</span>
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <OrderDetails order={order} />
                      </Dialog>
                      
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Invoice
                      </Button>
                      
                      {order.status === "delivered" && (
                        <Button size="sm" className="bg-kanxa-orange hover:bg-kanxa-orange/90">
                          <Star className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-4">You don't have any orders matching the selected filter</p>
              <Button asChild>
                <a href="/materials">
                  <Package className="mr-2 h-4 w-4" />
                  Shop Materials
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-kanxa-navy mb-4">Need Help with Your Order?</h2>
            <p className="text-gray-600 mb-8">
              Our customer support team is here to assist you with any questions about your orders
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Phone className="h-12 w-12 text-kanxa-blue mx-auto mb-4" />
                  <h3 className="font-semibold text-kanxa-navy mb-2">Call Support</h3>
                  <p className="text-sm text-gray-600 mb-3">Speak with our order specialists</p>
                  <p className="font-medium text-kanxa-blue">+977-XXX-XXXXXX</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <Mail className="h-12 w-12 text-kanxa-orange mx-auto mb-4" />
                  <h3 className="font-semibold text-kanxa-navy mb-2">Email Support</h3>
                  <p className="text-sm text-gray-600 mb-3">Get detailed help via email</p>
                  <p className="font-medium text-kanxa-orange">orders@kanxasafari.com</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
