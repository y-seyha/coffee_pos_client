import ProductCard from "@/components/common/ProductCard";
import ShopLayout from "@/components/layout/MainShopPage";

export default function MainShopPage() {
  const products = Array(8).fill({
    name: "Iced Americano",
    price: "1.00$",
    image: "/coffee_cup.png",
  });

  return (
    <ShopLayout>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,220px))] gap-x-5 gap-y-7">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </ShopLayout>
  );
}
