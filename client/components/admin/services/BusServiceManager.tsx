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
  Bus,
  MapPin,
  Clock,
} from "lucide-react";
import { servicesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";

interface BusService {
  _id: string;
  name: string;
  description: string;
  busService: {
    route: {
      from: string;
      to: string;
      distance: number;
      duration: string;
      stops?: string[];
    };
    schedule: Array<{
      departureTime: string;
      arrivalTime: string;
      frequency: string;
      daysOfOperation: string[];
      isActive: boolean;
    }>;
    vehicle: {
      busNumber: string;
      busType: string;
      totalSeats: number;
      availableSeats: number;
      amenities: string[];
      manufacturer?: string;
      model?: string;
      year?: number;
      plateNumber?: string;
    };
    operator: {
      name: string;
      license: string;
      contact: string;
      email: string;
    };
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

export default function BusServiceManager() {
  const [busServices, setBusServices] = useState<BusService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<BusService | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    busService: {
      route: {
        from: "",
        to: "",
        distance: 0,
        duration: "",
        stops: [] as string[],
      },
      schedule: [
        {
          departureTime: "",
          arrivalTime: "",
          frequency: "daily",
          daysOfOperation: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
          isActive: true,
        },
      ],
      vehicle: {
        busNumber: "",
        busType: "AC Deluxe",
        totalSeats: 45,
        availableSeats: 45,
        amenities: [] as string[],
        manufacturer: "",
        model: "",
        year: new Date().getFullYear(),
        plateNumber: "",
      },
      operator: {
        name: "",
        license: "",
        contact: "",
        email: "",
      },
    },
    pricing: {
      basePrice: 0,
      currency: "NPR",
      priceType: "fixed",
    },
    isActive: true,
    isFeatured: false,
  });

  const busTypes = ["AC Deluxe", "Non-AC", "Tourist Bus", "VIP", "Ordinary"];
  const commonAmenities = [
    "AC",
    "WiFi",
    "Entertainment",
    "Charging Port",
    "Reclining Seats",
    "Snacks",
    "Water",
    "Blanket",
  ];

  useEffect(() => {
    loadBusServices();
  }, []);

  const loadBusServices = async () => {
    try {
      setIsLoading(true);
      const response = await servicesAPI.getAllServices({
        type: "bus",
        limit: 100,
      });
      setBusServices(response.services || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load bus services",
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
        type: "bus",
        category: "Transportation",
        shortDescription: formData.description.substring(0, 200),
      };

      if (editingService) {
        await servicesAPI.updateService(editingService._id, serviceData);
        toast({
          title: "Success",
          description: "Bus service updated successfully",
        });
      } else {
        await servicesAPI.createService(serviceData);
        toast({
          title: "Success",
          description: "Bus service created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadBusServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save bus service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: BusService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      shortDescription: service.description.substring(0, 200),
      busService: service.busService,
      pricing: service.pricing,
      isActive: service.isActive,
      isFeatured: service.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this bus service?")) return;

    try {
      await servicesAPI.deleteService(serviceId);
      toast({
        title: "Success",
        description: "Bus service deleted successfully",
      });
      loadBusServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete bus service",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      busService: {
        route: {
          from: "",
          to: "",
          distance: 0,
          duration: "",
          stops: [],
        },
        schedule: [
          {
            departureTime: "",
            arrivalTime: "",
            frequency: "daily",
            daysOfOperation: [
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ],
            isActive: true,
          },
        ],
        vehicle: {
          busNumber: "",
          busType: "AC Deluxe",
          totalSeats: 45,
          availableSeats: 45,
          amenities: [],
          manufacturer: "",
          model: "",
          year: new Date().getFullYear(),
          plateNumber: "",
        },
        operator: {
          name: "",
          license: "",
          contact: "",
          email: "",
        },
      },
      pricing: {
        basePrice: 0,
        currency: "NPR",
        priceType: "fixed",
      },
      isActive: true,
      isFeatured: false,
    });
    setEditingService(null);
  };

  const addAmenity = (amenity: string) => {
    if (!formData.busService.vehicle.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        busService: {
          ...prev.busService,
          vehicle: {
            ...prev.busService.vehicle,
            amenities: [...prev.busService.vehicle.amenities, amenity],
          },
        },
      }));
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      busService: {
        ...prev.busService,
        vehicle: {
          ...prev.busService.vehicle,
          amenities: prev.busService.vehicle.amenities.filter(
            (a) => a !== amenity,
          ),
        },
      },
    }));
  };

  const filteredServices = busServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.busService?.route?.from
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      service.busService?.route?.to
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bus className="w-6 h-6" />
            Bus Services Management
          </h2>
          <p className="text-gray-600">
            Manage bus routes, schedules, and vehicles
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Bus Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bus services..."
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
                  <TableHead>Route</TableHead>
                  <TableHead>Vehicle</TableHead>
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
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {service.busService?.operator?.name}
                          </Badge>
                          {service.isFeatured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-sm">
                            {service.busService?.route?.from} →{" "}
                            {service.busService?.route?.to}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600">
                            {service.busService?.route?.duration} •{" "}
                            {service.busService?.route?.distance}km
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {service.busService?.vehicle?.busNumber}
                        </p>
                        <p className="text-xs text-gray-600">
                          {service.busService?.vehicle?.busType}
                        </p>
                        <p className="text-xs text-gray-600">
                          {service.busService?.vehicle?.totalSeats} seats
                        </p>
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
              {editingService ? "Edit Bus Service" : "Add New Bus Service"}
            </DialogTitle>
            <DialogDescription>
              Configure bus route, schedule, vehicle details, and pricing
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
                    placeholder="e.g., Kathmandu Express"
                  />
                </div>
                <div>
                  <Label htmlFor="operator">Operator Name</Label>
                  <Input
                    id="operator"
                    value={formData.busService.operator.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          operator: {
                            ...prev.busService.operator,
                            name: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="e.g., Kanxa Transport"
                  />
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
                  placeholder="Detailed description of the bus service"
                />
              </div>
            </div>

            {/* Route Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Route Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    value={formData.busService.route.from}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          route: {
                            ...prev.busService.route,
                            from: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Starting location"
                  />
                </div>
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    value={formData.busService.route.to}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          route: {
                            ...prev.busService.route,
                            to: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Destination"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    value={formData.busService.route.distance}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          route: {
                            ...prev.busService.route,
                            distance: Number(e.target.value),
                          },
                        },
                      }))
                    }
                    placeholder="Distance in kilometers"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.busService.route.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          route: {
                            ...prev.busService.route,
                            duration: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="e.g., 6 hours"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="busNumber">Bus Number</Label>
                  <Input
                    id="busNumber"
                    value={formData.busService.vehicle.busNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          vehicle: {
                            ...prev.busService.vehicle,
                            busNumber: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="e.g., KP-1001"
                  />
                </div>
                <div>
                  <Label htmlFor="busType">Bus Type</Label>
                  <Select
                    value={formData.busService.vehicle.busType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          vehicle: {
                            ...prev.busService.vehicle,
                            busType: value,
                          },
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {busTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="totalSeats">Total Seats</Label>
                  <Input
                    id="totalSeats"
                    type="number"
                    value={formData.busService.vehicle.totalSeats}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          vehicle: {
                            ...prev.busService.vehicle,
                            totalSeats: Number(e.target.value),
                          },
                        },
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Amenities</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonAmenities.map((amenity) => (
                    <Button
                      key={amenity}
                      type="button"
                      variant={
                        formData.busService.vehicle.amenities.includes(amenity)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (
                          formData.busService.vehicle.amenities.includes(
                            amenity,
                          )
                        ) {
                          removeAmenity(amenity);
                        } else {
                          addAmenity(amenity);
                        }
                      }}
                    >
                      {amenity}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departureTime">Departure Time</Label>
                  <Input
                    id="departureTime"
                    type="time"
                    value={formData.busService.schedule[0]?.departureTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          schedule: [
                            {
                              ...prev.busService.schedule[0],
                              departureTime: e.target.value,
                            },
                          ],
                        },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalTime">Arrival Time</Label>
                  <Input
                    id="arrivalTime"
                    type="time"
                    value={formData.busService.schedule[0]?.arrivalTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        busService: {
                          ...prev.busService,
                          schedule: [
                            {
                              ...prev.busService.schedule[0],
                              arrivalTime: e.target.value,
                            },
                          ],
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
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
