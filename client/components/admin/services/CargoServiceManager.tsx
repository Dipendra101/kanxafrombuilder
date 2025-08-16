import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Search,
  Truck,
  Package,
  Weight,
} from "lucide-react";
import { servicesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";

interface CargoService {
  _id: string;
  name: string;
  description: string;
  cargoService: {
    vehicleType: string;
    capacity: {
      weight: number;
      volume: number;
      dimensions: {
        length: number;
        width: number;
        height: number;
      };
    };
    availableRoutes: string[];
    restrictions: string[];
    additionalServices: string[];
  };
  pricing: {
    basePrice: number;
    currency: string;
    priceType: string;
  };
  rating: {
    average: number;
    count: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CargoServiceManager() {
  const [cargoServices, setCargoServices] = useState<CargoService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<CargoService | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    cargoService: {
      vehicleType: "Light Truck",
      capacity: {
        weight: 0,
        volume: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
      },
      availableRoutes: [] as string[],
      restrictions: [] as string[],
      additionalServices: [] as string[],
    },
    pricing: {
      basePrice: 0,
      currency: "NPR",
      priceType: "per_km",
    },
    isActive: true,
    isFeatured: false,
  });

  const vehicleTypes = [
    "Light Truck",
    "Medium Truck",
    "Heavy Truck",
    "Container Truck",
    "Refrigerated Truck",
    "Flatbed Truck",
    "Tanker Truck",
    "Van",
    "Pickup",
  ];

  const commonRoutes = [
    "Kathmandu → Pokhara",
    "Kathmandu → Chitwan",
    "Kathmandu → Dharan",
    "Kathmandu → Butwal",
    "Pokhara → Chitwan",
    "Local Delivery",
    "Express Delivery",
    "Inter-city",
    "Cross-border",
  ];

  const commonRestrictions = [
    "No Hazardous Materials",
    "No Fragile Items",
    "No Perishables",
    "Weight Limit Enforced",
    "Size Restrictions",
    "Documentation Required",
    "Insurance Mandatory",
  ];

  const additionalServices = [
    "Loading/Unloading",
    "Packaging",
    "Insurance Coverage",
    "GPS Tracking",
    "Express Delivery",
    "Door-to-Door",
    "24/7 Support",
    "Warehousing",
    "Documentation",
  ];

  useEffect(() => {
    loadCargoServices();
  }, []);

  const loadCargoServices = async () => {
    try {
      setIsLoading(true);
      const response = await servicesAPI.getAllServices({
        type: "cargo",
        limit: 100,
      });
      setCargoServices(response.services || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load cargo services",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const serviceData = {
        ...formData,
        type: "cargo",
        category: "Logistics",
        shortDescription: formData.description.substring(0, 200),
      };

      if (editingService) {
        await servicesAPI.updateService(editingService._id, serviceData);
        toast({
          title: "Success",
          description: "Cargo service updated successfully",
        });
      } else {
        await servicesAPI.createService(serviceData);
        toast({
          title: "Success",
          description: "Cargo service created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadCargoServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save cargo service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: CargoService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      shortDescription: service.description.substring(0, 200),
      cargoService: service.cargoService,
      pricing: service.pricing,
      isActive: service.isActive,
      isFeatured: service.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this cargo service?")) return;

    try {
      await servicesAPI.deleteService(serviceId);
      toast({
        title: "Success",
        description: "Cargo service deleted successfully",
      });
      loadCargoServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete cargo service",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      cargoService: {
        vehicleType: "Light Truck",
        capacity: {
          weight: 0,
          volume: 0,
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
          },
        },
        availableRoutes: [],
        restrictions: [],
        additionalServices: [],
      },
      pricing: {
        basePrice: 0,
        currency: "NPR",
        priceType: "per_km",
      },
      isActive: true,
      isFeatured: false,
    });
    setEditingService(null);
  };

  const addRoute = (route: string) => {
    if (!formData.cargoService.availableRoutes.includes(route)) {
      setFormData((prev) => ({
        ...prev,
        cargoService: {
          ...prev.cargoService,
          availableRoutes: [...prev.cargoService.availableRoutes, route],
        },
      }));
    }
  };

  const removeRoute = (route: string) => {
    setFormData((prev) => ({
      ...prev,
      cargoService: {
        ...prev.cargoService,
        availableRoutes: prev.cargoService.availableRoutes.filter(
          (r) => r !== route,
        ),
      },
    }));
  };

  const addRestriction = (restriction: string) => {
    if (!formData.cargoService.restrictions.includes(restriction)) {
      setFormData((prev) => ({
        ...prev,
        cargoService: {
          ...prev.cargoService,
          restrictions: [...prev.cargoService.restrictions, restriction],
        },
      }));
    }
  };

  const removeRestriction = (restriction: string) => {
    setFormData((prev) => ({
      ...prev,
      cargoService: {
        ...prev.cargoService,
        restrictions: prev.cargoService.restrictions.filter(
          (r) => r !== restriction,
        ),
      },
    }));
  };

  const addAdditionalService = (service: string) => {
    if (!formData.cargoService.additionalServices.includes(service)) {
      setFormData((prev) => ({
        ...prev,
        cargoService: {
          ...prev.cargoService,
          additionalServices: [
            ...prev.cargoService.additionalServices,
            service,
          ],
        },
      }));
    }
  };

  const removeAdditionalService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      cargoService: {
        ...prev.cargoService,
        additionalServices: prev.cargoService.additionalServices.filter(
          (s) => s !== service,
        ),
      },
    }));
  };

  const filteredServices = cargoServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.cargoService?.vehicleType
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="w-6 h-6" />
            Cargo Services Management
          </h2>
          <p className="text-gray-600">
            Manage cargo transportation and logistics services
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Cargo Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search cargo services..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Details</TableHead>
                  <TableHead>Vehicle & Capacity</TableHead>
                  <TableHead>Routes</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {service.description}
                        </p>
                        {service.isFeatured && (
                          <Badge className="mt-1 bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Truck className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">
                            {service.cargoService?.vehicleType}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Weight className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {service.cargoService?.capacity?.weight}kg
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {service.cargoService?.capacity?.volume}m³
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {service.cargoService?.availableRoutes
                          ?.slice(0, 2)
                          .map((route, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {route}
                            </Badge>
                          ))}
                        {(service.cargoService?.availableRoutes?.length || 0) >
                          2 && (
                          <Badge variant="outline" className="text-xs">
                            +
                            {(service.cargoService?.availableRoutes?.length ||
                              0) - 2}{" "}
                            more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {service.pricing?.currency}{" "}
                          {service.pricing?.basePrice?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {service.pricing?.priceType}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={service.isActive ? "default" : "secondary"}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleEdit(service)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(service._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Cargo Service" : "Add New Cargo Service"}
            </DialogTitle>
            <DialogDescription>
              Configure cargo transportation details, capacity, and pricing
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Heavy Cargo Transport"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.cargoService.vehicleType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        cargoService: {
                          ...prev.cargoService,
                          vehicleType: value,
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Detailed description of the cargo service"
                />
              </div>
            </div>

            {/* Capacity Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Capacity & Dimensions</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Max Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.cargoService.capacity.weight}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cargoService: {
                          ...prev.cargoService,
                          capacity: {
                            ...prev.cargoService.capacity,
                            weight: Number(e.target.value),
                          },
                        },
                      }))
                    }
                    placeholder="Maximum weight capacity"
                  />
                </div>
                <div>
                  <Label htmlFor="volume">Volume (m³)</Label>
                  <Input
                    id="volume"
                    type="number"
                    step="0.1"
                    value={formData.cargoService.capacity.volume}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cargoService: {
                          ...prev.cargoService,
                          capacity: {
                            ...prev.cargoService.capacity,
                            volume: Number(e.target.value),
                          },
                        },
                      }))
                    }
                    placeholder="Volume capacity"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="L"
                      value={formData.cargoService.capacity.dimensions.length}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cargoService: {
                            ...prev.cargoService,
                            capacity: {
                              ...prev.cargoService.capacity,
                              dimensions: {
                                ...prev.cargoService.capacity.dimensions,
                                length: Number(e.target.value),
                              },
                            },
                          },
                        }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="W"
                      value={formData.cargoService.capacity.dimensions.width}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cargoService: {
                            ...prev.cargoService,
                            capacity: {
                              ...prev.cargoService.capacity,
                              dimensions: {
                                ...prev.cargoService.capacity.dimensions,
                                width: Number(e.target.value),
                              },
                            },
                          },
                        }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="H"
                      value={formData.cargoService.capacity.dimensions.height}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cargoService: {
                            ...prev.cargoService,
                            capacity: {
                              ...prev.cargoService.capacity,
                              dimensions: {
                                ...prev.cargoService.capacity.dimensions,
                                height: Number(e.target.value),
                              },
                            },
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Available Routes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Available Routes</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {commonRoutes.map((route) => (
                    <Button
                      key={route}
                      type="button"
                      variant={
                        formData.cargoService.availableRoutes.includes(route)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (
                          formData.cargoService.availableRoutes.includes(route)
                        ) {
                          removeRoute(route);
                        } else {
                          addRoute(route);
                        }
                      }}
                    >
                      {route}
                    </Button>
                  ))}
                </div>
                {formData.cargoService.availableRoutes.length > 0 && (
                  <div>
                    <Label>Selected Routes:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.cargoService.availableRoutes.map((route) => (
                        <Badge
                          key={route}
                          variant="default"
                          className="cursor-pointer"
                          onClick={() => removeRoute(route)}
                        >
                          {route} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Restrictions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Restrictions</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {commonRestrictions.map((restriction) => (
                    <Button
                      key={restriction}
                      type="button"
                      variant={
                        formData.cargoService.restrictions.includes(restriction)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (
                          formData.cargoService.restrictions.includes(
                            restriction,
                          )
                        ) {
                          removeRestriction(restriction);
                        } else {
                          addRestriction(restriction);
                        }
                      }}
                    >
                      {restriction}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Services */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Services</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {additionalServices.map((service) => (
                    <Button
                      key={service}
                      type="button"
                      variant={
                        formData.cargoService.additionalServices.includes(
                          service,
                        )
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (
                          formData.cargoService.additionalServices.includes(
                            service,
                          )
                        ) {
                          removeAdditionalService(service);
                        } else {
                          addAdditionalService(service);
                        }
                      }}
                    >
                      {service}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="basePrice">Base Price</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={formData.pricing.basePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricing: {
                          ...prev.pricing,
                          basePrice: Number(e.target.value),
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.pricing.currency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricing: { ...prev.pricing, currency: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NPR">NPR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priceType">Price Type</Label>
                  <Select
                    value={formData.pricing.priceType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricing: { ...prev.pricing, priceType: value },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="per_km">Per KM</SelectItem>
                      <SelectItem value="per_hour">Per Hour</SelectItem>
                      <SelectItem value="per_day">Per Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingService ? "Update" : "Create"} Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
