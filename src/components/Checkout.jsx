import { useCart } from './CartContext.jsx';
import { useMemo, useContext } from 'react';
import { PlansContext } from './PlansContext.jsx';
import { ProductsContext } from './ProductsContext.jsx';

export default function Checkout() {
  const { cartItems } = useCart();

  const cartItemList = useMemo(() => Object.entries(cartItems).map(([id, qty]) => ({ id, qty })), [cartItems]);

  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[₦,]/g, ''))
      : price;

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numericPrice || 0);
  };

  const { plans } = useContext(PlansContext);
  const { products } = useContext(ProductsContext);

  const subtotal = useMemo(() => {
    return Object.entries(cartItems).reduce((sum, [id, stored]) => {
      const key = String(id);
      const qty = (stored && typeof stored === 'object') ? (stored.qty || 0) : (Number(stored) || 0);
      const type = (stored && typeof stored === 'object') ? (stored.type || null) : null;
      const item =
        (type === 'plan' ? plans?.find(p => String(p.slug) === key) : null) ||
        (type === 'product' ? products?.find(p => String(p._id || p.id) === key) : null) ||
        plans?.find(p => String(p.slug) === key) || products?.find(p => String(p._id || p.id) === key);
      if (!item) return sum;
      const price = typeof item.price === 'string' ? parseFloat(item.price.replace(/[₦,\s,]/g, '')) || 0 : Number(item.price) || 0;
      return sum + price * Number(qty || 0);
    }, 0);
  }, [cartItems, plans, products]);

  return (
    <div className="py-24 px-4">
      <div className="mx-auto container grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-sm">
        {/* Persistent cart summary (matches Jumia) */}
        <div className="col-span-full mb-2">
          <div className="bg-gray-50 border rounded p-3">
            <div className="text-xs text-gray-500">CART SUMMARY</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-gray-700 font-medium">Subtotal</div>
              <div className="text-sm font-semibold">{formatPrice(subtotal)}</div>
            </div>
          </div>
        </div>

        {/* Left Side - Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
          <div className="flex gap-4 mb-6">
            <button className="flex-1 border border-blue-500 text-blue-500 py-2 rounded-lg">Delivery</button>
            <button className="flex-1 border py-2 rounded-lg">Pick up</button>
          </div>

          <form className="space-y-4">
            <input type="text" placeholder="Full name" className="w-full border p-3 rounded-lg" />
            <input type="email" placeholder="Email address" className="w-full border p-3 rounded-lg" />
            <input type="tel" placeholder="Phone number" className="w-full border p-3 rounded-lg" />

            <select className="w-full border p-3 rounded-lg">
              <option>Choose country</option>
              <option>Nigeria</option>
              <option>USA</option>
            </select>

            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="City" className="border p-3 rounded-lg" />
              <input type="text" placeholder="State" className="border p-3 rounded-lg" />
            </div>

            <input type="text" placeholder="ZIP Code" className="w-full border p-3 rounded-lg" />

            <div className="flex items-center gap-2">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms" className="text-sm">I have read and agree to the Terms and Conditions.</label>
            </div>
          </form>
        </div>

        {/* Right Side - Summary */}
        <div className="lg:ps-6">
          <h3 className="text-lg font-semibold mb-4">Review your cart</h3>

          <div className="space-y-4 mb-4">
            {cartItemList.length === 0 ? (
              <div className="text-sm text-gray-500">No items in cart.</div>
            ) : (
              cartItemList.map(ci => (
                <div key={ci.id} className="flex justify-between">
                  <span>Item</span>
                  <span>Qty: {ci.qty}</span>
                </div>
              ))
            )}
          </div>

          {/* Discount */}
          <div className="mt-4 flex gap-2">
            <input type="text" placeholder="Discount code" className="flex-1 border p-2 rounded-lg" />
            <button className="bg-gray-800 text-white px-4 rounded-lg">Apply</button>
          </div>

          {/* Totals */}
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>

          {/* Pay Now */}
          <button className="mt-6 w-full bg-gold2 text-white py-3 rounded-lg">Pay Now</button>

          <p className="text-xs text-gray-500 mt-2 text-center">Secure Checkout · SSL Encrypted</p>

          {/* Mobile bottom pay bar (Jumia-like) */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 lg:hidden">
            <div className="flex items-center gap-3">
              <a
                href="tel:+234000000000"
                aria-label="Call support"
                className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h1.6a1 1 0 01.96.73l.7 2.5a1 1 0 01-.28.95L6.4 9.4a16 16 0 007.2 7.2l2.6-1.6a1 1 0 01.95-.28l2.5.7A1 1 0 0121 19.4V21a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                </svg>
              </a>

              <button className="flex-1 bg-[#ff7a00] text-white px-4 py-3 rounded-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21a1 1 0 11-2 0 1 1 0 012 0zm-8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                  <span>Pay Now</span>
                </span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
