"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { RootState, AppDispatch } from "@/store";
import {
  setCartItems,
  updateCartItem,
  removeCartItem,
  setLoading,
  setError,
} from "@/store/slices/cartSlice";
import { API_ENDPOINTS } from "@/lib/api";
import BuyerShell from "../components/BuyerShell";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const buyer = useSelector((state: RootState) => state.auth.buyer);
  const [updatingQuantity, setUpdatingQuantity] = useState<string | null>(null);
  const userId = buyer?._id;

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const fetchCart = async () => {
    if (!userId) return;
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${API_ENDPOINTS.GET_CART}/${user._id}`);
      if (!response.ok) throw new Error("Failed to fetch cart");
      const data = await response.json();
      dispatch(setCartItems(data.data?.items || []));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await handleRemoveProduct(productId);
      return;
    }

    setUpdatingQuantity(productId);
    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_CART_QUANTITY, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
          quantity,
        }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");
      const data = await response.json();
      dispatch(setCartItems(data.data?.items || []));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      setUpdatingQuantity(null);
    }
  };

  const handleRemoveProduct = async (productId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.REMOVE_FROM_CART, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId,
        }),
      });

      if (!response.ok) throw new Error("Failed to remove product");
      const data = await response.json();
      dispatch(setCartItems(data.data?.items || []));
      dispatch(removeCartItem(productId));
      dispatch(setError(null));
    } catch (error: any) {
      dispatch(setError(error.message));
    }
  };

  const totalPrice = items.reduce((sum, item) => {
    const unitPrice = item.product.minPrice ?? item.product.price ?? 0;
    return sum + unitPrice * item.quantity;
  }, 0);

  if (loading) {
    return (
      <BuyerShell showFooter>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg bg-gray-200 h-24" />
            ))}
          </div>
        </div>
      </BuyerShell>
    );
  }

  if (!buyer) {
    return (
      <BuyerShell showFooter>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-center">
          <p className="mb-4 text-lg font-medium">Please log in to view your cart</p>
          <Link href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg">
            Go to Login
          </Link>
        </div>
      </BuyerShell>
    );
  }

  if (items.length === 0) {
    return (
      <BuyerShell showFooter>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-shop-border bg-shop-surface-raised p-12 text-center">
            <p className="text-lg font-medium text-foreground mb-4">Your cart is empty</p>
            <p className="text-shop-muted mb-6">Start adding products to your cart</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </BuyerShell>
    );
  }

  return (
    <BuyerShell showFooter cartCount={items.length}>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="flex gap-4 rounded-2xl border border-shop-border bg-shop-surface-raised p-4"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-lg bg-shop-surface overflow-hidden flex-shrink-0">
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-medium text-foreground truncate hover:text-blue-600 transition">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-shop-muted">
                    ₹{(item.product.minPrice ?? item.product.price ?? 0).toLocaleString()}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                    disabled={updatingQuantity === item.product._id}
                    className="p-1 rounded hover:bg-shop-surface transition disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      handleUpdateQuantity(item.product._id, value);
                    }}
                    disabled={updatingQuantity === item.product._id}
                    className="w-12 text-center border border-shop-border rounded py-1 disabled:opacity-50"
                    min="1"
                  />
                  <button
                    onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                    disabled={updatingQuantity === item.product._id}
                    className="p-1 rounded hover:bg-shop-surface transition disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-foreground">
                    ₹{((item.product.minPrice || 0) * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveProduct(item.product._id)}
                  className="text-shop-muted hover:text-red-600 transition p-1"
                  aria-label="Remove product"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl border border-shop-border bg-shop-surface-raised p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 pb-4 border-b border-shop-border">
              <div className="flex justify-between text-sm">
                <span className="text-shop-muted">Subtotal:</span>
                <span className="text-foreground">₹{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-shop-muted">Shipping:</span>
                <span className="text-foreground">₹0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-shop-muted">Tax:</span>
                <span className="text-foreground">₹0</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-semibold text-foreground">Total:</span>
              <span className="text-xl font-bold text-foreground">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium mb-3">
              Proceed to Checkout
            </button>
            <Link
              href="/products"
              className="block text-center text-blue-600 hover:text-blue-700 transition text-sm py-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </BuyerShell>
  );
}
