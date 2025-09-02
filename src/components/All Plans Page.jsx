// src/pages/PlansPage.jsx
import { HashLink } from 'react-router-hash-link';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ShieldCheck, Share2, Heart, Search, X } from 'lucide-react';
import { useState, useContext, useMemo } from 'react';
import { useWishlist } from './WishlistContext';
import { PlansContext } from './PlansContext';
import { Link } from 'react-router-dom';

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

//The plans card component
const PlanCard2 = ({ image, title, price, slug, features = [], priceLabel, ctaText, custom, onToast }) => {
  const { planWishlist, togglePlanWishlist } = useWishlist();
  const isWishlisted = planWishlist.includes(slug);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: `Check out this energy plan: ${title} for ${price}.`,
          url: window.location.origin + `/plans/${slug}`,
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Share failed', error));
    } else {
      alert('Sharing not supported on this browser. Copy the link manually.');
    }
  };

  return (
    <motion.div
      className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full max-w-[320px]"
      variants={cardVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false }}
      custom={custom}
    >
      {/* Image */}
      <div className="relative">
        <img src={image} alt={title} className="h-44 w-full object-cover" />
        <span className="absolute top-3 left-3 bg-white text-black text-xs font-medium px-2 py-1 rounded-full shadow">
          {priceLabel}
        </span>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="text-[17px] font-semibold text-gray-800">{title}</h3>
        <p className="text-lg font-bold text-gold2 mt-1">{price}</p>

        {features?.length > 0 && (
          <ul className="space-y-1 mt-3 text-gray-500 text-sm">
            {features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-green-500" /> {feat}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between mt-5">
          <HashLink
            smooth
            to={`/plans/${slug}`}
            className="text-sm text-white bg-gold2 px-4 py-2 rounded-full hover:bg-black transition"
          >
            {ctaText}
          </HashLink>

          <div className="flex items-center gap-3">
            <motion.span
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                togglePlanWishlist(slug);
                onToast(`${isWishlisted ? 'Removed from Wishlist' : 'Plan Successfully Wishlisted'}`);
              }}
              className="cursor-pointer"
            >
              {isWishlisted ? (
                <Heart size={20} fill="#e49900" stroke="#e49900" />
              ) : (
                <Heart size={20} className="text-gold2" />
              )}
            </motion.span>

            <Share2 size={20} className="text-gold2 cursor-pointer" onClick={handleShare} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

PlanCard2.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.string),
  priceLabel: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  custom: PropTypes.number.isRequired,
  onToast: PropTypes.func.isRequired,
};

const PlansPage = () => {
  const { plans } = useContext(PlansContext);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPlans = useMemo(() => {
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return plans || [];
    return (plans || []).filter((plan) => {
      const title = String(plan.title || plan.name || '').toLowerCase();
      const slug = String(plan.slug || '').toLowerCase();
      const desc = Array.isArray(plan.description)
        ? plan.description.join(' ').toLowerCase()
        : String(plan.description || '').toLowerCase();
      const features = (plan.features || []).join(' ').toLowerCase();
      return title.includes(q) || slug.includes(q) || desc.includes(q) || features.includes(q);
    });
  }, [plans, searchTerm]);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!plans || !plans.length) return <div className="pt-24 text-center">Loading plans...</div>;

  return (
    <section className="px-4 pt-24 pb-16 md:pt-28">
      {/* Toast */}
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
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 mb-3">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">All Plans</span>
        </nav>

        <div className='w-full relative mb-6'>
          <h1 className="text-3xl text-center font-bold">All Solar Plans</h1>

          <div className="flex items-center -space-x-6 absolute right-0 top-0">
            {/* Search button */}
            <button
              onClick={() => setOpen(!open)}
              className={`p-2 rounded-full bg-gray-200 hover:bg-gray-300 z-10 ${open ? 'ring-2 ring-gray-200' : null}`}
            >
              <Search size={20} />
            </button>

            {/* Animated input */}
            <motion.input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search..."
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: open ? 200 : 0,
                opacity: open ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="ps-8 px-3 py-2 text-[12px] rounded-lg outline-none ring-2 ring-ash overflow-hidden"
            />

            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 ms-2 z-10"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
 
        </div>
        <p className="text-center text-ash max-w-2xl mx-auto mb-12">
          Browse our full range of solar solutions. Tap into efficient and smart energy tailored for your home or
          business.
        </p>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
          {filteredPlans.map((plan, index) => (
            <PlanCard2
              key={plan._id}
              image={plan.image}
              title={plan.title}
              slug={plan.slug}
              price={plan.price}
              features={plan.features}
              ctaText={`Get ${plan.title}`}
              custom={index}
              priceLabel={plan.priceLabel}
              onToast={triggerToast}
            />
          ))}
          {filteredPlans.length === 0 && <p>No results found</p>}
        </div>
      </div>
    </section>
  );
};

export default PlansPage;
