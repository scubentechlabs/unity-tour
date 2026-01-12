import { motion } from "framer-motion";
import { Settings, Globe, Bell, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const SettingsAdmin = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your application settings</p>
      </div>

      <div className="grid gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">General Settings</h2>
          </div>
          <div className="grid gap-4">
            <div><Label>Company Name</Label><Input defaultValue="Unity Global Tours" /></div>
            <div><Label>Contact Email</Label><Input defaultValue="info@unityglobaltours.com" /></div>
            <div><Label>Contact Phone</Label><Input defaultValue="+91 98765 43210" /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="font-medium">Email Notifications</p><p className="text-sm text-muted-foreground">Receive email for new enquiries</p></div><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><div><p className="font-medium">SMS Notifications</p><p className="text-sm text-muted-foreground">Receive SMS for urgent updates</p></div><Switch /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="font-medium">Two-Factor Authentication</p><p className="text-sm text-muted-foreground">Add extra security to your account</p></div><Switch /></div>
            <Button variant="outline">Change Password</Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
