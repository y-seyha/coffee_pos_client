import Navbar from "../common/Navbar";
import CheckoutSidebar from "../common/CheckoutSidebar";
import CategoryBar from "../common/CategoryBar";

interface ShopLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  onCategory?: (id: string | number) => void;
}

export default function ShopLayout({
  children,
  onSearch,
  onCategory,
}: ShopLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Navbar onSearch={onSearch} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8">
          <CategoryBar onSelect={onCategory} />
          <div className="pb-10 pt-4 max-w-[1200px] mx-auto">{children}</div>
        </div>

        <aside className="hidden lg:block h-[calc(100vh-80px)] sticky top-0 border-l border-gray-100">
          <CheckoutSidebar />
        </aside>
      </div>
    </div>
  );
}
