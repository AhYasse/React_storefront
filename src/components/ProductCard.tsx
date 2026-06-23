import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useAppDispatch } from '@/store/store';
import { addItemOptimistic } from '@/store/cartSlice';
import { CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number; // Optional: for staggered animation
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking "Add" button
    e.stopPropagation();

    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    };

    dispatch(addItemOptimistic(cartItem));
    toast.success(`Added ${product.name} to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
    >
      {/* Clickable Image Area */}
      <Link to={`/product/${product.id}`} className="block relative h-52 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : null}
        
        {/* Placeholder shown when no image or image fails */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
          <span className="text-gray-400 text-sm font-medium">Product Image</span>
        </div>

        {/* "New" or "Sale" badge (optional - can be extended) */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
            New
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating (decorative) */}
        <div className="flex items-center space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
              }`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">(4.0)</span>
        </div>

        {/* Clickable Title */}
        <Link to={`/product/${product.id}`} className="block mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price and Add to Cart Button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 block">Price</span>
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-all flex items-center space-x-2 text-sm font-semibold shadow-sm hover:shadow-md active:scale-95"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}