// src/pages/PlansPage.jsx
import { HashLink } from 'react-router-hash-link';
import { motion } from 'framer-motion';
import { Search, X, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, useContext, useMemo } from 'react';
import { PlansContext } from './PlansContext';
import { Link } from 'react-router-dom';
import { PlanCardSkeleton } from './LoadingSkeleton.jsx';
import PlanCard from './PlanCard.jsx';


const PlansPage = () => {
  const { plans, error, retryFetch, isLoading } = useContext(PlansContext);
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

  // Error state
  if (error) {
    return (
      <section className="px-4 pt-24 pb-16 md:pt-28">
        <div className="container mx-auto">
          <nav className="text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 font-medium">All Plans</span>
          </nav>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">All Solar Plans</h1>
            
            <div className="flexCenter mt-12">
              <div className="text-center max-w-md">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Unable to load plans
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={retryFetch}
                  className="bg-gold2 text-white px-6 py-3 rounded-md hover:bg-gold2/90 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
          <HashLink smooth to="/cart" className="text-white underline ml-2">
            View Cart
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
        <div className="flexCenter flex-wrap gap-4 mt-12">
          {isLoading ? (
            // Show loading skeletons
            Array.from({ length: 9 }).map((_, index) => (
              <PlanCardSkeleton key={index} variant="default" className="w-[320px]" />
            ))
          ) : filteredPlans.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No plans found</p>
              {searchTerm && (
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search terms
                </p>
              )}
            </div>
          ) : (
            filteredPlans.map((plan, index) => (
              <PlanCard
                key={plan._id || plan.id || index}
                plan={plan}
                index={index}
                onToast={triggerToast}
                variant="default"
                showRating={true}
                showWishlist={true}
                showShare={true}
                showFeatures={true}
                maxFeatures={3}
                className='w-full '
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PlansPage;
