"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Plus } from "lucide-react";
import type { Product } from "@/types/database";
import { useCart } from "@/hooks/use-cart";
import { formatIDR } from "@/lib/utils/format";
import { FoodImage } from "@/components/ui/food-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = React.useState(false);

  const isOutOfStock =
    !product.is_available || (product.stock !== null && product.stock <= 0);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    const added = addItem(product, { quantity: 1 });
    if (added) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1200);
    }
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-[#E8E3D8] bg-[#FCFAF6] transition-all duration-200 hover:border-[#173F35]/30 hover:shadow-editorial">
      <Link
        href={`/menu/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-[#F7F1E5]"
      >
        <FoodImage
          src={product.image_url}
          alt={product.name}
          containerClassName="h-full w-full"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.is_featured && (
            <Badge variant="spice" className="shadow-sm">
              Best Seller
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="muted" className="bg-[#272923]/85 text-[#FCFAF6]">
              Sold Out
            </Badge>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {product.category?.name && (
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A7A70]">
            {product.category.name}
          </p>
        )}

        <Link href={`/menu/${product.slug}`} className="mt-1.5 block">
          <h3 className="font-serif text-xl leading-snug text-[#272923] transition-colors group-hover:text-[#173F35]">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-[#7A7A70]">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#E8E3D8] pt-4">
          <div>
            <p className="text-base font-semibold text-[#173F35]">
              {formatIDR(product.price)}
            </p>
            <p className="text-[11px] text-[#7A7A70]">
              {isOutOfStock ? "Currently unavailable" : "Ready to order"}
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            variant={justAdded ? "secondary" : "default"}
            disabled={isOutOfStock}
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
            className="shrink-0"
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
