import { useState } from "react";
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
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/layout/Layout";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+977-XXX-XXXXXX",
    address: "Lamjung, Nepal",
    company: "ABC Construction",
    dateJoined: "2023-01-15",
    bio: "Regular customer of Kanxa Safari services. Primarily use transportation and construction materials."
  });

  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    promotions: false,
    serviceReminders: true,
    newsletter: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
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
      fileInputRef.current.value = '';
    }
  };

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      description: "Bus booking confirmed - Lamjung to Kathmandu",
      date: "2024-01-20",
      status: "completed"
    },
    {
      id: 2,
      type: "order",
      description: "Construction materials order #ORD-2024-001",
      date: "2024-01-18",
      status: "delivered"
    },
    {
      id: 3,
      type: "service",
      description: "Garage appointment scheduled for tractor service",
      date: "2024-01-22",
      status: "upcoming"
    }
  ];

  const loyaltyStats = {
    totalBookings: 15,
    totalOrders: 8,
    totalSpent: 245000,
    loyaltyPoints: 1250,
    membershipLevel: "Gold"
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden group cursor-pointer"
                   onClick={handleProfilePictureClick}>
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              {profilePicture && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProfilePicture();
                  }}
                >
                  ×
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={handleProfilePictureClick}
            >
              <Upload className="mr-2 h-4 w-4" />
              {profilePicture ? 'Change Photo' : 'Upload Photo'}
            </Button>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              My Profile
            </h1>
            <p className="text-xl text-white/90">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-12">
        <div className="container px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Profile Picture Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden group cursor-pointer border-2 border-gray-200"
                             onClick={handleProfilePictureClick}>
                          {profilePicture ? (
                            <img
                              src={profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-10 w-10 text-gray-400" />
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        {profilePicture && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProfilePicture();
                            }}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">Upload a new profile picture</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          JPG, PNG or GIF. Maximum file size is 5MB.
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleProfilePictureClick}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {profilePicture ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                          {profilePicture && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={removeProfilePicture}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Information */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Personal Information</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        >
                          {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
                          {isEditing ? "Save" : "Edit"}
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={profile.name}
                              onChange={(e) => setProfile({...profile, name: e.target.value})}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profile.email}
                              onChange={(e) => setProfile({...profile, email: e.target.value})}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={profile.phone}
                              onChange={(e) => setProfile({...profile, phone: e.target.value})}
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <Label htmlFor="company">Company</Label>
                            <Input
                              id="company"
                              value={profile.company}
                              onChange={(e) => setProfile({...profile, company: e.target.value})}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={profile.address}
                            onChange={(e) => setProfile({...profile, address: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                            disabled={!isEditing}
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Profile Summary */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-kanxa-blue" />
                          <div>
                            <p className="text-sm text-gray-600">Member Since</p>
                            <p className="font-medium">{profile.dateJoined}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-kanxa-orange" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium">{profile.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-kanxa-green" />
                          <div>
                            <p className="text-sm text-gray-600">Email Verified</p>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full justify-start" variant="outline">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Payment Methods
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Shield className="mr-2 h-4 w-4" />
                          Security Settings
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              activity.type === 'booking' ? 'bg-kanxa-light-blue' :
                              activity.type === 'order' ? 'bg-kanxa-light-orange' :
                              'bg-kanxa-light-green'
                            }`}>
                              {activity.type === 'booking' && <Calendar className="h-5 w-5 text-kanxa-blue" />}
                              {activity.type === 'order' && <CreditCard className="h-5 w-5 text-kanxa-orange" />}
                              {activity.type === 'service' && <Settings className="h-5 w-5 text-kanxa-green" />}
                            </div>
                            <div>
                              <p className="font-medium">{activity.description}</p>
                              <p className="text-sm text-gray-600">{activity.date}</p>
                            </div>
                          </div>
                          <Badge className={
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loyalty" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-kanxa-blue mb-2">{loyaltyStats.totalBookings}</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-kanxa-orange mb-2">{loyaltyStats.totalOrders}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-kanxa-green mb-2">NPR {loyaltyStats.totalSpent.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Spent</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center">
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold text-kanxa-navy mb-2">{loyaltyStats.loyaltyPoints}</div>
                      <div className="text-sm text-gray-600">Loyalty Points</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Membership Status
                      <Badge className="bg-yellow-100 text-yellow-800">{loyaltyStats.membershipLevel}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Progress to Platinum</span>
                        <span>75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-kanxa-blue h-2 rounded-full w-3/4"></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Spend NPR 55,000 more to reach Platinum status and unlock exclusive benefits!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Booking Updates</p>
                        <p className="text-sm text-gray-600">Receive notifications about your bookings</p>
                      </div>
                      <Switch
                        checked={notifications.bookingUpdates}
                        onCheckedChange={(checked) => setNotifications({...notifications, bookingUpdates: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotional Offers</p>
                        <p className="text-sm text-gray-600">Get notified about special deals and discounts</p>
                      </div>
                      <Switch
                        checked={notifications.promotions}
                        onCheckedChange={(checked) => setNotifications({...notifications, promotions: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Service Reminders</p>
                        <p className="text-sm text-gray-600">Reminders for scheduled services and maintenance</p>
                      </div>
                      <Switch
                        checked={notifications.serviceReminders}
                        onCheckedChange={(checked) => setNotifications({...notifications, serviceReminders: checked})}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-gray-600">Monthly newsletter with updates and tips</p>
                      </div>
                      <Switch
                        checked={notifications.newsletter}
                        onCheckedChange={(checked) => setNotifications({...notifications, newsletter: checked})}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Manage Payment Methods
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="mr-2 h-4 w-4" />
                      Update Email Address
                    </Button>
                    <Separator />
                    <Button variant="destructive" className="w-full justify-start">
                      <LogOut className="mr-2 h-4 w-4" />
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
