"use client";

import * as React from "react";
import { Loader2, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import type { OpeningHourEntry, StoreSettings } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface SettingsManagerProps {
  initialSettings: StoreSettings;
}

const DEFAULT_HOURS: OpeningHourEntry[] = [
  { day: "Monday", open: "10:00", close: "21:00", closed: false },
  { day: "Tuesday", open: "10:00", close: "21:00", closed: false },
  { day: "Wednesday", open: "10:00", close: "21:00", closed: false },
  { day: "Thursday", open: "10:00", close: "21:00", closed: false },
  { day: "Friday", open: "11:00", close: "22:00", closed: false },
  { day: "Saturday", open: "10:00", close: "22:00", closed: false },
  { day: "Sunday", open: "10:00", close: "21:00", closed: false },
];

export function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [saving, setSaving] = React.useState(false);
  const [uploadingLogo, setUploadingLogo] = React.useState(false);

  const [storeName, setStoreName] = React.useState(initialSettings.store_name);
  const [logoUrl, setLogoUrl] = React.useState(initialSettings.logo_url ?? "");
  const [whatsappNumber, setWhatsappNumber] = React.useState(
    initialSettings.whatsapp_number ?? ""
  );
  const [address, setAddress] = React.useState(initialSettings.address ?? "");
  const [deliveryFee, setDeliveryFee] = React.useState(
    String(initialSettings.delivery_fee ?? 0)
  );
  const [minimumOrder, setMinimumOrder] = React.useState(
    String(initialSettings.minimum_order ?? 0)
  );
  const [storeDescription, setStoreDescription] = React.useState(
    initialSettings.store_description ?? ""
  );
  const [instagramUrl, setInstagramUrl] = React.useState(
    initialSettings.instagram_url ?? ""
  );
  const [tiktokUrl, setTiktokUrl] = React.useState(
    initialSettings.social_links?.tiktok ?? ""
  );
  const [facebookUrl, setFacebookUrl] = React.useState(
    initialSettings.social_links?.facebook ?? ""
  );
  const [mapsEmbedUrl, setMapsEmbedUrl] = React.useState(
    initialSettings.social_links?.maps_embed_url ?? ""
  );
  const [openingHours, setOpeningHours] = React.useState<OpeningHourEntry[]>(
    initialSettings.opening_hours.length > 0
      ? initialSettings.opening_hours
      : DEFAULT_HOURS
  );

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Logo upload failed.");
        return;
      }
      setLogoUrl(data.url);
      toast.success("Logo uploaded.");
    } catch {
      toast.error("Network error during logo upload.");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const updateHourRow = (
    index: number,
    patch: Partial<OpeningHourEntry>
  ) => {
    setOpeningHours((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, ...patch } : row))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          store_name: storeName,
          logo_url: logoUrl || null,
          whatsapp_number: whatsappNumber || null,
          address: address || null,
          opening_hours: openingHours,
          delivery_fee: Number(deliveryFee) || 0,
          minimum_order: Number(minimumOrder) || 0,
          store_description: storeDescription,
          instagram_url: instagramUrl || null,
          social_links: {
            tiktok: tiktokUrl,
            facebook: facebookUrl,
            maps_embed_url: mapsEmbedUrl,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to save store settings.");
        setSaving(false);
        return;
      }
      toast.success("Store settings saved and reflected on storefront.");
    } catch {
      toast.error("Network error while saving settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl text-[#173F35]">Store Settings</h1>
          <p className="mt-1 text-sm text-[#7A7A70]">
            Configure your brand details, WhatsApp order number, delivery fees, opening hours, and contact links.
          </p>
        </div>
        <Button type="submit" disabled={saving || uploadingLogo}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Brand Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Identity & Contact</CardTitle>
          <CardDescription>
            Displayed in the navigation bar, footer, checkout, and Contact page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="store-name">Store Name *</Label>
              <Input
                id="store-name"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wa-number">Store WhatsApp Number</Label>
              <Input
                id="wa-number"
                placeholder="6281234567890"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
              />
              <p className="text-[11px] text-[#7A7A70]">
                Use international format without &quot;+&quot; (e.g. 6281234567890). Powers all customer WhatsApp order links.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="logo-url">Logo URL (Optional)</Label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                id="logo-url"
                placeholder="Leave blank to use default TB monogram"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="flex-1"
              />
              <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#E8E3D8] bg-[#F7F1E5] px-4 text-xs font-medium text-[#173F35] hover:bg-[#EFE6D4]">
                {uploadingLogo ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload Logo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="store-desc">Store Description</Label>
            <Textarea
              id="store-desc"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="store-address">Kitchen / Pickup Address</Label>
            <Textarea
              id="store-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your kitchen address or pickup instructions..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery & Order Rules</CardTitle>
          <CardDescription>
            Applied automatically on the Cart and Checkout pages and enforced on the server.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="delivery-fee">Flat Delivery Fee (IDR)</Label>
            <Input
              id="delivery-fee"
              type="number"
              min={0}
              step={1000}
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="min-order">Minimum Order Subtotal (IDR)</Label>
            <Input
              id="min-order"
              type="number"
              min={0}
              step={1000}
              value={minimumOrder}
              onChange={(e) => setMinimumOrder(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Opening Hours</CardTitle>
          <CardDescription>
            Shown in the announcement bar, footer, and Contact page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {openingHours.map((entry, idx) => (
            <div
              key={entry.day}
              className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#E8E3D8] bg-[#F7F1E5]/40 px-4 py-2.5"
            >
              <span className="w-24 text-sm font-medium text-[#272923]">
                {entry.day}
              </span>

              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={entry.open}
                  disabled={entry.closed}
                  onChange={(e) => updateHourRow(idx, { open: e.target.value })}
                  className="h-9 w-32"
                />
                <span className="text-xs text-[#7A7A70]">to</span>
                <Input
                  type="time"
                  value={entry.close}
                  disabled={entry.closed}
                  onChange={(e) => updateHourRow(idx, { close: e.target.value })}
                  className="h-9 w-32"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-[#7A7A70]">
                <Switch
                  checked={!entry.closed}
                  onCheckedChange={(open) =>
                    updateHourRow(idx, { closed: !open })
                  }
                />
                <span>{entry.closed ? "Closed" : "Open"}</span>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Social Media & Map */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links & Map</CardTitle>
          <CardDescription>
            Optional links shown on your Contact page and website footer.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="instagram-url">Instagram URL</Label>
            <Input
              id="instagram-url"
              placeholder="https://instagram.com/yourhandle"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tiktok-url">TikTok URL</Label>
            <Input
              id="tiktok-url"
              placeholder="https://tiktok.com/@yourhandle"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="facebook-url">Facebook URL</Label>
            <Input
              id="facebook-url"
              placeholder="https://facebook.com/yourpage"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maps-url">Google Maps Embed URL</Label>
            <Input
              id="maps-url"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={mapsEmbedUrl}
              onChange={(e) => setMapsEmbedUrl(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={saving || uploadingLogo}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save All Store Settings
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
