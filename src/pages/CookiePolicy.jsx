import React from 'react';
import Header from '@/components/layout/Header.jsx';
import Footer from '@/components/layout/Footer.jsx';

const CookiePolicy = () => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold text-grey-800 mb-6">Cookie Policy</h1>
        <div className="prose prose-lg max-w-none text-grey-700">
          <p className="text-sm text-grey-500 mb-4">Last Updated: October 12, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies?</h2>
            <p>Cookies are small text files stored on your device to enhance Site functionality, remember preferences (e.g., cart items), and analyze usage. We comply with DPDP Act 2023 and EU ePrivacy Directive for consent.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
            <table className="w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Type</th>
                  <th className="border border-gray-300 p-2">Purpose</th>
                  <th className="border border-gray-300 p-2">Duration</th>
                  <th className="border border-gray-300 p-2">Provider</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Essential</td>
                  <td className="border border-gray-300 p-2">Site functionality (e.g., login, cart)</td>
                  <td className="border border-gray-300 p-2">Session (deleted on close)</td>
                  <td className="border border-gray-300 p-2">Agri-Commerce</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Analytics</td>
                  <td className="border border-gray-300 p-2">Usage stats (e.g., popular tools; anonymized)</td>
                  <td className="border border-gray-300 p-2">2 years</td>
                  <td className="border border-gray-300 p-2">Google Analytics</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-medium">Marketing</td>
                  <td className="border border-gray-300 p-2">Targeted ads (e.g., fertilizer deals)</td>
                  <td className="border border-gray-300 p-2">90 days</td>
                  <td className="border border-gray-300 p-2">Facebook Pixel</td>
                </tr>
              </tbody>
            </table>
            <p>No third-party cookies without consent. For agri-users, analytics help optimize searches (e.g., monsoon machinery).</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Consent and Management</h2>
            <p>Our cookie banner seeks explicit consent on first visit (opt-in for non-essential). You can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manage via browser settings (e.g., Chrome: Settings Privacy  Cookies).</li>
              <li>Withdraw consent anytime (updates take effect next visit).</li>
              <li>Disable: May limit features (e.g., saved filters for categories).</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Cookies</h2>
            <p>Embedded services (e.g., Razorpay for payments) may set cookies—we have no control but require their privacy policies.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Changes to Policy</h2>
            <p>Updates posted here; check regularly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p>Email cookies@agri-commerce.com or see <a href="/privacy" className="text-brand-primary-600 hover:underline">Privacy Policy</a>.</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default CookiePolicy;
