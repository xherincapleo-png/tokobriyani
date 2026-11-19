"use client";

import * as React from "react";
import {
  Edit2,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import type { Category, Product } from "@/types/database";
import { formatIDR, slugify } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FoodImage } from "@/components/ui/food-image";
import { ConfirmDialog, Modal } from "@/components/ui/modal";

interface ProductsManagerProps {
  initialProducts: Product[];
  categories: Category[];
}

const PAGE_SIZE = 8;

interface ProductFormState {
  category_id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  image_url: string;
  is_available: boolean;
  is_featured: boolean;
  stock: string;
}

export function ProductsManager({
  initialProducts,
  categories,
}: ProductsManagerProps) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Product | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [slugTouched, setSlugTouched] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<Product | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const defaultCategoryId = categories[0]?.id ?? "";

  const [form, setForm] = React.useState<ProductFormState>({
    category_id: defaultCategoryId,
    name: "",
    slug: "",
    description: "",
    price: "",
    image_url: "",
    is_available: true,
    is_featured: false,
    stock: "",
  });

  const filtered = React.useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== "all" && p.category_id !== categoryFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    setPage(1);
  }, [search, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setSlugTouched(false);
    setForm({
      category_id: defaultCategoryId,
      name: "",
      slug: "",
      description: "",
      price: "",
      image_url: "",
      is_available: true,
      is_featured: false,
      stock: "",
    });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setSlugTouched(true);
    setForm({
      category_id: product.category_id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      image_url: product.image_url || "",
      is_available: product.is_available,
      is_featured: product.is_featured,
      stock: product.stock !== null ? String(product.stock) : "",
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Image upload failed.");
        return;
      }
      setForm((prev) => ({ ...prev, image_url: data.url }));
      toast.success("Image uploaded.");
    } catch {
      toast.error("Network error during upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        category_id: form.category_id,
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        price: Number(form.price),
        image_url: form.image_url,
        is_available: form.is_available,
        is_featured: form.is_featured,
        stock: form.stock.trim() === "" ? null : Number(form.stock),
      };

      const url = editing
        ? `/api/admin/products/${editing.id}`
        : "/api/admin/products";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to save product.");
        setSaving(false);
        return;
      }

      if (editing) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editing.id ? data.product : p))
        );
        toast.success(`Updated "${data.product.name}".`);
      } else {
        setProducts((prev) => [data.product, ...prev]);
        toast.success(`Created "${data.product.name}".`);
      }
      setModalOpen(false);
    } catch {
      toast.error("Network error while saving product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to delete product.");
        setDeleting(false);
        return;
      }
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`Deleted "${deleteTarget.name}".`);
      setDeleteTarget(null);
    } catch {
      toast.error("Network error while deleting product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl text-[#173F35]">Products</h1>
          <p className="mt-1 text-sm text-[#7A7A70]">
            Manage dishes, IDR pricing, availability, photos, and featured highlights.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7A7A70]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or slug..."
              className="pl-9"
            />
          </div>
          <select
            aria-label="Filter by category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-3 text-sm text-[#272923]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Responsive Table / List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-[#E8E3D8] bg-[#F7F1E5]/70 text-xs uppercase tracking-wider text-[#7A7A70]">
              <tr>
                <th className="px-5 py-3.5 font-medium">Dish</th>
                <th className="px-4 py-3.5 font-medium">Category</th>
                <th className="px-4 py-3.5 font-medium">Price</th>
                <th className="px-4 py-3.5 font-medium">Stock</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {paginated.length > 0 ? (
                paginated.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-[#F7F1E5]/35"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-14 shrink-0 overflow-hidden rounded border border-[#E8E3D8]">
                          <FoodImage
                            src={product.image_url}
                            alt={product.name}
                            containerClassName="h-full w-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate font-medium text-[#272923]">
                              {product.name}
                            </p>
                            {product.is_featured && (
                              <Star className="h-3.5 w-3.5 shrink-0 fill-[#C96A35] text-[#C96A35]" />
                            )}
                          </div>
                          <p className="truncate text-xs text-[#7A7A70]">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#7A7A70]">
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-[#173F35]">
                      {formatIDR(product.price)}
                    </td>
                    <td className="px-4 py-3.5 text-[#7A7A70]">
                      {product.stock !== null ? product.stock : "Unlimited"}
                    </td>
                    <td className="px-4 py-3.5">
                      {product.is_available ? (
                        <Badge variant="success">Available</Badge>
                      ) : (
                        <Badge variant="muted">Unavailable</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(product)}
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(product)}
                          className="text-red-700 hover:bg-red-50 hover:text-red-800"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-[#7A7A70]"
                  >
                    No products matched your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E8E3D8] px-5 py-3 text-xs text-[#7A7A70]">
            <span>
              Page {page} of {totalPages} ({filtered.length} products)
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? `Edit ${editing.name}` : "Add New Product"}
        description="Fill in dish details. Changes appear on the live menu immediately."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="prod-name">Product Name *</Label>
              <Input
                id="prod-name"
                required
                value={form.name}
                onChange={(e) => {
                  const nextName = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name: nextName,
                    slug: slugTouched ? prev.slug : slugify(nextName),
                  }));
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-slug">URL Slug *</Label>
              <Input
                id="prod-slug"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="prod-cat">Category *</Label>
              <select
                id="prod-cat"
                required
                value={form.category_id}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category_id: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-[#E8E3D8] bg-[#FCFAF6] px-3 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-price">Price (IDR) *</Label>
              <Input
                id="prod-price"
                type="number"
                min={0}
                step={500}
                required
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="prod-stock">Stock (Optional)</Label>
              <Input
                id="prod-stock"
                type="number"
                min={0}
                placeholder="Unlimited"
                value={form.stock}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, stock: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prod-desc">Description *</Label>
            <Textarea
              id="prod-desc"
              required
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          {/* Image Upload & URL */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-md border border-[#E8E3D8]">
                <FoodImage
                  src={form.image_url}
                  alt={form.name || "Preview"}
                  containerClassName="h-full w-full"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="/images/chicken-briyani.jpg or uploaded URL"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, image_url: e.target.value }))
                  }
                />
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-[#E8E3D8] bg-[#F7F1E5] px-3 py-1.5 text-xs font-medium text-[#173F35] hover:bg-[#EFE6D4]">
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {uploading ? "Uploading..." : "Upload JPG/PNG/WebP (max 5MB)"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 rounded-md border border-[#E8E3D8] bg-[#F7F1E5]/60 p-4">
            <label className="flex items-center gap-2.5 text-sm">
              <Switch
                checked={form.is_available}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, is_available: checked }))
                }
              />
              <span>Available on menu</span>
            </label>
            <label className="flex items-center gap-2.5 text-sm">
              <Switch
                checked={form.is_featured}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, is_featured: checked }))
                }
              />
              <span>Featured / Best Seller</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || uploading}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editing ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete "${deleteTarget?.name}"?`}
        description="This action permanently removes the product from your menu catalog. Existing historical orders will keep their saved item names."
        confirmLabel="Delete Product"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
