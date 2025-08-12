import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Save, Bell, Shield, CreditCard, Settings, LogOut, Camera, Upload, X
} from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});
type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Data Fetching with React Query ---
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => (await userAPI.getProfile()).user,
  });

  const { data: activityData, isLoading: isActivityLoading } = useQuery({
    queryKey: ['activity'],
    queryFn: async () => (await userAPI.getActivity()).activity,
    initialData: [],
  });

  const { data: loyaltyData, isLoading: isLoyaltyLoading } = useQuery({
    queryKey: ['loyalty'],
    queryFn: async () => (await userAPI.getLoyalty()).loyalty,
    initialData: { totalBookings: 0, totalOrders: 0, totalSpent: 0, loyaltyPoints: 0, membershipLevel: "Bronze" },
  });

  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await userAPI.getNotifications()).notifications,
    initialData: { bookingUpdates: true, promotions: false, serviceReminders: true, newsletter: true },
  });

  // --- Mutations (Updating Data) ---
  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data.user);
      toast({ title: "Success", description: "Profile updated successfully." });
      setIsEditing(false);
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: userAPI.updateNotifications,
    onSuccess: (data) => {
      queryClient.setQueryData(['notifications'], data.notifications);
      toast({ title: "Preferences Saved", description: "Your notification settings have been updated." });
    },
    onError: (error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });


  // --- Form Handling ---
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { // Pre-populate form with fetched data
      name: profileData?.name || '',
      email: profileData?.email || '',
      phone: profileData?.phone || '',
      address: profileData?.address || '',
      company: profileData?.company || '',
      bio: profileData?.bio || '',
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    const updatedNotifications = { ...notifications, [key]: value };
    updateNotificationsMutation.mutate(updatedNotifications);
  };

  // --- UI and Render Logic ---
  const getInitials = (name: string = "") => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const isLoading = isProfileLoading || isActivityLoading || isLoyaltyLoading || isNotificationsLoading;
  
  if (isLoading) {
    return <Layout><div className="container py-12"><Skeleton className="h-96 w-full" /></div></Layout>
  }

  return (
    <Layout>
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-12">
        <div className="container text-center">
            <img src={profileData?.avatarUrl || `https://ui-avatars.com/api/?name=${profileData?.name}&background=random`} alt="Profile" className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-2 border-white/30"/>
            <h1 className="text-4xl font-bold">{profileData?.name}</h1>
            <p className="text-xl text-white/90">Manage your account settings and preferences</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6 mt-6">
                <form onSubmit={handleSubmit(onProfileSubmit)}>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                          <CardTitle>Personal Information</CardTitle>
                          {isEditing ? (
                              <div className="flex gap-2">
                                  <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditing(false); reset(profileData); }}>
                                      <X className="mr-2 h-4 w-4" /> Cancel
                                  </Button>
                                  <Button type="submit" size="sm" disabled={updateProfileMutation.isPending}>
                                      <Save className="mr-2 h-4 w-4" /> {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                                  </Button>
                              </div>
                          ) : (
                              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                              </Button>
                          )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div><Label htmlFor="name">Full Name</Label><Input id="name" {...register("name")} disabled={!isEditing} />{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}</div>
                              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} disabled /></div>
                              <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" {...register("phone")} disabled={!isEditing} /></div>
                              <div><Label htmlFor="company">Company</Label><Input id="company" {...register("company")} disabled={!isEditing} /></div>
                          </div>
                          <div><Label htmlFor="address">Address</Label><Input id="address" {...register("address")} disabled={!isEditing} /></div>
                          <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" {...register("bio")} disabled={!isEditing} rows={3} className="resize-none" /></div>
                      </CardContent>
                    </Card>
                </form>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <Card>
                    <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {activityData.map((activity: any) => (
                          <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">{activity.type === "booking" ? <Calendar className="h-5 w-5 text-kanxa-blue" /> : <CreditCard className="h-5 w-5 text-kanxa-orange" />}</div><div><p className="font-medium">{activity.description}</p><p className="text-sm text-gray-600">{activity.date}</p></div></div>
                              <Badge className={`${activity.status === "completed" || activity.status === "delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{activity.status}</Badge>
                          </div>
                        ))}
                    </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loyalty" className="space-y-6 mt-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-blue mb-2">{loyaltyData.totalBookings}</div><div className="text-sm text-gray-600">Total Bookings</div></CardContent></Card>
                      <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-orange mb-2">{loyaltyData.totalOrders}</div><div className="text-sm text-gray-600">Total Orders</div></CardContent></Card>
                      <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-green mb-2">NPR {loyaltyData.totalSpent.toLocaleString()}</div><div className="text-sm text-gray-600">Total Spent</div></CardContent></Card>
                      <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-navy mb-2">{loyaltyData.loyaltyPoints}</div><div className="text-sm text-gray-600">Loyalty Points</div></CardContent></Card>
                  </div>
                  <Card>
                      <CardHeader><CardTitle className="flex items-center gap-2">Membership Status <Badge className="bg-yellow-100 text-yellow-800">{loyaltyData.membershipLevel}</Badge></CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-gray-600">You are making great progress towards the next level!</p></CardContent>
                  </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                  <Card>
                      <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex items-center justify-between"><div className="flex-1"><p className="font-medium">Booking Updates</p><p className="text-sm text-gray-600">Receive notifications about your bookings</p></div><Switch checked={notifications.bookingUpdates} onCheckedChange={(checked) => handleNotificationChange('bookingUpdates', checked)} /></div>
                          <Separator />
                          <div className="flex items-center justify-between"><div className="flex-1"><p className="font-medium">Promotional Offers</p><p className="text-sm text-gray-600">Get notified about special deals</p></div><Switch checked={notifications.promotions} onCheckedChange={(checked) => handleNotificationChange('promotions', checked)} /></div>
                          <Separator />
                          <div className="flex items-center justify-between"><div className="flex-1"><p className="font-medium">Service Reminders</p><p className="text-sm text-gray-600">Reminders for scheduled services</p></div><Switch checked={notifications.serviceReminders} onCheckedChange={(checked) => handleNotificationChange('serviceReminders', checked)} /></div>
                          <Separator />
                          <div className="flex items-center justify-between"><div className="flex-1"><p className="font-medium">Newsletter</p><p className="text-sm text-gray-600">Monthly newsletter with updates</p></div><Switch checked={notifications.newsletter} onCheckedChange={(checked) => handleNotificationChange('newsletter', checked)} /></div>
                      </CardContent>
                  </Card>
              </TabsContent>
            </Tabs>
        </div>
      </section>
    </Layout>
  );
}