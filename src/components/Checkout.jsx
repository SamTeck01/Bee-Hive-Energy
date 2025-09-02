export default function Checkout() {
  return (
    <div className="py-24 px-4">
      <div className="mx-auto container grid grid-cols-1 md:grid-cols-2 gap-0 bg-white p-6 rounded-lg shadow-sm">
        
        {/* Left Side - Form */}
        <div className="border-r-[1.5px] border-ash/50 pe-6">
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
        <div className="ps-6 border-s-[1.5px] border-ash/50">
          <h3 className="text-lg font-semibold mb-4">Review your cart</h3>

          <div className="space-y-4">
            {/* Product */}
            <div className="flex justify-between">
              <span>DuoComfort Sofa Premium</span>
              <span>$20.00</span>
            </div>
            <div className="flex justify-between">
              <span>IronOne Desk</span>
              <span>$25.00</span>
            </div>
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
              <span>$45.00</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span>Discount</span>
              <span>-$10.00</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>$40.00</span>
            </div>
          </div>

          {/* Pay Now */}
          <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg">
            Pay Now
          </button>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Secure Checkout · SSL Encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
