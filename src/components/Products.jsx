import { motion } from "framer-motion";
import CardComponent from "./CardComponent.jsx";
import IconButton from "@mui/material/IconButton";
import { useContext, useMemo } from "react";
import { ProductsCategoryContext } from "./ProductCategoryContext.jsx"; // NocoDB categories
import { ProductsContext } from "./ProductsContext.jsx";               // Backend products

export default function Products() {
  const { productsCategory } = useContext(ProductsCategoryContext); // categories (no embedded products)
  const { products } = useContext(ProductsContext);                  // flat products from backend

  // Normalize price coming as number or "₦12,345"
  const toNumber = (val) => {
    if (val === null || val === undefined) return NaN;
    if (typeof val === "number") return val;
    const n = String(val).replace(/[^\d.]/g, "");
    return parseFloat(n);
  };

  // Group backend products by their category name once
  const productsByCategory = useMemo(() => {
    const map = new Map();
    for (const p of products || []) {
      const catName =
        p.categoryName || p.category || p.category_title || p.category_name;
      if (!catName) continue;
      if (!map.has(catName)) map.set(catName, []);
      map.get(catName).push(p);
    }
    return map;
  }, [products]);

  const getStartingPriceForCategory = (catName) => {
    const list = productsByCategory.get(catName) || [];
    const nums = list.map((p) => toNumber(p.price)).filter((n) => !isNaN(n));
    if (!nums.length) return null;
    const min = Math.min(...nums);
    return `₦${min.toLocaleString()}`;
  };

  return (
    <motion.section
      id="products"
      className="px-4 py-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false }}
    >
      <div className="container mx-auto">
        <span className="inline-flex items-center px-5 py-[6px] font-medium text-center text-black bg-gold2/30 rounded-2xl text-[13px] uppercase mb-10">
          Our Products
        </span>
        <h2 className="h8 text-black w-full md:w-[50%] lg:w-[50%]">
          We offer a range of products to choose from
        </h2>

        <div className="flexEnd">
          <IconButton aria-label="" className="h-[35px] !rounded-3xl font-semibold">
            <p className="text-black text-sm ms-1">Browse all products</p>
            <i className="bx text-black bx-arrow-right-stroke"></i>
          </IconButton>
        </div>

        <motion.div
          className="flexCenter"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: false }}
        >
          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {productsCategory.map((category) => {
              // Be resilient to different field names coming from NocoDB
              const catId =
                category.id || category._id || category.Id || category.pk;
              const catTitle =
                category.title || category.name || category.Title || category.Name;
              const catSlug =
                category.slug ||
                (catTitle
                  ? encodeURIComponent(catTitle.toLowerCase().replace(/\s+/g, "-"))
                  : "");

              const items = productsByCategory.get(catTitle) || [];
              const startingPrice = getStartingPriceForCategory(catTitle);

              return (
                <CardComponent
                  key={catId ?? catTitle}
                  title={catTitle}
                  description={category.description || category.Description || ""}
                  image={category.image || category.Image}
                  to={`/products/${catSlug}`}
                  productCount={items.length}
                  startingPrice={startingPrice}
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/*import { motion } from "framer-motion";
import CardComponent from './CardComponent.jsx';
import IconButton from '@mui/material/IconButton'
//import productCategories from "../assets/product_categories.js";
import { useContext } from "react";
import { ProductsCategoryContext } from "./ProductCategoryContext.jsx"; // Import ProductsContext

export default function Products() {
  const { productsCategory } = useContext(ProductsCategoryContext); // Access products from context
  const getStartingPrice = (productsString) => {
    try {
      const products = JSON.parse(productsString.replace(/[\r\n]+/g, ''));
      const prices = products.map(p => {
        const raw = p.price.replace(/[₦,]/g, '');
        return parseFloat(raw);
      });
      const minPrice = Math.min(...prices);
      return `₦${minPrice.toLocaleString()}`;
    } catch (error) {
      console.error('Error parsing products:', error);
      return null;
    }
  };

  return (
    <motion.section
      id='products'
      className="px-4 py-12"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: false }}
    >
      <div className='container mx-auto'>
        <span className="inline-flex items-center px-5 py-[6px] font-medium text-center text-black bg-gold2/30 rounded-2xl text-[13px] uppercase mb-10 ">
          Our Products
        </span>   
        <h2 className="h8 text-black w-full md:w-[50%] lg:w-[50%]">We offer a range of products to choose from</h2>

        <div className='flexEnd'>
          <IconButton aria-label="" className='h-[35px] !rounded-3xl font-semibold'>
            <p className='text-black text-sm ms-1 '>Browse all products</p>
            <i className='bx text-black bx-arrow-right-stroke'></i> 
          </IconButton>
        </div>  
        
        {/*Products section with animation
        <motion.div
          className='flexCenter'
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: false }}
        >
          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {productsCategory.map((category) => {
              const parsedProducts = JSON.parse(category.products || '[]'); // Parse products if they are stored as a JSON string
              const startingPrice = getStartingPrice(category.products);
              return(
              <CardComponent
                key={category.id}
                title={category.title}
                description={category.description}
                image={category.image}
                to={`/products/${category.slug}`}
                productCount={parsedProducts.length}
                startingPrice={startingPrice}
              />
            )})}
          </div>

        </motion.div>
      </div>
    </motion.section>
  )
}*/