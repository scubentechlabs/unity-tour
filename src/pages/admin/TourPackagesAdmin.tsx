import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Eye, X, MapPin, Star, Upload, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface TourPackage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string;
  state: string | null;
  country: string | null;
  category: string;
  tour_type: string;
  duration_days: number;
  duration_nights: number;
  price_per_person: number;
  discounted_price: number | null;
  max_group_size: number | null;
  min_group_size: number | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  highlights: string[] | null;
  images: string[] | null;
  featured_image: string | null;
  itinerary: ItineraryDay[] | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  rating: number | null;
  total_reviews: number | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
}

const categories = [
  { value: "adventure", label: "Adventure" },
  { value: "honeymoon", label: "Honeymoon" },
  { value: "family", label: "Family" },
  { value: "pilgrimage", label: "Pilgrimage" },
  { value: "wildlife", label: "Wildlife" },
  { value: "beach", label: "Beach" },
  { value: "hill_station", label: "Hill Station" },
  { value: "heritage", label: "Heritage" },
];

const tourTypes = [
  { value: "domestic", label: "Domestic" },
  { value: "international", label: "International" },
];

const defaultTour: Partial<TourPackage> = {
  title: "",
  slug: "",
  description: "",
  location: "",
  state: "",
  country: "India",
  category: "adventure",
  tour_type: "domestic",
  duration_days: 3,
  duration_nights: 2,
  price_per_person: 0,
  discounted_price: null,
  max_group_size: 20,
  min_group_size: 2,
  inclusions: [],
  exclusions: [],
  highlights: [],
  images: [],
  featured_image: "",
  itinerary: [],
  is_featured: false,
  is_active: true,
  meta_title: "",
  meta_description: "",
};

const TourPackagesAdmin = () => {
  const [tours, setTours] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Partial<TourPackage>>(defaultTour);
  const [isEditing, setIsEditing] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  
  // For array inputs
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newItinerary, setNewItinerary] = useState<ItineraryDay>({ day: 1, title: "", description: "" });
  
  // For image uploads
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const featuredInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from("tour_packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTours((data as unknown as TourPackage[]) || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tourData = {
        title: editingTour.title,
        slug: editingTour.slug || generateSlug(editingTour.title || ""),
        description: editingTour.description,
        location: editingTour.location,
        state: editingTour.state,
        country: editingTour.country,
        category: editingTour.category as "adventure" | "honeymoon" | "family" | "pilgrimage" | "wildlife" | "beach" | "hill_station" | "heritage",
        tour_type: editingTour.tour_type as "domestic" | "international",
        duration_days: editingTour.duration_days,
        duration_nights: editingTour.duration_nights,
        price_per_person: editingTour.price_per_person,
        discounted_price: editingTour.discounted_price || null,
        max_group_size: editingTour.max_group_size,
        min_group_size: editingTour.min_group_size,
        inclusions: editingTour.inclusions || [],
        exclusions: editingTour.exclusions || [],
        highlights: editingTour.highlights || [],
        images: editingTour.images || [],
        featured_image: editingTour.featured_image,
        itinerary: JSON.parse(JSON.stringify(editingTour.itinerary || [])),
        is_featured: editingTour.is_featured,
        is_active: editingTour.is_active,
        meta_title: editingTour.meta_title,
        meta_description: editingTour.meta_description,
      };

      if (isEditing && editingTour.id) {
        const { error } = await supabase
          .from("tour_packages")
          .update(tourData)
          .eq("id", editingTour.id);

        if (error) throw error;
        toast({ title: "Success", description: "Tour package updated successfully" });
      } else {
        const { error } = await supabase.from("tour_packages").insert(tourData);
        if (error) throw error;
        toast({ title: "Success", description: "Tour package created successfully" });
      }

      setIsDialogOpen(false);
      setEditingTour(defaultTour);
      setIsEditing(false);
      fetchTours();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (tour: TourPackage) => {
    setEditingTour({
      ...tour,
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : [],
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tour package?")) return;

    try {
      const { error } = await supabase.from("tour_packages").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Tour package deleted successfully" });
      fetchTours();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, isActive: boolean | null) => {
    try {
      const { error } = await supabase
        .from("tour_packages")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
      fetchTours();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const addArrayItem = (field: "inclusions" | "exclusions" | "highlights" | "images", value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    const current = editingTour[field] || [];
    setEditingTour({ ...editingTour, [field]: [...current, value.trim()] });
    setter("");
  };

  const removeArrayItem = (field: "inclusions" | "exclusions" | "highlights" | "images", index: number) => {
    const current = editingTour[field] || [];
    setEditingTour({ ...editingTour, [field]: current.filter((_, i) => i !== index) });
  };

  const addItineraryDay = () => {
    if (!newItinerary.title.trim()) return;
    const current = editingTour.itinerary || [];
    const day = { ...newItinerary, day: current.length + 1 };
    setEditingTour({ ...editingTour, itinerary: [...current, day] });
    setNewItinerary({ day: current.length + 2, title: "", description: "" });
  };

  const removeItineraryDay = (index: number) => {
    const current = editingTour.itinerary || [];
    const updated = current.filter((_, i) => i !== index).map((item, i) => ({ ...item, day: i + 1 }));
    setEditingTour({ ...editingTour, itinerary: updated });
  };

  const uploadImage = async (file: File, isFeatured: boolean = false) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${isFeatured ? 'featured' : 'gallery'}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('tour-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('tour-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size should be less than 5MB", variant: "destructive" });
      return;
    }

    setUploadingFeatured(true);
    try {
      const url = await uploadImage(file, true);
      setEditingTour({ ...editingTour, featured_image: url });
      toast({ title: "Success", description: "Featured image uploaded" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingFeatured(false);
      if (featuredInputRef.current) {
        featuredInputRef.current.value = '';
      }
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingGallery(true);
    const newImages: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({ title: "Skipped", description: `${file.name} is not an image`, variant: "destructive" });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "Skipped", description: `${file.name} is too large (max 5MB)`, variant: "destructive" });
          continue;
        }

        const url = await uploadImage(file, false);
        newImages.push(url);
      }

      if (newImages.length > 0) {
        const currentImages = editingTour.images || [];
        setEditingTour({ ...editingTour, images: [...currentImages, ...newImages] });
        toast({ title: "Success", description: `${newImages.length} image(s) uploaded` });
      }
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploadingGallery(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
    }
  };

  const filteredTours = filterType === "all"
    ? tours 
    : tours.filter(t => t.tour_type === filterType);

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
            Tour Packages
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage domestic and international tour packages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tours</SelectItem>
              <SelectItem value="domestic">Domestic</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingTour(defaultTour);
              setIsEditing(false);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground shadow-gold">
                <Plus className="h-5 w-5 mr-2" />
                Add Tour
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Tour Package" : "Add New Tour Package"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                    <TabsTrigger value="media">Media & SEO</TabsTrigger>
                  </TabsList>

                  {/* Basic Info Tab */}
                  <TabsContent value="basic" className="space-y-5 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={editingTour.title || ""}
                          onChange={(e) => setEditingTour({ 
                            ...editingTour, 
                            title: e.target.value,
                            slug: generateSlug(e.target.value)
                          })}
                          placeholder="Magical Kashmir Tour"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                          id="slug"
                          value={editingTour.slug || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                          placeholder="magical-kashmir-tour"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tour_type">Tour Type *</Label>
                        <Select 
                          value={editingTour.tour_type || "domestic"} 
                          onValueChange={(v) => setEditingTour({ ...editingTour, tour_type: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {tourTypes.map(t => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select 
                          value={editingTour.category || "adventure"} 
                          onValueChange={(v) => setEditingTour({ ...editingTour, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(c => (
                              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={editingTour.location || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, location: e.target.value })}
                          placeholder="Srinagar, Gulmarg, Pahalgam"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={editingTour.state || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, state: e.target.value })}
                          placeholder="Jammu & Kashmir"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={editingTour.country || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, country: e.target.value })}
                          placeholder="India"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingTour.description || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                          placeholder="Detailed description of the tour..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-5 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration_days">Days *</Label>
                        <Input
                          id="duration_days"
                          type="number"
                          value={editingTour.duration_days || 0}
                          onChange={(e) => setEditingTour({ ...editingTour, duration_days: parseInt(e.target.value) })}
                          min={1}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration_nights">Nights *</Label>
                        <Input
                          id="duration_nights"
                          type="number"
                          value={editingTour.duration_nights || 0}
                          onChange={(e) => setEditingTour({ ...editingTour, duration_nights: parseInt(e.target.value) })}
                          min={0}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="min_group_size">Min Group</Label>
                        <Input
                          id="min_group_size"
                          type="number"
                          value={editingTour.min_group_size || 2}
                          onChange={(e) => setEditingTour({ ...editingTour, min_group_size: parseInt(e.target.value) })}
                          min={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="max_group_size">Max Group</Label>
                        <Input
                          id="max_group_size"
                          type="number"
                          value={editingTour.max_group_size || 20}
                          onChange={(e) => setEditingTour({ ...editingTour, max_group_size: parseInt(e.target.value) })}
                          min={1}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price_per_person">Price Per Person (₹) *</Label>
                        <Input
                          id="price_per_person"
                          type="number"
                          value={editingTour.price_per_person || 0}
                          onChange={(e) => setEditingTour({ ...editingTour, price_per_person: parseInt(e.target.value) })}
                          min={0}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discounted_price">Discounted Price (₹)</Label>
                        <Input
                          id="discounted_price"
                          type="number"
                          value={editingTour.discounted_price || ""}
                          onChange={(e) => setEditingTour({ ...editingTour, discounted_price: e.target.value ? parseInt(e.target.value) : null })}
                          min={0}
                          placeholder="Leave empty if no discount"
                        />
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2">
                      <Label>Highlights</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newHighlight}
                          onChange={(e) => setNewHighlight(e.target.value)}
                          placeholder="Add a highlight..."
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("highlights", newHighlight, setNewHighlight))}
                        />
                        <Button type="button" onClick={() => addArrayItem("highlights", newHighlight, setNewHighlight)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editingTour.highlights?.map((item, i) => (
                          <Badge key={i} variant="secondary" className="gap-1">
                            {item}
                            <button type="button" onClick={() => removeArrayItem("highlights", i)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-2">
                      <Label>Inclusions</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newInclusion}
                          onChange={(e) => setNewInclusion(e.target.value)}
                          placeholder="Add an inclusion..."
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("inclusions", newInclusion, setNewInclusion))}
                        />
                        <Button type="button" onClick={() => addArrayItem("inclusions", newInclusion, setNewInclusion)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editingTour.inclusions?.map((item, i) => (
                          <Badge key={i} variant="secondary" className="gap-1 bg-green-500/10 text-green-600">
                            {item}
                            <button type="button" onClick={() => removeArrayItem("inclusions", i)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Exclusions */}
                    <div className="space-y-2">
                      <Label>Exclusions</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newExclusion}
                          onChange={(e) => setNewExclusion(e.target.value)}
                          placeholder="Add an exclusion..."
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("exclusions", newExclusion, setNewExclusion))}
                        />
                        <Button type="button" onClick={() => addArrayItem("exclusions", newExclusion, setNewExclusion)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editingTour.exclusions?.map((item, i) => (
                          <Badge key={i} variant="secondary" className="gap-1 bg-red-500/10 text-red-600">
                            {item}
                            <button type="button" onClick={() => removeArrayItem("exclusions", i)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <Switch
                          id="is_featured"
                          checked={editingTour.is_featured ?? false}
                          onCheckedChange={(checked) => setEditingTour({ ...editingTour, is_featured: checked })}
                        />
                        <Label htmlFor="is_featured">Featured Tour</Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          id="is_active"
                          checked={editingTour.is_active ?? true}
                          onCheckedChange={(checked) => setEditingTour({ ...editingTour, is_active: checked })}
                        />
                        <Label htmlFor="is_active">Active</Label>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Itinerary Tab */}
                  <TabsContent value="itinerary" className="space-y-5 mt-4">
                    <div className="bg-secondary/50 rounded-lg p-4 space-y-4">
                      <h4 className="font-medium text-foreground">Add Day</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Day Title</Label>
                          <Input
                            value={newItinerary.title}
                            onChange={(e) => setNewItinerary({ ...newItinerary, title: e.target.value })}
                            placeholder="Arrival in Srinagar"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Description</Label>
                          <Input
                            value={newItinerary.description}
                            onChange={(e) => setNewItinerary({ ...newItinerary, description: e.target.value })}
                            placeholder="Day activities and details..."
                          />
                        </div>
                      </div>
                      <Button type="button" onClick={addItineraryDay} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Day {(editingTour.itinerary?.length || 0) + 1}
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {editingTour.itinerary?.map((day, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-primary font-bold text-sm">{day.day}</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-foreground">{day.title}</h5>
                            <p className="text-sm text-muted-foreground mt-1">{day.description}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItineraryDay(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {(!editingTour.itinerary || editingTour.itinerary.length === 0) && (
                        <p className="text-center text-muted-foreground py-8">
                          No itinerary days added yet. Add your first day above.
                        </p>
                      )}
                    </div>
                  </TabsContent>

                  {/* Media & SEO Tab */}
                  <TabsContent value="media" className="space-y-5 mt-4">
                    <div className="space-y-3">
                      <Label>Featured Image</Label>
                      <div className="flex flex-col gap-3">
                        {/* Upload Button */}
                        <div className="flex gap-2">
                          <input
                            ref={featuredInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFeaturedImageUpload}
                            className="hidden"
                            id="featured-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => featuredInputRef.current?.click()}
                            disabled={uploadingFeatured}
                            className="flex-1"
                          >
                            {uploadingFeatured ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Featured Image
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {/* Or use URL */}
                        <div className="flex gap-2 items-center">
                          <span className="text-xs text-muted-foreground">or</span>
                          <Input
                            value={editingTour.featured_image || ""}
                            onChange={(e) => setEditingTour({ ...editingTour, featured_image: e.target.value })}
                            placeholder="Paste image URL..."
                            className="flex-1"
                          />
                        </div>
                        
                        {/* Preview */}
                        {editingTour.featured_image && (
                          <div className="relative rounded-lg overflow-hidden border border-border h-40 group">
                            <img
                              src={editingTour.featured_image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                            <button
                              type="button"
                              onClick={() => setEditingTour({ ...editingTour, featured_image: "" })}
                              className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Gallery Images</Label>
                      
                      {/* Upload Button */}
                      <div className="flex gap-2">
                        <input
                          ref={galleryInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImageUpload}
                          className="hidden"
                          id="gallery-upload"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => galleryInputRef.current?.click()}
                          disabled={uploadingGallery}
                          className="flex-1"
                        >
                          {uploadingGallery ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Image className="h-4 w-4 mr-2" />
                              Upload Gallery Images
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {/* Or use URL */}
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-muted-foreground">or</span>
                        <Input
                          value={newImage}
                          onChange={(e) => setNewImage(e.target.value)}
                          placeholder="Paste image URL..."
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArrayItem("images", newImage, setNewImage))}
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={() => addArrayItem("images", newImage, setNewImage)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Gallery Grid */}
                      {editingTour.images && editingTour.images.length > 0 ? (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                          {editingTour.images.map((img, i) => (
                            <div key={i} className="relative group aspect-video rounded-lg overflow-hidden bg-secondary border border-border">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeArrayItem("images", i)}
                                className="absolute top-1 right-1 p-1 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground">
                          <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No gallery images added yet</p>
                          <p className="text-xs mt-1">Upload images or paste URLs above</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta_title">SEO Title</Label>
                      <Input
                        id="meta_title"
                        value={editingTour.meta_title || ""}
                        onChange={(e) => setEditingTour({ ...editingTour, meta_title: e.target.value })}
                        placeholder="Kashmir Tour Package | Premium Tours"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta_description">SEO Description</Label>
                      <Textarea
                        id="meta_description"
                        value={editingTour.meta_description || ""}
                        onChange={(e) => setEditingTour({ ...editingTour, meta_description: e.target.value })}
                        placeholder="Book the best Kashmir tour package..."
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-gold hover:opacity-90 text-primary-foreground"
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? "Update Tour" : "Create Tour"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{tours.length}</p>
          <p className="text-sm text-muted-foreground">Total Tours</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{tours.filter(t => t.tour_type === "domestic").length}</p>
          <p className="text-sm text-muted-foreground">Domestic</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{tours.filter(t => t.tour_type === "international").length}</p>
          <p className="text-sm text-muted-foreground">International</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-2xl font-bold text-foreground">{tours.filter(t => t.is_featured).length}</p>
          <p className="text-sm text-muted-foreground">Featured</p>
        </div>
      </div>

      {/* Tours Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Tour Name</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Duration</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No tour packages found. Add your first tour to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredTours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell>
                    <div className="w-16 h-12 rounded overflow-hidden bg-secondary">
                      {tour.featured_image ? (
                        <img src={tour.featured_image} alt={tour.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{tour.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {tour.location}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant={tour.tour_type === "domestic" ? "default" : "secondary"}>
                      {tour.tour_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {tour.duration_days}D / {tour.duration_nights}N
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <span className="font-medium text-primary">₹{(tour.discounted_price || tour.price_per_person).toLocaleString()}</span>
                      {tour.discounted_price && tour.discounted_price < tour.price_per_person && (
                        <span className="text-xs text-muted-foreground line-through ml-1">₹{tour.price_per_person.toLocaleString()}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(tour.id, tour.is_active)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        tour.is_active
                          ? "bg-green-500/20 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tour.is_active ? "Active" : "Inactive"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/domestic-tours/${tour.slug}`, "_blank")}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(tour)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(tour.id)}
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
    </div>
  );
};

export default TourPackagesAdmin;
