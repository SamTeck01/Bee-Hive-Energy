import { useMemo, useContext, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Package, Box } from 'lucide-react';
import { PlansContext } from './PlansContext.jsx';
import { ProductsContext } from './ProductsContext.jsx';
import { useWishlist } from './WishlistContext.jsx';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2 },
  }),
};

// Local Card component for search results (matches requested structure)
const Card = ({ image, title, price, categoryId, productId, custom, onToast, isPlan = false }) => {
  const { productWishlist, toggleProductWishlist, togglePlanWishlist, planWishlist } = useWishlist();
  const id = productId;
  const isWishlisted = isPlan ? (planWishlist || []).includes(id) : (productWishlist || []).includes(id);
  // AddToCartButton handles cart internally; we use onToast to bubble messages up
  return (
    <motion.div
      className="md:w-[220px] min-w-[150px] mb-2"
      variants={cardVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false }}
      custom={custom}
    >
      <Link
        to={isPlan ? `/plans/${productId}` : `/products/${categoryId}/${productId}`}
        className="rounded-xl bg-white shadow-sm group hover:shadow-md overflow-hidden block"
      >
        <div className="bg-white relative">
          <img
            src={image}
            alt={title}
            className="h-40 w-full object-contain transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (isPlan) togglePlanWishlist(id);
                else toggleProductWishlist(id);
                const msg = isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist';
                if (onToast) onToast(msg);
              }}
              className=""
            >
              {isWishlisted ? (
                <Heart size={20} fill="#e49900" stroke="#e49900" />
              ) : (
                <Heart size={20} className="text-gold2" />
              )}
            </button>
          </div>
        </div>

        <div className="p-1 ps-2">
          <h3 className="text-[14px] font-medium text-black">{title}</h3>
          <p className="text-[14px] font-medium text-ash mt-1">{price}</p>
        </div>
      </Link>
    </motion.div>
  );
};

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  categoryId: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
  custom: PropTypes.number.isRequired,
  onToast: PropTypes.func.isRequired,
  isPlan: PropTypes.bool,
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const q = useQuery();
  const search = (q.get('search') || '').trim();

  const { plans = [] } = useContext(PlansContext);
  const { products = [] } = useContext(ProductsContext);

  const normalized = (s) => (s || '').toString().toLowerCase();

  const [activeTab, setActiveTab] = useState('plan');
  const visibleTabs = ['plan', 'product'];

  const planResults = useMemo(() => {
    if (!search) return [];
    const t = search.toLowerCase();
    return plans.filter(p =>
      (normalized(p.title).includes(t) || normalized(p.description).includes(t) || (p.slug && normalized(p.slug).includes(t)))
    );
  }, [plans, search]);

  const productResults = useMemo(() => {
    if (!search) return [];
    const t = search.toLowerCase();
    return products.filter(p =>
      (normalized(p.name).includes(t) || normalized(p.description).includes(t) || (p.brand && normalized(p.brand).includes(t)))
    );
  }, [products, search]);

  

  return (
    <section className="px-4 py-24">
      <div className="container mx-auto bg-white p-3 rounded-lg shadow-md">
        {/* VS Code-style tab bar */}
        <div className="flex items-center border-b border-gray-200 mb-6 -mx-3 px-3">
          <div className="flex -mb-px">
            {visibleTabs.includes('plan') && (
              <div
                role="tab"
                aria-selected={activeTab === 'plan'}
                onClick={() => setActiveTab('plan')}
                className={`px-4 py-2 rounded-t-md border-t border-l border-r ${activeTab === 'plan' ? 'bg-white text-black border-gray-300' : 'bg-gray-100 text-gray-600 border-transparent'}`}
              >
                <div className="inline-flex items-center gap-2">
                  <Package size={14} />
                  <span className="text-sm font-medium">Plans</span>
                  <span className="text-xs opacity-70 ml-2">({planResults.length})</span>
                </div>
                {/* tabs are permanent in this UI; close button removed */}
              </div>
            )}

            {visibleTabs.includes('product') && (
              <div
                role="tab"
                aria-selected={activeTab === 'product'}
                onClick={() => setActiveTab('product')}
                className={`px-4 py-2 rounded-t-md border-t border-l border-r ${activeTab === 'product' ? 'bg-white text-black border-gray-300' : 'bg-gray-100 text-gray-600 border-transparent'}`}
              >
                <div className="inline-flex items-center gap-2">
                  <Box size={14} />
                  <span className="text-sm font-medium">Products</span>
                  <span className="text-xs opacity-70 ml-2">({productResults.length})</span>
                </div>
                {/* tabs are permanent in this UI; close button removed */}
              </div>
            )}
          </div>
        </div>

        {planResults.length === 0 && productResults.length === 0 ? (
          <div className="px-4 py-24 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No results found</h2>
            <p className="text-sm text-gray-500">Try a different search term or browse plans and products.</p>
          </div>
        ) : (
          <div>
            {activeTab === 'plan' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {planResults.map((plan, idx) => (
                  <Card
                    key={plan.slug || idx}
                    image={plan.image}
                    title={plan.title}
                    price={plan.price}
                    categoryId={''}
                    productId={plan.slug}
                    custom={idx}
                    isPlan
                    onToast={() => {}}
                  />
                ))}
              </div>
            )}

            {activeTab === 'product' && (
              <div className="flex flex-wrap gap-4">
                {productResults.map((prod, idx) => (
                  <Card
                    key={prod.id || prod._id || idx}
                    image={prod.image}
                    title={prod.name}
                    price={prod.price}
                    categoryId={(prod.category || prod.categoryId || 'all').toString()}
                    productId={(prod._id || prod.id || idx).toString()}
                    custom={idx}
                    onToast={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;
