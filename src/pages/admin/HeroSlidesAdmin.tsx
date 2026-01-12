import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Upload, X } from "lucide-react";

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
}

const defaultSlide: Partial<HeroSlide> = {
  title: "",
  subtitle: "",
  description: "",
  image_url: "",
  button_text: "Explore Now",
  button_link: "/domestic-tours",
  display_order: 0,
  is_active: true,
};

const HeroSlidesAdmin = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide>>(defaultSlide);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      if (isEditing && editingSlide.id) {
        const { error } = await supabase
          .from("hero_slides")
          .update({
            title: editingSlide.title,
            subtitle: editingSlide.subtitle,
            description: editingSlide.description,
            image_url: editingSlide.image_url,
            button_text: editingSlide.button_text,
            button_link: editingSlide.button_link,
            display_order: editingSlide.display_order,
            is_active: editingSlide.is_active,
          })
          .eq("id", editingSlide.id);

        if (error) throw error;
        toast({ title: "Success", description: "Slide updated successfully" });
      } else {
        const { error } = await supabase.from("hero_slides").insert({
          title: editingSlide.title,
          subtitle: editingSlide.subtitle,
          description: editingSlide.description,
          image_url: editingSlide.image_url,
          button_text: editingSlide.button_text,
          button_link: editingSlide.button_link,
          display_order: editingSlide.display_order || slides.length + 1,
          is_active: editingSlide.is_active ?? true,
        });

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
            Hero Slides
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage homepage hero slider images and content
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingSlide(defaultSlide);
            setIsEditing(false);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-gold hover:opacity-90 text-primary-foreground shadow-gold">
              <Plus className="h-5 w-5 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Slide" : "Add New Slide"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={editingSlide.title || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="Discover Amazing Destinations"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle (Badge)</Label>
                <Input
                  id="subtitle"
                  value={editingSlide.subtitle || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  placeholder="✨ Premium Experience"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingSlide.description || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                  placeholder="Brief description for the slide..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label>Slide Image *</Label>
                
                {/* Upload Button */}
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="slide-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Or use URL */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground">or</span>
                  <Input
                    value={editingSlide.image_url || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, image_url: e.target.value })}
                    placeholder="Paste image URL..."
                    className="flex-1"
                  />
                </div>
                
                {/* Preview */}
                {editingSlide.image_url && (
                  <div className="relative rounded-lg overflow-hidden border border-border h-40 group">
                    <img
                      src={editingSlide.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                    <button
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, image_url: "" })}
                      className="absolute top-2 right-2 p-1.5 bg-destructive rounded-full text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {!editingSlide.image_url && (
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1920x1080px (16:9 aspect ratio) for best display
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="button_text">Button Text</Label>
                  <Input
                    id="button_text"
                    value={editingSlide.button_text || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, button_text: e.target.value })}
                    placeholder="Explore Now"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="button_link">Button Link</Label>
                  <Input
                    id="button_link"
                    value={editingSlide.button_link || ""}
                    onChange={(e) => setEditingSlide({ ...editingSlide, button_link: e.target.value })}
                    placeholder="/domestic-tours"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_order">Display Order</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={editingSlide.display_order || 0}
                    onChange={(e) => setEditingSlide({ ...editingSlide, display_order: parseInt(e.target.value) })}
                    min={0}
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <Switch
                    id="is_active"
                    checked={editingSlide.is_active ?? true}
                    onCheckedChange={(checked) => setEditingSlide({ ...editingSlide, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-gold hover:opacity-90 text-primary-foreground"
                  disabled={saving || !editingSlide.image_url}
                >
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slides Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Button</TableHead>
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-32 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No slides yet. Add your first slide to get started.
                </TableCell>
              </TableRow>
            ) : (
              slides.map((slide) => (
                <TableRow key={slide.id}>
                  <TableCell className="font-medium">{slide.display_order}</TableCell>
                  <TableCell>
                    <div className="w-16 h-10 rounded overflow-hidden bg-secondary">
                      <img
                        src={slide.image_url}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{slide.title}</p>
                      {slide.subtitle && (
                        <p className="text-sm text-muted-foreground line-clamp-1">{slide.subtitle}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{slide.button_text}</span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => toggleActive(slide.id, slide.is_active)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        slide.is_active
                          ? "bg-green-500/20 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {slide.is_active ? "Active" : "Inactive"}
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(slide)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(slide.id)}
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

export default HeroSlidesAdmin;