import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  Users, 
  Activity, 
  LogOut, 
  Eye, 
  Phone, 
  Mail, 
  Calendar,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

interface AuditLog {
  id: string;
  user_id: string | null;
  table_name: string;
  operation: string;
  record_id: string | null;
  ip_address: unknown;
  user_agent: string | null;
  session_id: string | null;
  created_at: string;
  metadata: any;
}

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'agent' | 'viewer';
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      // Check user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();

      if (roleData) {
        setUserRole(roleData.role);
        await loadData(roleData.role);
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have the required permissions to access this area.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      navigate("/auth");
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (role: string) => {
    try {
      // Load leads if user has admin or agent role
      if (role === 'admin' || role === 'agent') {
        const { data: leadsData, error: leadsError } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (leadsError) throw leadsError;
        setLeads(leadsData || []);

        // Log the data access
        await supabase.rpc("log_data_access", {
          p_table_name: "leads",
          p_operation: "SELECT",
          p_metadata: { source: "admin_dashboard", role }
        });
      }

      // Load audit logs if user is admin
      if (role === 'admin') {
        const { data: auditData, error: auditError } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100);

        if (auditError) throw auditError;
        setAuditLogs(auditData || []);

        // Load user roles
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("*")
          .order("created_at", { ascending: false });

        if (rolesError) throw rolesError;
        setUserRoles(rolesData || []);
      }
    } catch (error) {
      console.error("Data loading error:", error);
      toast({
        title: "Error Loading Data",
        description: "Some data may not be available. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getOperationBadge = (operation: string) => {
    const variants = {
      SELECT: "secondary",
      INSERT: "default",
      UPDATE: "outline",
      DELETE: "destructive",
      LOGIN: "default",
      SIGNUP: "secondary"
    } as const;

    return (
      <Badge variant={variants[operation as keyof typeof variants] || "secondary"}>
        {operation}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      agent: "default",
      viewer: "secondary"
    } as const;

    return (
      <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
        {role.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {user?.email} - {getRoleBadge(userRole || '')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Activity className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Audit Entries</p>
                  <p className="text-2xl font-bold text-foreground">{auditLogs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Today's Leads</p>
                  <p className="text-2xl font-bold text-foreground">
                    {leads.filter(lead => 
                      new Date(lead.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">User Roles</p>
                  <p className="text-2xl font-bold text-foreground">{userRoles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leads">Leads Management</TabsTrigger>
            <TabsTrigger value="audit" disabled={userRole !== 'admin'}>
              Security Audit
            </TabsTrigger>
            <TabsTrigger value="users" disabled={userRole !== 'admin'}>
              User Roles
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Customer Leads</span>
                </CardTitle>
                <CardDescription>
                  Recent customer inquiries and contact requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {leads.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No leads found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell className="font-medium">{lead.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{lead.email}</span>
                              </div>
                              {lead.phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{lead.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {format(new Date(lead.created_at), "MMM dd, yyyy HH:mm")}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Contact
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Security Audit Log</span>
                </CardTitle>
                <CardDescription>
                  System access and data operation tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No audit logs found</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Operation</TableHead>
                        <TableHead>Table</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{getOperationBadge(log.operation)}</TableCell>
                          <TableCell className="font-mono text-sm">{log.table_name}</TableCell>
                          <TableCell className="text-sm">
                            {log.user_id ? log.user_id.substring(0, 8) + '...' : 'Anonymous'}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {log.ip_address ? String(log.ip_address) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Roles Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>User Role Management</span>
                </CardTitle>
                <CardDescription>
                  Manage staff access levels and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userRoles.length === 0 ? (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No user roles configured</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Assigned</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userRoles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-mono text-sm">
                            {role.user_id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>{getRoleBadge(role.role)}</TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(role.created_at), "MMM dd, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;