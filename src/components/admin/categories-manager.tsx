"use client";

import * as React from "react";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types/database";
import { slugify } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog, Modal } from "@/components/ui/modal";

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export function CategoriesManager({
  initialCategories,
}: CategoriesManagerProps) {
  const [categories, setCategories] =
    React.useState<Category[]>(initialCategories);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Category | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [slugTouched, setSlugTouched] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<Category | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const [form, setForm] = React.useState({
    name: "",
    slug: "",
    description: "",
    sort_order: "0",
    is_active: true,
  });

  const sortedCategories = React.useMemo(
    () =>
      [...categories].sort(
        (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)
      ),
    [categories]
  );

  const openCreate = () => {
    setEditing(null);
    setSlugTouched(false);
    setForm({
      name: "",
      slug: "",
      description: "",
      sort_order: String(categories.length + 1),
      is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setSlugTouched(true);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      sort_order: String(category.sort_order),
      is_active: category.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description || null,
        sort_order: Number(form.sort_order) || 0,
        is_active: form.is_active,
      };

      const url = editing
        ? `/api/admin/categories/${editing.id}`
        : "/api/admin/categories";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error || "Failed to save category.");
        setSaving(false);
        return;
      }

      if (editing) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editing.id
              ? { ...data.category, product_count: c.product_count }
              : c
          )
        );
        toast.success(`Updated category "${data.category.name}".`);
      } else {
        setCategories((prev) => [...prev, data.category]);
        toast.success(`Created category "${data.category.name}".`);
      }
      setModalOpen(false);
    } catch {
      toast.error("Network error while saving category.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: category.name,
          slug: category.slug,
          description: category.description,
          sort_order: category.sort_order,
          is_active: !category.is_active,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to update category.");
        return;
      }
      setCategories((prev) =>
        prev.map((c) =>
          c.id === category.id
            ? { ...data.category, product_count: c.product_count }
            : c
        )
      );
      toast.success(
        `${category.name} is now ${!category.is_active ? "active" : "hidden"}.`
      );
    } catch {
      toast.error("Network error.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Could not delete category.");
        setDeleting(false);
        setDeleteTarget(null);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success(`Deleted category "${deleteTarget.name}".`);
      setDeleteTarget(null);
    } catch {
      toast.error("Network error while deleting category.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl text-[#173F35]">Categories</h1>
          <p className="mt-1 text-sm text-[#7A7A70]">
            Organize menu tabs, sort display order, and toggle visibility. Categories with assigned products cannot be deleted until products are reassigned.
          </p>
        </div>
        <Button type="button" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="border-b border-[#E8E3D8] bg-[#F7F1E5]/70 text-xs uppercase tracking-wider text-[#7A7A70]">
              <tr>
                <th className="px-5 py-3.5 font-medium">Order</th>
                <th className="px-4 py-3.5 font-medium">Category</th>
                <th className="px-4 py-3.5 font-medium">Products</th>
                <th className="px-4 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3D8]">
              {sortedCategories.map((cat) => (
                <tr
                  key={cat.id}
                  className="transition-colors hover:bg-[#F7F1E5]/35"
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-[#7A7A70]">
                    #{cat.sort_order}
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-[#272923]">{cat.name}</p>
                    <p className="text-xs text-[#7A7A70]">/{cat.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="cream">{cat.product_count ?? 0} dish(es)</Badge>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={cat.is_active}
                        onCheckedChange={() => handleToggleActive(cat)}
                        aria-label={`Toggle ${cat.name} active`}
                      />
                      <span className="text-xs text-[#7A7A70]">
                        {cat.is_active ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(cat)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(cat)}
                        className="text-red-700 hover:bg-red-50 hover:text-red-800"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing ? `Edit ${editing.name}` : "Add Category"}
        description="Configure category details and menu tab sort order."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Category Name *</Label>
              <Input
                id="cat-name"
                required
                value={form.name}
                onChange={(e) => {
                  const v = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name: v,
                    slug: slugTouched ? prev.slug : slugify(v),
                  }));
                }}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-slug">Slug *</Label>
              <Input
                id="cat-slug"
                required
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc">Description</Label>
            <Textarea
              id="cat-desc"
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-sort">Sort Order</Label>
              <Input
                id="cat-sort"
                type="number"
                min={0}
                value={form.sort_order}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, sort_order: e.target.value }))
                }
              />
            </div>

            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2.5 text-sm">
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, is_active: checked }))
                  }
                />
                <span>Visible on storefront</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editing ? (
                "Save Changes"
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Delete category "${deleteTarget?.name}"?`}
        description={
          (deleteTarget?.product_count ?? 0) > 0
            ? `This category still has ${deleteTarget?.product_count} product(s). Deletion will be blocked until you reassign those products to another category.`
            : "This will permanently remove the empty category."
        }
        confirmLabel="Delete Category"
        loading={deleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
