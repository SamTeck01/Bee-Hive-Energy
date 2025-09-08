import PropTypes from 'prop-types';
import { useCart } from './CartContext.jsx';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const AddToCartButton = ({ item, className = '', onToast }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!item) return null;

  const itemId = String(item.id || item.slug || '');
  const itemType = item.type || (item.slug ? 'plan' : 'product');
  if (!itemId) return null;

  // read the actual quantity from cart context
  const quantity = typeof getItemQuantity === 'function' ? getItemQuantity(itemId) : 0;

  const doToast = (msg = 'Added to cart') => {
    setShowToast(true);
    if (onToast) onToast(msg);
    setTimeout(() => setShowToast(false), 2600);
  };

  const handleAdd = async (e) => {
    e?.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      // optimistic update via context
      addToCart(itemId, itemType);
      doToast();
    } catch (err) {
      console.error('Add to cart failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    addToCart(itemId, itemType);
    doToast();
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    removeFromCart(itemId);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* If not in cart: show primary add button */}
      {quantity <= 0 ? (
        <button
          onClick={handleAdd}
          aria-label={`Add ${item.name || item.title || itemId} to cart`}
          disabled={loading}
          className={`bg-gold2 hover:bg-gold2/80 text-white font-medium px-6 py-3 rounded-md flex items-center justify-between transition w-full`}
        >
          <ShoppingCart size={16} />
          <span>{loading ? 'Adding...' : 'Add to cart'}</span>
          <div/>
        </button>
      ) : (
        // When item is in cart show compact quantity controls
        <div className="flex items-center justify-between gap-3 w-full ">
          <button
            onClick={handleDecrease}
            aria-label="Decrease quantity"
            className="px-5 py-3 text-lg rounded-md bg-gray-200 flex items-center justify-center text-gray-700"
          >
            -
          </button>

          <div className="px-3 text-center text-lg font-medium">{quantity}</div>

          <button
            onClick={handleIncrease}
            aria-label="Increase quantity"
            className="px-5 py-3 rounded-md bg-gold2 text-white flex items-center justify-center"
          >
            +
          </button>
        </div>
      )}

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
  className: PropTypes.string,
  onToast: PropTypes.func,
};

export default AddToCartButton;