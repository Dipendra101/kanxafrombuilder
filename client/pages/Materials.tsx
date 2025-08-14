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
  Weight,
  Ruler,
} from "lucide-react";
import { PaymentOptions } from "@/components/ui/payment-options";
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

export default function Materials() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [sortBy, setSortBy] = useState("name");
  const [showPayment, setShowPayment] = useState(false);

  const categories = [
    { id: "all", name: "All Materials", icon: "🏗️" },
    { id: "cement", name: "Cement & Concrete", icon: "🧱" },
    { id: "blocks", name: "Blocks & Bricks", icon: "🟤" },
    { id: "steel", name: "Steel & Rebar", icon: "🔗" },
    { id: "pipes", name: "Pipes & Plumbing", icon: "🚰" },
    { id: "aggregates", name: "Sand & Aggregates", icon: "⛰️" },
    { id: "hardware", name: "Hardware Items", icon: "🔧" },
    { id: "roofing", name: "Roofing Materials", icon: "🏠" },
    { id: "electrical", name: "Electrical Items", icon: "⚡" },
  ];

  const materials = [
    {
      id: "cement-opc-53",
      name: "OPC 53 Grade Cement",
      category: "cement",
      price: 850,
      unit: "50kg bag",
      description: "High-grade Ordinary Portland Cement for superior strength",
      image: "🧱",
      inStock: true,
      stockQuantity: 500,
      brand: "Shree Cement",
      specifications: { grade: "53", weight: "50kg", type: "OPC" },
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "cement-ppc",
      name: "PPC Cement",
      category: "cement",
      price: 780,
      unit: "50kg bag",
      description: "Portland Pozzolana Cement for general construction",
      image: "🧱",
      inStock: true,
      stockQuantity: 300,
      brand: "Himalayan Cement",
      specifications: { grade: "PPC", weight: "50kg", type: "Blended" },
      rating: 4.6,
      reviews: 89,
    },
    {
      id: "rebar-12mm",
      name: "TMT Steel Rebar 12mm",
      category: "steel",
      price: 85,
      unit: "per kg",
      description: "High-strength TMT bars for reinforcement",
      image: "🔗",
      inStock: true,
      stockQuantity: 2000,
      brand: "Kamdhenu Steel",
      specifications: { diameter: "12mm", grade: "Fe-500", length: "12m" },
      rating: 4.9,
      reviews: 203,
    },
    {
      id: "rebar-16mm",
      name: "TMT Steel Rebar 16mm",
      category: "steel",
      price: 88,
      unit: "per kg",
      description: "Heavy-duty TMT bars for major construction",
      image: "🔗",
      inStock: true,
      stockQuantity: 1500,
      brand: "Kamdhenu Steel",
      specifications: { diameter: "16mm", grade: "Fe-500", length: "12m" },
      rating: 4.9,
      reviews: 156,
    },
    {
      id: "concrete-blocks",
      name: "Concrete Hollow Blocks",
      category: "blocks",
      price: 45,
      unit: "per piece",
      description: "Standard concrete blocks for wall construction",
      image: "🟤",
      inStock: true,
      stockQuantity: 800,
      brand: "Local Manufacturer",
      specifications: {
        size: "400x200x200mm",
        type: "Hollow",
        strength: "M7.5",
      },
      rating: 4.5,
      reviews: 67,
    },
    {
      id: "red-bricks",
      name: "Red Clay Bricks",
      category: "blocks",
      price: 18,
      unit: "per piece",
      description: "Traditional fired clay bricks",
      image: "🧱",
      inStock: true,
      stockQuantity: 5000,
      brand: "Local Kiln",
      specifications: {
        size: "230x110x70mm",
        type: "First Class",
        absorption: "<20%",
      },
      rating: 4.3,
      reviews: 234,
    },
    {
      id: "pvc-pipe-4inch",
      name: "PVC Pipe 4 inch",
      category: "pipes",
      price: 450,
      unit: "per meter",
      description: "High-quality PVC pipes for plumbing",
      image: "🚰",
      inStock: true,
      stockQuantity: 200,
      brand: "Kisan Pipes",
      specifications: {
        diameter: "4 inch",
        pressure: "6 kg/cm²",
        length: "6m",
      },
      rating: 4.7,
      reviews: 91,
    },
    {
      id: "water-tank-1000l",
      name: "Plastic Water Tank 1000L",
      category: "pipes",
      price: 12500,
      unit: "per piece",
      description: "Food-grade plastic water storage tank",
      image: "🏺",
      inStock: true,
      stockQuantity: 25,
      brand: "Sintex",
      specifications: {
        capacity: "1000L",
        material: "LLDPE",
        layers: "3 Layer",
      },
      rating: 4.8,
      reviews: 45,
    },
    {
      id: "sand-river",
      name: "River Sand",
      category: "aggregates",
      price: 1200,
      unit: "per cubic ft",
      description: "Clean river sand for construction",
      image: "⛰���",
      inStock: true,
      stockQuantity: 100,
      brand: "Local Supplier",
      specifications: {
        type: "River Sand",
        fineness: "Fine",
        purity: "Washed",
      },
      rating: 4.4,
      reviews: 78,
    },
    {
      id: "gravel-20mm",
      name: "Crushed Gravel 20mm",
      category: "aggregates",
      price: 1100,
      unit: "per cubic ft",
      description: "Machine crushed gravel for concrete",
      image: "🪨",
      inStock: true,
      stockQuantity: 150,
      brand: "Local Quarry",
      specifications: {
        size: "20mm",
        type: "Crushed",
        gradation: "Well graded",
      },
      rating: 4.5,
      reviews: 92,
    },
    {
      id: "gi-sheet",
      name: "GI Roofing Sheet",
      category: "roofing",
      price: 850,
      unit: "per sq meter",
      description: "Galvanized iron corrugated roofing sheets",
      image: "🏠",
      inStock: true,
      stockQuantity: 300,
      brand: "Tata BlueScope",
      specifications: {
        thickness: "0.47mm",
        coating: "Z275",
        profile: "Corrugated",
      },
      rating: 4.6,
      reviews: 134,
    },
    {
      id: "electrical-wire",
      name: "Copper Electrical Wire 2.5sq",
      category: "electrical",
      price: 280,
      unit: "per meter",
      description: "High-quality copper electrical wiring",
      image: "⚡",
      inStock: true,
      stockQuantity: 1000,
      brand: "Finolex",
      specifications: {
        size: "2.5 sq mm",
        conductor: "Copper",
        insulation: "PVC",
      },
      rating: 4.7,
      reviews: 167,
    },
  ];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return a.name.localeCompare(b.name);
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
      const material = materials.find((m) => m.id === materialId);
      return total + (material ? material.price * quantity : 0);
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
        {Object.entries(cart).length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(cart).map(([materialId, quantity]) => {
                const material = materials.find((m) => m.id === materialId);
                if (!material) return null;

                return (
                  <div
                    key={materialId}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="text-3xl">{material.image}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-kanxa-navy">
                        {material.name}
                      </h4>
                      <p className="text-sm text-gray-600">{material.unit}</p>
                      <p className="text-sm font-medium text-kanxa-orange">
                        Rs {material.price.toLocaleString()}
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
                        Rs {(material.price * quantity).toLocaleString()}
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
                  onClick={() => setShowPayment(true)}
                  disabled={Object.keys(cart).length === 0}
                >
                  Proceed to Checkout
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
              const material = materials.find((m) => m.id === materialId);
              if (!material) return null;

              return (
                <div key={materialId} className="flex justify-between text-sm">
                  <span>
                    {material.name} x {quantity}
                  </span>
                  <span className="font-medium">
                    Rs {(material.price * quantity).toLocaleString()}
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {sortedMaterials.map((material) => (
              <Card
                key={material.id}
                className="hover:shadow-lg transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl mb-2">{material.image}</div>
                    <div className="text-right">
                      {material.inStock ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          In Stock
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-kanxa-navy leading-tight">
                    {material.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{material.brand}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {material.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {material.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({material.reviews} reviews)
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    {Object.entries(material.specifications).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-600 capitalize">
                            {key}:
                          </span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ),
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-kanxa-orange">
                          Rs {material.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">{material.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Stock:</p>
                        <p className="text-sm font-medium">
                          {material.stockQuantity}
                        </p>
                      </div>
                    </div>

                    {cart[material.id] ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCart(material.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex-1 text-center font-medium">
                          {cart[material.id]} in cart
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(material.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-kanxa-orange hover:bg-kanxa-orange/90"
                        onClick={() => addToCart(material.id)}
                        disabled={!material.inStock}
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

          {sortedMaterials.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No materials found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
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
                <p className="text-white/90">+977-XXX-XXXXXX</p>
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
