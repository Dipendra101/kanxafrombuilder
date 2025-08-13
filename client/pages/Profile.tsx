import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import GuestRestriction from "@/components/auth/GuestRestriction";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Bell,
  Shield,
  CreditCard,
  Settings,
  LogOut,
  Camera,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/layout/Layout";
import { bookingsAPI } from "@/services/api";

export default function Profile() {
  const { user, isGuest, isAuthenticated, updateUser, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show guest restriction if user is in guest mode
  if (isGuest || !isAuthenticated) {
    return (
      <GuestRestriction
        action="access your profile"
        description="You need to be logged in to view and edit your profile. Create an account to manage your personal information and preferences."
      />
    );
  }

  // Default image provided
  const defaultImage =
    "https://cdn.builder.io/api/v1/image/assets%2Fe0e990aaf8214381b9783ad82133cc2a%2F726cd8591a334f858722142910fcf4de?format=webp&width=800";

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    company: "",
    dateJoined: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    bio: "",
  });

  // Fetch user activity and stats from backend
  const fetchUserData = async () => {
    if (!user) return;

    try {
      setActivityLoading(true);

      // Fetch user's recent bookings as activity
      const bookingsResponse = await bookingsAPI.getBookings({ limit: 5 });
      if (bookingsResponse.success && bookingsResponse.bookings) {
        const activities = bookingsResponse.bookings.map((booking: any, index: number) => ({
          id: booking._id || index,
          type: "booking",
          description: `${booking.service?.name || 'Service'} booking${booking.status === 'confirmed' ? ' confirmed' : ''} - ${booking.serviceDetails?.route || booking.contactInfo?.name || 'Service'}`,
          date: new Date(booking.createdAt).toLocaleDateString(),
          status: booking.status || 'unknown',
        }));
        setRecentActivity(activities);
      }

      // You could also fetch actual loyalty/stats data here
      // const statsResponse = await userAPI.getStats();

    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // Keep default data on error
    } finally {
      setActivityLoading(false);
    }
  };

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        company: "",
        dateJoined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        bio: "",
      });
      setProfilePicture(user.profilePicture || null);

      // Fetch user activity and stats
      fetchUserData();
    }
  }, [user]);

  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    promotions: false,
    serviceReminders: true,
    newsletter: true,
  });

  // Save notification settings to backend
  const saveNotificationSettings = async (newSettings: typeof notifications) => {
    try {
      await updateUser({
        preferences: {
          notifications: newSettings,
        },
      });

      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to save notification settings.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUser({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        profilePicture: profilePicture || undefined,
      });

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const handleProfilePictureUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: "booking",
      description: "Bus booking confirmed - Lamjung to Kathmandu",
      date: "2024-01-20",
      status: "completed",
    },
    {
      id: 2,
      type: "order",
      description: "Construction materials order #ORD-2024-001",
      date: "2024-01-18",
      status: "delivered",
    },
    {
      id: 3,
      type: "service",
      description: "Garage appointment scheduled for tractor service",
      date: "2024-01-22",
      status: "upcoming",
    },
  ]);

  const [loyaltyStats, setLoyaltyStats] = useState({
    totalBookings: 15,
    totalOrders: 8,
    totalSpent: 245000,
    loyaltyPoints: 1250,
    membershipLevel: "Gold",
  });

  const [activityLoading, setActivityLoading] = useState(false);

  // Load recent activity from backend
  useEffect(() => {
    const loadRecentActivity = async () => {
      if (!user) return;

      setActivityLoading(true);
      try {
        const response = await bookingsAPI.getUserBookings();
        if (response.success && response.bookings) {
          const activities = response.bookings.slice(0, 5).map((booking: any, index: number) => ({
            id: booking.id || index + 1,
            type: booking.type || "booking",
            description: booking.service?.name || booking.serviceName || 'Service booking',
            date: new Date(booking.createdAt || booking.date).toISOString().split('T')[0],
            status: booking.status || "completed",
          }));
          setRecentActivity(activities);
        }
      } catch (error) {
        console.error('Failed to load recent activity:', error);
        // Keep the mock data if API fails
      } finally {
        setActivityLoading(false);
      }
    };

    loadRecentActivity();
  }, [user]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-8 sm:py-12 lg:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-2 border-white/30">
              <img
                src={profilePicture || defaultImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4">
              My Profile
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 px-4 sm:px-0">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
                <TabsTrigger
                  value="profile"
                  className="text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="loyalty"
                  className="text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Loyalty
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="profile"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                {/* Profile Picture Section */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">
                      Profile Picture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="relative mx-auto sm:mx-0">
                        <div
                          className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden group cursor-pointer border-2 border-gray-200"
                          onClick={handleProfilePictureClick}
                        >
                          <img
                            src={profilePicture || defaultImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                          </div>
                        </div>
                        {profilePicture && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProfilePicture();
                            }}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-medium mb-2 text-sm sm:text-base">
                          Upload a new profile picture
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 mb-4">
                          JPG, PNG or GIF. Maximum file size is 5MB. Click on
                          the image or use the button below to upload.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleProfilePictureClick}
                            className="text-xs sm:text-sm"
                          >
                            <Upload className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            {profilePicture ? "Change Photo" : "Upload Photo"}
                          </Button>
                          {profilePicture && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={removeProfilePicture}
                              className="text-xs sm:text-sm"
                            >
                              Reset to Default
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                  {/* Profile Information */}
                  <div className="xl:col-span-2">
                    <Card>
                      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-4">
                        <CardTitle className="text-lg sm:text-xl">
                          Personal Information
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            isEditing ? handleSave() : setIsEditing(true)
                          }
                          className="text-xs sm:text-sm w-full sm:w-auto"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                          ) : isEditing ? (
                            <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          ) : (
                            <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          )}
                          {isLoading ? "Saving..." : isEditing ? "Save" : "Edit"}
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name" className="text-sm">
                              Full Name
                            </Label>
                            <Input
                              id="name"
                              value={profile.name}
                              onChange={(e) =>
                                setProfile({ ...profile, name: e.target.value })
                              }
                              disabled={!isEditing}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email" className="text-sm">
                              Email
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  email: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone" className="text-sm">
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              value={profile.phone}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  phone: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label htmlFor="company" className="text-sm">
                              Company
                            </Label>
                            <Input
                              id="company"
                              value={profile.company}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  company: e.target.value,
                                })
                              }
                              disabled={!isEditing}
                              className="text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address" className="text-sm">
                            Address
                          </Label>
                          <Input
                            id="address"
                            value={profile.address}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                address: e.target.value,
                              })
                            }
                            disabled={!isEditing}
                            className="text-sm"
                          />
                        </div>

                        <div>
                          <Label htmlFor="bio" className="text-sm">
                            Bio
                          </Label>
                          <Textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) =>
                              setProfile({ ...profile, bio: e.target.value })
                            }
                            disabled={!isEditing}
                            rows={3}
                            className="text-sm resize-none"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Profile Summary */}
                  <div className="space-y-4 sm:space-y-6">
                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">
                          Account Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 sm:space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-kanxa-blue flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">
                              Member Since
                            </p>
                            <p className="font-medium text-sm sm:text-base truncate">
                              {profile.dateJoined}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-kanxa-orange flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">
                              Location
                            </p>
                            <p className="font-medium text-sm sm:text-base truncate">
                              {profile.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-kanxa-green flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm text-gray-600">
                              Email Verified
                            </p>
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 text-xs"
                            >
                              Verified
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg sm:text-xl">
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 sm:space-y-3">
                        <Button
                          className="w-full justify-start text-xs sm:text-sm h-auto py-2 sm:py-2.5"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: "Payment methods management will be available soon.",
                            });
                          }}
                        >
                          <CreditCard className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Payment Methods
                        </Button>
                        <Button
                          className="w-full justify-start text-xs sm:text-sm h-auto py-2 sm:py-2.5"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Coming Soon",
                              description: "Security settings will be available soon.",
                            });
                          }}
                        >
                          <Shield className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Security Settings
                        </Button>
                        <Button
                          className="w-full justify-start text-xs sm:text-sm h-auto py-2 sm:py-2.5"
                          variant="outline"
                          onClick={() => {
                            // Scroll to settings tab or switch to it
                            const settingsTab = document.querySelector('[data-value="settings"]') as HTMLElement;
                            if (settingsTab) {
                              settingsTab.click();
                            }
                          }}
                        >
                          <Bell className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                          Notifications
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="activity"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                activity.type === "booking"
                                  ? "bg-kanxa-light-blue"
                                  : activity.type === "order"
                                    ? "bg-kanxa-light-orange"
                                    : "bg-kanxa-light-green"
                              }`}
                            >
                              {activity.type === "booking" && (
                                <Calendar className="h-3 w-3 sm:h-5 sm:w-5 text-kanxa-blue" />
                              )}
                              {activity.type === "order" && (
                                <CreditCard className="h-3 w-3 sm:h-5 sm:w-5 text-kanxa-orange" />
                              )}
                              {activity.type === "service" && (
                                <Settings className="h-3 w-3 sm:h-5 sm:w-5 text-kanxa-green" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm sm:text-base line-clamp-2">
                                {activity.description}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {activity.date}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={`text-xs flex-shrink-0 ${
                              activity.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : activity.status === "delivered"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="loyalty"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  <Card className="text-center">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-kanxa-blue mb-1 sm:mb-2">
                        {loyaltyStats.totalBookings}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Total Bookings
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-kanxa-orange mb-1 sm:mb-2">
                        {loyaltyStats.totalOrders}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Total Orders
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-kanxa-green mb-1 sm:mb-2">
                        NPR {loyaltyStats.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Total Spent
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-kanxa-navy mb-1 sm:mb-2">
                        {loyaltyStats.loyaltyPoints}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Loyalty Points
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-lg sm:text-xl">
                      <span>Membership Status</span>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        {loyaltyStats.membershipLevel}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base">
                          Progress to Platinum
                        </span>
                        <span className="text-sm sm:text-base font-medium">
                          75%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-kanxa-blue h-2 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Spend NPR 55,000 more to reach Platinum status and
                        unlock exclusive benefits!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent
                value="settings"
                className="space-y-4 sm:space-y-6 mt-4 sm:mt-6"
              >
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          Booking Updates
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Receive notifications about your bookings
                        </p>
                      </div>
                      <Switch
                        checked={notifications.bookingUpdates}
                        onCheckedChange={(checked) => {
                          const newSettings = {
                            ...notifications,
                            bookingUpdates: checked,
                          };
                          setNotifications(newSettings);
                          saveNotificationSettings(newSettings);
                        }}
                        className="flex-shrink-0"
                      />
                    </div>
                    <Separator />
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          Promotional Offers
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Get notified about special deals and discounts
                        </p>
                      </div>
                      <Switch
                        checked={notifications.promotions}
                        onCheckedChange={(checked) => {
                          const newSettings = {
                            ...notifications,
                            promotions: checked,
                          };
                          setNotifications(newSettings);
                          saveNotificationSettings(newSettings);
                        }}
                        className="flex-shrink-0"
                      />
                    </div>
                    <Separator />
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          Service Reminders
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Reminders for scheduled services and maintenance
                        </p>
                      </div>
                      <Switch
                        checked={notifications.serviceReminders}
                        onCheckedChange={(checked) => {
                          const newSettings = {
                            ...notifications,
                            serviceReminders: checked,
                          };
                          setNotifications(newSettings);
                          saveNotificationSettings(newSettings);
                        }}
                        className="flex-shrink-0"
                      />
                    </div>
                    <Separator />
                    <div className="flex items-start sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm sm:text-base">
                          Newsletter
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Monthly newsletter with updates and tips
                        </p>
                      </div>
                      <Switch
                        checked={notifications.newsletter}
                        onCheckedChange={(checked) => {
                          const newSettings = {
                            ...notifications,
                            newsletter: checked,
                          };
                          setNotifications(newSettings);
                          saveNotificationSettings(newSettings);
                        }}
                        className="flex-shrink-0"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">
                      Account Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs sm:text-sm h-auto py-2 sm:py-2.5"
                    >
                      <Shield className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs sm:text-sm h-auto py-2 sm:py-2.5"
                    >
                      <CreditCard className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Manage Payment Methods
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs sm:text-sm h-auto py-2 sm:py-2.5"
                    >
                      <Mail className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Update Email Address
                    </Button>
                    <Separator />
                    <Button
                      variant="destructive"
                      className="w-full justify-start text-xs sm:text-sm h-auto py-2 sm:py-2.5"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
}
