import PropTypes from 'prop-types';
import { useCart } from './CartContext.jsx';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const AddToCartButton = ({ item, classs, onToast }) => {
  const { addToCart, getItemQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  console.log(classs);
  if (!item) return null;

  const itemId = String(item.id || item.slug || '');
  const itemType = item.type || (item.slug ? 'plan' : 'product');
  if (!itemId) return null;

  const quantity = getItemQuantity ? getItemQuantity(itemId) : 0;

  const handleAdd = async (e) => {
    e && e.preventDefault && e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      // optimistic update
  addToCart(itemId, itemType);
      setShowToast(true);
      if (onToast) onToast('Added to cart');
      setTimeout(() => setShowToast(false), 2600);
    } catch (err) {
      // ideally rollback optimistic update here
      console.error('Add to cart failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={handleAdd}
        aria-label={`Add ${item.name || item.title || itemId} to cart`}
        disabled={loading}
        className={`bg-gold2 hover:bg-gold2/80 text-white font-medium px-6 py-3 rounded-md flex justify-between items-center gap-2 mt-3 transition flex-row ${classs}`}
      >
        <ShoppingCart size={16}/>
        <span>{loading ? 'Adding...' : (quantity > 0 ? `In Cart (${quantity})` : 'Add to cart')}</span>
        <div/>
      </button>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 bg-black text-white px-3 py-2 rounded shadow-md text-sm z-50"
          >
            Added to cart
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

AddToCartButton.propTypes = {
  item: PropTypes.object.isRequired,
  classs: PropTypes.string,
  onToast: PropTypes.func,
};

export default AddToCartButton;


// import PropTypes from 'prop-types';
// import { useCart } from './CartContext';

// const AddToCartButton = ({ item, className = '' }) => {
//   const { addToCart, cartItems } = useCart();
  
//   // Handle undefined item
//   if (!item) {
//     return null;
//   }
  
//   // Use slug for plans, id for products
//   const itemId = item.slug || item.id;
//   if (!itemId) {
//     return null;
//   }
  
//   const isInCart = cartItems.some(cartItem => 
//     (cartItem.slug || cartItem.id) === itemId
//   );
  
//   const handleAddToCart = () => {
//     if (item && itemId) {
//       addToCart(item);
//     }
//   };

//   return (
//     <button
//       onClick={handleAddToCart}
//       className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
//         isInCart
//           ? 'bg-green-600 text-white hover:bg-green-700'
//           : 'bg-blue-600 text-white hover:bg-blue-700'
//       } ${className}`}
//     >
//       {isInCart ? 'Added to Cart' : 'Add to Cart'}
//     </button>
//   );
// };

// AddToCartButton.propTypes = {
//   item: PropTypes.shape({
//     id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//     slug: PropTypes.string,
//     price: PropTypes.number.isRequired,
//   }).isRequired,
//   className: PropTypes.string,
// };

// export default AddToCartButton;
