"use client";

interface ProductCardProps {
    name: string;
    price: string;
    image: string;
    onOrder?: () => void;
}

const ProductCard = ({ name, price, image, onOrder }: ProductCardProps) => {
    return (
        <div className="bg-[#fcfcfc] p-3 sm:p-4 rounded-[24px] sm:rounded-[30px] border border-[#f1f1f1] hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col">

            {/* Image */}
            <div className="bg-[#f7f7f7] rounded-[18px] sm:rounded-[24px] aspect-square flex items-center justify-center mb-3 sm:mb-5">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-[70%] sm:w-[76%] h-[70%] sm:h-[76%] object-contain"
                    />
                ) : (
                    <div className="text-xs sm:text-sm text-gray-400">No Image</div>
                )}
            </div>

            {/* Content */}
            <div className="px-1 flex-1">
                <h3 className="text-sm sm:text-[16px] font-medium text-[#2b2b2b] line-clamp-2">
                    {name}
                </h3>

                <p className="text-xs sm:text-[15px] text-[#2b2b2b] mt-1 font-khmer">
                    តម្លៃ : {price}
                </p>
            </div>

            {/* Button */}
            <button
                onClick={onOrder}
                className="w-full mt-3 sm:mt-6 py-2 sm:py-3 rounded-full cursor-pointer bg-[#d18b47] text-white font-khmer hover:opacity-90 transition text-sm sm:text-base"
            >
                កម្មង់
            </button>
        </div>
    );
};

export default ProductCard;