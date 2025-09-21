import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { ShieldCheck, Share2, Heart, Star } from 'lucide-react';
import { HashLink } from 'react-router-hash-link';
import { useWishlist } from './WishlistContext';

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15 },
  }),
};

const PlanCard = ({ 
  plan, 
  index = 0, 
  showRating = true, 
  showWishlist = true, 
  showShare = true,
  showFeatures = true,
  maxFeatures = 3,
  className = "",
  onToast = () => {},
  ctaText = null,
  priceLabel = null,
  variant = "default" // "default", "compact", "detailed"
}) => {
  const { planWishlist, togglePlanWishlist } = useWishlist();

  // Normalize plan data to handle different API structures
  const normalizedPlan = {
    id: plan.id || plan._id || plan.slug,
    slug: plan.slug || plan.id || plan._id,
    title: plan.title || plan.name || 'Untitled Plan',
    price: plan.price || 'Price not available',
    image: plan.image || '/placeholder-plan.jpg',
    features: Array.isArray(plan.features) ? plan.features : [],
    priceLabel: plan.priceLabel || plan.label || 'Plan',
    rating: plan.rating || 5,
    reviews: plan.reviews || plan.reviewCount || 0,
    ...plan
  };

  // Check if plan is wishlisted
  const checkWishlistStatus = () => {
    return planWishlist.includes(normalizedPlan.slug);
  };

  const handleWishlistToggle = () => {
    togglePlanWishlist(normalizedPlan.slug);
    const newStatus = !checkWishlistStatus();
    onToast(`${newStatus ? 'Plan Successfully Wishlisted' : 'Removed from Wishlist'}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: normalizedPlan.title,
        text: `Check out this energy plan: ${normalizedPlan.title} for ${normalizedPlan.price}.`,
        url: window.location.origin + `/plans/${normalizedPlan.slug}`,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Share failed', error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/plans/${normalizedPlan.slug}`)
        .then(() => onToast('Link copied to clipboard!'))
        .catch(() => alert('Sharing not supported. Copy the link manually.'));
    }
  };

  // Get CTA text based on variant or prop
  const getCtaText = () => {
    if (ctaText) return ctaText;
    return variant === 'compact' ? 'View' : `Get ${normalizedPlan.title}`;
  };

  // Get price label
  const getPriceLabel = () => {
    if (priceLabel) return priceLabel;
    return normalizedPlan.priceLabel;
  };

  // Card size classes based on variant
  const getCardClasses = () => {
    const baseClasses = "rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col";
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} w-full max-w-[200px] h-[280px]`;
      case 'detailed':
        return `${baseClasses} w-full max-w-[400px] h-[480px]`;
      default:
        return `${baseClasses} w-full max-w-[320px] h-[420px]`;
    }
  };

  // Image height based on variant
  const getImageHeight = () => {
    switch (variant) {
      case 'compact':
        return 'h-32';
      case 'detailed':
        return 'h-48';
      default:
        return 'h-44';
    }
  };

  return (
    <motion.div
      className={`${getCardClasses()} ${className}`}
      variants={cardVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false }}
      custom={index}
    >
      {/* Image */}
      <div className="relative">
        <img 
          src={normalizedPlan.image} 
          alt={normalizedPlan.title} 
          className={`${getImageHeight()} w-full object-cover`}
          onError={(e) => {
            e.target.src = '/placeholder-plan.jpg';
          }}
        />
        <span className="absolute top-3 left-3 bg-white text-black text-xs font-medium px-2 py-1 rounded-full shadow">
          {getPriceLabel()}
        </span>
      </div>

      {/* Content */}
      <div className="px-4 py-2 flex flex-col flex-1">
        {/* Header Section */}
        <div className="flex-shrink-0">
          <h3 className="text-[17px] font-semibold text-gray-800 line-clamp-2">
            {normalizedPlan.title}
          </h3>
          
          <p className="text-lg font-bold text-gold2 ">
            {normalizedPlan.price}
          </p>

          {/* Rating */}
          {showRating && (
            <div className="flex items-center gap-1 mt-0.5 text-gold2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill="currentColor"
                  className={i < normalizedPlan.rating ? 'text-gold2' : 'text-gray-300'}
                />
              ))}
              <span className="text-gray-500 text-sm ml-1">
                ({normalizedPlan.reviews} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Features Section - Flexible height */}
        {showFeatures && normalizedPlan.features?.length > 0 && (
          <div className="flex-1 mt-3 min-h-0">
            <ul className="space-y-1 text-gray-500 text-sm h-full">
              {normalizedPlan.features.slice(0, maxFeatures).map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-green-500 flex-shrink-0" />
                  <span className="line-clamp-1">{feat}</span>
                </li>
              ))}
              {normalizedPlan.features.length > maxFeatures && (
                <li className="text-gray-400 text-xs">
                  +{normalizedPlan.features.length - maxFeatures} more features
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Spacer for cards without features */}
        {!showFeatures && (
          <div className="flex-1"></div>
        )}

        {/* Actions - Fixed at bottom */}
        <div className="flex items-center justify-between mt-4 flex-shrink-0">
          <HashLink
            smooth
            to={`/plans/${normalizedPlan.slug}`}
            className="text-sm text-white bg-gold2 px-4 py-2 rounded-full hover:bg-gold2/90 transition-colors flex-1 text-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {getCtaText()}
          </HashLink>

          <div className="flex items-center gap-3 ml-3">
            {/* Wishlist Button */}
            {showWishlist && (
              <motion.span
                whileTap={{ scale: 0.8 }}
                onClick={handleWishlistToggle}
                className="cursor-pointer"
                title={checkWishlistStatus() ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart 
                  size={20} 
                  fill={checkWishlistStatus() ? '#e49900' : 'none'}
                  stroke={checkWishlistStatus() ? '#e49900' : '#e49900'}
                  className={checkWishlistStatus() ? '' : 'text-gold2'}
                />
              </motion.span>
            )}

            {/* Share Button */}
            {showShare && (
              <Share2 
                size={20} 
                className="text-gold2 cursor-pointer hover:text-gold2/80 transition-colors" 
                onClick={handleShare}
                title="Share this plan"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

PlanCard.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    slug: PropTypes.string,
    title: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
    image: PropTypes.string,
    features: PropTypes.arrayOf(PropTypes.string),
    priceLabel: PropTypes.string,
    label: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    reviewCount: PropTypes.number,
    description: PropTypes.string,
    subtext: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
  showRating: PropTypes.bool,
  showWishlist: PropTypes.bool,
  showShare: PropTypes.bool,
  showFeatures: PropTypes.bool,
  maxFeatures: PropTypes.number,
  className: PropTypes.string,
  onToast: PropTypes.func,
  ctaText: PropTypes.string,
  priceLabel: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']),
};

export default PlanCard;
