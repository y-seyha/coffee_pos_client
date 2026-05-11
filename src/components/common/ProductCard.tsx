interface ProductCardProps {
  name: string;
  price: string;
  image: string;
}

const ProductCard = ({ name, price, image }: ProductCardProps) => {
  return (
    <div className="bg-[#fcfcfc] p-4 rounded-[30px] border border-[#f1f1f1] hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Image Box */}
      <div className="bg-[#f7f7f7] rounded-[24px] aspect-square flex items-center justify-center mb-6">
        <img
          src={image}
          alt={name}
          className="w-[76%] h-[76%] object-contain"
        />
      </div>

      {/* Content */}
      <div className="px-1">
        <h3 className="text-[16px] font-medium text-[#2b2b2b]">{name}</h3>

        <p className="text-[15px] text-[#2b2b2b] mt-1 font-khmer">
          តម្លៃ : {price}
        </p>
      </div>

      {/* Button */}
      <button className="w-full mt-6 py-3 rounded-full bg-[#d18b47] text-white text-sm font-khmer hover:opacity-90 transition">
        កម្មង់
      </button>
    </div>
  );
};

export default ProductCard;
