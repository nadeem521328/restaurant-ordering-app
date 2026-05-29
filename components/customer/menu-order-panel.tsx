"use client";

import { MenuItemCard } from "@/components/customer/menu-item-card";
import { StickyCart } from "@/components/customer/sticky-cart";
import { useCart } from "@/hooks/use-cart";
import type { MenuItem } from "@/types/menu";
import type { RestaurantStatus } from "@/types/restaurant";

export function MenuOrderPanel({
  items,
  restaurantStatus
}: {
  items: MenuItem[];
  restaurantStatus: RestaurantStatus;
}) {
  const cart = useCart();
  const orderingDisabled = restaurantStatus !== "OPEN";
  const visibleItems = items.slice(0, 1);

  return (
    <>
      <div className="space-y-4">
        {visibleItems.map((item) => {
          const cartItem = cart.items.find(
            (entry) => entry.menuItemId === item.id
          );
          const quantity = cartItem?.quantity ?? 0;

          return (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={quantity}
              disabled={orderingDisabled}
              onChangeQuantity={(nextQuantity) =>
                cart.setQuantity(
                  {
                    menuItemId: item.id,
                    name: item.name,
                    price: item.price,
                    imageUrl: item.image_url
                  },
                  nextQuantity
                )
              }
            />
          );
        })}
      </div>

      <StickyCart
        quantity={cart.totalQuantity}
        totalPrice={cart.totalPrice}
        disabled={orderingDisabled}
      />
    </>
  );
}
