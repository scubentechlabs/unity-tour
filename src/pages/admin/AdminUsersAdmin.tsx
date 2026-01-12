import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const AdminUsersAdmin = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
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
    toast({ title: "Admin removed" });
    fetchAdmins();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Admin Users</h1>
          <p className="text-muted-foreground mt-1">Manage administrator access</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Added On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">{admin.email}</TableCell>
                <TableCell>{admin.name || "—"}</TableCell>
                <TableCell><Badge variant={admin.is_super_admin ? "default" : "secondary"}><Shield className="h-3 w-3 mr-1" />{admin.is_super_admin ? "Super Admin" : "Admin"}</Badge></TableCell>
                <TableCell>{format(new Date(admin.created_at), "dd MMM yyyy")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(admin.id)} disabled={admin.is_super_admin}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-muted-foreground">Note: To add new admins, they must first sign up through the auth page, then be added to the admin_users table.</p>
    </div>
  );
};

export default AdminUsersAdmin;
