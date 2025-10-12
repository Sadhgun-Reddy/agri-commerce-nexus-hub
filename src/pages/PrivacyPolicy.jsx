import React from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';

const PrivacyPolicy = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-grey-800 mb-6">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none text-grey-700">
          <p className="text-sm text-grey-500 mb-4">Last Updated: October 12, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>Agri-Commerce we is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make purchases (e.g., seeds, fertilizers, machinery), or use our services. We comply with the Digital Personal Data Protection (DPDP) Act 2023, Information Technology (Reasonable Security Practices) Rules 2011, and other applicable laws.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We collect personal data to provide personalized agri-solutions:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Name, email, phone, address (for shipping farm equipment).</li>
              <li><strong>Payment Data:</strong> Credit/debit card details (processed securely via Razorpay; we don't store full info).</li>
              <li><strong>Farm-Specific Data:</strong> Location (for targeted deliveries), product preferences (e.g., organic fertilizers), to comply with Seeds Act 1966 and Fertilizer Control Order 1985.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, pages viewed (via cookies for analytics).</li>
              <li><strong>Non-Personal Data:</strong> Aggregated stats (e.g., popular machinery searches) for site improvement.</li>
            </ul>
            <p>We do not collect sensitive data (e.g., biometric) unless required for compliance (e.g., KYC for high-value machinery).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>Your data is used for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing orders and deliveries (e.g., farm address for sprayers).</li>
              <li>Personalized recommendations (e.g., seeds based on location/climate).</li>
              <li>Marketing (with consent; unsubscribe via email).</li>
              <li>Customer support and grievance redressal (15-30 days response under DPDP).</li>
              <li>Compliance (e.g., sharing with regulators for agri-product audits).</li>
              <li>Improving services (anonymized analytics).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Sharing Your Information</h2>
            <p>We share data only as necessary:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Razorpay (payments), AWS (hosting), shipping partners (e.g., Delhivery for rural farms).</li>
              <li><strong>Legal Requirements:</strong> To authorities (e.g., under Insecticides Act 1968 for product safety).</li>
              <li><strong>Business Transfers:</strong> In mergers (with notice).</li>
            </ul>
            <p>We do not sell data to third parties.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
            <p>Under DPDP Act and IT Act, you have rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access/Correction:</strong> View/update data via account dashboard.</li>
              <li><strong>Deletion:</strong> Request erasure (e.g., after account closure); we retain for 7 years for tax compliance.</li>
              <li><strong>Consent Withdrawal:</strong> Opt-out of marketing at any time.</li>
              <li><strong>Grievance:</strong> Contact our Data Protection Officer (DPO) at dpo@agri-commerce.com within 30 days.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Security and Cookies</h2>
            <p>We use SSL encryption, firewalls, and regular audits (per IT Rules 2011). See our <a href="/cookies" className="text-brand-primary-600 hover:underline">Cookie Policy</a> for tracking details.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
            <p>Our site is not for children under 18. We do not knowingly collect their data.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p>We may update this policy; changes will be posted here with the new date. Continued use constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
            <p>For questions, email privacy@agri-commerce.com or visit <a href="/contact" className="text-brand-primary-600 hover:underline">Contact Us</a>. DPO: [Name], Agri-Commerce, 123 Agriculture Street, Farming District, India.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;
