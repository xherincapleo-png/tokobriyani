import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data/repository";
import { ProductsManager } from "@/components/admin/products-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getProducts({ includeUnavailable: true }),
    getCategories(true),
  ]);

  return <ProductsManager initialProducts={products} categories={categories} />;
}
