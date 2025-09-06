import { useCart } from './CartContext.jsx';
import { useContext, useMemo } from 'react';
import { PlansContext } from './PlansContext.jsx';
import { ProductsContext } from './ProductsContext.jsx';
import { useLoading } from './LoadingContext.jsx';
import { Link } from 'react-router-dom';
import Bin from '../assets/bin.svg';

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
  const { isLoading } = useLoading();

  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[₦,]/g, ''))
      : price;

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numericPrice || 0);
  };

  const cartItemList = useMemo(() => Object.entries(cartItems).map(([itemId, stored]) => {
    const key = String(itemId);
    // stored may be { qty, type } or legacy number
    const qty = (stored && typeof stored === 'object') ? (stored.qty || 0) : (Number(stored) || 0);
    const itemType = (stored && typeof stored === 'object') ? (stored.type || null) : null;

    const item =
      (itemType === 'plan' ? plans?.find(i => String(i.slug) === key) : null) ||
      (itemType === 'product' ? products?.find(i => String(i._id) === key) : null) ||
      // fallback: try both
      plans?.find(i => String(i.slug) === key) ||
      products?.find(i => String(i._id) === key) || null;

    return item ? { ...item, quantity: qty, cartKey: key, cartId: key, itemType } : null;
  }).filter(Boolean), [cartItems, plans, products]);

  const getCartTotal = () => {
    return cartItemList.reduce((total, item) => {
      let price = 0;
      if (item.price == null) price = 0;
      else if (typeof item.price === 'string') price = parseFloat(item.price.replace(/[₦,\s,]/g, '')) || 0;
      else price = Number(item.price) || 0;
      return total + price * (Number(item.quantity) || 0);
    }, 0);
  };

  console.log('Cart Items:', cartItemList);

  if (cartItemList.length === 0) {
    return (
      <section className="px-4 py-24">
        {isLoading && (
          <div className="text-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        )}
        {!isLoading &&
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
        }
      </section>
    );
  }

  return (
    <section className="px-0 py-24">
        <div className="container mx-auto">
        {/* Persistent cart summary bar (matches Jumia mobile screenshot) */}
        <div className="">
          <div className="text-sm text-gray-500 px-4">CART SUMMARY</div>
          <div className="flex items-center justify-between mt-1 bg-white px-4 py-2">
            <div className="text-sm text-gray-700 font-medium">Subtotal</div>
            <div className="text-sm font-semibold">{formatPrice(getCartTotal())}</div>
          </div>
        </div>

        <div className="text-sm text-gray-500 px-4 my-2">CART ({getTotalCartItems()})</div>
        <div className="lg:flex lg:items-start lg:gap-8">
          {/* Left: items list */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-lg shadow-sm">

              <div className="divide-y">
                {cartItemList.map(item => (
                  <div key={ item._id } className="p-6 flex flex-row justify-between items-center">

                    <div className='flex items-center gap-3 flex-row'>
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name || item.title}
                        className="w-full md:w-28 h-40 md:h-20 object-cover rounded mb-3 md:mb-0"
                      />

                      <div className="flex justify-between flex-col text-left ">
                        <h3 className="font-semibold text-gray-900">{item.name || item.title}</h3>
                        <p className="text-sm text-gray-600">{item.itemType === 'plan' ? 'Plan' : 'Product'}</p>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => deleteCartItem(item.cartId || item._id || item.id)}
                          className="text-gold2 flex items-center gap-2 mt-2.5"
                        >
                          <img src={Bin} alt="Remove" className='h-5 w-5' />
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className='flex items-end gap-4 flex-col'>
                      <p className="text-lg font-semibold text-gold2 ">{formatPrice(item.price)}</p>

                      {/* Button */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => removeFromCart(item.cartId || item._id || item.id)}
                          className="w-8 h-8 rounded-md bg-gray-200 flex items-center justify-center text-gray-700"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>

                        <span className="w-12 text-center font-medium">{item.quantity}</span>

                        <button
                          onClick={() => addToCart(item.cartId || item._id || item.id, item.itemType || (item.slug ? 'plan' : 'product'))}
                          className="w-8 h-8 rounded-md bg-gold2 text-white flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

              <div className="p-6 border-t text-right">
                <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm">Clear Cart</button>
              </div>
            </div>
          </div>

          {/* Right: summary (sticky on desktop) */}
          <aside className="mt-6 lg:mt-0 lg:w-[360px] lg:sticky lg:top-24">
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

              <Link to="/checkout" className="w-full mt-6 bg-gold2 text-white py-3 rounded-lg hover:bg-gold2/90 transition-colors block text-center">Proceed to Checkout</Link>
              <Link to="/products" className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors block text-center">Continue Shopping</Link>
            </div>
          </aside>
        </div>

          {/* Mobile bottom bar (Jumia-like) */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden">
          <div className="flex items-center gap-3">
            {/* Call/Contact anchor on the left - replace number with your support line */}
            <a
              href="tel:+234000000000"
              aria-label="Call support"
              className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h1.6a1 1 0 01.96.73l.7 2.5a1 1 0 01-.28.95L6.4 9.4a16 16 0 007.2 7.2l2.6-1.6a1 1 0 01.95-.28l2.5.7A1 1 0 0121 19.4V21a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              </svg>
            </a>

            {/* Big Checkout button showing subtotal and item count */}
            <Link to="/checkout" className="flex-1 bg-gold2 text-white px-4 py-3 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21a1 1 0 11-2 0 1 1 0 012 0zm-8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </span>
              <span className="font-semibold">Checkout ({formatPrice(getCartTotal())})</span>
              <div></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;