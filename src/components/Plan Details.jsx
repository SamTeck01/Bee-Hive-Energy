import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { PlansContext } from './PlansContext.jsx';
import { Star, ShoppingCart, AlertCircle, Info, DollarSign, ChevronRight, ChevronDown, ChevronUp, Heart, Share2, Phone, RefreshCw } from 'lucide-react';
import SendWhatsAppMessage from './SendWhatsappMessage';
import AddToCartButton from './AddToCartButton';

import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from './WishlistContext';
import { PlanCardSkeleton } from './LoadingSkeleton.jsx';
import PlanCard from './PlanCard.jsx';


const PlanDetails = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { planWishlist, togglePlanWishlist } = useWishlist();
  const [showToast, setShowToast] = useState(false);

  const { plans, error, retryFetch, isLoading } = useContext(PlansContext);

  const handleWishlistToggle = () => {
    if (!plan) return;
    togglePlanWishlist(plan.slug);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000); // 3 seconds
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const { slug } = useParams();
  const plan = (plans || []).find((item) => item.slug === slug); console.log(plan);

  const isWishlisted = Boolean(plan && planWishlist.includes(plan.slug));

  const [openSections, setOpenSections] = useState([]);

  // initialize sections when plan loads
  useEffect(() => {
    if (plan?.descriptions) {
      setOpenSections(plan.descriptions.map(() => true));
    } else {
      setOpenSections([]);
    }
  }, [plan]);

  // Error state
  if (error) {
    return (
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <nav className="text-sm text-ash flex items-center mb-3 ms-2 space-x-2">
            <Link to="/" className="hover:text-gold2">Home</Link>
            <ChevronRight size={16} />
            <Link to="/plans" className="hover:text-gold2">Plans</Link>
            <ChevronRight size={16} />
            <span className="text-black font-medium">Plan Details</span>
          </nav>

          <div className="flexCenter mt-12">
            <div className="text-center max-w-md">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Unable to load plan details
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

  // Loading state
  if (isLoading) {
    return (
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <nav className="text-sm text-ash flex items-center mb-3 ms-2 space-x-2">
            <Link to="/" className="hover:text-gold2">Home</Link>
            <ChevronRight size={16} />
            <Link to="/plans" className="hover:text-gold2">Plans</Link>
            <ChevronRight size={16} />
            <span className="text-black font-medium">Loading...</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PlanCardSkeleton variant="default" className="w-full" />
            <PlanCardSkeleton variant="default" className="w-full" />
          </div>
        </div>
      </section>
    );
  }

  if (!plan) {
    return (
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <nav className="text-sm text-ash flex items-center mb-3 ms-2 space-x-2">
            <Link to="/" className="hover:text-gold2">Home</Link>
            <ChevronRight size={16} />
            <Link to="/plans" className="hover:text-gold2">Plans</Link>
            <ChevronRight size={16} />
            <span className="text-black font-medium">Plan not found</span>
          </nav>

          <div className="flexCenter mt-12">
            <div className="text-center max-w-md">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Plan not found
              </h3>
              <p className="text-gray-600 mb-6">
                The plan youre looking for doesnt exist or may have been removed.
              </p>
              <Link
                to="/plans"
                className="bg-gold2 text-white px-6 py-3 rounded-md hover:bg-gold2/90 transition-colors inline-block"
              >
                Browse All Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Filter out the current plan to show others (from runtime plans)
  const similarPlans = (plans || []).filter(p => p.slug !== slug).slice(0, 3); // Show top 3

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen))
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: plan.title,
        text: `Discover the '${plan.title}' solar plan — just ${plan.price} from Bee Energy Hive!`,
        url: window.location.href
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Share failed', error));
    } else {
      alert('Sharing not supported on this browser. Copy the link manually.');
    }
  };

  return (
     <section className="px-4 py-24 ">
      <div className="md:container w-90 -mx-1 md:mx-auto relative">
        {/*Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="fixed top-16 left-auto bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 w-[94.5%] md:w-[80%] flex items-center justify-between"
            >
              {isWishlisted ? 'Plan Successfully Wishlisted' : 'Removed from Wishlist'}
              <HashLink smooth to="/wishlist" className="text-white underline ml-2">
                View Wishlist
              </HashLink>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Breadcrumbs */}
        <nav className="text-sm text-ash flex items-center mb-3 ms-2 space-x-2">
          <Link to="/" className="hover:text-gold2">Home</Link>
          <ChevronRight size={16} />
          <Link to="/plans" className="hover:text-gold2">Plans</Link>
          <ChevronRight size={16} />
          <span className="text-black font-medium">{plan.title}</span>
        </nav>

        <div className="md:bg-white bg-transparent rounded-lg grid grid-cols-1 gap-2 md:gap-2 md:w-[75%] w-full">
      {/* Mobile bottom bar: phone + add to cart (mobile only) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 md:hidden mx-auto">
        <div className="flex items-center gap-4 container mx-auto">
          <a
            href="tel:+2349023036748"
            aria-label="Call support"
            className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow"
          >
            <Phone size={25} />
          </a>

          {/* Mobile Add to Cart button */}
          <div className="flex-1">
            <AddToCartButton
              item={{ ...plan, id: plan.slug, type: 'plan' }}
              onToast={triggerToast}
              className="w-full"
            />
          </div>
        </div>
      </div>

          <div className='flex md:flex-row flex-col gap-2 md:gap-10'>
            {/* Image and Add to Cart */}
            <div className='md:w-[280px] min-h-60 w-full flexCenter shrink-0 md:flex md:items-start flex-col bg-white md:bg-transparent p-3 rounded-lg shadow-md md:shadow-none'>
              <div>
                <img 
                  src={plan.image} 
                  alt={plan.title} 
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="mt-6 hidden md:grid">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Promotions</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center gap-2"><Info size={16}/> Free Installation in Lagos</li>
                  <li className="flex items-center gap-2"><DollarSign size={16}/> Flexible payment options available</li>
                  <li className="flex items-center gap-2"><AlertCircle size={16}/> 18-month battery warranty</li>
                </ul>
              </div>
            </div>

            {/* Details */}
            <div className='w-full bg-white md:bg-transparent p-3 rounded-lg'>
              <h1 className="text-2xl font-bold text-gray-800">{plan.title}</h1>
              <p className="text-gray-500 mt-1">{plan?.subtext || 'Smart Energy Plan for Modern Homes'}</p>

              <p className="text-2xl text-gray-800 font-bold mt-3">{plan.price}</p>

              <div className='flex justify-between' >
                <div className="flex items-center gap-1 mt-2 text-gold2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
                  <span className="text-gray-500 text-sm ml-1">(5 ratings)</span>
                </div>

                <div className="flex items-center gap-3">
                  <motion.span
                    whileTap={{ scale: 0.8 }}
                    onClick={handleWishlistToggle}
                    className="cursor-pointer"
                  >
                    {isWishlisted ? (
                      <Heart size={20} fill='#e49900' stroke='#e49900' />
                    ) : (
                      <Heart size={20} className="text-gold2" />
                    )}
                  </motion.span>

                  <Share2 size={20} className="text-gold2 cursor-pointer" onClick={handleShare}/>
                </div>
              </div> 

              <ul className="space-y-1 my-4 text-gray-600">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-green-600"/> {feat}
                  </li>
                ))}
              </ul>

              <div className="mt-4 w-full flex flex-col items-center">
                <AddToCartButton item={{
                  ...plan,
                  id: plan.slug,
                  type: 'plan',
                }} onToast={triggerToast} className={'md:flex hidden w-full'}/>
              </div>

              <button 
                onClick={() => SendWhatsAppMessage(`Hello, I'm interested in the ${plan.title} plan`)} 
                className="bg-gold2 hover:bg-gold2/80 text-white font-medium px-6 py-3 rounded-md flex justify-between items-center gap-2 mt-3 transition w-full"
                >
                <ShoppingCart size={18}/> <span>Chat on Whatsapp</span> <div></div>
              </button>
            </div>
          </div>

          <div className="show md:hidden bg-white md:bg-transparent p-3 rounded-lg shadow-md md:shadow-none ">
            <h3 className="text-lg font-semibold mb-2 text-black">Promotions</h3>
            <ul className="space-y-2 text-ash text-sm">
              <li className="flex items-center gap-2"><Info size={16}/> Free Installation in Lagos</li>
              <li className="flex items-center gap-2"><DollarSign size={16}/> Flexible payment options available</li>
              <li className="flex items-center gap-2"><AlertCircle size={16}/> 18-month battery warranty</li>
            </ul>
          </div>

          {/* Description */}
          <div className="bg-white md:bg-transparent p-3 rounded-lg md:shadow-none shadow-md">
            <h2 className="text-lg font-semibold text-black mb-4">Description</h2>

            {plan.descriptions?.map((section, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full text-left flex justify-between items-center text-md font-medium text-black mb-2 focus:outline-none"
                >
                  {section.title}
                  <div>{openSections[index] ? <ChevronDown size={16}/> : <ChevronUp size={16} /> }</div>
                </button>

                <AnimatePresence>
                  {openSections[index] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {Array.isArray(section.content) ? (
                        <ul className="list-disc list-inside text-ash text-base space-y-1">
                          {section.content.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">{section.content}</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Similar Plans Section */}
          <div className="bg-white md:bg-transparent py-3 px-2 rounded-lg md:shadow-none shadow-md">
            <h2 className="text-lg font-medium text-black ps-1 mb-2">Customers Also Viewed</h2>
            <div className='overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory pb-2'>
              <div className="flex gap-3">
                {similarPlans.map((similar, idx) => (
                  <div key={idx} className="w-52 shrink-0 snap-start">
                    <PlanCard
                      plan={similar}
                      index={idx}
                      variant="compact"
                      showRating={false}
                      showWishlist={true}
                      showShare={false}
                      showFeatures={false}
                      onToast={() => {}}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default PlanDetails;