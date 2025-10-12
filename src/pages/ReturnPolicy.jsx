import React from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';

const ReturnPolicy = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-grey-800 mb-6">Return Policy</h1>
        <div className="prose prose-lg max-w-none text-grey-700">
          <p className="text-sm text-grey-500 mb-4">Last Updated: October 12, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
            <p>We aim for customer satisfaction. Returns accepted within 7 days for eligible items (per Consumer Protection Rules 2019). Agri-products have restrictions due to perishability and regulations (e.g., Seeds Act 1966).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Eligibility for Returns</h2>
            <p>Returns allowed if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Item is defective/damaged (e.g., faulty machinery).</li>
              <li>Wrong item shipped.</li>
              <li>Not as described (e.g., incorrect seed variety).</li>
            </ul>
            <p><strong>Non-Returnable:</strong> Perishables (e.g., fruits, fertilizers post-opening), customized items, digital downloads. No returns on seeds/chemicals after planting/use (safety under Insecticides Act).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Return Process</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact support@agri-commerce.com within 7 days with order #, photos, reason.</li>
              <li>We'll issue a return label (free for defects; customer-paid otherwise).</li>
              <li>Ship back to: Agri-Commerce Returns, 123 Agriculture Street, Farming District, India.</li>
              <li>Inspect within 3 days; approve refund/exchange.</li>
            </ol>
            <p>Timeline: 5-10 business days for processing.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Refunds</h2>
            <p>Full refund to original payment method (minus shipping if non-defect). See <a href="/refunds" className="text-brand-primary-600 hover:underline">Refund Policy</a> for details. No cash refunds.</p>
            <p>Partial for used agri-items (e.g., 50% on opened tools).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Exceptions and Costs</h2>
            <p>Customer pays return shipping unless our error. Restocking fee (10%) for non-defects. International returns: Case-by-case.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Contact for Issues</h2>
            <p>Email returns@agri-commerce.com or call +91 98765 43210. Grievances: Respond in 48 hours (E-Commerce Rules).</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Changes to Policy</h2>
            <p>Updates posted here; continued purchases accept changes.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default ReturnPolicy;
