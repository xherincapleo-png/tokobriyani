import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/data/repository";
import { SettingsManager } from "@/components/admin/settings-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Store Settings",
};

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();
  return <SettingsManager initialSettings={settings} />;
}
