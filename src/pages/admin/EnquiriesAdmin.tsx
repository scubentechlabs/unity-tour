import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  Eye, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  MapPin,
  IndianRupee,
  MessageSquare,
  Search,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TourPackage {
  id: string;
  title: string;
  slug: string;
}

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  travel_date: string | null;
  adults: number | null;
  children: number | null;
  status: "pending" | "quoted" | "confirmed" | "completed" | "cancelled";
  quoted_price: number | null;
  admin_notes: string | null;
  tour_package_id: string | null;
  user_id: string | null;
  created_at: string;
  updated_at: string;
  tour_packages?: TourPackage | null;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "bg-yellow-500/20 text-yellow-500" },
  { value: "quoted", label: "Quoted", color: "bg-blue-500/20 text-blue-500" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-500/20 text-green-500" },
  { value: "completed", label: "Completed", color: "bg-primary/20 text-primary" },
  { value: "cancelled", label: "Cancelled", color: "bg-destructive/20 text-destructive" },
];

const EnquiriesAdmin = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Editable fields
  const [editStatus, setEditStatus] = useState<string>("");
  const [editQuotedPrice, setEditQuotedPrice] = useState<string>("");
  const [editAdminNotes, setEditAdminNotes] = useState<string>("");
  
  const { toast } = useToast();

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("tour_enquiries")
        .select(`
          *,
          tour_packages (
            id,
            title,
            slug
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEnquiries((data as unknown as Enquiry[]) || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setEditStatus(enquiry.status);
    setEditQuotedPrice(enquiry.quoted_price?.toString() || "");
    setEditAdminNotes(enquiry.admin_notes || "");
    setIsDetailOpen(true);
  };

  const handleUpdateEnquiry = async () => {
    if (!selectedEnquiry) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("tour_enquiries")
        .update({
          status: editStatus as Enquiry["status"],
          quoted_price: editQuotedPrice ? parseFloat(editQuotedPrice) : null,
          admin_notes: editAdminNotes || null,
        })
        .eq("id", selectedEnquiry.id);

      if (error) throw error;
      
      toast({ title: "Success", description: "Enquiry updated successfully" });
      setIsDetailOpen(false);
      fetchEnquiries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleQuickStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("tour_enquiries")
        .update({ status: newStatus as Enquiry["status"] })
        .eq("id", id);

      if (error) throw error;
      fetchEnquiries();
      toast({ title: "Status updated" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      const { error } = await supabase.from("tour_enquiries").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Enquiry deleted successfully" });
      fetchEnquiries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Tour", "Travel Date", "Adults", "Children", "Status", "Quoted Price", "Created At"];
    const csvData = filteredEnquiries.map(e => [
      e.name,
      e.email,
      e.phone,
      e.tour_packages?.title || "N/A",
      e.travel_date || "N/A",
      e.adults || 0,
      e.children || 0,
      e.status,
      e.quoted_price || "N/A",
      format(new Date(e.created_at), "yyyy-MM-dd HH:mm")
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const filteredEnquiries = enquiries.filter(e => {
    const matchesStatus = filterStatus === "all" || e.status === filterStatus;
    const matchesSearch = searchQuery === "" || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.phone.includes(searchQuery) ||
      e.tour_packages?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || "bg-muted text-muted-foreground";
  };

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === "pending").length,
    quoted: enquiries.filter(e => e.status === "quoted").length,
    confirmed: enquiries.filter(e => e.status === "confirmed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Tour Enquiries
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and respond to customer enquiries
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Enquiries</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-blue-500">{stats.quoted}</p>
          <p className="text-sm text-muted-foreground">Quoted</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-green-500">{stats.confirmed}</p>
          <p className="text-sm text-muted-foreground">Confirmed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or tour..."
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {statusOptions.map(s => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Enquiries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Tour Package</TableHead>
              <TableHead className="hidden lg:table-cell">Travel Date</TableHead>
              <TableHead className="hidden sm:table-cell">Travelers</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Quoted</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnquiries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  {searchQuery || filterStatus !== "all" 
                    ? "No enquiries match your filters." 
                    : "No enquiries yet."}
                </TableCell>
              </TableRow>
            ) : (
              filteredEnquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{enquiry.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {enquiry.email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 md:hidden">
                        <Phone className="h-3 w-3" />
                        {enquiry.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-foreground line-clamp-1">
                      {enquiry.tour_packages?.title || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {enquiry.travel_date ? (
                      <span className="text-sm">{format(new Date(enquiry.travel_date), "dd MMM yyyy")}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm">
                      {enquiry.adults || 0} Adults, {enquiry.children || 0} Kids
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={enquiry.status}
                      onValueChange={(v) => handleQuickStatusUpdate(enquiry.id, v)}
                    >
                      <SelectTrigger className={`h-8 w-28 text-xs ${getStatusColor(enquiry.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {enquiry.quoted_price ? (
                      <span className="font-medium text-primary">₹{enquiry.quoted_price.toLocaleString()}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(enquiry)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(enquiry.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
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
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          
          {selectedEnquiry && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-foreground">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{selectedEnquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-primary hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-primary" />
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-primary hover:underline">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                      Submitted: {format(new Date(selectedEnquiry.created_at), "dd MMM yyyy, hh:mm a")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tour & Travel Info */}
              <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-foreground">Tour Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Tour Package</p>
                      <p className="text-foreground font-medium">
                        {selectedEnquiry.tour_packages?.title || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Travel Date</p>
                      <p className="text-foreground font-medium">
                        {selectedEnquiry.travel_date 
                          ? format(new Date(selectedEnquiry.travel_date), "dd MMM yyyy")
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <p className="text-muted-foreground">Travelers</p>
                      <p className="text-foreground font-medium">
                        {selectedEnquiry.adults || 0} Adults, {selectedEnquiry.children || 0} Children
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Message */}
              {selectedEnquiry.message && (
                <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Customer Message
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedEnquiry.message}</p>
                </div>
              )}

              {/* Admin Controls */}
              <div className="space-y-4 border-t border-border pt-6">
                <h4 className="font-medium text-foreground">Admin Actions</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quoted Price (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={editQuotedPrice}
                        onChange={(e) => setEditQuotedPrice(e.target.value)}
                        placeholder="Enter quoted price"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Internal notes about this enquiry..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                <a href={`tel:${selectedEnquiry.phone}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </Button>
                </a>
                <a href={`mailto:${selectedEnquiry.email}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </a>
                <a 
                  href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="text-green-500 border-green-500/50">
                    WhatsApp
                  </Button>
                </a>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-gold hover:opacity-90 text-primary-foreground"
                  onClick={handleUpdateEnquiry}
                  disabled={saving}
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiriesAdmin;
