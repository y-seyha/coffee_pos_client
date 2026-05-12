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
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1200px] mx-auto py-4 space-y-6">
            {/* Category */}
            <CategoryBar onSelect={onCategory} />

            {/* Products / Children */}
            <div className="pb-10">{children}</div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:block w-[380px] border-l border-gray-100 bg-white">
          <div className="sticky top-0 h-screen">
            <CheckoutSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
