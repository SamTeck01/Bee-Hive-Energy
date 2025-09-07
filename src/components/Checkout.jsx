import { useCart } from './CartContext.jsx';
import { useMemo, useContext } from 'react';
import { PlansContext } from './PlansContext.jsx';
import { ProductsContext } from './ProductsContext.jsx';

// Checkout page — simplified and heavily commented so it's easy to follow
export default function Checkout() {
  // 1) Read the global cart object from the CartContext.
  //    The shape stored in localStorage now is: { [itemId]: { qty: number, type: 'plan'|'product'|null } }
  //    but older installations may still have { [itemId]: number } — we handle both.
  const { cartItems } = useCart();

  // 2) Build a simple list of cart entries we can render safely.
  //    Each entry becomes: { id: string, qty: number, type: string|null }
  //    We use useMemo so we only recompute when cartItems changes.
  const cartItemList = useMemo(() => {
    return Object.entries(cartItems).map(([id, stored]) => {
      // stored may be { qty, type } or a raw number (legacy)
      const qty = (stored && typeof stored === 'object') ? (stored.qty || 0) : (Number(stored) || 0);
      const type = (stored && typeof stored === 'object') ? (stored.type || null) : null;
      return { id, qty, type };
    });
  }, [cartItems]);

  // 3) A small helper to consistently format prices for display.
  //    Takes numbers or strings like '₦1,200' and returns a locale formatted NGN string.
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[₦,]/g, ''))
      : price;

    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(numericPrice || 0);
  };

  // 4) Read the central product/plan datasets so we can look up full item details.
  const { plans } = useContext(PlansContext);
  const { products } = useContext(ProductsContext);

  // 5) Compute subtotal by iterating the raw cart storage (we must handle both shapes).
  //    We attempt to resolve an item first by the stored `type` (if present), otherwise
  //    we try both lists as a fallback. If the item isn't found we skip it.
  const subtotal = useMemo(() => {
    return Object.entries(cartItems).reduce((sum, [id, stored]) => {
      const key = String(id);
      const qty = (stored && typeof stored === 'object') ? (stored.qty || 0) : (Number(stored) || 0);
      const type = (stored && typeof stored === 'object') ? (stored.type || null) : null;

      // try to find the corresponding item object in plans or products
      const item =
        (type === 'plan' ? plans?.find(p => String(p.slug) === key) : null) ||
        (type === 'product' ? products?.find(p => String(p._id || p.id) === key) : null) ||
        // fallback: try both lists when type is unknown
        plans?.find(p => String(p.slug) === key) || products?.find(p => String(p._id || p.id) === key);

      if (!item) return sum; // skip missing items

      // item.price may be a string like '₦12,000' or a number — normalize to number
      const price = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[₦,\s,]/g, '')) || 0
        : Number(item.price) || 0;

      return sum + price * Number(qty || 0);
    }, 0);
  }, [cartItems, plans, products]);

  // 6) Render: form on the left, cart summary on the right. We show a simple
  //    persistent 'CART SUMMARY' at the top with the computed subtotal.
  return (
    <div className="container mx-auto py-24 px-4">
      <div className="max-w-6xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-2 text-ash">
        {/* LEFT: Shipping / Form */}
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

          {/* Delivery / Pickup toggles */}
          <div className="mb-6 ring-1 ring-gold2/50 bg-gold2/20 rounded-sm py-0.5 text-center font-medium">
            Pickup Details
          </div>

          <div className="space-y-4">
            {/* Simple form fields without actual form handling for now */}
            <div className='space-y-1'>
              <label className="block font-semibold text-sm ">Full name <span className="text-red-600 text-lg">*</span></label>
              <input className="input_field" placeholder="Enter full name" required/>
            </div>

            <div>
              <label className="block font-semibold text-sm">Email address <span className="text-red-600 text-lg">*</span></label>
              <input className="input_field" placeholder="Enter email address" required/>
            </div>  

            <div>
              <label className="block font-semibold text-sm">Phone number <span className="text-red-600 text-lg">*</span></label>
              <input className="input_field" placeholder="Enter phone number" required/>
            </div>
            
            <div>
              <label className="block font-semibold text-sm">Country</label>
              <select className="input_field">
                <option>Choose country</option>
                <option>Nigeria</option>
                <option>USA</option>
              </select>
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" className="mt-1" />
              <label htmlFor="terms" className="text-sm">I have read and agree to the Terms and Conditions.</label>
            </div>
          </div>
        </div>

        {/* RIGHT: Review panel */}
        <aside className="p-8 border-l">
          <h2 className="text-lg font-medium mb-4">Review your cart</h2>

          <div className="space-y-4 mb-6">
            {/* Show each cart item with small thumbnail, title, qty and price */}
            {cartItemList.length === 0 ? (
              <div className="text-sm text-gray-500">No items in cart.</div>
            ) : (
              cartItemList.map(ci => {
                // resolve item details (fallback to id string). Keep this simple for now.
                const id = String(ci.id);
                const found = (ci.type === 'plan')
                  ? plans?.find(p => String(p.slug) === id)
                  : products?.find(p => String(p._id || p.id) === id) || plans?.find(p => String(p.slug) === id);

                const title = found ? (found.name || found.title) : id;
                const price = found ? (found.price || 0) : 0;

                return (
                  <div key={ci.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gray-100 rounded flex items-center justify-center"> 
                        {/* placeholder thumbnail */}
                        <img src={found?.image} alt={title} className="object-cover w-full h-full rounded" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{title}</div>
                        <div className="text-xs text-gray-500">{ci.qty}x</div>
                      </div>
                    </div>

                    <div className="text-sm font-semibold">{formatPrice(price)}</div>
                  </div>
                );
              })
            )}
          </div>

          {/* Totals block */}
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(5000)}</span></div>
            <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(10000)}</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatPrice(subtotal - 5000 - 10000)}</span></div>
          </div>

          <button className="w-full bg-gold2 text-white py-3 rounded-md mb-4">Pay Now</button>

          <div className="text-xs text-gray-500">
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c2.21 0 4-1.79 4-4V5a4 4 0 10-8 0v2c0 2.21 1.79 4 4 4z"/></svg>
              Secure Checkout · SSL Encrypted
            </div>
            <div className="text-gray-400">Ensuring your financial and personal details are secure during every transaction.</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
