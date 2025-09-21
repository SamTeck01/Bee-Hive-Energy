import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react'; 
import { useState, useContext } from 'react';
import { HashLink } from 'react-router-hash-link';
import { PlansContext } from './PlansContext';
import { PlanCardSkeleton } from './LoadingSkeleton.jsx';
import PlanCard from './PlanCard.jsx';


const PlansSection = () => {
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { plans: contextPlans, error, retryFetch, isLoading } = useContext(PlansContext);

  // Use context plans if available, otherwise fallback to static plans
  const displayPlans = contextPlans;

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  // Error state
  if (error) {
    return (
      <section id="plans" className="px-4 py-12 mt-5">
        <div className="container mx-auto">
          <motion.div
            className="max-w-[36rem]"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
          >
            <span className="inline-flex items-center px-5 py-[6px] font-medium text-center text-black bg-gold2/30 rounded-2xl text-[13px] uppercase mb-6">
              Trending Plans
            </span>
            <h2 className="h8 text-black">Popular Solar Plans for Your Home or Business</h2>
          </motion.div>

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
      </section>
    );
  }

  return (
    <section id="plans" className="px-4 py-12 mt-5">

      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          className="fixed top-20 right-4 bg-green-50 text-white px-4 py-2 rounded-lg shadow-lg z-50"
        >
          {toastMessage}
          <HashLink smooth to="/cart" className="text-white underline ml-2">
            View Cart
          </HashLink>
        </motion.div>
      )}

      <div className="container mx-auto">
        <motion.div
          className="max-w-[36rem]"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: false }}
        >
          <span className="inline-flex items-center px-5 py-[6px] font-medium text-center text-black bg-gold2/30 rounded-2xl text-[13px] uppercase mb-6">
            Trending Plans
          </span>

          <h2 className="h8 text-black">Popular Solar Plans for Your Home or Business</h2>

          <p className="text-ash text-[18px] my-4 leading-relaxed">
            Explore a few of our most selected plans. Want more? Visit the full plans page for all available packages.
          </p>
        </motion.div>
        
        <div className="flexCenter flex-wrap gap-8 mt-12">
          {isLoading ? (
            // Show loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <PlanCardSkeleton key={index} variant="default" className="w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[320px] mx-auto" />
            ))
          ) : (
            displayPlans.map((plan, index) => (
              <PlanCard
                key={plan.slug || plan.id || index}
                plan={plan}
                index={index}
                onToast={triggerToast}
                variant="default"
                showRating={true}
                showWishlist={true}
                showShare={true}
                showFeatures={true}
                maxFeatures={3}
                className="w-full sm:max-w-[290px] md:max-w-[220px] xl:max-w-[280px] "
              />
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <HashLink smooth to="/plans" className="text-ash underline font-medium text-lg hover:text-black transition-all">
            View All Plans →
          </HashLink>
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
