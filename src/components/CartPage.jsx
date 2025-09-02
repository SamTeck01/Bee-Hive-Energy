import { useCart } from './CartContext';
import { useContext } from 'react';
import { PlansContext } from './PlansContext';
import { ProductsContext } from './ProductsContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    deleteCartItem,
    clearCart,
    getTotalCartItems,
  } = useCart();

  const { plans } = useContext(PlansContext);
  const { products } = useContext(ProductsContext);
  console.log('Cart Items:', cartItems);
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[₦,]/g, ''))
      : price;

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numericPrice);
  };

  // Merge cart items with their full data
  const cartItemList = Object.entries(cartItems).map(([itemId, quantity]) => {
    const item =
      plans?.find(i => i.slug === itemId) ||
      products?.find(i => i.id === itemId);

    return item ? { ...item, quantity } : null;
  }).filter(Boolean);




  const getCartTotal = () => {
    return cartItemList.reduce((total, item) => {
      const price = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[₦,]/g, ''))
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };
  console.log('Cart Items:', cartItemList);
  if (cartItemList.length === 0) {
    return (
      <section className="px-4 py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products or plans to get started!</p>
          <Link to="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Products
          </Link>
          <Link to="/plans" className="ml-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Browse Plans
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  Cart Items ({getTotalCartItems()})
                </h2>
              </div>

              <div className="divide-y">
                {cartItemList.map(item => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    <img
                      src={item.image || '/placeholder-image.jpg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />

                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.type === 'plan' ? 'Plan' : item.category || item.title}
                      </p>
                      <p className="text-lg font-semibold text-blue-600">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>

                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => addToCart(item.id, item.type)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <button
                        onClick={() => deleteCartItem(item.id)}
                        className="text-red-600 text-sm hover:text-red-700 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalCartItems()} items)</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors block text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;



// import { useCart } from './CartContext';
// import { Link } from 'react-router-dom';

// const CartPage = () => {
//   const { 
//     cartItems, 
//     removeFromCart, 
//     updateQuantity, 
//     clearCart, 
//     getCartTotal,
//     getCartItemsCount 
//   } = useCart();

//   const handleQuantityChange = (itemId, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(itemId);
//     } else {
//       updateQuantity(itemId, newQuantity);
//     }
//   };

//   const formatPrice = (price) => {
//     // Handle string prices (like "₦450,000") and number prices
//     if (typeof price === 'string') {
//       // Remove currency symbols and commas, then convert to number
//       const numericPrice = parseFloat(price.replace(/[₦,]/g, ''));
//       return new Intl.NumberFormat('en-NG', {
//         style: 'currency',
//         currency: 'NGN',
//       }).format(numericPrice);
//     }
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN',
//     }).format(price);
//   };

//   if (cartItems.length === 0) {
//     return (
//       <section className="px-4 py-24">
//         <div className="container mx-auto text-center">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
//             <p className="text-gray-600 mb-8">Add some products to get started!</p>
//             <Link 
//               to="/products" 
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="px-4 py-24">
//       <div className="container mx-auto text-center">
//         <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow-sm">
//               <div className="p-6 border-b">
//                 <h2 className="text-xl font-semibold">
//                   Cart Items ({getCartItemsCount()})
//                 </h2>
//               </div>
              
//               <div className="divide-y">
//                 {cartItems.map((item) => (
//                   <div key={item.slug || item.id} className="p-6 flex items-center space-x-4">
//                     <img
//                       src={item.image || '/placeholder-image.jpg'}
//                       alt={item.name}
//                       className="w-20 h-20 object-cover rounded"
//                     />
                    
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                       <p className="text-sm text-gray-600">{item.category || item.title}</p>
//                       <p className="text-lg font-semibold text-blue-600">
//                         {formatPrice(item.price)}
//                       </p>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       <button
//                         onClick={() => handleQuantityChange(item.slug || item.id, item.quantity - 1)}
//                         className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
//                       >
//                         -
//                       </button>
                      
//                       <span className="w-12 text-center font-medium">
//                         {item.quantity}
//                       </span>
                      
//                       <button
//                         onClick={() => handleQuantityChange(item.slug || item.id, item.quantity + 1)}
//                         className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
//                       >
//                         +
//                       </button>
//                     </div>
                    
//                     <div className="text-right">
//                       <p className="font-semibold">
//                         {formatPrice(item.price * item.quantity)}
//                       </p>
//                       <button
//                         onClick={() => removeFromCart(item.slug || item.id)}
//                         className="text-red-600 text-sm hover:text-red-700 mt-1"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="p-6 border-t">
//                 <button
//                   onClick={clearCart}
//                   className="text-red-600 hover:text-red-700 text-sm"
//                 >
//                   Clear Cart
//                 </button>
//               </div>
//             </div>
//           </div>
          
//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Subtotal ({getCartItemsCount()} items)</span>
//                   <span className="font-semibold">{formatPrice(getCartTotal())}</span>
//                 </div>
                
//                 <div className="flex justify-between">
//                   <span>Shipping</span>
//                   <span className="text-green-600">Free</span>
//                 </div>
                
//                 <div className="border-t pt-3">
//                   <div className="flex justify-between text-lg font-semibold">
//                     <span>Total</span>
//                     <span>{formatPrice(getCartTotal())}</span>
//                   </div>
//                 </div>
//               </div>
              
//               <Link
//                 to="/checkout"
//                 className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors block text-center"
//               >
//                 Proceed to Checkout
//               </Link>
              
//               <Link
//                 to="/products"
//                 className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors block text-center"
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CartPage;
