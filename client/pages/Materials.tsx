import { useState, useEffect } from "react";
import {
  Building,
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  Shield,
  CheckCircle,
  Star,
  Calculator,
  Phone,
  Mail,
  Package,
  Lock,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { PaymentOptions } from "@/components/ui/payment-options";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import { servicesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";

export default function Materials() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [sortBy, setSortBy] = useState("name");
  const [showPayment, setShowPayment] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic categories based on loaded materials
  const categories = [
    { id: "all", name: "All Materials", icon: "🏗️" },
    { id: "cement", name: "Cement & Concrete", icon: "🧱" },
    { id: "steel", name: "Steel & Rebar", icon: "🔗" },
    { id: "blocks", name: "Blocks & Bricks", icon: "🟤" },
    { id: "pipes", name: "Pipes & Plumbing", icon: "🚰" },
    { id: "aggregates", name: "Sand & Aggregates", icon: "⛰️" },
    { id: "hardware", name: "Hardware Items", icon: "🔧" },
    { id: "roofing", name: "Roofing Materials", icon: "🏠" },
    { id: "electrical", name: "Electrical Items", icon: "⚡" },
  ];

  // Listen for payment completion events
  useEffect(() => {
    const handlePaymentCompleted = (event: CustomEvent) => {
      const { method, service } = event.detail;
      if (service === "Construction Materials") {
        console.log(`✅ Payment completed with ${method} for ${service}`);
        setCart({});
        setShowPayment(false);
        toast({
          title: "Order Confirmed!",
          description: "Your material order has been placed successfully.",
          variant: "success",
        });
      }
    };

    window.addEventListener(
      "paymentCompleted",
      handlePaymentCompleted as EventListener,
    );

    return () => {
      window.removeEventListener(
        "paymentCompleted",
        handlePaymentCompleted as EventListener,
      );
    };
  }, []); // Remove toast dependency to prevent infinite loop

  // Fetch materials from API
  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await servicesAPI.getAllServices({
        type: "material",
        limit: 100,
        isActive: true,
      });

      setMaterials(response.services || []);
      console.log(`✅ Loaded ${response.services?.length || 0} materials`);
    } catch (error: any) {
      console.error("Failed to fetch materials:", error);
      setError("Failed to load materials. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load materials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load materials on component mount
  useEffect(() => {
    fetchMaterials();
  }, []);

  // Filter and sort materials
  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.materialService?.brand
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const materialCategory =
      material.materialService?.materialType?.toLowerCase() ||
      material.category?.toLowerCase() ||
      "";

    const matchesCategory =
      selectedCategory === "all" ||
      materialCategory.includes(selectedCategory) ||
      material.type === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.pricing?.basePrice || 0) - (b.pricing?.basePrice || 0);
      case "price-high":
        return (b.pricing?.basePrice || 0) - (a.pricing?.basePrice || 0);
      case "rating":
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      default:
        return (a.name || "").localeCompare(b.name || "");
    }
  });

  const addToCart = (materialId: string) => {
    setCart((prev) => ({
      ...prev,
      [materialId]: (prev[materialId] || 0) + 1,
    }));
  };

  const removeFromCart = (materialId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[materialId] > 1) {
        newCart[materialId]--;
      } else {
        delete newCart[materialId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [materialId, quantity]) => {
      const material = materials.find((m) => m._id === materialId);
      return total + (material?.pricing?.basePrice || 0) * quantity;
    }, 0);
  };

  const CartDialog = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy">
          Shopping Cart
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Guest Mode Alert */}
        {!isAuthenticated && Object.entries(cart).length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <Lock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Please log in to checkout:</strong> You can browse and add
              items to cart, but you'll need to{" "}
              <Link to="/login" className="underline font-medium">
                log in
              </Link>{" "}
              to complete your purchase.
            </AlertDescription>
          </Alert>
        )}

        {Object.entries(cart).length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(cart).map(([materialId, quantity]) => {
                const material = materials.find((m) => m._id === materialId);
                if (!material) return null;

                return (
                  <div
                    key={materialId}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="text-3xl">
                      {material.materialService?.materialType === "Cement"
                        ? "🧱"
                        : material.materialService?.materialType === "Steel"
                          ? "🔗"
                          : "📦"}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-kanxa-navy">
                        {material.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {material.pricing?.unit || "per unit"}
                      </p>
                      <p className="text-sm font-medium text-kanxa-orange">
                        Rs {(material.pricing?.basePrice || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFromCart(materialId)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addToCart(materialId)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-kanxa-blue">
                        Rs{" "}
                        {(
                          (material.pricing?.basePrice || 0) * quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-kanxa-blue">
                  Rs {getTotalPrice().toLocaleString()}
                </span>
              </div>

              <Alert>
                <Truck className="h-4 w-4" />
                <AlertDescription>
                  Free delivery for orders above Rs 50,000. Delivery charges
                  apply for smaller orders.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-kanxa-orange hover:bg-kanxa-orange/90"
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowLoginPrompt(true);
                    } else {
                      setShowPayment(true);
                    }
                  }}
                  disabled={Object.keys(cart).length === 0}
                >
                  {!isAuthenticated ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Login to Checkout
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setCart({})}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </DialogContent>
  );

  const LoginPromptDialog = () => (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy flex items-center gap-2">
          <Lock className="h-6 w-6 text-kanxa-orange" />
          Login Required
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-kanxa-light-orange rounded-full flex items-center justify-center mx-auto">
            <User className="h-8 w-8 text-kanxa-orange" />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium text-kanxa-navy">
              Please log in to complete your purchase
            </p>
            <p className="text-gray-600 text-sm">
              You need an account to track orders, manage deliveries, and access
              customer support.
            </p>
          </div>

          <Alert>
            <ShoppingCart className="h-4 w-4" />
            <AlertDescription>
              Your cart items will be saved when you log in or create an
              account.
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowLoginPrompt(false)}
            className="flex-1"
          >
            Continue Browsing
          </Button>
          <Button
            asChild
            className="flex-1 bg-kanxa-orange hover:bg-kanxa-orange/90"
          >
            <Link to="/login">Login</Link>
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-kanxa-blue hover:underline font-medium"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </DialogContent>
  );

  const PaymentDialog = () => (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-kanxa-navy">
          Complete Your Order
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-kanxa-navy mb-3">Order Summary</h4>
          <div className="space-y-2">
            {Object.entries(cart).map(([materialId, quantity]) => {
              const material = materials.find((m) => m._id === materialId);
              if (!material) return null;

              return (
                <div key={materialId} className="flex justify-between text-sm">
                  <span>
                    {material.name} x {quantity}
                  </span>
                  <span className="font-medium">
                    Rs{" "}
                    {(
                      (material.pricing?.basePrice || 0) * quantity
                    ).toLocaleString()}
                  </span>
                </div>
              );
            })}
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span className="text-kanxa-blue">
                Rs {getTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <PaymentOptions
          amount={getTotalPrice()}
          service="Construction Materials"
          serviceId="materials-order"
          bookingId={`materials-${Date.now()}`}
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPayment(false)}
            className="flex-1"
          >
            Cancel
          </Button>
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
              Premium Construction Materials
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Quality building materials at competitive prices with reliable
              delivery across Nepal
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-kanxa-orange hover:bg-white/90"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Bulk Quote Request
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-kanxa-orange"
              >
                <Phone className="mr-2 h-5 w-5" />
                Call for Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-kanxa-orange">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <CartDialog />
              </Dialog>

              {/* Login Prompt Dialog */}
              <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
                <LoginPromptDialog />
              </Dialog>

              {/* Payment Dialog */}
              <Dialog open={showPayment} onOpenChange={setShowPayment}>
                <PaymentDialog />
              </Dialog>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 w-full overflow-x-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="text-xs"
                >
                  <span className="mr-1">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-kanxa-navy">
              {selectedCategory === "all"
                ? "All Materials"
                : categories.find((c) => c.id === selectedCategory)?.name}
              ({sortedMaterials.length})
            </h2>

            {isLoading && (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-600">
                  Loading materials...
                </span>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isLoading && sortedMaterials.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No materials found
              </h3>
              <p className="text-gray-500 mb-4">
                {materials.length === 0
                  ? "No materials are currently available. Please check back later."
                  : "Try adjusting your search or filters"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  fetchMaterials();
                }}
              >
                {materials.length === 0 ? "Reload Materials" : "Clear Filters"}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {sortedMaterials.map((material) => (
                <Card
                  key={material._id}
                  className="hover:shadow-lg transition-all duration-300 group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-4xl mb-2">
                        {material.materialService?.materialType === "Cement"
                          ? "🧱"
                          : material.materialService?.materialType === "Steel"
                            ? "🔗"
                            : material.materialService?.materialType === "Pipes"
                              ? "🚰"
                              : "📦"}
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          In Stock
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-kanxa-navy leading-tight">
                      {material.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {material.materialService?.brand || "Quality Brand"}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {material.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {material.rating?.average || "4.5"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        ({material.rating?.count || "0"} reviews)
                      </span>
                    </div>

                    {material.materialService?.specifications && (
                      <div className="space-y-2 text-sm">
                        {Object.entries(material.materialService.specifications)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600 capitalize">
                                {key}:
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-bold text-kanxa-orange">
                            Rs{" "}
                            {(
                              material.pricing?.basePrice || 0
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {material.pricing?.unit || "per unit"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Stock:</p>
                          <p className="text-sm font-medium">
                            {material.materialService?.stockQuantity ||
                              "Available"}
                          </p>
                        </div>
                      </div>

                      {cart[material._id] ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeFromCart(material._id)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="flex-1 text-center font-medium">
                            {cart[material._id]} in cart
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(material._id)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                          onClick={() => addToCart(material._id)}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-kanxa-navy mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600">
              Complete construction material solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: <Truck className="h-8 w-8 text-kanxa-orange" />,
                title: "Free Delivery",
                description: "Free delivery for orders above Rs 50,000",
              },
              {
                icon: <Shield className="h-8 w-8 text-kanxa-blue" />,
                title: "Quality Guarantee",
                description: "All materials come with quality certification",
              },
              {
                icon: <Calculator className="h-8 w-8 text-kanxa-green" />,
                title: "Bulk Pricing",
                description: "Special rates for bulk orders and contractors",
              },
              {
                icon: <CheckCircle className="h-8 w-8 text-kanxa-orange" />,
                title: "Expert Advice",
                description: "Technical support for material selection",
              },
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h3 className="font-semibold text-kanxa-navy mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-kanxa-navy text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Need Bulk Quantities?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Contact our specialists for custom quotes and bulk pricing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Call Us</p>
                <p className="text-white/90">+977-9800000000</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-kanxa-orange rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Email Us</p>
                <p className="text-white/90">materials@kanxasafari.com</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-kanxa-orange hover:bg-kanxa-orange/90"
            >
              Request Bulk Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-kanxa-navy"
            >
              Download Catalog
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
