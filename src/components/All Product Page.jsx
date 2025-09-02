// src/pages/AllProductsPage.jsx
import { motion } from 'framer-motion';
import { useState, useContext, useMemo } from 'react';
import { ProductCard } from './ProductCard';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import { ProductsContext } from './ProductsContext';
import { Search, X } from 'lucide-react';

export default function AllProductsPage() {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  const { products } = useContext(ProductsContext); // ✅ get products directly

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Memoized, safe filtering across multiple fields
  const filteredProducts = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return products || [];
    return (products || []).filter((product) => {
      const name = String(product.name || product.title || '').toLowerCase();
      const category = String(product.category_name || product.category || '').toLowerCase();
      const desc = Array.isArray(product.description)
        ? product.description.join(' ').toLowerCase()
        : String(product.description || '').toLowerCase();
      const features = (product.features || []).join(' ').toLowerCase();
      return (
        name.includes(q) ||
        category.includes(q) ||
        desc.includes(q) ||
        features.includes(q)
      );
    });
  }, [products, searchQuery]);

  return (
    <section className="px-4 py-24 md:pt-28">
      {/* ✅ Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          {toastMessage}
          <HashLink smooth to="/wishlist" className="text-white underline ml-2">
            View Wishlist
          </HashLink>
        </motion.div>
      )}

      <div className="container mx-auto">
        {/* ✅ Breadcrumbs */}
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">All Products</span>
        </nav>

        {/* ✅ Page Title */}
        <div className='w-full relative'>
          <h1 className="text-3xl font-bold text-center mb-6">All Products</h1>

          {/* ✅ Search Input (animated like Plans) */}
          <div className="flex items-center -space-x-6 absolute right-0 top-0">
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 z-10 ${open ? 'ring-2 ring-gray-200' : ''}`}
              aria-label="Toggle search"
            >
              <Search size={18} />
            </button>

            <motion.input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: open ? 200 : 0,
                opacity: open ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="ps-8 px-3 py-2 text-[12px] rounded-lg outline-none ring-2 ring-ash overflow-hidden"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 ms-2 z-10 absolute right-0 top-0 mt-1"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

        </div>


        <p className="text-center text-ash max-w-2xl mx-auto mb-8">
          Explore every solar product across panels, inverters, batteries, and controllers — all in one place.
        </p>

        {/* ✅ Product Grid */}
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id || product._id || index}
                image={product.image}
                title={product.name}
                price={product.price || product.new_price || ''}
                categoryId={(product.category_name || product.category || '').replace(/ /g, '-')?.toLowerCase()}
                productId={product.id || product._id}
                custom={index}
                onToast={triggerToast}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No products found.</p>
        )}
      </div>
    </section>
  );
}
