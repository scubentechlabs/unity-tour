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
  Mail, 
  Calendar, 
  Users, 
  MapPin,
  MessageSquare,
  Search,
  Download,
  Clock,
  IndianRupee
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
  { value: "pending", label: "Pending", color: "bg-[#fff3cd] text-[#856404]" },
  { value: "quoted", label: "Quoted", color: "bg-[#cce5ff] text-[#004085]" },
  { value: "confirmed", label: "Confirmed", color: "bg-[#d4edda] text-[#155724]" },
  { value: "completed", label: "Completed", color: "bg-[#e3f1ee] text-[#008060]" },
  { value: "cancelled", label: "Cancelled", color: "bg-[#f8d7da] text-[#721c24]" },
];

const EnquiriesAdmin = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
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
    return statusOptions.find(s => s.value === status)?.color || "bg-[#f6f6f7] text-[#637381]";
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
        <Loader2 className="h-8 w-8 animate-spin text-[#008060]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#303030]">Tour Enquiries</h1>
          <p className="text-[#637381] text-sm mt-1">
            Manage and respond to customer enquiries
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="border-[#e1e3e5] text-[#303030] hover:bg-[#f6f6f7]">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white border-[#e1e3e5]">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-[#303030]">{stats.total}</p>
            <p className="text-sm text-[#637381]">Total Enquiries</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e1e3e5]">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-[#856404]">{stats.pending}</p>
            <p className="text-sm text-[#637381]">Pending</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e1e3e5]">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-[#004085]">{stats.quoted}</p>
            <p className="text-sm text-[#637381]">Quoted</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e1e3e5]">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-[#155724]">{stats.confirmed}</p>
            <p className="text-sm text-[#637381]">Confirmed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c9196]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, or tour..."
            className="pl-10 border-[#e1e3e5] focus:border-[#008060] bg-white"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48 border-[#e1e3e5] bg-white">
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
      <Card className="bg-white border-[#e1e3e5]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#e1e3e5] hover:bg-transparent">
                <TableHead className="text-[#637381] font-medium">Customer</TableHead>
                <TableHead className="text-[#637381] font-medium hidden md:table-cell">Tour Package</TableHead>
                <TableHead className="text-[#637381] font-medium hidden lg:table-cell">Travel Date</TableHead>
                <TableHead className="text-[#637381] font-medium hidden sm:table-cell">Travelers</TableHead>
                <TableHead className="text-[#637381] font-medium">Status</TableHead>
                <TableHead className="text-[#637381] font-medium hidden md:table-cell">Quoted</TableHead>
                <TableHead className="text-[#637381] font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnquiries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-[#8c9196]">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-[#d2d5d8]" />
                    <p className="font-medium text-[#303030]">No enquiries found</p>
                    <p className="text-sm">
                      {searchQuery || filterStatus !== "all" 
                        ? "Try adjusting your filters" 
                        : "Enquiries will appear here"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <TableRow key={enquiry.id} className="border-[#e1e3e5]">
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#303030]">{enquiry.name}</p>
                        <p className="text-sm text-[#637381]">{enquiry.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-[#303030] line-clamp-1">
                        {enquiry.tour_packages?.title || "—"}
                      </p>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {enquiry.travel_date ? (
                        <span className="text-sm text-[#303030]">{format(new Date(enquiry.travel_date), "dd MMM yyyy")}</span>
                      ) : (
                        <span className="text-[#8c9196]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-[#303030]">
                        {enquiry.adults || 0} Adults, {enquiry.children || 0} Kids
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={enquiry.status}
                        onValueChange={(v) => handleQuickStatusUpdate(enquiry.id, v)}
                      >
                        <SelectTrigger className={`h-8 w-28 text-xs border-0 ${getStatusColor(enquiry.status)}`}>
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
                        <span className="font-medium text-[#008060]">₹{enquiry.quoted_price.toLocaleString()}</span>
                      ) : (
                        <span className="text-[#8c9196]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(enquiry)}
                          className="h-8 w-8 text-[#637381] hover:text-[#303030] hover:bg-[#f6f6f7]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(enquiry.id)}
                          className="h-8 w-8 text-[#637381] hover:text-red-600 hover:bg-red-50"
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
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#303030]">Enquiry Details</DialogTitle>
          </DialogHeader>
          
          {selectedEnquiry && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="bg-[#f6f6f7] rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-[#303030]">Customer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-[#008060]" />
                    <span className="text-[#303030]">{selectedEnquiry.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-[#008060]" />
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-[#008060] hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-[#008060]" />
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-[#008060] hover:underline">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-[#008060]" />
                    <span className="text-[#637381]">
                      {format(new Date(selectedEnquiry.created_at), "dd MMM yyyy, hh:mm a")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tour & Travel Info */}
              <div className="bg-[#f6f6f7] rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-[#303030]">Tour Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[#008060] mt-0.5" />
                    <div>
                      <p className="text-[#637381]">Tour Package</p>
                      <p className="text-[#303030] font-medium">
                        {selectedEnquiry.tour_packages?.title || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-[#008060] mt-0.5" />
                    <div>
                      <p className="text-[#637381]">Travel Date</p>
                      <p className="text-[#303030] font-medium">
                        {selectedEnquiry.travel_date 
                          ? format(new Date(selectedEnquiry.travel_date), "dd MMM yyyy")
                          : "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="h-4 w-4 text-[#008060] mt-0.5" />
                    <div>
                      <p className="text-[#637381]">Travelers</p>
                      <p className="text-[#303030] font-medium">
                        {selectedEnquiry.adults || 0} Adults, {selectedEnquiry.children || 0} Children
                      </p>
                    </div>
                  </div>
                </div>

                {selectedEnquiry.message && (
                  <div className="pt-3 border-t border-[#e1e3e5]">
                    <p className="text-[#637381] text-sm mb-1">Message</p>
                    <p className="text-[#303030] text-sm">{selectedEnquiry.message}</p>
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              <div className="space-y-4">
                <h4 className="font-medium text-[#303030]">Update Enquiry</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[#303030]">Status</Label>
                    <Select value={editStatus} onValueChange={setEditStatus}>
                      <SelectTrigger className="border-[#e1e3e5]">
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
                    <Label className="text-[#303030]">Quoted Price (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8c9196]" />
                      <Input
                        type="number"
                        value={editQuotedPrice}
                        onChange={(e) => setEditQuotedPrice(e.target.value)}
                        placeholder="Enter price"
                        className="pl-10 border-[#e1e3e5]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#303030]">Admin Notes</Label>
                  <Textarea
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Internal notes about this enquiry..."
                    rows={3}
                    className="border-[#e1e3e5]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e3e5]">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailOpen(false)}
                    className="border-[#e1e3e5] text-[#303030] hover:bg-[#f6f6f7]"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateEnquiry} 
                    disabled={saving}
                    className="bg-[#008060] hover:bg-[#006e52] text-white"
                  >
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnquiriesAdmin;
