import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Eye,
  Trash2,
  Phone,
  MapPin,
  Search,
  Car,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DriverRegistration {
  id: string;
  name: string;
  phone: string;
  city: string;
  vehicle_type: string;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-800 border-amber-200" },
  { value: "approved", label: "Approved", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800 border-red-200" },
  { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-800 border-blue-200" },
];

const DriversAdmin = () => {
  const [registrations, setRegistrations] = useState<DriverRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<DriverRegistration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [editStatus, setEditStatus] = useState<string>("");
  const [editAdminNotes, setEditAdminNotes] = useState<string>("");

  const { toast } = useToast();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from("driver_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (registration: DriverRegistration) => {
    setSelectedRegistration(registration);
    setEditStatus(registration.status);
    setEditAdminNotes(registration.admin_notes || "");
    setIsDetailOpen(true);
  };

  const handleUpdateRegistration = async () => {
    if (!selectedRegistration) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("driver_registrations")
        .update({
          status: editStatus,
          admin_notes: editAdminNotes || null,
        })
        .eq("id", selectedRegistration.id);

      if (error) throw error;

      toast({ title: "Success", description: "Driver registration updated successfully" });
      setIsDetailOpen(false);
      fetchRegistrations();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("driver_registrations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Status updated" });
      fetchRegistrations();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      const { error } = await supabase.from("driver_registrations").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Registration deleted successfully" });
      fetchRegistrations();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-600";
  };

  const filterRegistrations = (registrations: DriverRegistration[]) => {
    return registrations.filter((r) => {
      const matchesStatus = filterStatus === "all" || r.status === filterStatus;
      const matchesSearch =
        searchQuery === "" ||
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery) ||
        r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === "pending").length,
    approved: registrations.filter((r) => r.status === "approved").length,
    rejected: registrations.filter((r) => r.status === "rejected").length,
  };

  const filteredRegistrations = filterRegistrations(registrations);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#008060]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Driver Registrations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage driver partner applications</p>
        </div>
        {stats.pending > 0 && (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5">
            {stats.pending} pending applications
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-slate-500 to-slate-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-slate-100">Total Applications</p>
              </div>
              <Users className="h-8 w-8 text-slate-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.pending}</p>
                <p className="text-sm text-amber-100">Pending</p>
              </div>
              <Clock className="h-8 w-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.approved}</p>
                <p className="text-sm text-emerald-100">Approved</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-red-100">Rejected</p>
              </div>
              <XCircle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, city, or vehicle..."
            className="pl-10 border-gray-300 focus:border-[#008060] bg-white"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48 border-gray-300 bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-gray-200">
                  <TableHead className="text-gray-600 font-medium">Driver</TableHead>
                  <TableHead className="text-gray-600 font-medium">Contact</TableHead>
                  <TableHead className="text-gray-600 font-medium">City</TableHead>
                  <TableHead className="text-gray-600 font-medium">Vehicle</TableHead>
                  <TableHead className="text-gray-600 font-medium">Status</TableHead>
                  <TableHead className="text-gray-600 font-medium">Date</TableHead>
                  <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                      No driver registrations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration.id} className="border-gray-200 hover:bg-gray-50">
                      <TableCell>
                        <div className="font-medium text-gray-900">{registration.name}</div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`tel:${registration.phone}`}
                          className="text-gray-600 hover:text-emerald-600 flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {registration.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {registration.city}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Car className="h-3 w-3" />
                          {registration.vehicle_type}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={registration.status}
                          onValueChange={(value) => handleQuickStatusUpdate(registration.id, value)}
                        >
                          <SelectTrigger className={`w-32 h-8 text-xs border ${getStatusColor(registration.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {format(new Date(registration.created_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(registration)}
                            className="h-8 w-8 text-gray-500 hover:text-emerald-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(registration.id)}
                            className="h-8 w-8 text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Driver Registration Details</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6">
              {/* Driver Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wider">Name</Label>
                  <p className="font-medium text-gray-900">{selectedRegistration.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wider">Phone</Label>
                  <a
                    href={`tel:${selectedRegistration.phone}`}
                    className="font-medium text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    {selectedRegistration.phone}
                  </a>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wider">City</Label>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    {selectedRegistration.city}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wider">Vehicle Type</Label>
                  <p className="font-medium text-gray-900 flex items-center gap-1">
                    <Car className="h-3 w-3 text-gray-400" />
                    {selectedRegistration.vehicle_type}
                  </p>
                </div>
              </div>

              {/* Message */}
              {selectedRegistration.message && (
                <div>
                  <Label className="text-xs text-gray-500 uppercase tracking-wider">Message</Label>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">
                    {selectedRegistration.message}
                  </p>
                </div>
              )}

              {/* Submitted Date */}
              <div>
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Submitted On</Label>
                <p className="text-gray-700">
                  {format(new Date(selectedRegistration.created_at), "dd MMMM yyyy 'at' hh:mm a")}
                </p>
              </div>

              {/* Admin Controls */}
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger className="mt-1 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Admin Notes</Label>
                  <Textarea
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this driver..."
                    className="mt-1 border-gray-300"
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateRegistration}
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriversAdmin;
