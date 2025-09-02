import PropTypes from 'prop-types';
import { useCart } from './CartContext';

const AddToCartButton = ({ item, className = '' }) => {
  const { addToCart, cartItems } = useCart();

  if (!item) return null;

  const itemId = item.id || item.slug;
  const itemType = item.type || (item.slug ? 'plan' : 'product');

  if (!itemId || !itemType) return null;

  const isInCart = !!cartItems[itemId];

  const handleAddToCart = () => {
    addToCart(itemId, itemType);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
        isInCart
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${className}`}
    >
      {isInCart ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
};

AddToCartButton.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    slug: PropTypes.string,
    type: PropTypes.string, // 'product' or 'plan'
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  }).isRequired,
  className: PropTypes.string,
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
