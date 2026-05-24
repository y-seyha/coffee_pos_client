import Navbar from "../common/Navbar";
import CheckoutSidebar from "../client/Checkout/CheckoutSidebar";
import CategoryBar from "../common/CategoryBar";

interface ShopLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  onCategory?: (id: string | number) => void;
}

export default function MainShopLayout({
                                         children,
                                         onSearch,
                                         onCategory,
                                       }: ShopLayoutProps) {
  return (
      <div className="h-screen bg-[#fafafa] flex flex-col font-sans overflow-hidden">

        {/* TOP NAVBAR */}
        <Navbar onSearch={onSearch} />

        <div className="flex flex-1 overflow-hidden">

          {/* MAIN AREA */}
          <main className="flex-1 flex flex-col overflow-hidden">

            {/* CATEGORY BAR (FIXED CONTEXT) */}
            <div className="shrink-0 bg-white/70 backdrop-blur-md z-40 border-b border-gray-100">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <CategoryBar onSelect={onCategory} />
              </div>
            </div>

            {/* SCROLLABLE PRODUCTS ONLY */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-[1200px] mx-auto py-4 space-y-6">
                {children}
              </div>
            </div>

          </main>

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-[380px] border-l border-gray-100 bg-white overflow-hidden">
            <CheckoutSidebar />
          </aside>

        </div>
      </div>
  );
}