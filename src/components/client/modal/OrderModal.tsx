"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface OrderModalProps {
  product: any;
  onClose: () => void;
  onConfirm: (order: any) => void;
}

const OrderModal = ({ product, onClose, onConfirm }: OrderModalProps) => {
  if (!product) return null;

  const [ice, setIce] = useState<number | null>(null);
  const [sugar, setSugar] = useState<number | null>(null);
  const [size, setSize] = useState<number | null>(null);

  //  check variant exists
  const hasVariant = (code: string) => {
    return product?.variant_groups?.some(
        (g: any) => g.variant_group?.code === code
    );
  };

  const getOptions = (code: string) => {
    const options =
        product?.variant_groups?.find(
            (g: any) => g.variant_group?.code === code
        )?.variant_group?.options || [];

    return [...options].sort((a: any, b: any) => {
      if (
          a.sort_order !== undefined &&
          b.sort_order !== undefined
      ) {
        return a.sort_order - b.sort_order;
      }
      const aNum = parseInt(a.name);
      const bNum = parseInt(b.name);

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }

      return a.name.localeCompare(b.name);
    });
  };


  const iceOptions = getOptions("ice_level");
  const sugarOptions = getOptions("sugar_level");
  const sizeOptions = getOptions("size");

  // reset when product changes
  useEffect(() => {
    setIce(null);
    setSugar(null);
    setSize(null);
  }, [product?.id]);

  // set defaults safely
  useEffect(() => {
    if (!product) return;

    const getDefault = (code: string) => {
      const group = product.variant_groups?.find(
          (g: any) => g.variant_group?.code === code
      );

      const options = group?.variant_group?.options || [];

      return (
          options.find((o: any) => o.is_default)?.id ||
          options?.[0]?.id ||
          null
      );
    };

    if (hasVariant("ice_level")) setIce(getDefault("ice_level"));
    if (hasVariant("sugar_level")) setSugar(getDefault("sugar_level"));
    if (hasVariant("size")) setSize(getDefault("size"));
  }, [product]);

  const handleConfirm = () => {
    const variants: any[] = [];

    if (ice) {
      const group = product.variant_groups.find(
          (g: any) => g.variant_group?.code === "ice_level"
      );

      variants.push({
        variant_group_id: group?.variant_group_id,
        variant_option_id: ice,
      });
    }

    if (sugar) {
      const group = product.variant_groups.find(
          (g: any) => g.variant_group?.code === "sugar_level"
      );

      variants.push({
        variant_group_id: group?.variant_group_id,
        variant_option_id: sugar,
      });
    }

    if (size) {
      const group = product.variant_groups.find(
          (g: any) => g.variant_group?.code === "size"
      );

      variants.push({
        variant_group_id: group?.variant_group_id,
        variant_option_id: size,
      });
    }

    onConfirm({
      product_id: product.id,
      quantity: 1,
      variants,
    });
  };

  return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 font-sans">
        <div className="relative bg-white w-full max-w-[420px] rounded-[24px] p-6 shadow-xl">

          {/* Close */}
          <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-[#FF4D4D] text-white p-1 rounded-lg hover:bg-red-600 transition-colors"
          >
            <X size={18} strokeWidth={3} />
          </button>

          {/* HEADER */}
          <div className="flex gap-4 items-center mb-8">
            <div className="w-28 h-28 bg-[#F7F7F7] rounded-2xl flex items-center justify-center">
              {product.images?.[0]?.url ? (
                  <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-20 h-20 object-contain"
                  />
              ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400">
                    No image
                  </div>
              )}
            </div>

            <div className="ml-10 flex-1">
              <h2 className="text-xl font-bold text-[#333] mb-1">
                {product.name}
              </h2>

              <p className="text-[15px] font-medium text-[#444]">
                តម្លៃ ៖ {product.price}$
              </p>

              <p className="text-[15px] font-medium text-[#FF6B6B]">
                បញ្ចុះតម្លៃ ៖ {product.discount?.value ?? 0}%
              </p>
            </div>
          </div>

          {/* ICE */}
          {hasVariant("ice_level") && (
              <div className="flex items-center">
                <label className="w-16 text-[15px] font-bold text-[#333]">
                  ទឹកកក
                </label>

                <div className="flex-1 flex bg-white border border-gray-200 p-0.5 rounded-full overflow-hidden">
                  {iceOptions.map((opt: any) => (
                      <button
                          key={opt.id}
                          onClick={() => setIce(opt.id)}
                          className={`flex-1 py-1.5 px-3 rounded-full text-sm font-medium transition-all ${
                              ice === opt.id
                                  ? "bg-[#D5904B] text-white"
                                  : "text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        {opt.name}
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* SUGAR */}
          {hasVariant("sugar_level") && (
              <div className="flex items-center mt-5">
                <label className="w-16 text-[15px] font-bold text-[#333]">
                  ស្ករ
                </label>

                <div className="flex-1 flex bg-white border border-gray-200 p-0.5 rounded-full overflow-hidden">
                  {sugarOptions.map((opt: any) => (
                      <button
                          key={opt.id}
                          onClick={() => setSugar(opt.id)}
                          className={`flex-1 py-1.5 text-[13px] font-medium rounded-full transition-all ${
                              sugar === opt.id
                                  ? "bg-[#D5904B] text-white"
                                  : "text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        {opt.name}
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* SIZE */}
          {hasVariant("size") && (
              <div className="flex items-center mt-5">
                <label className="w-16 text-[15px] font-bold text-[#333]">
                  ទំហំ
                </label>

                <div className="flex-1 flex bg-white border border-gray-200 p-0.5 rounded-full overflow-hidden">
                  {sizeOptions.map((opt: any) => (
                      <button
                          key={opt.id}
                          onClick={() => setSize(opt.id)}
                          className={`flex-1 py-1.5 text-sm font-medium rounded-full transition-all ${
                              size === opt.id
                                  ? "bg-[#D5904B] text-white"
                                  : "text-gray-500 hover:bg-gray-50"
                          }`}
                      >
                        {opt.name}
                      </button>
                  ))}
                </div>
              </div>
          )}

          {/* ORDER */}
          <button
              onClick={handleConfirm}
              className="w-full h-10 mt-10 rounded-xl bg-[#D5904B] text-white text-lg font-bold flex items-center justify-center hover:bg-[#c07e3e] active:scale-[0.98] transition-all shadow-md"
          >
            កម្មង់
          </button>
        </div>
      </div>
  );
};

export default OrderModal;