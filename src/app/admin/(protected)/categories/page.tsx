import type { Metadata } from "next";
import { getCategories } from "@/lib/data/repository";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories(true);
  return <CategoriesManager initialCategories={categories} />;
}
