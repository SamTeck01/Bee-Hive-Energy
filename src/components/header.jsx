import { motion } from "framer-motion";
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';
import logo from '../assets/IMG-20250526-WA0150.png';
import { useState, useEffect } from 'react';
import { useLoading } from './LoadingContext.jsx';
import { useNavigate } from 'react-router-dom';
import SendWhatsAppMessage from './SendWhatsappMessage';
import { useCart } from './CartContext.jsx';
import { ShoppingCart, X, Search, MenuIcon, SearchIcon, SearchX } from "lucide-react";
import { Home, Package, Box, Wrench, Phone, Heart } from "lucide-react";
import WhatsappIcon from '../assets/whatsapp.svg';

const NewHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOpenPc, setIsOpenPc] = useState(false);
  const [isStickyPc, setIsStickyPc] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isActive, setIsActive] = useState('#home');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isLoading } = useLoading();

  const handleClick = (section) => {
    setIsActive(section);
    setIsOpenPc(false);
    setIsStickyPc(false);
  };

  const handleSearch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const q = (searchQuery || '').trim();
    if (q.length === 0) return;
  // navigate to search page with query param
  navigate(`/search?search=${encodeURIComponent(q)}`);
    // Optionally close any open menus
    setIsOpenPc(false);
    setIsStickyPc(false);
  };

  // cart total
  const { getTotalCartItems } = useCart();
  const totalCart = getTotalCartItems();

  const linkClass = (section) => `hover:text-gold2 font-medium transition duration-300 ${section === isActive ? 'text-gold2 font-bold' : ''}`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Import Lucide icons

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-gold py-3 md:py-4'}`}>
        {/* top progress bar for global loading */}
        <div className="absolute left-0 top-0 w-full h-1 z-50">
          <div className={`h-1 bg-[#e49900] transition-all duration-300 ${isLoading ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
        </div>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center relative">

            <div className="flex flex-row">
              {/* Hamburger Menu */}
              <div className="flex items-center justify-center flex-col me-2">
                <button
                  onClick={() => {
                    // Toggle sticky mode when clicked
                    const next = !isStickyPc;
                    setIsStickyPc(next);
                    setIsOpenPc(next || true);
                  }}
                  onMouseEnter={() => setIsOpenPc(true)}
                  onMouseLeave={() => { if (!isStickyPc) setIsOpenPc(false); }}
                  className="text-primary-900 focus:outline-none"
                >
                  {isStickyPc ? <X size={25} /> : <MenuIcon size={25} />}
                </button>

                <div className="relative bg-green-50 w-fit">
                  {isOpenPc && (
                    <motion.div
                      className="md:block text-[14px] block bg-white p-2 shadow-md absolute rounded-md z-50 -left-[18px] top-[9px] w-48"
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      onMouseEnter={() => setIsOpenPc(true)}
                      onMouseLeave={() => { if (!isStickyPc) setIsOpenPc(false); }}
                    >
                      {/* small pointer */}
                      <div className="absolute -top-2.5 left-2 w-5 h-5 bg-white rotate-45" />

                      <nav className="flex flex-col space-y-4">
                        <HashLink smooth to="/#home" onClick={() => handleClick('#home')} className={`${linkClass('#home')} mt-1`}>
                          <span className="inline-flex items-center gap-2"><Home size={18} />Home</span>
                        </HashLink>
                        <HashLink smooth to="/plans" className={linkClass('#plans')} onClick={() => handleClick('#plans')}>
                          <span className="inline-flex items-center gap-2"><Package size={18} />Plans</span>
                        </HashLink>
                        <HashLink smooth to="/products" className={linkClass('#products')} onClick={() => handleClick('#products')}>
                          <span className="inline-flex items-center gap-2"><Box size={18} />Products</span>
                        </HashLink>
                        <HashLink smooth to="/#services" className={linkClass('#services')} onClick={() => handleClick('#services')}>
                          <span className="inline-flex items-center gap-2"><Wrench size={18} />Services</span>
                        </HashLink>
                        <HashLink smooth to="/#contact" className={linkClass('#contact')} onClick={() => handleClick('#contact')}>
                          <span className="inline-flex items-center gap-2"><Phone size={18} />Contact</span>
                        </HashLink>
                        <HashLink smooth to="/wishlist" onClick={() => handleClick('#wishlist')} className={linkClass('#wishlist')}>
                          <span className="inline-flex items-center gap-2"><Heart size={18} />Wishlist</span>
                        </HashLink>
                        <HashLink smooth to='/gallery' className={linkClass('#gallery')} onClick={() => handleClick('#gallery')} >
                          <span className="inline-flex items-center gap-2"><Box size={18} />Gallery</span>
                        </HashLink>
                      </nav>
                    </motion.div>
                  )}
                </div>
              </div>  
              
              {/* Logo */}
              <Link to={'/'}><div className='flexCenter gap-x-2'>
                 <img src={logo} alt="Logo" height={50} width={50} /> 
                <span className='font-semibold text-center text-[20px] hidden md:block'>BEE Energy</span>
              </div></Link>
            </div>
        
            {/* centered search - follows the pattern, visible on md+  */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <form onSubmit={handleSearch} className="w-full max-w-2xl">
                <div className="w-full flex items-center bg-white rounded-md shadow-sm border border-gray-200">
                  <div className="pl-3 text-gray-400"><Search size={18} /></div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="search"
                    placeholder="Search products, brands and categories"
                    className="flex-1 px-3 py-2 text-sm outline-none"
                  />
                  <button type="submit" className="bg-gold2 hover:bg-gold2/90 text-white px-4 py-2 rounded-r-md">Search</button>
                </div>
              </form>
            </div>

            <div className="hidden md:flexCenter gap-4">
              <HashLink smooth to="/cart" className="text-black font-medium transition duration-300 mt-1 relative">
                <span className="inline-flex items-center gap-2 ">
                  <ShoppingCart size={18} />
                  {totalCart > 0 && (
                    <span className="absolute -top-2 left-2 bg-gold2 text-white text-[10px] font-semibold rounded-full w-[14px] h-[14px] flex items-center justify-center">{totalCart}</span>
                  )}
                  Cart
                </span>
              </HashLink>

              <button
                onClick={() => SendWhatsAppMessage('Hi! I’d like to learn more about your services and discuss how they might fit my business needs. Can we chat about the features and pricing? Thanks!')}
                className={`${scrolled ? 'bg-[#E49900] hover:bg-transparent text-white hover:text-gold2 border-2 border-gold2' : 'bg-transparent ring-1 ring-gold2'} text-gold2 px-5 py-1 rounded-md font-medium transition duration-300`}
              >
                Chat with us
              </button>
            </div>

            <div className="md:hidden flex items-center space-x-5">

              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-black">
                {isSearchOpen ? <SearchX size={22} /> : <SearchIcon size={22} />} 
              </button>

              <HashLink smooth to="/cart" className="text-black relative">
                <ShoppingCart size={22} />
                {totalCart > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gold2 text-white text-sm font-medium rounded-full px-[6px] flexCenter">{totalCart}</span>
                )}
              </HashLink>

              <button 
                onClick={() => SendWhatsAppMessage('Hi! I’d like to learn more about your services and discuss how they might fit my business needs. Can we chat about the features and pricing? Thanks!')}
                className="text-black"
              >
                <img src={WhatsappIcon} alt="Chat Us" className="w-5 h-5" />
              </button>
            
              {/* ✅ CTA Button for mobile 
              <Link
                to="/plans"
                className="block md:hidden ml-2 bg-gold2 text-white text-sm px-4 py-2 rounded-full shadow-md font-medium"
              >
                Chat Us
              </Link>*/}
            </div>
            
          </div>

        </div>

        {/* Mobile Search */}
        {isSearchOpen && <div className="w-full relative flexCenter">
          <form onSubmit={handleSearch} className="w-full absolute top-2">
            <div className="w-full flex items-center bg-white rounded-md shadow-sm border border-gray-200">
              <div className="pl-3 text-gray-400"><Search size={18} /></div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="search"
                placeholder="Search products, brands and categories"
                className="flex-1 px-3 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-gold2 hover:bg-gold2/90 text-white px-4 py-2 rounded-r-md">Search</button>
            </div>
          </form>
        </div>}

      </header>
    </>
  );
};

export default NewHeader;
