"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Category, Product } from "@/types/database";
import { ProductCard } from "./product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface MenuBrowserProps {
  categories: Category[];
  products: Product[];
  initialCategory?: string;
}

type SortOption = "featured" | "price-asc" | "price-desc" | "name-asc";

export function MenuBrowser({
  categories,
  products,
  initialCategory = "all",
}: MenuBrowserProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("featured");

  const filteredProducts = React.useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category?.slug === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category?.name.toLowerCase().includes(q) ?? false)
      );
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div
        role="tablist"
        aria-label="Menu categories"
        className="flex items-center gap-2 overflow-x-auto pb-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === "all"}
          onClick={() => setSelectedCategory("all")}
          className={cn(
            "shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            selectedCategory === "all"
              ? "bg-[#173F35] text-[#FCFAF6]"
              : "border border-[#E8E3D8] bg-[#F7F1E5] text-[#272923] hover:border-[#173F35]/40 hover:text-[#173F35]"
          )}
        >
          All Menu
        </button>

        {categories.map((cat) => {
          const active = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCategory(cat.slug)}
              className={cn(
                "shrink-0 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[#173F35] text-[#FCFAF6]"
                  : "border border-[#E8E3D8] bg-[#F7F1E5] text-[#272923] hover:border-[#173F35]/40 hover:text-[#173F35]"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col gap-3 rounded-lg border border-[#E8E3D8] bg-[#F7F1E5]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7A70]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Briyani, Chicken Tikka, Naan, Mango Lassi..."
            aria-label="Search menu items"
            className="pl-10 pr-9"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7A70] hover:text-[#272923]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-[#7A7A70]" />
          <label htmlFor="menu-sort" className="sr-only">
            Sort menu items
          </label>
          <select
            id="menu-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="h-10 rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-3 text-sm text-[#272923] focus:border-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]/20"
          >
            <option value="featured">Sort: Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-[#7A7A70]">
        <p>
          Showing <span className="font-medium text-[#272923]">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "dish" : "dishes"}
          {selectedCategory !== "all" && (
            <>
              {" "}
              in{" "}
              <span className="font-medium text-[#173F35]">
                {categories.find((c) => c.slug === selectedCategory)?.name}
              </span>
            </>
          )}
        </p>
        {(selectedCategory !== "all" || searchQuery.trim()) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-[#173F35] underline underline-offset-4 hover:text-[#285747]"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-[#E8E3D8] bg-[#F7F1E5]/60 px-6 py-16 text-center">
          <h3 className="font-serif text-2xl text-[#272923]">No dishes matched your search</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#7A7A70]">
            Try searching for another dish name or switch back to All Menu to browse our complete kitchen selection.
          </p>
          <Button type="button" variant="secondary" onClick={clearFilters} className="mt-6">
            View Full Menu
          </Button>
        </div>
      )}
    </div>
  );
}
