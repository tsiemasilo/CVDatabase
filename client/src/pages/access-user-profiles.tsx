import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Users, Shield, UserCheck, Search, Eye, Settings, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import type { UserProfile, InsertUserProfile } from "@shared/schema";



export default function AccessUserProfiles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { permissions, hasPermission } = useRoleAccess();
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user" as 'admin' | 'manager' | 'user',
    firstName: "",
    lastName: "",
    department: "",
    position: "",
    phoneNumber: "",
  });

  // Fetch user profiles from API
  const { data: userProfiles = [], isLoading, error } = useQuery({
    queryKey: ["/api/user-profiles", { search: searchTerm, role: selectedRole }],
    queryFn: async ({ queryKey }) => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedRole && selectedRole !== "all") params.append("role", selectedRole);
      
      const url = `/api/user-profiles${params.toString() ? `?${params.toString()}` : ''}`;
      console.log("Making API call to:", url);
      
      const res = await fetch(url, {
        credentials: "include",
      });
      
      if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }
      
      const result = await res.json();
      console.log("Fetched user profiles:", result);
      return result;
    },
  });

  // Check if user has permission to access this page - after all hooks are called
  if (!permissions.canAccessUserProfiles) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access user profiles.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    console.error("Query error:", error);
  }

  // Create user profile mutation
  const createUserMutation = useMutation({
    mutationFn: async (data: InsertUserProfile) => {
      const response = await apiRequest("POST", "/api/user-profiles", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles"] });
      toast({ title: "Success", description: "User profile created successfully" });
      setIsAddModalOpen(false);
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "user",
        firstName: "",
        lastName: "",
        department: "",
        position: "",
        phoneNumber: "",
      });
    },
    onError: (error: any) => {
      console.error("Frontend mutation error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to create user profile", 
        variant: "destructive" 
      });
    },
  });

  // Delete user profile mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/user-profiles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles"] });
      toast({ title: "Success", description: "User profile deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete user profile", variant: "destructive" });
    },
  });

  // Update user profile mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertUserProfile> }) => {
      const response = await apiRequest("PUT", `/api/user-profiles/${id}`, data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-profiles"] });
      toast({ title: "Success", description: "User status updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user profile", variant: "destructive" });
    },
  });

  // Check if user has permission to access this page - after all hooks are called
  if (!permissions.canAccessUserProfiles) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="pt-6 text-center">
            <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access user profiles.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'manager': return <UserCheck className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'admin':
        return [
          "Manage All Users",
          "Approve/Verify Certificates", 
          "Add/Edit Roles & K-Levels",
          "Manage Site Content",
          "Backup & Restore",
          "View Logs & Audit Trails",
          "Configure System Settings"
        ];
      case 'manager':
        return [
          "View Submitted CVs",
          "Shortlist Candidates",
          "Comment/Rate CVs",
          "Export Candidate List",
          "Request Additional Docs",
          "Manage Opportunities",
          "View Stats"
        ];
      case 'user':
        return [
          "Create Profile",
          "Submit CV",
          "Edit Profile",
          "Apply to Tenders/Opportunities",
          "View Tender Matches",
          "Download/Print CV",
          "Notifications"
        ];
      default:
        return [];
    }
  };

  const filteredUsers = userProfiles;
  console.log("User profiles:", userProfiles);
  console.log("Filtered users:", filteredUsers);
  console.log("Is loading:", isLoading);

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast({ 
        title: "Error", 
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    createUserMutation.mutate(newUser);
  };

  const handleDeleteUser = (id: number) => {
    deleteUserMutation.mutate(id);
  };

  const toggleUserStatus = (id: number) => {
    const user = userProfiles.find((u: UserProfile) => u.id === id);
    if (user) {
      updateUserMutation.mutate({ 
        id, 
        data: { isActive: !user.isActive }
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access User Profiles</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        {hasPermission('canCreateUsers') && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Enter username"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select value={newUser.role} onValueChange={(value: 'admin' | 'manager' | 'user') => setNewUser({...newUser, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newUser.department}
                      onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value={newUser.position}
                      onChange={(e) => setNewUser({...newUser, position: e.target.value})}
                      placeholder="Enter position"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700">
                    Create User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <div className="flex space-x-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search">Search Users</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="search"
              placeholder="Search by name, email, username, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="roleFilter">Filter by Role</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Role Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['admin', 'manager', 'user'].map(role => {
          const count = userProfiles.filter((user: UserProfile) => user.role === role).length;
          const permissions = getRolePermissions(role);
          
          return (
            <Card key={role} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(role)}
                    <span className="capitalize">{role}</span>
                  </div>
                  <Badge className={getRoleColor(role)}>
                    {count} {count === 1 ? 'user' : 'users'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Permissions:</p>
                  <div className="space-y-1">
                    {permissions.slice(0, 4).map((permission, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{permission}</span>
                      </div>
                    ))}
                    {permissions.length > 4 && (
                      <div className="text-xs text-gray-500">
                        +{permissions.length - 4} more...
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>User Profiles ({filteredUsers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: 'rgb(0, 0, 83)' }}>
                  <TableHead className="text-white font-medium">Name</TableHead>
                  <TableHead className="text-white font-medium">Username</TableHead>
                  <TableHead className="text-white font-medium">Email</TableHead>
                  <TableHead className="text-white font-medium">Role</TableHead>
                  <TableHead className="text-white font-medium">Department</TableHead>
                  <TableHead className="text-white font-medium">Status</TableHead>
                  <TableHead className="text-white font-medium">Last Login</TableHead>
                  <TableHead className="text-white font-medium text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Loading user profiles...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      No user profiles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium">
                          {user.firstName || ''} {user.lastName || ''}
                        </div>
                      </TableCell>
                    <TableCell className="font-mono text-sm">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleColor(user.role)} flex items-center space-x-1 w-fit`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{user.department || 'N/A'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(user.id)}
                        className={`text-xs px-2 py-1 ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {!user.lastLogin ? 'Never' : new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setViewingUser(user)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>User Profile Details</DialogTitle>
                            </DialogHeader>
                            {viewingUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Name</Label>
                                    <p className="text-sm">{viewingUser.firstName} {viewingUser.lastName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Username</Label>
                                    <p className="text-sm font-mono">{viewingUser.username}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                                  <p className="text-sm">{viewingUser.email}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Role</Label>
                                    <Badge className={`${getRoleColor(viewingUser.role)} flex items-center space-x-1 w-fit mt-1`}>
                                      {getRoleIcon(viewingUser.role)}
                                      <span className="capitalize">{viewingUser.role}</span>
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                                    <p className={`text-sm font-medium ${viewingUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                      {viewingUser.isActive ? 'Active' : 'Inactive'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Department</Label>
                                    <p className="text-sm">{viewingUser.department || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Position</Label>
                                    <p className="text-sm">{viewingUser.position || 'N/A'}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                                  <p className="text-sm font-mono">{viewingUser.phoneNumber || 'N/A'}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Created</Label>
                                    <p className="text-sm">{new Date(viewingUser.createdAt).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Last Login</Label>
                                    <p className="text-sm">
                                      {!viewingUser.lastLogin ? 'Never' : new Date(viewingUser.lastLogin!).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Role Permissions</Label>
                                  <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="grid grid-cols-1 gap-1">
                                      {getRolePermissions(viewingUser.role).map((permission, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-xs text-gray-700">
                                          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                          <span>{permission}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete User Profile</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the user profile for {user.firstName} {user.lastName}? 
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}