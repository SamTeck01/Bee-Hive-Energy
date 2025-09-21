 // src/pages/ProductPage.jsx
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, AlertCircle, Info, DollarSign, ChevronRight, ChevronDown, ChevronUp, Heart, Share2, Phone } from 'lucide-react';
import SendWhatsAppMessage from './SendWhatsappMessage';
import { HashLink } from 'react-router-hash-link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useContext } from 'react';
import { useWishlist } from './WishlistContext';
import { ProductCard } from './ProductCard';
import AddToCartButton from './AddToCartButton';
import { ProductsContext } from './ProductsContext';
import { ProductsCategoryContext } from './ProductCategoryContext';

export default function ProductPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { productWishlist, toggleProductWishlist } = useWishlist();
  const { products } = useContext(ProductsContext);
  const { productsCategory } = useContext(ProductsCategoryContext);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  
  const { categoryId, productId } = useParams();

  // ✅ get product from backend
  const product = products.find(p => String(p._id) === String(productId));
  // initialize open sections when product changes
  useEffect(() => {
    if (product?.sections) {
      setOpenSections(product.sections.map(() => true));
    }
  }, [product]);

  const [openSections, setOpenSections] = useState([]);
  // initialize sections when plan loads
  useEffect(() => {
    if (product?.section) {
      setOpenSections(product.section.map(() => true));
    } else {
      setOpenSections([]);
    }
  }, [product]);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!product) return <h2 className="text-center py-24">Product not found</h2>;

  const isWishlisted = productWishlist.includes(product._id);

  // ✅ filter similar products from backend by same category
  const similarProduct = products
    .filter(p => p._id !== product._id && String(p.category_name.replace(" ", "-").toLowerCase()) === String(categoryId))
    .slice(0, 7);
  
  // ✅ get category from nocodb
  const category = productsCategory.find(c => String(c.slug) === String(categoryId));
  if (!category) return <h2 className="text-center py-24">Category not found</h2>;

  const toggleSection = (index) => {
    setOpenSections((prev) =>
      prev.map((isOpen, idx) => (idx === index ? !isOpen : isOpen))
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Discover the '${product.name}' solar plan — just ${product.price} from Bee Energy Hive!`,
        url: window.location.href
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Share failed', error));
    } else {
      alert('Sharing not supported on this browser. Copy the link manually.');
    }
  };

  return (
    <section className="px-4 py-24">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-16 left-auto bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50 w-[94.5%] md:w-[80%] flex items-center justify-between"
          >
            {toastMessage}
            <HashLink smooth to="/cart" className="text-white underline ml-2">
              View Cart
            </HashLink>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="md:container w-90 -mx-1 md:mx-auto relative">
        <Link to={`/products/${categoryId}`} className="text-sm text-gray-500 hover:text-gold2 mb-4 inline-block">
          ← Back to {category.title.toLowerCase()}
        </Link>

        {/* Breadcrumbs */}
        <nav className="text-sm text-ash flex items-center mb-3 ms-2 space-x-2">
          <Link to="/" className="hover:text-gold2">Home</Link>
          <ChevronRight size={16} />
          <Link to="/products" className="hover:text-gold2">Products</Link>
          <ChevronRight size={16} />
          <Link to={`/products/${category.slug}`} className='hover:text-gold2'>{product.category_name}</Link>
          <ChevronRight size={16} />
          <span className="text-black font-medium">{product.name}</span>
        </nav>

        <div className="md:bg-white bg-transparent rounded-lg grid grid-cols-1 gap-2 md:gap-2 md:w-[75%] w-full">

          <div className='flex md:flex-row flex-col gap-2 md:gap-10'>
            {/* Image */}
            <div className='md:w-[280px] h-[400px] w-full flexCenter shrink-0 md:flex md:items-start flex-col bg-white md:bg-transparent p-3 rounded-lg shadow-md md:shadow-none'>
              <div>
                <img 
                  src={product.image} 
                  alt={product.name} 
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
              <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
              <p className="text-gray-500 mt-1">{product.subtext || 'Smart Energy Plan for Modern Homes'}</p>

              <p className="text-2xl text-gray-800 font-bold mt-3">{product.price}</p>

              <div className='flex justify-between' >
                <div className="flex items-center gap-1 mt-2 text-gold2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor"/>)}
                  <span className="text-gray-500 text-sm ml-1">(5 ratings)</span>
                </div>

                <div className="flex items-center gap-3">
                  <motion.span
                    whileTap={{ scale: 0.8 }}
                    onClick={()=>{
                      toggleProductWishlist(productId)
                      triggerToast(`${isWishlisted ? 'Removed from Wishlist' : 'Plan Successfully Wishlisted'}`);
                    }}
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
                {product.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-green-600"/> {feat}
                  </li>
                ))}
              </ul>
              
              {/* Add to Cart Button */}
              <AddToCartButton item={{
                ...product,
                id: product._id,
                type: 'product',
              }} onToast={triggerToast} className={'md:flex hidden w-full'} />

              <button 
                onClick={() => SendWhatsAppMessage(`Hello, I'm interested in the ${product.name} plan`)} 
                className="bg-gold2 hover:bg-gold2/80 text-white font-medium px-6 py-3 rounded-md flex justify-between items-center gap-2 mt-3 transition w-full"
                >
                <ShoppingCart size={18}/> <span>Chat on Whatsapp</span> <div></div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white md:bg-transparent p-3 rounded-lg md:shadow-none shadow-md">
            <h2 className="text-lg font-semibold text-black mb-4">Description</h2>
            
            {product.section?.length === 0 && (
              <p className="text-gray-600">No description available for this product.</p>
            )}

            {product.section?.map((section, index) => (
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
          <div className=" bg-white md:bg-transparent py-3 px-2 rounded-lg md:shadow-none shadow-md">
            <h2 className="text-lg font-medium text-black ps-1 mb-2">Customers Also Viewed</h2>
            <div className='overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory pb-2' >
              <div className="flex gap-3">
                {similarProduct.map((similar, idx) => (
                  <HashLink smooth to={`/plans/${similar._id}`}
                    key={similar._id}
                  >
                    <ProductCard
                      categoryId={categoryId}
                      image={similar.image}
                      title={similar.name}
                      productId={similar._id}
                      custom={idx}
                      price={similar.price}
                      key={similar._id}
                      onToast={triggerToast}
                    />
                  </HashLink>
                ))}
                {similarProduct.length === 0 && (
                  <p className="text-gray-500 ps-1">No similar products found.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      
      </div>
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
                item={{ ...product, id: product._id, type: 'product' }}
                onToast={triggerToast}
                className="w-full"
              />
            </div>
          </div>
        </div>
    </section>
  );
}
