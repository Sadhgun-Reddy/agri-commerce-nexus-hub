import React from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';

const TermsOfService = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-grey-800 mb-6">Terms of Service</h1>
        <div className="prose prose-lg max-w-none text-grey-700">
          <p className="text-sm text-grey-500 mb-4">Last Updated: October 12, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing Agri-Commerce ("Site," "we," "us"), you agree to these Terms of Service ("Terms"), Privacy Policy, and all applicable laws. If you do not agree, do not use the Site. These Terms form a binding contract.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Eligibility</h2>
            <p>You must be 18+ and capable of forming a binding contract. Businesses must comply with GST registration for purchases over ₹5 lakh.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Description of Services</h2>
            <p>We provide an online marketplace for agri-products (e.g., seeds, tools, machinery). We facilitate sales but are not the seller—products comply with Seeds Act 1966, Insecticides Act 1968, and Fertilizer Control Order 1985.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
            <p>Create accounts with accurate info. You are responsible for security; notify us of breaches. We may suspend accounts for violations.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sell prohibited items (e.g., banned pesticides, counterfeit seeds).</li>
              <li>Engage in fraud, spam, or IP infringement.</li>
              <li>Harvest data without consent (per DPDP Act).</li>
              <li>Misuse products (e.g., improper fertilizer application leading to crop damage).</li>
            </ul>
            <p>Violations may result in termination and legal action.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Payments and Orders</h2>
            <p>Payments via Razorpay/UPI; all prices in INR + GST. Orders are binding; we confirm via email. For agri-products, check stock/expiry (e.g., seeds valid 6-12 months).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>Site content (logos, product images) is our property or licensed. You may not reproduce without permission. User content (e.g., reviews) grants us a royalty-free license.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitations</h2>
            <p>Products are as-described; we disclaim liability for misuse (e.g., no warranty for crop yield). Services provided "as-is." Limitation: ₹10,000 max for indirect damages.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
            <p>We may terminate access for breaches. You may close your account anytime.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution</h2>
            <p>Governing law: India. Disputes resolved via arbitration in Delhi under Arbitration Act 1996. For grievances, contact within 48 hours (per E-Commerce Rules 2020).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
            <p>We may update Terms; continued use accepts changes. Check footer for updates.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p>Email legal@agri-commerce.com or visit <a href="/contact" className="text-brand-primary-600 hover:underline">Contact Us</a>.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;
