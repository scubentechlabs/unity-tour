import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2, Car, MessageSquare, Users, Fuel, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

const TaxiAdmin = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVehicleDialogOpen, setIsVehicleDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const { toast } = useToast();

  const [vehicleForm, setVehicleForm] = useState({
    name: "", category: "sedan", seating_capacity: 4, luggage_capacity: 2,
    ac: true, fuel_type: "Petrol", base_price_per_km: 12, base_price_per_day: 2500, image_url: "", is_active: true
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      // Check current user session
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user?.id, user?.email);

      const [vehiclesRes, enquiriesRes] = await Promise.all([
        supabase.from("taxi_vehicles").select("*").order("name"),
        supabase.from("taxi_enquiries").select("*, taxi_vehicles(name)").order("created_at", { ascending: false })
      ]);
      
      console.log("Vehicles response:", vehiclesRes);
      console.log("Enquiries response:", enquiriesRes);
      
      if (enquiriesRes.error) {
        console.error("Enquiries fetch error:", enquiriesRes.error);
      }
      
      setVehicles(vehiclesRes.data || []);
      setEnquiries(enquiriesRes.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  };

  const handleSaveVehicle = async () => {
    const { error } = editingVehicle
      ? await supabase.from("taxi_vehicles").update(vehicleForm).eq("id", editingVehicle.id)
      : await supabase.from("taxi_vehicles").insert(vehicleForm);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Success", description: editingVehicle ? "Vehicle updated" : "Vehicle added" }); 
    setIsVehicleDialogOpen(false); 
    fetchData();
    setVehicleForm({ name: "", category: "sedan", seating_capacity: 4, luggage_capacity: 2, ac: true, fuel_type: "Petrol", base_price_per_km: 12, base_price_per_day: 2500, image_url: "", is_active: true });
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    await supabase.from("taxi_vehicles").delete().eq("id", id);
    toast({ title: "Vehicle deleted" }); fetchData();
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    // Find the enquiry to get customer details
    const enquiry = enquiries.find(e => e.id === id);
    
    const { error } = await supabase.from("taxi_enquiries").update({ status }).eq("id", id);
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    // Send status update email notification
    if (enquiry && status !== "pending") {
      try {
        await supabase.functions.invoke("send-enquiry-notification", {
          body: {
            type: "taxi-status-update",
            name: enquiry.name,
            email: enquiry.email,
            phone: enquiry.phone,
            pickupLocation: enquiry.pickup_location,
            dropLocation: enquiry.drop_location,
            tripType: enquiry.trip_type,
            travelDate: enquiry.pickup_date ? format(new Date(enquiry.pickup_date), "dd MMM yyyy") : undefined,
            vehicleName: enquiry.taxi_vehicles?.name,
            oldStatus: enquiry.status,
            newStatus: status,
            quotedPrice: enquiry.quoted_price
          }
        });
        toast({ title: "Status updated", description: "Customer has been notified via email" });
      } catch (emailError) {
        console.error("Failed to send status notification:", emailError);
        toast({ title: "Status updated", description: "Note: Email notification failed" });
      }
    } else {
      toast({ title: "Status updated" });
    }
    
    fetchData();
  };

  const openEditVehicle = (v: any) => {
    setEditingVehicle(v);
    setVehicleForm(v);
    setIsVehicleDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      quoted: "bg-blue-100 text-blue-800 border-blue-200",
      confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

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
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Taxi Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your fleet and booking enquiries</p>
      </div>
      
      <Tabs defaultValue="vehicles" className="space-y-6">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger 
            value="vehicles" 
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium"
          >
            <Car className="h-4 w-4 mr-2" />
            Vehicles ({vehicles.length})
          </TabsTrigger>
          <TabsTrigger 
            value="enquiries"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-4 py-2 text-sm font-medium"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Enquiries ({enquiries.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicles" className="space-y-4">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{vehicles.length} vehicles in fleet</p>
            <Button 
              onClick={() => { 
                setEditingVehicle(null); 
                setVehicleForm({ name: "", category: "sedan", seating_capacity: 4, luggage_capacity: 2, ac: true, fuel_type: "Petrol", base_price_per_km: 12, base_price_per_day: 2500, image_url: "", is_active: true }); 
                setIsVehicleDialogOpen(true); 
              }}
              className="bg-[#008060] hover:bg-[#006e52] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add vehicle
            </Button>
          </div>

          {/* Vehicles Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Vehicle</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Category</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Capacity</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Rate</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Status</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No vehicles added</p>
                      <p className="text-sm text-gray-400">Add your first vehicle to get started</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  vehicles.map((v) => (
                    <TableRow key={v.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {v.image_url ? (
                            <img src={v.image_url} alt={v.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Car className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{v.name}</p>
                            <p className="text-xs text-gray-500">{v.fuel_type} • {v.ac ? "AC" : "Non-AC"}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize bg-gray-50">{v.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{v.seating_capacity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-900 font-medium">₹{v.base_price_per_km}/km</div>
                        <div className="text-xs text-gray-500">₹{v.base_price_per_day}/day</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={v.is_active ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                          {v.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100" onClick={() => openEditVehicle(v)}>
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50" onClick={() => handleDeleteVehicle(v.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="enquiries" className="space-y-4">
          {/* Enquiries Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Customer</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Trip Details</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Date</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Vehicle</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Status</TableHead>
                  <TableHead className="text-xs font-medium text-gray-500 uppercase tracking-wider py-3 text-right">Quote</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No enquiries yet</p>
                      <p className="text-sm text-gray-400">Enquiries will appear here when customers book</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  enquiries.map((e) => (
                    <TableRow key={e.id} className="hover:bg-gray-50 border-b border-gray-100">
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{e.name}</p>
                          <p className="text-sm text-gray-500">{e.phone}</p>
                          <p className="text-xs text-gray-400">{e.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm text-gray-900 truncate">{e.pickup_location}</p>
                          <p className="text-xs text-gray-500">→ {e.drop_location || "Local"}</p>
                          <Badge variant="outline" className="mt-1 text-xs capitalize">{e.trip_type}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-900">{format(new Date(e.pickup_date), "dd MMM yyyy")}</div>
                        {e.pickup_time && <div className="text-xs text-gray-500">{e.pickup_time}</div>}
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600">{e.taxi_vehicles?.name || "Not selected"}</span>
                      </TableCell>
                      <TableCell>
                        <Select value={e.status} onValueChange={(v) => handleUpdateEnquiryStatus(e.id, v)}>
                          <SelectTrigger className={`h-8 w-28 text-xs border ${getStatusColor(e.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["pending", "quoted", "confirmed", "completed", "cancelled"].map(s => (
                              <SelectItem key={s} value={s} className="capitalize text-sm">{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        {e.quoted_price ? (
                          <span className="text-[#008060] font-semibold">₹{e.quoted_price.toLocaleString()}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Vehicle Dialog */}
      <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editingVehicle ? "Edit vehicle" : "Add new vehicle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Vehicle Name</Label>
                <Input 
                  value={vehicleForm.name} 
                  onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})}
                  placeholder="e.g., Swift Dzire"
                  className="border-gray-300 focus:border-[#008060] focus:ring-[#008060]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Category</Label>
                <Select value={vehicleForm.category} onValueChange={(v) => setVehicleForm({...vehicleForm, category: v})}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["sedan", "suv", "muv", "luxury"].map(c => (
                      <SelectItem key={c} value={c} className="capitalize">{c.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Seating Capacity</Label>
                <Input 
                  type="number" 
                  value={vehicleForm.seating_capacity} 
                  onChange={(e) => setVehicleForm({...vehicleForm, seating_capacity: +e.target.value})}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Luggage Capacity</Label>
                <Input 
                  type="number" 
                  value={vehicleForm.luggage_capacity} 
                  onChange={(e) => setVehicleForm({...vehicleForm, luggage_capacity: +e.target.value})}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Price per KM (₹)</Label>
                <Input 
                  type="number" 
                  value={vehicleForm.base_price_per_km} 
                  onChange={(e) => setVehicleForm({...vehicleForm, base_price_per_km: +e.target.value})}
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Price per Day (₹)</Label>
                <Input 
                  type="number" 
                  value={vehicleForm.base_price_per_day} 
                  onChange={(e) => setVehicleForm({...vehicleForm, base_price_per_day: +e.target.value})}
                  className="border-gray-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Fuel Type</Label>
                <Select value={vehicleForm.fuel_type} onValueChange={(v) => setVehicleForm({...vehicleForm, fuel_type: v})}>
                  <SelectTrigger className="border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Petrol", "Diesel", "CNG", "Electric"].map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Air Conditioning</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch 
                    checked={vehicleForm.ac} 
                    onCheckedChange={(v) => setVehicleForm({...vehicleForm, ac: v})}
                  />
                  <span className="text-sm text-gray-600">{vehicleForm.ac ? "AC" : "Non-AC"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Image URL</Label>
              <Input 
                value={vehicleForm.image_url || ""} 
                onChange={(e) => setVehicleForm({...vehicleForm, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
                className="border-gray-300"
              />
            </div>

            <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Active Status</p>
                <p className="text-sm text-gray-500">Vehicle will be available for booking</p>
              </div>
              <Switch 
                checked={vehicleForm.is_active} 
                onCheckedChange={(v) => setVehicleForm({...vehicleForm, is_active: v})}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={() => setIsVehicleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-[#008060] hover:bg-[#006e52] text-white"
                onClick={handleSaveVehicle}
              >
                {editingVehicle ? "Save changes" : "Add vehicle"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxiAdmin;
