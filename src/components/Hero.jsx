import { useEffect, useState, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronLeft, ChevronRight, ThumbsUp } from 'lucide-react';

// Mock images (replace with your actual imports)
const iotBanner = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80";
const installationBanner = "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80";
const buildingInverter = "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80";

const slides = [
  {
    id: 'inverter-solutions',
    title: 'Renewable and green energy industry.',
    description: 'We are providing awesome 20+ green energy services.',
    bgImage: buildingInverter,
    link: '/inverter-solutions',
    leftContent: {
      badge: 'Green Savings, Bright Future'
    }
  },
  {
    id: 'installation-services',
    title: 'Expert Installation Services',
    description: 'Professional setup of solar panels, batteries, and energy systems.',
    bgImage: installationBanner,
    link: '/installation-services',
    leftContent: {
      badge: 'Professional Installation'
    }
  },
  {
    id: 'iot-solutions',
    title: 'Smart IoT Energy Solutions',
    description: 'Monitor and control your power intelligently with smart IoT tech.',
    bgImage: iotBanner,
    link: '/iot-energy-solutions',
    leftContent: {
      badge: 'Smart Energy Management'
    }
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const SLIDE_DURATION = 6000; // 6 seconds per slide

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
      setProgress(0);
    }, SLIDE_DURATION);
    
    return () => clearInterval(interval);
  }, [isPlaying, isHovered]);

  // Progress bar animation
  useEffect(() => {
    if (!isPlaying || isHovered) return;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / (SLIDE_DURATION / 50)); // Update every 50ms
      });
    }, 50);
    
    return () => clearInterval(progressInterval);
  }, [isPlaying, isHovered, activeIndex]);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + slides.length) % slides.length);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    setProgress(0);
  }, []);

  const goToSlide = useCallback((index) => {
    setActiveIndex(index);
    setProgress(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) setProgress(0);
  }, [isPlaying]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
  };

  // Mouse drag support for desktop
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left mouse button
    setTouchStart(e.clientX);
    setTouchEnd(e.clientX);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      next();
    } else if (isRightSwipe) {
      prev();
    }
    
    setIsDragging(false);
  }, [isDragging, touchStart, touchEnd, next, prev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === ' ') {
    e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, togglePlayPause]);

  // Global mouse events for drag functionality
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const currentSlide = slides[activeIndex];

  return (
    <section 
      className="w-full h-screen relative overflow-hidden group bg-green-900 select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      role="region"
      aria-label="Hero carousel"
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/20 z-40">
        <motion.div 
          className="h-full bg-gold2"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
              </div>

      <div className="flex h-full flex-col lg:flex-row">
        {/* Mobile: Image area (top half) */}
        <div className="w-full h-1/2 lg:w-[57%] lg:h-full relative">
              <AnimatePresence mode="wait">
                <motion.div 
              key={activeIndex}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${currentSlide.bgImage})` }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              aria-hidden
            />
              </AnimatePresence>
          
          {/* Gradient overlay for better text readability on mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent lg:hidden" />
        </div>

        {/* Mobile: Content panel (bottom half) */}
        <div className="w-full h-1/2 lg:w-[43%] lg:h-full bg-green-900 relative text-white flex lg:items-center px-6 lg:px-10 py-8 lg:py-0">
          <div className="w-full text-center lg:text-left">
              <AnimatePresence mode="wait">
                <motion.div 
                key={`content-${activeIndex}`} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-5"
              >
                {/* Badge with underline */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="space-y-2"
                >
                  <h3 className="text-sm uppercase text-white tracking-wider font-medium">
                    {currentSlide.leftContent.badge}
                  </h3>
                  <div className="w-16 h-0.5 bg-gray-300 mx-auto lg:mx-0"></div>
                </motion.div>

                {/* Main Title */}
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-2xl lg:text-5xl font-bold leading-tight"
                >
                  {currentSlide.title}
                </motion.h2>

                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-gray-200 text-base lg:text-lg leading-[1.3]"
                >
                  {currentSlide.description}
                </motion.p>

                {/* CTAs */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-col gap-4"
                >
                  <NavLink 
                    to={currentSlide.link} 
                    className="bg-white text-green-900 px-6 py-3 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg mx-auto lg:mx-0 w-fit"
                  >
                    <ThumbsUp size={16}/>
                    Discover more
                  </NavLink>
                  <NavLink 
                    to="/services" 
                    className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm mx-auto lg:mx-0 w-fit"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                    View services
                  </NavLink>
                </motion.div>
                </motion.div>
              </AnimatePresence>

            {/* Desktop Navigation - Left side */}
            <div className="hidden lg:flex absolute bottom-10 left-10 flex-row gap-6 z-30">
              {slides.map((_, i) => (
                <motion.button 
                  key={i} 
                  onClick={() => goToSlide(i)}
                  className={`text-xl font-bold transition-all duration-300 flex flex-row ${
                    i === activeIndex 
                      ? 'text-white scale-110 me-6' 
                      : 'text-white/60 hover:text-white/80 hover:scale-105'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {`0${i + 1}`}
                </motion.button>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Navigation - Bottom center */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-30 lg:hidden">
        {slides.map((_, i) => (
          <motion.button
            key={i} 
            onClick={() => goToSlide(i)}
            className={`text-lg font-bold transition-all duration-300 ${
              i === activeIndex 
                ? 'text-white' 
                : 'text-white/60 hover:text-white/80'
            }`}
            aria-label={`Go to slide ${i + 1}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {`0${i + 1}`}
            {i === activeIndex && (
              <div className="w-full h-0.5 bg-white mt-1"></div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Desktop Controls - Hidden on mobile for cleaner look */}
      <div className="hidden lg:flex absolute bottom-8 right-6 items-center gap-4 z-30">
        {/* Play/Pause Button */}
        <motion.button 
          onClick={togglePlayPause}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </motion.button>

        {/* Navigation Buttons */}
        <motion.button 
          onClick={prev} 
          aria-label="Previous slide" 
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        
        <motion.button 
          onClick={next} 
          aria-label="Next slide" 
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </section>
  );
}