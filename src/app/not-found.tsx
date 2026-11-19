import Link from "next/link";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <StorefrontShell>
      <section className="container py-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
          404 — Page Not Found
        </p>
        <h1 className="mt-3 font-serif text-4xl text-[#173F35] sm:text-5xl">
          We couldn&apos;t find that page.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-[#7A7A70]">
          The dish or page you&apos;re looking for may have moved or is no longer available.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/menu">Explore Menu</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </section>
    </StorefrontShell>
  );
}
