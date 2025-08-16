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
  Hammer,
  Package2,
  Star,
} from "lucide-react";
import { servicesAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast-simple";

interface MaterialsService {
  _id: string;
  name: string;
  description: string;
  constructionService: {
    itemType: "material" | "machinery" | "tool";
    specifications: any;
    availability: {
      inStock: boolean;
      quantity: number;
      unit: string;
      restockDate?: Date;
    };
    supplier: {
      name: string;
      contact: string;
      address: string;
      rating: number;
    };
    qualityCertifications: string[];
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

export default function MaterialsServiceManager() {
  const [materialsServices, setMaterialsServices] = useState<
    MaterialsService[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<MaterialsService | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    constructionService: {
      itemType: "material" as "material" | "machinery" | "tool",
      specifications: {},
      availability: {
        inStock: true,
        quantity: 0,
        unit: "pieces",
        restockDate: undefined as Date | undefined,
      },
      supplier: {
        name: "",
        contact: "",
        address: "",
        rating: 5,
      },
      qualityCertifications: [] as string[],
    },
    pricing: {
      basePrice: 0,
      currency: "NPR",
      priceType: "per_unit",
    },
    isActive: true,
    isFeatured: false,
  });

  const itemTypes = [
    { value: "material", label: "Construction Material" },
    { value: "machinery", label: "Construction Machinery" },
    { value: "tool", label: "Construction Tool" },
  ];

  const units = [
    "pieces",
    "kg",
    "tons",
    "bags",
    "cubic meter",
    "square meter",
    "linear meter",
    "sets",
    "boxes",
    "rolls",
    "sheets",
  ];

  const commonCertifications = [
    "ISO 9001",
    "Bureau of Indian Standards (BIS)",
    "Nepal Bureau of Standards (NBS)",
    "CE Marking",
    "ISI Mark",
    "Quality Assurance Certificate",
    "Environmental Compliance",
    "Safety Standard Certification",
  ];

  const materialCategories = {
    material: [
      "Cement & Concrete",
      "Steel & Metal",
      "Bricks & Blocks",
      "Sand & Aggregates",
      "Timber & Wood",
      "Roofing Materials",
      "Plumbing Materials",
      "Electrical Materials",
      "Paint & Coatings",
      "Tiles & Flooring",
    ],
    machinery: [
      "Excavators",
      "Bulldozers",
      "Concrete Mixers",
      "Cranes",
      "Compactors",
      "Generators",
      "Welding Equipment",
      "Pumps",
      "Lifting Equipment",
    ],
    tool: [
      "Hand Tools",
      "Power Tools",
      "Measuring Equipment",
      "Safety Equipment",
      "Cutting Tools",
      "Drilling Equipment",
      "Fasteners",
      "Hardware",
    ],
  };

  useEffect(() => {
    loadMaterialsServices();
  }, []);

  const loadMaterialsServices = async () => {
    try {
      setIsLoading(true);
      const response = await servicesAPI.getAllServices({
        type: "construction",
        limit: 100,
      });
      setMaterialsServices(response.services || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load materials services",
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
        type: "construction",
        category: "Construction",
        shortDescription: formData.description.substring(0, 200),
      };

      if (editingService) {
        await servicesAPI.updateService(editingService._id, serviceData);
        toast({
          title: "Success",
          description: "Materials service updated successfully",
        });
      } else {
        await servicesAPI.createService(serviceData);
        toast({
          title: "Success",
          description: "Materials service created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      loadMaterialsServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save materials service",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (service: MaterialsService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      shortDescription: service.description.substring(0, 200),
      constructionService: service.constructionService,
      pricing: service.pricing,
      isActive: service.isActive,
      isFeatured: service.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this materials service?"))
      return;

    try {
      await servicesAPI.deleteService(serviceId);
      toast({
        title: "Success",
        description: "Materials service deleted successfully",
      });
      loadMaterialsServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete materials service",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      shortDescription: "",
      constructionService: {
        itemType: "material",
        specifications: {},
        availability: {
          inStock: true,
          quantity: 0,
          unit: "pieces",
          restockDate: undefined,
        },
        supplier: {
          name: "",
          contact: "",
          address: "",
          rating: 5,
        },
        qualityCertifications: [],
      },
      pricing: {
        basePrice: 0,
        currency: "NPR",
        priceType: "per_unit",
      },
      isActive: true,
      isFeatured: false,
    });
    setEditingService(null);
  };

  const addCertification = (certification: string) => {
    if (
      !formData.constructionService.qualityCertifications.includes(
        certification,
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        constructionService: {
          ...prev.constructionService,
          qualityCertifications: [
            ...prev.constructionService.qualityCertifications,
            certification,
          ],
        },
      }));
    }
  };

  const removeCertification = (certification: string) => {
    setFormData((prev) => ({
      ...prev,
      constructionService: {
        ...prev.constructionService,
        qualityCertifications:
          prev.constructionService.qualityCertifications.filter(
            (c) => c !== certification,
          ),
      },
    }));
  };

  const filteredServices = materialsServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.constructionService?.itemType
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      service.constructionService?.supplier?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Hammer className="w-6 h-6" />
            Construction Materials Management
          </h2>
          <p className="text-gray-600">
            Manage construction materials, machinery, and tools
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Material/Tool
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search materials and tools..."
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
                  <TableHead>Item Details</TableHead>
                  <TableHead>Type & Specifications</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Availability</TableHead>
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
                        <div className="flex gap-1 mt-1">
                          {service.constructionService?.qualityCertifications
                            ?.slice(0, 2)
                            .map((cert, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {cert}
                              </Badge>
                            ))}
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
                          <Package2 className="w-3 h-3 text-gray-400" />
                          <span className="text-sm capitalize">
                            {service.constructionService?.itemType}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {Object.keys(
                            service.constructionService?.specifications || {},
                          ).length > 0 && <span>Specs available</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {service.constructionService?.supplier?.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs">
                            {service.constructionService?.supplier?.rating}/5
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {service.constructionService?.supplier?.address}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant={
                            service.constructionService?.availability?.inStock
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {service.constructionService?.availability?.inStock
                            ? "In Stock"
                            : "Out of Stock"}
                        </Badge>
                        <p className="text-xs text-gray-600">
                          {service.constructionService?.availability?.quantity}{" "}
                          {service.constructionService?.availability?.unit}
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
              {editingService
                ? "Edit Construction Item"
                : "Add New Construction Item"}
            </DialogTitle>
            <DialogDescription>
              Add construction materials, machinery, or tools with detailed
              specifications
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Premium Cement OPC 53"
                  />
                </div>
                <div>
                  <Label htmlFor="itemType">Item Type</Label>
                  <Select
                    value={formData.constructionService.itemType}
                    onValueChange={(value: "material" | "machinery" | "tool") =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          itemType: value,
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {itemTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
                  placeholder="Detailed description of the construction item"
                />
              </div>
            </div>

            {/* Supplier Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Supplier Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    value={formData.constructionService.supplier.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          supplier: {
                            ...prev.constructionService.supplier,
                            name: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Supplier company name"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierContact">Contact</Label>
                  <Input
                    id="supplierContact"
                    value={formData.constructionService.supplier.contact}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          supplier: {
                            ...prev.constructionService.supplier,
                            contact: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierAddress">Address</Label>
                  <Input
                    id="supplierAddress"
                    value={formData.constructionService.supplier.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          supplier: {
                            ...prev.constructionService.supplier,
                            address: e.target.value,
                          },
                        },
                      }))
                    }
                    placeholder="Supplier address"
                  />
                </div>
                <div>
                  <Label htmlFor="supplierRating">Supplier Rating</Label>
                  <Select
                    value={formData.constructionService.supplier.rating.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          supplier: {
                            ...prev.constructionService.supplier,
                            rating: Number(value),
                          },
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <SelectItem key={rating} value={rating.toString()}>
                          {rating} Star{rating > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Availability</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.constructionService.availability.quantity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          availability: {
                            ...prev.constructionService.availability,
                            quantity: Number(e.target.value),
                          },
                        },
                      }))
                    }
                    placeholder="Available quantity"
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={formData.constructionService.availability.unit}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          availability: {
                            ...prev.constructionService.availability,
                            unit: value,
                          },
                        },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.constructionService.availability.inStock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        constructionService: {
                          ...prev.constructionService,
                          availability: {
                            ...prev.constructionService.availability,
                            inStock: e.target.checked,
                          },
                        },
                      }))
                    }
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>
              </div>
            </div>

            {/* Quality Certifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quality Certifications</h3>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {commonCertifications.map((cert) => (
                    <Button
                      key={cert}
                      type="button"
                      variant={
                        formData.constructionService.qualityCertifications.includes(
                          cert,
                        )
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        if (
                          formData.constructionService.qualityCertifications.includes(
                            cert,
                          )
                        ) {
                          removeCertification(cert);
                        } else {
                          addCertification(cert);
                        }
                      }}
                    >
                      {cert}
                    </Button>
                  ))}
                </div>
                {formData.constructionService.qualityCertifications.length >
                  0 && (
                  <div>
                    <Label>Selected Certifications:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.constructionService.qualityCertifications.map(
                        (cert) => (
                          <Badge
                            key={cert}
                            variant="default"
                            className="cursor-pointer"
                            onClick={() => removeCertification(cert)}
                          >
                            {cert} ×
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="basePrice">Price per Unit</Label>
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
                      <SelectItem value="per_unit">Per Unit</SelectItem>
                      <SelectItem value="per_kg">Per KG</SelectItem>
                      <SelectItem value="per_day">Per Day (Rent)</SelectItem>
                      <SelectItem value="fixed">Fixed Price</SelectItem>
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
              {editingService ? "Update" : "Create"} Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
