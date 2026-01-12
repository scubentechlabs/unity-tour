import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Loader2, Plus, Edit, Trash2, Eye, Car, MessageSquare, Download } from "lucide-react";
import { format } from "date-fns";

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
    const [vehiclesRes, enquiriesRes] = await Promise.all([
      supabase.from("taxi_vehicles").select("*").order("name"),
      supabase.from("taxi_enquiries").select("*, taxi_vehicles(name)").order("created_at", { ascending: false })
    ]);
    setVehicles(vehiclesRes.data || []);
    setEnquiries(enquiriesRes.data || []);
    setLoading(false);
  };

  const handleSaveVehicle = async () => {
    const { error } = editingVehicle
      ? await supabase.from("taxi_vehicles").update(vehicleForm).eq("id", editingVehicle.id)
      : await supabase.from("taxi_vehicles").insert(vehicleForm);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Success" }); setIsVehicleDialogOpen(false); fetchData();
    setVehicleForm({ name: "", category: "sedan", seating_capacity: 4, luggage_capacity: 2, ac: true, fuel_type: "Petrol", base_price_per_km: 12, base_price_per_day: 2500, image_url: "", is_active: true });
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    await supabase.from("taxi_vehicles").delete().eq("id", id);
    toast({ title: "Deleted" }); fetchData();
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    await supabase.from("taxi_enquiries").update({ status }).eq("id", id);
    fetchData();
  };

  const openEditVehicle = (v: any) => {
    setEditingVehicle(v);
    setVehicleForm(v);
    setIsVehicleDialogOpen(true);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Taxi Management</h1>
      
      <Tabs defaultValue="vehicles">
        <TabsList><TabsTrigger value="vehicles"><Car className="h-4 w-4 mr-2" />Vehicles</TabsTrigger><TabsTrigger value="enquiries"><MessageSquare className="h-4 w-4 mr-2" />Enquiries ({enquiries.length})</TabsTrigger></TabsList>
        
        <TabsContent value="vehicles" className="mt-6">
          <div className="flex justify-between mb-4">
            <p className="text-muted-foreground">{vehicles.length} vehicles</p>
            <Button onClick={() => { setEditingVehicle(null); setVehicleForm({ name: "", category: "sedan", seating_capacity: 4, luggage_capacity: 2, ac: true, fuel_type: "Petrol", base_price_per_km: 12, base_price_per_day: 2500, image_url: "", is_active: true }); setIsVehicleDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Vehicle</Button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Vehicle</TableHead><TableHead>Category</TableHead><TableHead>Capacity</TableHead><TableHead>Price/KM</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="capitalize">{v.category}</TableCell>
                    <TableCell>{v.seating_capacity} seats</TableCell>
                    <TableCell>₹{v.base_price_per_km}</TableCell>
                    <TableCell><Badge variant={v.is_active ? "default" : "secondary"}>{v.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => openEditVehicle(v)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => handleDeleteVehicle(v.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="enquiries" className="mt-6">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Trip</TableHead><TableHead>Date</TableHead><TableHead>Vehicle</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {enquiries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell><div><p className="font-medium">{e.name}</p><p className="text-sm text-muted-foreground">{e.phone}</p></div></TableCell>
                    <TableCell><p className="text-sm">{e.pickup_location} → {e.drop_location || "Local"}</p></TableCell>
                    <TableCell>{format(new Date(e.pickup_date), "dd MMM yyyy")}</TableCell>
                    <TableCell>{e.taxi_vehicles?.name || "—"}</TableCell>
                    <TableCell>
                      <Select value={e.status} onValueChange={(v) => handleUpdateEnquiryStatus(e.id, v)}>
                        <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>{["pending", "quoted", "confirmed", "completed", "cancelled"].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">{e.quoted_price && <span className="text-primary font-medium">₹{e.quoted_price}</span>}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isVehicleDialogOpen} onOpenChange={setIsVehicleDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>{editingVehicle ? "Edit" : "Add"} Vehicle</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={vehicleForm.name} onChange={(e) => setVehicleForm({...vehicleForm, name: e.target.value})} /></div>
              <div><Label>Category</Label><Select value={vehicleForm.category} onValueChange={(v) => setVehicleForm({...vehicleForm, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["sedan", "suv", "muv", "luxury"].map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Seating</Label><Input type="number" value={vehicleForm.seating_capacity} onChange={(e) => setVehicleForm({...vehicleForm, seating_capacity: +e.target.value})} /></div>
              <div><Label>Price/KM (₹)</Label><Input type="number" value={vehicleForm.base_price_per_km} onChange={(e) => setVehicleForm({...vehicleForm, base_price_per_km: +e.target.value})} /></div>
            </div>
            <div><Label>Image URL</Label><Input value={vehicleForm.image_url || ""} onChange={(e) => setVehicleForm({...vehicleForm, image_url: e.target.value})} /></div>
            <Button onClick={handleSaveVehicle}>Save Vehicle</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaxiAdmin;
