import { useState } from "react";
import { Globe, Bell, Shield, Palette, Mail, Phone, Building2, Save, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const SettingsAdmin = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: "Settings saved", description: "Your changes have been saved successfully." });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your application settings and preferences</p>
        </div>
        <Button 
          onClick={handleSave} 
          className="bg-[#008060] hover:bg-[#006e52] text-white"
          disabled={saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="p-2 bg-[#f4f6f8] rounded-lg">
              <Building2 className="h-5 w-5 text-[#008060]" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">General Settings</h2>
              <p className="text-sm text-gray-500">Basic information about your business</p>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Company Name</Label>
                <Input 
                  defaultValue="Unity Global Tours" 
                  className="border-gray-300 focus:border-[#008060] focus:ring-[#008060]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Website URL</Label>
                <Input 
                  defaultValue="https://unityglobaltours.com" 
                  className="border-gray-300 focus:border-[#008060] focus:ring-[#008060]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Contact Email
                </Label>
                <Input 
                  defaultValue="info@unityglobaltours.com" 
                  className="border-gray-300 focus:border-[#008060] focus:ring-[#008060]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Contact Phone
                </Label>
                <Input 
                  defaultValue="+91 92270 26000" 
                  className="border-gray-300 focus:border-[#008060] focus:ring-[#008060]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Configure how you receive notifications</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email alerts for new enquiries and bookings</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">Get SMS alerts for urgent updates and confirmations</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Bell className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Browser Notifications</p>
                  <p className="text-sm text-gray-500">Show desktop notifications when browser is open</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Shield className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">Security</h2>
              <p className="text-sm text-gray-500">Manage your account security settings</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Shield className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Lock className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">Automatically log out after 30 minutes of inactivity</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Palette className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-medium text-gray-900">Appearance</h2>
              <p className="text-sm text-gray-500">Customize how the admin panel looks</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Palette className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-500">Switch to dark theme for the admin panel</p>
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Globe className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Compact Mode</p>
                  <p className="text-sm text-gray-500">Reduce spacing and padding for denser layout</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
