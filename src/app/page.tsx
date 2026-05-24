"use client";

import { useCallback, useRef, useState } from "react";

import ProductCard from "../components/client/Menu/ProductCard";
import OrderModal from "../components/client/modal/OrderModal";

import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";

import { Product } from "@/types";
import MainShopLayout from "@/components/layout/MainShopLayout";
import CheckoutInfoModal from "../components/client/modal/CheckoutInfoModal";
import PaymentSelectionModal from "../components/client/payment/PaymentSelectionModal";

export default function MainShopPage() {
  const {
    data: products,
    loading,
    error,
    setAll,
    setCategory,
    setBestSellers,
  } = useProducts();

  const { addToCart, checkout } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCheckoutInfo, setShowCheckoutInfo] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  // const hasInitSearch = useRef(false);

  const handleSearch = useCallback((query: string) => {
    const clean = query.trim();

    if (!clean) {
      setAll();
      return;
    }

    setAll({
      search: clean,
      page: 1,
    });
  }, [setAll]);

  const handleCategory = (categoryId: string | number) => {
    if (categoryId === "all") {
      setAll();
      return;
    }

    if (categoryId === "best-sellers") {
      setBestSellers(20);
      return;
    }

    setCategory(Number(categoryId));
  };

  const handleOrderClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
      <MainShopLayout onSearch={handleSearch} onCategory={handleCategory}>
        {error && (
            <p className="text-xs text-red-400 mb-3">{error}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {loading ? (
              <p className="text-gray-400 col-span-full">Loading...</p>
          ) : products.length > 0 ? (
              products.map((product) => (
                  <ProductCard
                      key={product.id}
                      name={product.name}
                      price={`${product.price}$`}
                      image={product.images?.[0]?.url || ""}
                      onOrder={() => handleOrderClick(product)}
                  />
              ))
          ) : (
              <p className="text-gray-400 col-span-full">
                No products found
              </p>
          )}
        </div>

        {/* ORDER MODAL */}
        {isModalOpen && selectedProduct && (
            <OrderModal
                product={selectedProduct}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedProduct(null);
                }}
                onConfirm={async (order: any) => {
                  await addToCart({
                    product_id: order.product_id,
                    quantity: order.quantity,
                    variants: order.variants,
                  });

                  setIsModalOpen(false);
                  setSelectedProduct(null);
                }}
            />
        )}

        {/* CHECKOUT INFO */}
        {showCheckoutInfo && (
            <CheckoutInfoModal
                onClose={() => setShowCheckoutInfo(false)}
                onNext={() => {
                  setShowCheckoutInfo(false);
                  setShowPayment(true);
                }}
            />
        )}

        {/* PAYMENT */}
        {showPayment && (
            <PaymentSelectionModal
                onClose={() => setShowPayment(false)}
                onSelectPayment={async (type) => {
                  await checkout(type);
                  setShowPayment(false);
                }}
            />
        )}
      </MainShopLayout>
  );
}