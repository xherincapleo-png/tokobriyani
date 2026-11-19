import * as React from "react";
import { getStoreSettings } from "@/lib/data/repository";
import { AnnouncementBar } from "./announcement-bar";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "./footer";

export async function StorefrontShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getStoreSettings();

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF6]">
      <AnnouncementBar settings={settings} />
      <Navbar storeName={settings.store_name} logoUrl={settings.logo_url} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
