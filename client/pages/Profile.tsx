// import { useState, useRef, useEffect } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { userAPI, authAPI } from "@/services/api";
// import { useToast } from "@/hooks/use-toast";
// import Layout from "@/components/layout/Layout";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";
// import { Switch } from "@/components/ui/switch";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   Edit,
//   Save,
//   Bell,
//   Shield,
//   CreditCard,
//   Settings,
//   LogOut,
//   Camera,
//   Upload,
//   X,
//   CheckCircle,
//   KeyRound,
//   Loader2,
// } from "lucide-react";

// // Schemas for form validation
// const profileSchema = z.object({
//   name: z.string().min(2, "Name must be at least 2 characters."),
//   email: z.string().email(),
//   phone: z.string().optional(),
//   address: z.string().optional(),
//   company: z.string().optional(),
//   bio: z.string().optional(),
// });

// const passwordSchema = z
//   .object({
//     currentPassword: z.string().min(1, "Current password is required."),
//     newPassword: z.string().min(6, "New password must be at least 6 characters."),
//     confirmPassword: z.string().min(1, "Please confirm your password."),
//   })
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   });

// const emailVerificationSchema = z.object({
//   email: z.string().email("Please enter a valid email address."),
// });

// type ProfileFormData = z.infer<typeof profileSchema>;
// type PasswordFormData = z.infer<typeof passwordSchema>;
// type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

// export default function Profile() {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const [isEditing, setIsEditing] = useState(false);
//   const [verificationCode, setVerificationCode] = useState("");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // --- Data Fetching with React Query ---
//   const { data: profileData, isLoading: isProfileLoading } = useQuery({
//     queryKey: ["profile"],
//     queryFn: async () => (await userAPI.getProfile()).user,
//   });

//   const { data: activityData, isLoading: isActivityLoading } = useQuery({
//     queryKey: ["activity"],
//     queryFn: async () => (await userAPI.getActivity()).activity,
//     initialData: [],
//   });

//   const { data: loyaltyData, isLoading: isLoyaltyLoading } = useQuery({
//     queryKey: ["loyalty"],
//     queryFn: async () => (await userAPI.getLoyalty()).loyalty,
//     initialData: {
//       totalBookings: 0,
//       totalOrders: 0,
//       totalSpent: 0,
//       loyaltyPoints: 0,
//       membershipLevel: "Bronze",
//     },
//   });

//   const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
//     queryKey: ["notifications"],
//     queryFn: async () => (await userAPI.getNotifications()).notifications,
//     initialData: {
//       bookingUpdates: true,
//       promotions: false,
//       serviceReminders: true,
//       newsletter: true,
//     },
//   });

//   // --- Mutations (Updating Data) ---
  
//   // *** FIX #1: Correct mutation handler for instant UI update ***
//   const uploadPictureMutation = useMutation({
//     mutationFn: (file: File) => {
//       const formData = new FormData();
//       formData.append('profilePicture', file);
//       return userAPI.uploadProfilePicture(formData);
//     },
//     onSuccess: (data) => {
//       const updatedUser = data.user;
//       if (updatedUser) {
//         // Manually update React Query's cache. This is what makes the image appear instantly.
//         queryClient.setQueryData(['profile'], updatedUser);
//         toast({ title: "Success", description: "Profile picture updated." });
//       }
//     },
//     onError: (error: any) => {
//       toast({
//         title: "Upload Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const updateProfileMutation = useMutation({
//     mutationFn: userAPI.updateProfile,
//     onSuccess: (data) => {
//       queryClient.setQueryData(["profile"], data.user);
//       toast({ title: "Success", description: "Profile updated successfully." });
//       setIsEditing(false);
//     },
//     onError: (error: any) =>
//       toast({ title: "Error", description: error.message, variant: "destructive" }),
//   });

//   const passwordMutation = useMutation({
//     mutationFn: authAPI.changePassword,
//     onSuccess: () => {
//       toast({ title: "Success", description: "Your password has been changed." });
//       resetPassword();
//     },
//     onError: (error: any) =>
//       toast({ title: "Error", description: error.message, variant: "destructive" }),
//   });

//   const sendVerificationMutation = useMutation({
//     mutationFn: authAPI.sendVerificationEmail,
//     onSuccess: (data) => toast({ title: "Code Sent", description: data.message }),
//     onError: (error: any) =>
//       toast({ title: "Error", description: error.message, variant: "destructive" }),
//   });

//   const verifyCodeMutation = useMutation({
//     mutationFn: (code: string) => authAPI.verifyEmailCode(code), // Pass code directly
//     onSuccess: (data) => {
//       toast({ title: "Success!", description: "Email verified successfully." });
//       queryClient.invalidateQueries({ queryKey: ["profile"] }); // Refetch profile to update status
//       setVerificationCode("");
//     },
//     onError: (error: any) =>
//       toast({ title: "Error", description: error.message, variant: "destructive" }),
//   });

//   const updateNotificationsMutation = useMutation({
//     mutationFn: userAPI.updateNotifications,
//     onSuccess: (data) => {
//       queryClient.setQueryData(["notifications"], data.notifications);
//       toast({
//         title: "Preferences Saved",
//         description: "Your notification settings have been updated.",
//       });
//     },
//     onError: (error: any) =>
//       toast({ title: "Error", description: error.message, variant: "destructive" }),
//   });

//   // --- Form Handling ---
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<ProfileFormData>({
//     resolver: zodResolver(profileSchema),
//   });

//   useEffect(() => {
//     if (profileData) {
//       reset(profileData);
//     }
//   }, [profileData, reset]);

//   const {
//     register: registerPassword,
//     handleSubmit: handlePasswordSubmit,
//     formState: { errors: passwordErrors },
//     reset: resetPassword,
//   } = useForm<PasswordFormData>({
//     resolver: zodResolver(passwordSchema),
//   });

//   const {
//     register: registerEmail,
//     handleSubmit: handleEmailSubmit,
//     formState: { errors: emailErrors },
//   } = useForm<EmailVerificationFormData>({
//     resolver: zodResolver(emailVerificationSchema),
//     defaultValues: {
//       email: profileData?.email || "",
//     },
//   });

//   // --- Event Handlers ---
//   const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       uploadPictureMutation.mutate(file);
//     }
//   };

//   const handleProfilePictureClick = () => {
//     fileInputRef.current?.click();
//   };

//   const onProfileSubmit = (data: ProfileFormData) => {
//     updateProfileMutation.mutate(data);
//   };

//   const onPasswordChange = (data: PasswordFormData) => {
//     passwordMutation.mutate({
//       currentPassword: data.currentPassword,
//       newPassword: data.newPassword,
//     });
//   };

//   const onEmailVerificationSubmit = () => {
//     sendVerificationMutation.mutate();
//   };

//   const handleNotificationChange = (key: string, value: boolean) => {
//     if (notifications) {
//       const updatedNotifications = { ...notifications, [key]: value };
//       updateNotificationsMutation.mutate(updatedNotifications);
//     }
//   };

//   const handleVerifyCode = () => {
//       verifyCodeMutation.mutate(verificationCode);
//   }

//   // --- Render Logic ---
//   const isLoading =
//     isProfileLoading ||
//     isActivityLoading ||
//     isLoyaltyLoading ||
//     isNotificationsLoading;

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="container py-12">
//           <Skeleton className="h-96 w-full" />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-12">
//         <div className="container text-center">
//           <div className="relative w-24 h-24 mx-auto mb-4 group">
            
//             {/* *** FIX #2: Correctly build the image src URL *** */}
//             <img
//               key={profileData?.profilePicture} // Force re-render when the image path changes
//               src={
//                 profileData?.profilePicture
//                   ? `http://localhost:5000${profileData.profilePicture}` // Build the full, working URL
//                   : `https://ui-avatars.com/api/?name=${profileData?.name || 'U'}&background=random`
//               }
//               alt="Profile"
//               className="w-24 h-24 object-cover rounded-full border-2 border-white/30"
//             />
            
//             <button
//               onClick={handleProfilePictureClick}
//               className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
//               aria-label="Upload new profile picture"
//               disabled={uploadPictureMutation.isPending}
//             >
//               {uploadPictureMutation.isPending ? (
//                 <Loader2 className="h-8 w-8 text-white animate-spin" />
//               ) : (
//                 <Camera className="h-8 w-8 text-white" />
//               )}
//             </button>
//           </div>
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={handleFileSelect}
//             accept="image/png, image/jpeg, image/gif"
//             className="hidden"
//           />
//           <h1 className="text-4xl font-bold">{profileData?.name}</h1>
//           <p className="text-xl text-white/90">
//             Manage your account settings and preferences
//           </p>
//         </div>
//       </section>

//       <section className="py-12">
//         <div className="container max-w-6xl mx-auto">
//           <Tabs defaultValue="profile" className="w-full">
//             <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
//               <TabsTrigger value="profile">Profile</TabsTrigger>
//               <TabsTrigger value="activity">Activity</TabsTrigger>
//               <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
//               <TabsTrigger value="settings">Settings</TabsTrigger>
//             </TabsList>

//             <TabsContent value="profile" className="space-y-6 mt-6">
//               <form onSubmit={handleSubmit(onProfileSubmit)}>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle>Personal Information</CardTitle>
//                     {isEditing ? (
//                       <div className="flex gap-2">
//                         <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditing(false); reset(profileData); }}>
//                           <X className="mr-2 h-4 w-4" /> Cancel
//                         </Button>
//                         <Button type="submit" size="sm" disabled={updateProfileMutation.isPending}>
//                           <Save className="mr-2 h-4 w-4" />{" "}
//                           {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
//                         </Button>
//                       </div>
//                     ) : (
//                       <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
//                         <Edit className="mr-2 h-4 w-4" /> Edit
//                       </Button>
//                     )}
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div><Label htmlFor="name">Full Name</Label><Input id="name" {...register("name")} disabled={!isEditing} />{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}</div>
//                       <div><Label htmlFor="email">Email</Label><Input id="email" type="email" {...register("email")} disabled /></div>
//                       <div><Label htmlFor="phone">Phone Number</Label><Input id="phone" {...register("phone")} disabled={!isEditing} /></div>
//                       <div><Label htmlFor="company">Company</Label><Input id="company" {...register("company")} disabled={!isEditing} /></div>
//                     </div>
//                     <div><Label htmlFor="address">Address</Label><Input id="address" {...register("address")} disabled={!isEditing} /></div>
//                     <div><Label htmlFor="bio">Bio</Label><Textarea id="bio" {...register("bio")} disabled={!isEditing} rows={3} className="resize-none" /></div>
//                   </CardContent>
//                 </Card>
//               </form>
//             </TabsContent>

//             <TabsContent value="activity" className="mt-6">
//               <Card>
//                 <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
//                 <CardContent className="space-y-4">
//                   {activityData.map((activity: any) => (
//                     <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
//                       <div className="flex items-center gap-4">
//                         <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">{activity.type === "booking" ? <Calendar className="h-5 w-5 text-kanxa-blue" /> : <CreditCard className="h-5 w-5 text-kanxa-orange" />}</div>
//                         <div><p className="font-medium">{activity.description}</p><p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p></div>
//                       </div>
//                       <Badge className={`${activity.status === "completed" || activity.status === "delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{activity.status}</Badge>
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="loyalty" className="space-y-6 mt-6">
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
//                 <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-blue mb-2">{loyaltyData.totalBookings}</div><div className="text-sm text-gray-600">Total Bookings</div></CardContent></Card>
//                 <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-orange mb-2">{loyaltyData.totalOrders}</div><div className="text-sm text-gray-600">Total Orders</div></CardContent></Card>
//                 <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-green mb-2">NPR {loyaltyData.totalSpent.toLocaleString()}</div><div className="text-sm text-gray-600">Total Spent</div></CardContent></Card>
//                 <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-navy mb-2">{loyaltyData.loyaltyPoints}</div><div className="text-sm text-gray-600">Loyalty Points</div></CardContent></Card>
//               </div>
//               <Card>
//                 <CardHeader><CardTitle className="flex items-center gap-2">Membership Status<Badge className="bg-yellow-100 text-yellow-800">{loyaltyData.membershipLevel}</Badge></CardTitle></CardHeader>
//                 <CardContent><p className="text-sm text-gray-600">You are making great progress towards the next level!</p></CardContent>
//               </Card>
//             </TabsContent>

//             <TabsContent value="settings" className="space-y-6 mt-6">
//               <Card>
//                 <CardHeader><CardTitle>Email Verification</CardTitle><CardDescription>Verify your email address to secure your account.</CardDescription></CardHeader>
//                 <CardContent>
//                   {profileData?.isEmailVerified ? (
//                     <div className="flex items-center gap-2 text-green-600 font-medium mb-4"><CheckCircle className="h-5 w-5" /><span>Your email is verified.</span></div>
//                   ) : (
//                     <div className="space-y-4">
//                       <form onSubmit={handleEmailSubmit(onEmailVerificationSubmit)} className="space-y-4">
//                         <Button type="submit" disabled={sendVerificationMutation.isPending} className="w-full sm:w-auto">
//                           {sendVerificationMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending...</> : <><Mail className="mr-2 h-4 w-4" />Send Verification Code</>}
//                         </Button>
//                       </form>
//                       <div className="space-y-4 pt-4 border-t">
//                         <Label htmlFor="verificationCode">Verification Code</Label>
//                         <div className="flex items-center gap-4">
//                           <Input id="verificationCode" placeholder="Enter 6-digit code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} disabled={verifyCodeMutation.isPending}/>
//                           <Button onClick={handleVerifyCode} disabled={verifyCodeMutation.isPending || verificationCode.length < 6}>
//                             {verifyCodeMutation.isPending ? <Loader2 className="animate-spin" /> : "Verify"}
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>For your security, we recommend choosing a strong password.</CardDescription></CardHeader>
//                 <CardContent>
//                   <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-4">
//                     <div><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />{passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>}</div>
//                     <div><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" {...registerPassword("newPassword")} />{passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>}</div>
//                     <div><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} />{passwordErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>}</div>
//                     <Button type="submit" disabled={passwordMutation.isPending}>
//                       {passwordMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <KeyRound className="mr-2 h-4 w-4" />}Update Password
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
//                 <CardContent className="space-y-4">
//                   {notifications && Object.entries(notifications).map(([key, value]) =>(
//                      <div key={key} className="flex items-center justify-between">
//                        <div className="flex-1">
//                         <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
//                        </div>
//                        <Switch checked={value as boolean} onCheckedChange={(checked) => handleNotificationChange(key, checked)} />
//                      </div>
//                   ))}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>
//     </Layout>
//   );
// }








import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { userAPI, authAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
  X,
  CheckCircle,
  KeyRound,
  Loader2,
} from "lucide-react";

// --- Schemas for form validation ---
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(6, "New password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const emailVerificationSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;
type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Data Fetching ---
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => (await userAPI.getProfile()).user,
  });

  const { data: activityData, isLoading: isActivityLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: async () => (await userAPI.getActivity()).activity,
    initialData: [],
  });

  const { data: loyaltyData, isLoading: isLoyaltyLoading } = useQuery({
    queryKey: ["loyalty"],
    queryFn: async () => (await userAPI.getLoyalty()).loyalty,
    initialData: { totalBookings: 0, totalOrders: 0, totalSpent: 0, loyaltyPoints: 0, membershipLevel: "Bronze" },
  });

  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => (await userAPI.getNotifications()).notifications,
    initialData: { bookingUpdates: true, promotions: false, serviceReminders: true, newsletter: true },
  });

  // --- Mutations ---
  const uploadPictureMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('profilePicture', file);
      return userAPI.uploadProfilePicture(formData);
    },
    onSuccess: (data) => {
      const updatedUser = data.user;
      if (updatedUser) {
        queryClient.setQueryData(['profile'], updatedUser);
        toast({ title: "Success", description: "Profile picture updated." });
      }
    },
    onError: (error: any) => toast({ title: "Upload Failed", description: error.message, variant: "destructive" }),
  });

  const updateProfileMutation = useMutation({
    mutationFn: userAPI.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data.user);
      toast({ title: "Success", description: "Profile updated successfully." });
      setIsEditing(false);
    },
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const passwordMutation = useMutation({
    mutationFn: authAPI.changePassword,
    onSuccess: () => {
      toast({ title: "Success", description: "Your password has been changed." });
      resetPassword();
    },
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const sendVerificationMutation = useMutation({
    mutationFn: authAPI.sendVerificationEmail,
    onSuccess: (data) => toast({ title: "Code Sent", description: data.message }),
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const verifyCodeMutation = useMutation({
    mutationFn: (code: string) => authAPI.verifyEmailCode(code),
    onSuccess: () => {
      toast({ title: "Success!", description: "Email verified successfully." });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setVerificationCode("");
    },
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: userAPI.updateNotifications,
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications"], data.notifications);
      toast({ title: "Preferences Saved", description: "Your notification settings have been updated." });
    },
    onError: (error: any) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  // --- Form Handling ---
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  // *** THE FIX FOR THE EMAIL VERIFICATION FORM ***
  const { handleSubmit: handleEmailSubmit, setValue } = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
  });

  // This useEffect ensures all forms are populated when the user data is fetched.
  useEffect(() => {
    if (profileData) {
      reset(profileData); // Populates the main profile form
      setValue('email', profileData.email); // Specifically populates the email verification form
    }
  }, [profileData, reset, setValue]);

  // --- Event Handlers ---
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPictureMutation.mutate(file);
    }
  };

  const handleProfilePictureClick = () => fileInputRef.current?.click();
  const onProfileSubmit = (data: ProfileFormData) => updateProfileMutation.mutate(data);
  const onPasswordChange = (data: PasswordFormData) => passwordMutation.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  
  // This function is now correctly called by the form's `onSubmit`.
  const onEmailVerificationSubmit = () => {
    sendVerificationMutation.mutate();
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    if (notifications) {
      updateNotificationsMutation.mutate({ ...notifications, [key]: value });
    }
  };

  const handleVerifyCode = () => verifyCodeMutation.mutate(verificationCode);

  // --- Render Logic ---
  const isLoading = isProfileLoading || isActivityLoading || isLoyaltyLoading || isNotificationsLoading;

  if (isLoading) {
    return <Layout><div className="container py-12"><Skeleton className="h-96 w-full" /></div></Layout>;
  }

  return (
    <Layout>
      <section className="bg-gradient-to-r from-kanxa-blue to-kanxa-navy text-white py-12">
        <div className="container text-center">
          <div className="relative w-24 h-24 mx-auto mb-4 group">
            <img
              key={profileData?.profilePicture}
              src={profileData?.profilePicture ? `http://localhost:5000${profileData.profilePicture}` : `https://ui-avatars.com/api/?name=${profileData?.name || 'U'}&background=random`}
              alt="Profile"
              className="w-24 h-24 object-cover rounded-full border-2 border-white/30"
            />
            <button onClick={handleProfilePictureClick} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" aria-label="Upload new profile picture" disabled={uploadPictureMutation.isPending}>
              {uploadPictureMutation.isPending ? <Loader2 className="h-8 w-8 text-white animate-spin" /> : <Camera className="h-8 w-8 text-white" />}
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/png, image/jpeg, image/gif" className="hidden" />
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

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6 mt-6">
              <form onSubmit={handleSubmit(onProfileSubmit)}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    {isEditing ? (
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => { setIsEditing(false); reset(profileData); }}><X className="mr-2 h-4 w-4" /> Cancel</Button>
                        <Button type="submit" size="sm" disabled={updateProfileMutation.isPending}><Save className="mr-2 h-4 w-4" /> {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}</Button>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>
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

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {activityData && activityData.length > 0 ? activityData.map((activity: any) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">{activity.type === "booking" ? <Calendar className="h-5 w-5 text-kanxa-blue" /> : <CreditCard className="h-5 w-5 text-kanxa-orange" />}</div>
                        <div><p className="font-medium">{activity.description}</p><p className="text-sm text-gray-600">{new Date(activity.date).toLocaleDateString()}</p></div>
                      </div>
                      <Badge className={`${activity.status === "completed" || activity.status === "delivered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{activity.status}</Badge>
                    </div>
                  )) : <p>No recent activity found.</p>}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Loyalty Tab */}
            <TabsContent value="loyalty" className="space-y-6 mt-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-blue mb-2">{loyaltyData?.totalBookings}</div><div className="text-sm text-gray-600">Total Bookings</div></CardContent></Card>
                <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-orange mb-2">{loyaltyData?.totalOrders}</div><div className="text-sm text-gray-600">Total Orders</div></CardContent></Card>
                <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-green mb-2">NPR {loyaltyData?.totalSpent.toLocaleString()}</div><div className="text-sm text-gray-600">Total Spent</div></CardContent></Card>
                <Card className="text-center"><CardContent className="p-6"><div className="text-3xl font-bold text-kanxa-navy mb-2">{loyaltyData?.loyaltyPoints}</div><div className="text-sm text-gray-600">Loyalty Points</div></CardContent></Card>
              </div>
              <Card><CardHeader><CardTitle className="flex items-center gap-2">Membership Status<Badge className="bg-yellow-100 text-yellow-800">{loyaltyData?.membershipLevel}</Badge></CardTitle></CardHeader><CardContent><p className="text-sm text-gray-600">You are making great progress towards the next level!</p></CardContent></Card>
            </TabsContent>
            
            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6 mt-6">
              <Card>
                <CardHeader><CardTitle>Email Verification</CardTitle><CardDescription>Verify your email address to secure your account.</CardDescription></CardHeader>
                <CardContent>
                  {profileData?.isEmailVerified ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium mb-4"><CheckCircle className="h-5 w-5" /><span>Your email is verified.</span></div>
                  ) : (
                    <div className="space-y-4">
                      {/* THE CORRECTED FORM SUBMISSION */}
                      <form onSubmit={handleEmailSubmit(onEmailVerificationSubmit)}>
                        <Button type="submit" disabled={sendVerificationMutation.isPending} className="w-full sm:w-auto">
                          {sendVerificationMutation.isPending ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Sending...</> : <><Mail className="mr-2 h-4 w-4" />Send Verification Code</>}
                        </Button>
                      </form>
                      <div className="space-y-4 pt-4 border-t">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <div className="flex items-center gap-4">
                          <Input id="verificationCode" placeholder="Enter 6-digit code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} maxLength={6} disabled={verifyCodeMutation.isPending}/>
                          <Button onClick={handleVerifyCode} disabled={verifyCodeMutation.isPending || verificationCode.length < 6}>
                            {verifyCodeMutation.isPending ? <Loader2 className="animate-spin" /> : "Verify"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Change Password</CardTitle><CardDescription>For your security, we recommend choosing a strong password.</CardDescription></CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit(onPasswordChange)} className="space-y-4">
                    <div><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" {...registerPassword("currentPassword")} />{passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword.message}</p>}</div>
                    <div><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" {...registerPassword("newPassword")} />{passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword.message}</p>}</div>
                    <div><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" {...registerPassword("confirmPassword")} />{passwordErrors.confirmPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>}</div>
                    <Button type="submit" disabled={passwordMutation.isPending}>
                      {passwordMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <KeyRound className="mr-2 h-4 w-4" />}Update Password
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {notifications && Object.entries(notifications).map(([key, value]) =>(
                     <div key={key} className="flex items-center justify-between">
                       <div className="flex-1">
                        <p className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                       </div>
                       <Switch checked={value as boolean} onCheckedChange={(checked) => handleNotificationChange(key, checked)} />
                     </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}