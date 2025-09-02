import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Header from './components/header.jsx';
import Footer from './pages/Footer.jsx';

import Home from './components/Home.jsx';
import PlansPage from './components/All Plans Page.jsx';
import PlanDetails from './components/Plan Details.jsx';
import WishlistPage from './components/WishlistPage.jsx';
import AllProductsPage from './components/All Product Page.jsx';
import ProductCategoryPage from './components/ProductCategoryPage.jsx';
import ProductDetailsPage from './components/productDetail.jsx';
import InverterSolutions from './components/InverterSolution.jsx';
import InstallationServices from './components/InstallationServices.jsx';
import IoTEnergySolutions from './components/IotSolution.jsx';
import GalleryPro from './components/Gallery.jsx';
import CartPage from './components/CartPage.jsx';
import Checkout from './components/Checkout.jsx';

import { WishlistProvider } from './components/WishlistContext.jsx';
import { PlansProvider } from './components/PlansContext.jsx';
import { ProductsProvider } from './components/ProductsContext.jsx';
import { CartProvider } from './components/CartContext.jsx';
import { ProductsCategoryProvider } from './components/ProductCategoryContext.jsx';

export default function App() {
  return (
    <main className="text-tertiary">
      <CartProvider>
        <WishlistProvider>
          <ProductsCategoryProvider>
            <PlansProvider>
              <ProductsProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <Header />

                  <Routes>
                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* Plans */}
                    <Route path="/plans" element={<PlansPage />} />
                    <Route path="/plans/:slug" element={<PlanDetails />} />

                    {/* Products */}
                    <Route path="/products" element={<AllProductsPage />} />
                    <Route path="/products/:categoryId" element={<ProductCategoryPage />} />
                    <Route path="/products/:categoryId/:productId" element={<ProductDetailsPage />} />

                    {/* Services */}
                    <Route path="/inverter-solutions" element={<InverterSolutions />} />
                    <Route path="/installation-services" element={<InstallationServices />} />
                    <Route path="/iot-energy-solutions" element={<IoTEnergySolutions />} />

                    {/* Extras */}
                    <Route path="/gallery" element={<GalleryPro />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />

                    {/* Fallback */}
                    <Route path="*" element={<p className="text-center mt-10">Page not found 😏</p>} />
                  </Routes>

                  <Footer />
                </BrowserRouter>
              </ProductsProvider>
            </PlansProvider>
          </ProductsCategoryProvider>
        </WishlistProvider>
      </CartProvider>
    </main>
  );
}
