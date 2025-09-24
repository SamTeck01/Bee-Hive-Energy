import { useContext } from 'react';
import { ProductsContext } from './ProductsContext';
import { useParams, Link } from 'react-router-dom';
import { ProductCard } from './ProductCard';

export default function ProductCategoryPage() {
  const { products } = useContext(ProductsContext); 
  const { categoryId } = useParams();

  // Filter products belonging to this category
  const categoryProducts = products.filter(
    (product) => product.category_name?.replace(/ /g, '-')?.toLowerCase() === categoryId.toLowerCase()
  );
  if (categoryProducts.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold text-gray-800">No products found for this category</h2>
      </div>
    );
  }

  return (
    <section className="px-4 py-24">
      <div className="container mx-auto">
        {/* ✅ Breadcrumbs */}
        <nav className="text-sm text-gray-500">
          <Link to="/" className="hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:underline">All Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{categoryId.replace(/-/g, ' ')}</span>
        </nav>
        <h1 className="text-3xl font-bold text-center mb-6 capitalize">
          {categoryId.replace(/-/g, ' ')}
        </h1>
        <div className="md:flex md:flex-wrap grid grid-cols-2 gap-6">
          {categoryProducts.map((product, index) => (
            <div key={product._id || index}>
              <ProductCard
                image={product.image}
                title={product.name}
                price={product.price}
                categoryId={categoryId}
                productId={product._id}
                custom={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}