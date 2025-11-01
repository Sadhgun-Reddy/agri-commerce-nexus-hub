import React from 'react';
import { Users, Tractor, Leaf, Calendar, Award, MapPin } from 'lucide-react'; // Optional icons for visual appeal (from lucide-react)
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
      const navigate = useNavigate();
    const handleClick = () => {
    navigate("/products");
     window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero/Intro Section */}
        <section className="relative bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About Agri-Commerce
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 text-white/90">
              Empowering India's farmers with innovative tools and sustainable solutions for modern agriculture.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>10,000+ Farmers Served</span>
              </div>
              <div className="flex items-center space-x-2">
                <Tractor className="w-5 h-5" />
                <span>500+ Products</span>
              </div>
              <div className="flex items-center space-x-2">
                <Leaf className="w-5 h-5" />
                <span>100% Sustainable</span>
              </div>
            </div>
          </div>
          {/* Optional background image overlay */}
          <div className="absolute inset-0 bg-black/20"></div>
        </section>

        {/* Company Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg text-center mb-12">
              <h2 className="text-3xl font-bold text-grey-800 mb-6">
                Our Journey: From Vision to Harvest
              </h2>
              <p className="text-lg text-grey-600">
                Founded in 2015, Agri-Commerce started as a small initiative to bridge the gap between innovative agricultural technology and India's vast farming community. Today, we're a leading e-commerce platform revolutionizing how farmers access quality equipment, seeds, and supplies.
              </p>
            </div>

            {/* Timeline */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-brand-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-grey-800 mb-2">2015: Inception</h3>
                <p className="text-grey-600">Launched with a focus on affordable tools for smallholder farmers in rural India.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-brand-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-grey-800 mb-2">2020: Growth Milestone</h3>
                <p className="text-grey-600">Expanded to nationwide delivery, partnering with 50+ manufacturers for sustainable products.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-brand-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-grey-800 mb-2">2025: Future Forward</h3>
                <p className="text-grey-600">Integrating AI for crop recommendations and expanding to organic farming solutions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-3xl font-bold text-grey-800 mb-8 text-center">
                Our Mission & Vision
              </h2>
              <div className="grid md:grid-cols-2 gap-12 text-grey-600">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-semibold text-grey-800 mb-4">Mission</h3>
                  <p className="mb-4">
                    To empower Indian farmers by providing accessible, high-quality agricultural equipment and knowledge that boosts productivity, reduces costs, and promotes eco-friendly practices. We aim to make modern farming tools available to every doorstep, from large estates to small family farms.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Innovative solutions for irrigation, soil health, and harvesting.</li>
                    <li>Affordable pricing with flexible payments via Razorpay and UPI.</li>
                    <li>Education through blogs and videos on sustainable agriculture.</li>
                  </ul>
                </div>
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-2xl font-semibold text-grey-800 mb-4">Vision</h3>
                  <p className="mb-4">
                    To be the go-to platform for a sustainable agricultural revolution in India, where every farmer thrives with technology-driven efficiency and environmental responsibility. By 2030, we envision serving 1 million users and reducing water waste by 30% through smart tools.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mb-4">
                    <li>Global partnerships for cutting-edge agri-tech.</li>
                    <li>Community building via farmer forums and expert consultations.</li>
                    <li>Zero-waste supply chain for seeds and machinery.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team & Values Section */}
       

        {/* Core Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg text-center mb-12">
              <h2 className="text-3xl font-bold text-grey-800 mb-6">
                Our Core Values
              </h2>
              <p className="text-lg text-grey-600">
                Sustainability, Integrity, Innovation, and Farmer-Centric Approach.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Leaf className="w-12 h-12 text-brand-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-grey-800 mb-2">Sustainability</h3>
                <p className="text-grey-600">Eco-friendly products to preserve soil and water for future generations.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Award className="w-12 h-12 text-brand-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-grey-800 mb-2">Integrity</h3>
                <p className="text-grey-600">Transparent dealings, quality assurance, and fair pricing for all farmers.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Tractor className="w-12 h-12 text-brand-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-grey-800 mb-2">Innovation</h3>
                <p className="text-grey-600">Cutting-edge tech like smart irrigation and AI-driven seed selection.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Users className="w-12 h-12 text-brand-primary-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-grey-800 mb-2">Farmer First</h3>
                <p className="text-grey-600">Tailored support, from tutorials to 24/7 assistance for rural needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Similar to TrustBar */}
        <section className="py-16 bg-brand-primary-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-grey-800 mb-6">
              Ready to Grow with Us?
            </h2>
            <p className="text-lg text-grey-600 mb-8 max-w-2xl mx-auto">
              Join the Agri-Commerce family and elevate your farming operations today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-brand-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-primary-600"
              onClick={handleClick}
>
                Shop Now
              </button>
              <button className="border border-brand-primary-500 text-brand-primary-500 px-8 py-3 rounded-lg font-semibold hover:bg-brand-primary-50"
               onClick={() => navigate("/contact")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
