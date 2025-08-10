import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, MapPin, Clock, Users, Truck, Plane, Bus, Package, Calendar, Phone, Mail, MapPin as MapPinIcon } from 'lucide-react';
import { apiCall, apiClient, BusService, CargoService, TourPackage } from '@/services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Transportation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('buses');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  
  // Data states
  const [busServices, setBusServices] = useState<BusService[]>([]);
  const [cargoServices, setCargoServices] = useState<CargoService[]>([]);
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingBuses, setLoadingBuses] = useState(false);
  const [loadingCargo, setLoadingCargo] = useState(false);
  const [loadingTours, setLoadingTours] = useState(false);
  
  const navigate = useNavigate();

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadBusServices(),
        loadCargoServices(),
        loadTourPackages()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load transportation services');
    } finally {
      setLoading(false);
    }
  };

  const loadBusServices = async () => {
    setLoadingBuses(true);
    try {
      const buses = await apiCall(
        () => apiClient.getBusServices({ query: searchQuery, type: filterType }),
        { showToast: false }
      );
      setBusServices(buses);
    } catch (error) {
      console.error('Error loading bus services:', error);
      toast.error('Failed to load bus services');
    } finally {
      setLoadingBuses(false);
    }
  };

  const loadCargoServices = async () => {
    setLoadingCargo(true);
    try {
      const cargo = await apiCall(
        () => apiClient.getCargoServices({ query: searchQuery, type: filterType }),
        { showToast: false }
      );
      setCargoServices(cargo);
    } catch (error) {
      console.error('Error loading cargo services:', error);
      toast.error('Failed to load cargo services');
    } finally {
      setLoadingCargo(false);
    }
  };

  const loadTourPackages = async () => {
    setLoadingTours(true);
    try {
      const tours = await apiCall(
        () => apiClient.getTourPackages({ 
          query: searchQuery, 
          category: filterCategory, 
          difficulty: filterDifficulty 
        }),
        { showToast: false }
      );
      setTourPackages(tours);
    } catch (error) {
      console.error('Error loading tour packages:', error);
      toast.error('Failed to load tour packages');
    } finally {
      setLoadingTours(false);
    }
  };

  // Handle search and filters
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (activeTab === 'buses') {
        loadBusServices();
      } else if (activeTab === 'cargo') {
        loadCargoServices();
      } else if (activeTab === 'tours') {
        loadTourPackages();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filterType, filterCategory, filterDifficulty, activeTab]);

  const handleBooking = (service: BusService | CargoService | TourPackage, type: 'bus' | 'cargo' | 'tour') => {
    // Check if user is logged in
    const token = apiClient.getToken();
    if (!token) {
      toast.error('Please login to book services');
      navigate('/login');
      return;
    }

    // Navigate to booking page with service details
    navigate('/booking', { 
      state: { 
        service, 
        serviceType: type 
      } 
    });
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'AC': return '❄️';
      case 'WiFi': return '📶';
      case 'Entertainment': return '📺';
      case 'Charging Port': return '🔌';
      case 'Refreshments': return '☕';
      case 'USB Port': return '🔋';
      case 'Reading Light': return '💡';
      case 'Reclining Seats': return '🪑';
      default: return '✅';
    }
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'GPS Tracking': return '📍';
      case 'Insurance Coverage': return '🛡️';
      case 'Real-time Updates': return '📱';
      case 'Door-to-Door': return '🏠';
      case 'Express Delivery': return '⚡';
      case 'Fragile Handling': return '📦';
      case 'Temperature Control': return '🌡️';
      case '24/7 Support': return '🕐';
      default: return '✅';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Deluxe': return 'bg-purple-100 text-purple-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Express': return 'bg-green-100 text-green-800';
      case 'Truck': return 'bg-orange-100 text-orange-800';
      case 'Van': return 'bg-yellow-100 text-yellow-800';
      case 'Container': return 'bg-red-100 text-red-800';
      case 'Adventure': return 'bg-red-100 text-red-800';
      case 'Cultural': return 'bg-blue-100 text-blue-800';
      case 'Wildlife': return 'bg-green-100 text-green-800';
      case 'Religious': return 'bg-purple-100 text-purple-800';
      case 'Leisure': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transportation services...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Transportation Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Premium bus services, reliable cargo transport, and unforgettable tour packages
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Bus className="w-5 h-5" />
              <span>Bus Services</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Truck className="w-5 h-5" />
              <span>Cargo Transport</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Plane className="w-5 h-5" />
              <span>Tour Packages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            {activeTab === 'buses' && (
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Bus Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Deluxe">Deluxe</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Express">Express</SelectItem>
                </SelectContent>
              </Select>
            )}
            {activeTab === 'cargo' && (
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Cargo Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                  <SelectItem value="Container">Container</SelectItem>
                </SelectContent>
              </Select>
            )}
            {activeTab === 'tours' && (
              <>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Adventure">Adventure</SelectItem>
                    <SelectItem value="Cultural">Cultural</SelectItem>
                    <SelectItem value="Wildlife">Wildlife</SelectItem>
                    <SelectItem value="Religious">Religious</SelectItem>
                    <SelectItem value="Leisure">Leisure</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Difficulties</SelectItem>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Difficult">Difficult</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        </div>

        {/* Services Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="buses" className="flex items-center gap-2">
              <Bus className="w-4 h-4" />
              Bus Services
            </TabsTrigger>
            <TabsTrigger value="cargo" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Cargo Transport
            </TabsTrigger>
            <TabsTrigger value="tours" className="flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Tour Packages
            </TabsTrigger>
          </TabsList>

          {/* Bus Services */}
          <TabsContent value="buses">
            {loadingBuses ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading bus services...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {busServices.map((bus) => (
                  <Card key={bus._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={bus.image}
                        alt={bus.name}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className={`absolute top-4 right-4 ${getStatusColor(bus.type)}`}>
                        {bus.type}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{bus.name}</CardTitle>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{bus.route}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{bus.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{bus.rating}</span>
                            <span className="text-sm text-gray-500">({bus.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {bus.availableSeats} seats available
                            </span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            Rs. {bus.price}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {bus.amenities.slice(0, 3).map((amenity) => (
                            <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {getAmenityIcon(amenity)} {amenity}
                            </span>
                          ))}
                          {bus.amenities.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{bus.amenities.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 line-clamp-2">
                          {bus.description}
                        </div>

                        <Button 
                          onClick={() => handleBooking(bus, 'bus')}
                          className="w-full"
                          disabled={bus.availableSeats === 0}
                        >
                          {bus.availableSeats === 0 ? 'No Seats Available' : 'Book Now'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Cargo Services */}
          <TabsContent value="cargo">
            {loadingCargo ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading cargo services...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cargoServices.map((cargo) => (
                  <Card key={cargo._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={cargo.image}
                        alt={cargo.name}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className={`absolute top-4 right-4 ${getStatusColor(cargo.type)}`}>
                        {cargo.type}
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{cargo.name}</CardTitle>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{cargo.capacity}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{cargo.deliveryTime}</span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            Rs. {cargo.price}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">
                            <strong>Routes:</strong> {cargo.routes.join(', ')}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`flex items-center gap-1 ${cargo.insurance ? 'text-green-600' : 'text-gray-400'}`}>
                              🛡️ Insurance
                            </span>
                            <span className={`flex items-center gap-1 ${cargo.tracking ? 'text-green-600' : 'text-gray-400'}`}>
                              📍 Tracking
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {cargo.features.slice(0, 3).map((feature) => (
                            <span key={feature} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {getFeatureIcon(feature)} {feature}
                            </span>
                          ))}
                          {cargo.features.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{cargo.features.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 line-clamp-2">
                          {cargo.description}
                        </div>

                        <Button 
                          onClick={() => handleBooking(cargo, 'cargo')}
                          className="w-full"
                        >
                          Book Cargo Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tour Packages */}
          <TabsContent value="tours">
            {loadingTours ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading tour packages...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tourPackages.map((tour) => (
                  <Card key={tour._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge className={getStatusColor(tour.category)}>
                          {tour.category}
                        </Badge>
                        <Badge className="bg-orange-100 text-orange-800">
                          {tour.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{tour.name}</CardTitle>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{tour.destination}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{tour.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{tour.rating}</span>
                            <span className="text-sm text-gray-500">({tour.reviews})</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Max {tour.groupSize} people
                            </span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            Rs. {tour.price}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>Highlights:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {tour.highlights.slice(0, 3).map((highlight) => (
                                <span key={highlight} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {highlight}
                                </span>
                              ))}
                              {tour.highlights.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{tour.highlights.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 line-clamp-2">
                          {tour.description}
                        </div>

                        <Button 
                          onClick={() => handleBooking(tour, 'tour')}
                          className="w-full"
                        >
                          Book Tour Package
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <Phone className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600">+977-9856056782</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600">info@kanxasafari.com</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPinIcon className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600">Lamjung, Nepal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transportation;
