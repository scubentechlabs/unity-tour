import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Shield, ShieldCheck, Users, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const AdminUsersAdmin = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchAdmins(); }, []);

  const fetchAdmins = async () => {
    const { data } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
    setAdmins(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this admin?")) return;
    await supabase.from("admin_users").delete().eq("id", id);
    toast({ title: "Admin removed successfully" });
    fetchAdmins();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#008060]" />
      </div>
    );
  }

  const superAdminCount = admins.filter(a => a.is_super_admin).length;
  const regularAdminCount = admins.filter(a => !a.is_super_admin).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Admin Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage administrator access and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f4f6f8] rounded-lg">
              <Users className="h-5 w-5 text-[#008060]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{admins.length}</p>
              <p className="text-sm text-gray-500">Total Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{superAdminCount}</p>
              <p className="text-sm text-gray-500">Super Admins</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">{regularAdminCount}</p>
              <p className="text-sm text-gray-500">Regular Admins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Admin</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Role</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Added On</TableHead>
              <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No admin users</p>
                  <p className="text-sm text-gray-400">Admin users will appear here</p>
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.id} className="hover:bg-gray-50 border-b border-gray-100">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${admin.is_super_admin ? 'bg-amber-100' : 'bg-gray-100'}`}>
                        {admin.is_super_admin ? (
                          <Crown className="h-5 w-5 text-amber-600" />
                        ) : (
                          <Shield className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{admin.name || "Unnamed Admin"}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {admin.is_super_admin ? (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-gray-900">{format(new Date(admin.created_at), "dd MMM yyyy")}</div>
                    <div className="text-xs text-gray-500">{format(new Date(admin.created_at), "hh:mm a")}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-red-50"
                      onClick={() => handleDelete(admin.id)} 
                      disabled={admin.is_super_admin}
                      title={admin.is_super_admin ? "Cannot delete super admin" : "Delete admin"}
                    >
                      <Trash2 className={`h-4 w-4 ${admin.is_super_admin ? 'text-gray-300' : 'text-red-500'}`} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="p-2 bg-blue-100 rounded-lg h-fit">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-blue-900">Adding new admins</p>
            <p className="text-sm text-blue-700 mt-1">
              To add new admins, they must first sign up through the authentication page. 
              Once registered, their email can be added to the admin_users table with appropriate permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersAdmin;
