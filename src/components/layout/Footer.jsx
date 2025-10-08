import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '' },
      { name: 'Careers', href: '' },
      { name: 'Press', href: '' },
    ],
    support: [
      { name: 'Help Center', href: '' },
      { name: 'Safety Center', href: '' },
      { name: 'Community Guidelines', href: '' },
      { name: 'Contact Us', href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '' },
      { name: 'Terms of Service', href: '' },
      { name: 'Cookie Policy', href: '' },
      { name: 'Return Policy', href: '' },
    ],
  };

  return (
    <footer className="bg-grey-50 border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-brand-primary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl">Agri-Commerce</span>
            </div>
            <p className="text-sm text-grey-600 max-w-sm">
              Your trusted partner for quality farming equipment and agricultural supplies. 
              Empowering farmers with the best tools for sustainable agriculture.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-grey-600">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-grey-600">
                <Mail className="h-4 w-4" />
                <span>support@agri-commerce.in</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-grey-600">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-grey-800 mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-grey-600 hover:text-brand-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-grey-800 mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-grey-600 hover:text-brand-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-grey-800 mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-grey-600 hover:text-brand-primary-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mt-8 pt-8 border-t">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="p-2 text-grey-600 hover:text-brand-primary-500 transition-colors"
              aria-label={social.label}
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-grey-600">
            © 2025 Agri-Commerce. All rights reserved. Built with ❤️ for farmers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
