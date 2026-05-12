"use client";

import { useRef, useState } from "react";
import ProductCard from "@/components/common/ProductCard";
import ShopLayout from "@/components/layout/MainShopPage";
import OrderModal from "@/components/modal/OrderModal";
import { useCart } from "@/context/CartContext";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Iced Americano",
    price: "1.00$",
    image: "/coffee_cup.png",
    categoryId: 1,
  },
  {
    id: 2,
    name: "Cappuccino",
    price: "1.50$",
    image: "/coffee_cup.png",
    categoryId: 2,
  },
  {
    id: 3,
    name: "Latte",
    price: "1.80$",
    image: "/coffee_cup.png",
    categoryId: 3,
  },
  {
    id: 4,
    name: "Mocha",
    price: "2.00$",
    image: "/coffee_cup.png",
    categoryId: 4,
  },

  {
    id: 5,
    name: "Espresso",
    price: "1.20$",
    image: "/coffee_cup.png",
    categoryId: 1,
  },
  {
    id: 6,
    name: "Caramel Macchiato",
    price: "2.50$",
    image: "/coffee_cup.png",
    categoryId: 2,
  },
  {
    id: 7,
    name: "Flat White",
    price: "2.00$",
    image: "/coffee_cup.png",
    categoryId: 2,
  },
  {
    id: 8,
    name: "Iced Latte",
    price: "1.90$",
    image: "/coffee_cup.png",
    categoryId: 3,
  },
  {
    id: 9,
    name: "Matcha Latte",
    price: "2.20$",
    image: "/coffee_cup.png",
    categoryId: 3,
  },
  {
    id: 10,
    name: "Hot Chocolate",
    price: "1.70$",
    image: "/coffee_cup.png",
    categoryId: 4,
  },
  {
    id: 11,
    name: "Vanilla Cold Brew",
    price: "2.30$",
    image: "/coffee_cup.png",
    categoryId: 1,
  },
  {
    id: 12,
    name: "Hazelnut Coffee",
    price: "2.10$",
    image: "/coffee_cup.png",
    categoryId: 2,
  },
];

export default function MainShopPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!trimmed) {
        setProducts(MOCK_PRODUCTS);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:3000/product?search=${encodeURIComponent(trimmed)}`,
        );

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        setProducts(
          data?.length
            ? data
            : MOCK_PRODUCTS.filter((p) =>
                p.name.toLowerCase().includes(trimmed.toLowerCase()),
              ),
        );
      } catch (err) {
        console.error(err);

        setProducts(
          MOCK_PRODUCTS.filter((p) =>
            p.name.toLowerCase().includes(trimmed.toLowerCase()),
          ),
        );

        setError("Offline mode (mock data)");
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleCategory = async (categoryId: string | number) => {
    try {
      setLoading(true);
      setError("");

      if (categoryId === "all") {
        setProducts(MOCK_PRODUCTS);
        return;
      }

      const res = await fetch(
        `http://localhost:3000/product?categoryId=${categoryId}`,
      );

      const data = await res.json();

      setProducts(
        data?.length
          ? data
          : MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId),
      );
    } catch (err) {
      console.error(err);

      setProducts(
        categoryId === "all"
          ? MOCK_PRODUCTS
          : MOCK_PRODUCTS.filter((p) => p.categoryId === categoryId),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <ShopLayout onSearch={handleSearch} onCategory={handleCategory}>
      {error && <p className="text-xs text-orange-400 mb-3">{error}</p>}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,220px))] gap-x-5 gap-y-7">
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              onOrder={() => handleOrderClick(product)}
            />
          ))
        ) : (
          <p className="text-gray-400">No products found</p>
        )}
      </div>

      {isModalOpen && selectedProduct && (
        <OrderModal
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onConfirm={(order: any) => {
            addToCart(order);

            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </ShopLayout>
  );
}
