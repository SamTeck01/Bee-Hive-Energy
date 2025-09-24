import { useCart } from './CartContext.jsx';
import { useMemo, useContext, useState } from 'react';
import { PlansContext } from './PlansContext.jsx';
import { ProductsContext } from './ProductsContext.jsx';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';
import config from '../config/environment.js';
import axios from 'axios';

export default function Checkout() {
  // 1) Get current cart data from context
  const { cartItems } = useCart();

  // 2) Get all products and plans from their contexts
  const { plans } = useContext(PlansContext);
  const { products } = useContext(ProductsContext);

  // 3) Track user input with local state
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4) Convert cart object into a clean list of items
  const cartItemList = useMemo(() => {
    return Object.entries(cartItems).map(([id, stored]) => {
      const qty = (stored && typeof stored === 'object') ? (stored.qty || 0) : (Number(stored) || 0);
      const type = (stored && typeof stored === 'object') ? (stored.type || null) : null;
      return { id, qty, type };
    });
  }, [cartItems]);

  // 5) Helper: format any price into NGN currency string
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[₦,]/g, ''))
      : price;
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(numericPrice || 0);
  };

  // 6) Calculate the total cost of items in the cart
  const subtotal = useMemo(() => {
    return Object.entries(cartItems).reduce((sum, [id, stored]) => {
      const key = String(id);
      const qty = (stored && typeof stored === 'object') ? (stored.qty || 0) : (Number(stored) || 0);
      const type = (stored && typeof stored === 'object') ? (stored.type || null) : null;

      // Try to find the full product/plan details
      const item =
        (type === 'plan' ? plans?.find(p => String(p.slug) === key) : null) ||
        (type === 'product' ? products?.find(p => String(p._id || p.id) === key) : null) ||
        plans?.find(p => String(p.slug) === key) || products?.find(p => String(p._id || p.id) === key);

      if (!item) return sum;

      // Normalize the price (string → number)
      const price = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[₦,\s]/g, '')) || 0
        : Number(item.price) || 0;

      return sum + price * Number(qty || 0);
    }, 0);
  }, [cartItems, plans, products]);

  // 7) Handle Pay Now button
  const handlePayNow = async () => {
    try {
      // a) Build an array of items to send to backend
      const items = cartItemList.map(ci => {
        const id = String(ci.id);
        const found = (ci.type === 'plan')
          ? plans?.find(p => String(p.slug) === id)
          : products?.find(p => String(p._id || p.id) === id) || plans?.find(p => String(p.slug) === id);

        return {
          id,
          name: found?.name || found?.title || 'Unknown Item',
          price: typeof found?.price === 'string'
            ? parseFloat(found.price.replace(/[₦,\s]/g, '')) || 0
            : Number(found?.price) || 0,
          qty: ci.qty,
          type: ci.type || 'product'
        };
      });

      // b) Send the order to backend
      const res = await axios.post(`${config.API_URL}/orders/initiate-payment`, {
        ...formData,
        items,
        totalAmount: subtotal
      });

      // c) Redirect user to Paystack checkout page
      window.location.href = res.data.authorizationUrl;
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Try again.');
    }
  };

  // 8) UI Layout
  return (
    <div className="container mx-auto py-24 px-4">
      {/* Back link */}
      <Link to={'/cart'} className='text-ash flex flex-row gap-2 mb-3 hover:text-gold2 w-fit'>
        <MoveLeft /> Back to Cart
      </Link>

      {/* Grid with form (left) and cart summary (right) */}
      <div className="max-w-6xl bg-white rounded-lg shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-2 text-ash">
        
        {/* LEFT: Form */}
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

          {/* Pickup notice */}
          <div className="mb-6 ring-1 ring-gold2/50 bg-gold2/10 rounded-sm py-0.5 text-center font-medium">
            Pickup
          </div>

          {/* Form inputs */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-sm">Full name *</label>
              <input name="customerName" className="input_field" placeholder="Enter full name" required onChange={handleChange}/>
            </div>

            <div>
              <label className="block font-semibold text-sm">Email address *</label>
              <input name="email" type="email" className="input_field" placeholder="Enter email" required onChange={handleChange}/>
            </div>  

            <div>
              <label className="block font-semibold text-sm">Phone number *</label>
              <input name="phone" className="input_field" placeholder="Enter phone number" required onChange={handleChange}/>
            </div>
            
            <div>
              <label className="block font-semibold text-sm">Address</label>
              <input name="address" className="input_field" placeholder="Enter address" onChange={handleChange}/>
            </div>

            <div className="flex items-start gap-2">
              <input id="terms" type="checkbox" className="mt-1" />
              <label htmlFor="terms" className="text-sm">I agree to the Terms and Conditions.</label>
            </div>
          </div>
        </div>

        {/* RIGHT: Cart Summary */}
        <aside className="p-8 border-l">
          <h2 className="text-lg font-medium mb-4">Review your cart</h2>

          {/* Cart items */}
          <div className="space-y-4 mb-6">
            {cartItemList.length === 0 ? (
              <div className="text-sm text-gray-500">No items in cart.</div>
            ) : (
              cartItemList.map(ci => {
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

          {/* Totals */}
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          </div>

          {/* Pay Now button */}
          <button onClick={handlePayNow} className="w-full bg-gold2 text-white py-3 rounded-md mb-4">Pay Now</button>
        </aside>
      </div>
    </div>
  );
}
