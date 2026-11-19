import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/repository";
import { formatIDR } from "@/lib/utils/format";
import { StorefrontShell } from "@/components/layout/storefront-shell";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { ProductDetailActions } from "@/components/products/product-detail-actions";
import { ProductCard } from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return { title: "Dish Not Found" };
  }
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | Toko Briyani`,
      description: product.description,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product, 4);
  const isAvailable =
    product.is_available && (product.stock === null || product.stock > 0);

  return (
    <StorefrontShell>
      <div className="container py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs text-[#7A7A70]">
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 font-medium text-[#173F35] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Menu
          </Link>
          <span>/</span>
          {product.category?.name && (
            <>
              <Link
                href={`/menu?category=${product.category.slug}`}
                className="hover:text-[#173F35]"
              >
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#272923]">{product.name}</span>
        </div>

        {/* Product Detail Grid */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Large Image */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-lg border border-[#E8E3D8] bg-[#F7F1E5] p-2.5 shadow-editorial">
              <FoodImage
                src={product.image_url}
                alt={product.name}
                priority
                containerClassName="aspect-square w-full rounded-md"
              />
            </div>
          </div>

          {/* Info & Order Controls */}
          <div className="space-y-6 lg:col-span-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.category?.name && (
                <Badge variant="cream">{product.category.name}</Badge>
              )}
              {product.is_featured && (
                <Badge variant="spice">Best Seller</Badge>
              )}
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium ${
                  isAvailable ? "text-emerald-800" : "text-red-700"
                }`}
              >
                {isAvailable ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Available today
                  </>
                ) : (
                  <>
                    <XCircle className="h-3.5 w-3.5" />
                    Currently sold out
                  </>
                )}
              </span>
            </div>

            <div>
              <h1 className="font-serif text-4xl text-[#173F35] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-3 font-serif text-3xl text-[#272923]">
                {formatIDR(product.price)}
              </p>
            </div>

            <p className="text-base leading-relaxed text-[#272923]/80">
              {product.description}
            </p>

            <div className="rounded-lg border border-[#E8E3D8] bg-[#F7F1E5]/50 p-6">
              <ProductDetailActions product={product} />
            </div>
          </div>
        </div>

        {/* Related Menu Recommendations */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-[#E8E3D8] pt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C96A35]">
                  Pair It With
                </p>
                <h2 className="mt-1 font-serif text-3xl text-[#173F35]">
                  You Might Also Enjoy
                </h2>
              </div>
              <Link
                href="/menu"
                className="text-sm font-medium text-[#173F35] underline underline-offset-4 hover:text-[#285747]"
              >
                See all dishes
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StorefrontShell>
  );
}
