import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Trash2, 
  Mail, 
  Search,
  Download,
  CheckCircle,
  XCircle,
  MailOpen,
  UserMinus
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Subscription {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  unsubscribed_at: string | null;
}

const NewsletterAdmin = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
  
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from("newsletter_subscriptions")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .update({ 
          is_active: !currentActive,
          unsubscribed_at: !currentActive ? null : new Date().toISOString()
        })
        .eq("id", id);

      if (error) throw error;
      
      toast({ 
        title: currentActive ? "Unsubscribed" : "Resubscribed",
        description: `Subscription ${currentActive ? "deactivated" : "reactivated"} successfully`
      });
      fetchSubscriptions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this subscription?")) return;

    try {
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "Deleted", description: "Subscription deleted permanently" });
      fetchSubscriptions();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const exportToCSV = () => {
    const headers = ["Email", "Subscribed At", "Status", "Unsubscribed At"];
    const csvData = filteredSubscriptions.map(s => [
      s.email,
      format(new Date(s.subscribed_at), "yyyy-MM-dd HH:mm"),
      s.is_active ? "Active" : "Inactive",
      s.unsubscribed_at ? format(new Date(s.unsubscribed_at), "yyyy-MM-dd HH:mm") : ""
    ]);
    
    const csv = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscriptions-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const filteredSubscriptions = subscriptions.filter(s => {
    const matchesSearch = searchQuery === "" || 
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterActive === "all" || 
      (filterActive === "active" && s.is_active) ||
      (filterActive === "inactive" && !s.is_active);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.is_active).length,
    inactive: subscriptions.filter(s => !s.is_active).length,
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
          <h1 className="text-2xl font-semibold text-[#303030]">Newsletter Subscriptions</h1>
          <p className="text-[#637381] text-sm mt-1">
            Manage your newsletter subscribers
          </p>
        </div>
        <Button 
          onClick={exportToCSV} 
          variant="outline" 
          className="border-[#e1e3e5] text-[#303030] hover:bg-[#f6f6f7]"
          disabled={filteredSubscriptions.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white border-[#e1e3e5]">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-[#303030]">{stats.total}</p>
            <p className="text-sm text-[#637381]">Total Subscribers</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e1e3e5]">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-[#008060]">{stats.active}</p>
            <p className="text-sm text-[#637381]">Active</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-[#e1e3e5]">
          <CardContent className="p-4">
            <p className="text-2xl font-semibold text-[#637381]">{stats.inactive}</p>
            <p className="text-sm text-[#637381]">Inactive</p>
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
            placeholder="Search by email..."
            className="pl-10 border-[#e1e3e5] focus:border-[#008060] bg-white"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterActive === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("all")}
            className={filterActive === "all" ? "bg-[#008060] hover:bg-[#006e52]" : "border-[#e1e3e5]"}
          >
            All
          </Button>
          <Button
            variant={filterActive === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("active")}
            className={filterActive === "active" ? "bg-[#008060] hover:bg-[#006e52]" : "border-[#e1e3e5]"}
          >
            Active
          </Button>
          <Button
            variant={filterActive === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterActive("inactive")}
            className={filterActive === "inactive" ? "bg-[#008060] hover:bg-[#006e52]" : "border-[#e1e3e5]"}
          >
            Inactive
          </Button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-white border-[#e1e3e5]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#e1e3e5] hover:bg-transparent">
                <TableHead className="text-[#637381] font-medium">Email</TableHead>
                <TableHead className="text-[#637381] font-medium hidden sm:table-cell">Subscribed</TableHead>
                <TableHead className="text-[#637381] font-medium">Status</TableHead>
                <TableHead className="text-[#637381] font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-[#8c9196]">
                    <MailOpen className="h-12 w-12 mx-auto mb-3 text-[#d2d5d8]" />
                    <p className="font-medium text-[#303030]">No subscriptions found</p>
                    <p className="text-sm">
                      {searchQuery || filterActive !== "all"
                        ? "Try adjusting your filters"
                        : "Newsletter subscribers will appear here"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id} className="border-[#e1e3e5]">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#637381]" />
                        <a 
                          href={`mailto:${subscription.email}`}
                          className="text-[#303030] hover:text-[#008060]"
                        >
                          {subscription.email}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm text-[#637381]">
                        {format(new Date(subscription.subscribed_at), "dd MMM yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {subscription.is_active ? (
                        <Badge className="bg-[#d4edda] text-[#155724] hover:bg-[#d4edda]">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-[#f8d7da] text-[#721c24] hover:bg-[#f8d7da]">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleActive(subscription.id, subscription.is_active)}
                          className="h-8 w-8 text-[#637381] hover:text-[#303030] hover:bg-[#f6f6f7]"
                          title={subscription.is_active ? "Unsubscribe" : "Resubscribe"}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(subscription.id)}
                          className="h-8 w-8 text-[#637381] hover:text-red-600 hover:bg-red-50"
                          title="Delete permanently"
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
    </div>
  );
};

export default NewsletterAdmin;
