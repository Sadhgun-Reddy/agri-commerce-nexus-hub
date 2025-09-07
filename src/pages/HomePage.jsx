import React from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import HeroCarousel from '@/components/home/HeroCarousel.jsx';
import CategoryRail from '@/components/home/CategoryRail.jsx';
import FeaturedProducts from '@/components/home/FeaturedProducts.jsx';
import TrustBar from '@/components/home/TrustBar.jsx';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-8">
          <HeroCarousel />
        </section>

        {/* Category Rail */}
        <CategoryRail />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Trust Bar */}
        <TrustBar />

        {/* SEO Content Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-3xl font-bold text-grey-800 mb-6 text-center">
                Your Trusted Partner in Modern Agriculture
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-grey-600">
                <div>
                  <p className="mb-4">
                    Welcome to Agri-Commerce, India's premier destination for quality farming equipment 
                    and agricultural supplies. We understand the challenges faced by modern farmers and 
                    are committed to providing innovative solutions that enhance productivity and sustainability.
                  </p>
                  <p className="mb-4">
                    Our extensive catalog features premium tractors, advanced irrigation systems, 
                    high-quality seeds, and essential farming tools from trusted manufacturers across the globe.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    With over a decade of experience in the agricultural sector, we have built strong 
                    relationships with farmers, dealers, and manufacturers to ensure you get the best 
                    products at competitive prices.
                  </p>
                  <p className="mb-4">
                    Join thousands of satisfied farmers who trust Agri-Commerce for their farming needs. 
                    Experience the difference that quality equipment makes in your agricultural operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
