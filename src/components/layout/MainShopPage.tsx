import Navbar from "../common/Navbar";
import CheckoutSidebar from "../common/CheckoutSidebar";
import CategoryBar from "../common/CategoryBar";

interface ShopLayoutProps {
  children: React.ReactNode;
}

export default function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-8">
          <div className="max-w-[1200px] mx-auto">
            <CategoryBar />
          </div>

          <div className="pb-10 pt-4 max-w-[1200px] mx-auto">{children}</div>
        </div>

        <aside className="hidden lg:block h-[calc(100vh-80px)] sticky top-0 border-l border-gray-100">
          <CheckoutSidebar />
        </aside>
      </div>
    </div>
  );
}
