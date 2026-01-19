import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Upload, ImageIcon, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
  is_taxi_slide: boolean;
  created_at: string;
}

const defaultSlide: Partial<HeroSlide> = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  button_text: "Learn More",
  button_link: "/",
  display_order: 1,
  is_active: true,
  is_taxi_slide: false,
};

const HeroSlidesAdmin = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide>>(defaultSlide);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageInputType, setImageInputType] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `slides/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('hero-slides')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('hero-slides')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size should be less than 5MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const url = await uploadImage(file);
      setEditingSlide({ ...editingSlide, image_url: url });
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const slideData = {
        title: editingSlide.title,
        subtitle: editingSlide.subtitle,
        description: editingSlide.description,
        image_url: editingSlide.image_url,
        button_text: editingSlide.button_text,
        button_link: editingSlide.button_link,
        display_order: editingSlide.display_order || slides.length + 1,
        is_active: editingSlide.is_active ?? true,
        is_taxi_slide: editingSlide.is_taxi_slide ?? false,
      };

      if (isEditing && editingSlide.id) {
        const { error } = await supabase
          .from("hero_slides")
          .update(slideData)
          .eq("id", editingSlide.id);

        if (error) throw error;
        toast({ title: "Success", description: "Slide updated successfully" });
      } else {
        const { error } = await supabase.from("hero_slides").insert(slideData);
        if (error) throw error;
        toast({ title: "Success", description: "Slide created successfully" });
      }

      setIsDialogOpen(false);
      setEditingSlide(defaultSlide);
      setIsEditing(false);
      fetchSlides();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;

    try {
      const { error } = await supabase.from("hero_slides").delete().eq("id", id);
      if (error) throw error;
      toast({ title: "Deleted", description: "Slide deleted successfully" });
      fetchSlides();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("hero_slides")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;
      fetchSlides();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
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
          <h1 className="text-2xl font-semibold text-[#303030]">Hero Slides</h1>
          <p className="text-[#637381] text-sm mt-1">
            Manage homepage carousel images
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingSlide(defaultSlide);
            setIsEditing(false);
            setImageInputType("upload");
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-[#008060] hover:bg-[#006e52] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#303030]">
                {isEditing ? "Edit slide" : "Add new slide"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Image Section */}
              <div className="space-y-3">
                <Label className="text-[#303030]">Slide Image</Label>
                <Tabs value={imageInputType} onValueChange={(v) => setImageInputType(v as "upload" | "url")}>
                  <TabsList className="grid w-full grid-cols-2 bg-[#f6f6f7]">
                    <TabsTrigger value="upload" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">Upload</TabsTrigger>
                    <TabsTrigger value="url" className="text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900">URL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="mt-3">
                    <div
                      className="border-2 border-dashed border-[#e1e3e5] rounded-lg p-6 text-center cursor-pointer hover:border-[#008060] transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {editingSlide.image_url ? (
                        <div className="space-y-2">
                          <img
                            src={editingSlide.image_url}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <p className="text-sm text-[#637381]">Click to replace</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {uploading ? (
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-[#008060]" />
                          ) : (
                            <Upload className="h-8 w-8 mx-auto text-[#8c9196]" />
                          )}
                          <p className="text-sm text-[#637381]">
                            {uploading ? "Uploading..." : "Click to upload image"}
                          </p>
                          <p className="text-xs text-[#8c9196]">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="url" className="mt-3">
                    <Input
                      value={editingSlide.image_url || ""}
                      onChange={(e) => setEditingSlide({ ...editingSlide, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="border-[#e1e3e5] focus:border-[#008060] focus:ring-[#008060]"
                    />
                    {editingSlide.image_url && (
                      <img
                        src={editingSlide.image_url}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-md mt-3"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Content Fields */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-[#303030]">Title *</Label>
                  <Input
                    id="title"
                    value={editingSlide.title || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                    placeholder="Explore Amazing Destinations"
                    required
                    className="border-[#e1e3e5] focus:border-[#008060] focus:ring-[#008060]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-[#303030]">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={editingSlide.subtitle || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                    placeholder="Your adventure awaits"
                    className="border-[#e1e3e5] focus:border-[#008060] focus:ring-[#008060]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-[#303030]">Description</Label>
                  <Textarea
                    id="description"
                    value={editingSlide.description || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                    placeholder="Brief description for the slide"
                    rows={3}
                    className="border-[#e1e3e5] focus:border-[#008060] focus:ring-[#008060]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="button_text" className="text-[#303030]">Button Text</Label>
                    <Input
                      id="button_text"
                      value={editingSlide.button_text || ""}
                      onChange={(e) => setEditingSlide({ ...editingSlide, button_text: e.target.value })}
                      placeholder="Learn More"
                      className="border-[#e1e3e5] focus:border-[#008060] focus:ring-[#008060]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button_link" className="text-[#303030]">Button Link</Label>
                    <Input
                      id="button_link"
                      value={editingSlide.button_link || ""}
                      onChange={(e) => setEditingSlide({ ...editingSlide, button_link: e.target.value })}
                      placeholder="/tours"
                      className="border-[#e1e3e5] focus:border-[#008060] focus:ring-[#008060]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order" className="text-[#303030]">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      min="0"
                      value={editingSlide.display_order || 0}
                      onChange={(e) => setEditingSlide({ ...editingSlide, display_order: parseInt(e.target.value) })}
                      className="border-[#e1e3e5] focus:border-[#008060] focus:ring-[#008060]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#303030]">Status</Label>
                    <div className="flex items-center gap-3 h-10">
                      <Switch
                        checked={editingSlide.is_active ?? true}
                        onCheckedChange={(checked) => setEditingSlide({ ...editingSlide, is_active: checked })}
                        className="data-[state=checked]:bg-[#008060]"
                      />
                      <span className="text-sm text-[#637381]">
                        {editingSlide.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Taxi Slide Toggle */}
                <div className="space-y-2 pt-2 border-t border-[#e1e3e5]">
                  <Label className="text-[#303030]">Slide Type</Label>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={editingSlide.is_taxi_slide ?? false}
                      onCheckedChange={(checked) => setEditingSlide({ ...editingSlide, is_taxi_slide: checked })}
                      className="data-[state=checked]:bg-[#008060]"
                    />
                    <span className="text-sm text-[#637381]">
                      {editingSlide.is_taxi_slide ? "Taxi Booking Slide (special layout with Call Now button)" : "Regular Slide"}
                    </span>
                  </div>
                  {editingSlide.is_taxi_slide && (
                    <p className="text-xs text-[#8c9196]">
                      Taxi slides display with a special centered layout featuring service highlights and a Call Now button.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e1e3e5]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-[#e1e3e5] text-[#303030] hover:bg-[#f6f6f7]"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={saving || !editingSlide.title || !editingSlide.image_url}
                  className="bg-[#008060] hover:bg-[#006e52] text-white"
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isEditing ? "Save changes" : "Add slide"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides Table */}
      <Card className="bg-white border-[#e1e3e5]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-[#e1e3e5] hover:bg-transparent">
                <TableHead className="text-[#637381] font-medium">Image</TableHead>
                <TableHead className="text-[#637381] font-medium">Title</TableHead>
                <TableHead className="text-[#637381] font-medium hidden md:table-cell">Order</TableHead>
                <TableHead className="text-[#637381] font-medium">Status</TableHead>
                <TableHead className="text-[#637381] font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slides.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-[#8c9196]">
                    <ImageIcon className="h-12 w-12 mx-auto mb-3 text-[#d2d5d8]" />
                    <p className="font-medium text-[#303030]">No slides yet</p>
                    <p className="text-sm">Add your first hero slide to get started</p>
                  </TableCell>
                </TableRow>
              ) : (
                slides.map((slide) => (
                  <TableRow key={slide.id} className="border-[#e1e3e5]">
                    <TableCell>
                      <img
                        src={slide.image_url}
                        alt={slide.title}
                        className="w-20 h-12 object-cover rounded-md border border-[#e1e3e5]"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-[#303030]">{slide.title}</p>
                        {slide.subtitle && (
                          <p className="text-sm text-[#637381] truncate max-w-[200px]">{slide.subtitle}</p>
                        )}
                        {slide.is_taxi_slide && (
                          <Badge className="mt-1 bg-amber-100 text-amber-800 border-0 text-xs">
                            Taxi Slide
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-[#637381]">{slide.display_order}</span>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(slide.id, slide.is_active)}
                        className="flex items-center gap-1.5"
                      >
                        {slide.is_active ? (
                          <Badge className="bg-[#e3f1ee] text-[#008060] hover:bg-[#d4ebe5] border-0">
                            <Eye className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-[#f6f6f7] text-[#637381] hover:bg-[#e8e9eb] border-0">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(slide)}
                          className="h-8 w-8 text-[#637381] hover:text-[#303030] hover:bg-[#f6f6f7]"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(slide.id)}
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
    </div>
  );
};

export default HeroSlidesAdmin;
