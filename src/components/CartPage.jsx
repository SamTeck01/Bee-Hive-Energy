import { useCart } from './CartContext.jsx';
import { useContext, useMemo, useState } from 'react';
import { PlansContext } from './PlansContext.jsx';
import { ProductsContext } from './ProductsContext.jsx';
import { useLoading } from './LoadingContext.jsx';
import { Link } from 'react-router-dom';
import Bin from '../assets/bin.svg';
import { Phone } from 'lucide-react';

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

  // Dummy fulfillment selector state (visual only). Does NOT persist or affect totals.
  const [fulfillment, setFulfillment] = useState('delivery');

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
                  <div key={ item._id } className="p-4 gap-0">

                    <div className='grid grid-cols-2 items-center'>
                      <div className='flex items-center gap-3 flex-row w-full me-1'>
                        <img
                          src={item.image || '/placeholder-image.jpg'}
                          alt={item.name || item.title}
                          className="md:w-28 h-20 w-20 md:h-20 object-cover rounded mb-3 md:mb-0"
                        />

                        <div className="flex justify-between flex-col text-left ">
                          <h3 className="font-semibold text-gray-900">{item.name || item.title}</h3>
                          <p className="text-sm text-gray-600">{item.itemType === 'plan' ? 'Plan' : 'Product'}</p>
                          
                          {/* Delete Button */}
                          <button
                            onClick={() => deleteCartItem(item.cartId || item._id || item.id)}
                            className="text-gold2 hidden md:flex items-center gap-2 mt-2.5 "
                          >
                            <img src={Bin} alt="Remove" className='h-5 w-5' />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className='flex items-end gap-4 flex-col '>
                        <p className="text-lg font-semibold text-gold2 ">{formatPrice(item.price)}</p>

                        {/* Button */}
                        <div className="md:flex items-center gap-3 hidden">
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

                    {/* Action button on mobile */}
                    <div className="flex justify-between md:hidden">
                      <button
                        onClick={() => deleteCartItem(item.cartId || item._id || item.id)}
                        className="text-gold2 flex items-center gap-2 "
                      >
                        <img src={Bin} alt="Remove" className='h-5 w-5' />
                        Remove
                      </button>

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

              <div className="p-6 border-t flex justify-end">
                <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm flexCenter gap-1 flex-row  w-fit">
                  <div className="w-5 h-5"><svg id="Слой_1" version="1.1" viewBox="0 0 40 40"  xmlns="http://www.w3.org/2000/svg" fill="#dc2626 "><g><path d="M28,40H11.8c-3.3,0-5.9-2.7-5.9-5.9V16c0-0.6,0.4-1,1-1s1,0.4,1,1v18.1c0,2.2,1.8,3.9,3.9,3.9H28c2.2,0,3.9-1.8,3.9-3.9V16   c0-0.6,0.4-1,1-1s1,0.4,1,1v18.1C33.9,37.3,31.2,40,28,40z"/></g><g><path d="M33.3,4.9h-7.6C25.2,2.1,22.8,0,19.9,0s-5.3,2.1-5.8,4.9H6.5c-2.3,0-4.1,1.8-4.1,4.1S4.2,13,6.5,13h26.9   c2.3,0,4.1-1.8,4.1-4.1S35.6,4.9,33.3,4.9z M19.9,2c1.8,0,3.3,1.2,3.7,2.9h-7.5C16.6,3.2,18.1,2,19.9,2z M33.3,11H6.5   c-1.1,0-2.1-0.9-2.1-2.1c0-1.1,0.9-2.1,2.1-2.1h26.9c1.1,0,2.1,0.9,2.1,2.1C35.4,10.1,34.5,11,33.3,11z"/></g><g><path d="M12.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C13.9,34.6,13.4,35.1,12.9,35.1z"/></g><g><path d="M26.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C27.9,34.6,27.4,35.1,26.9,35.1z"/></g><g><path d="M19.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C20.9,34.6,20.4,35.1,19.9,35.1z"/></g></svg></div>
                  Clear Cart
                </button>
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

                {/* Fulfillment selector */}
                <div className="">
                  <div className="text-sm text-gray-600 mb-2">Delivery Details</div>
                  <div className="flex gap-2">
                    {/* <button
                      onClick={() => setFulfillment('delivery')}
                      className={`px-3 py-2 rounded-md border ${fulfillment === 'delivery' ? 'border-gold2 bg-gold2/10' : 'border-gray-200'}`}>
                      Delivery
                    </button> */}
                    <button
                      onClick={() => setFulfillment('pickup')}
                      className={`px-3 py-2 rounded-md border border-gold2 bg-gold2/10`}>
                      <input type="radio" className='text-gold2 bg-gold2' checked /> Pickup
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold">{fulfillment === 'pickup' ? 'Free' : 'Calculated at checkout'}</span>
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden mx-auto">
          <div className="flex items-center gap-4 container mx-auto">
            {/* Call/Contact anchor on the left - replace number with your support line */}
            <a
              href="tel:+2349023036748"
              aria-label="Call support"
              className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow"
            >
              <Phone size={25} />
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