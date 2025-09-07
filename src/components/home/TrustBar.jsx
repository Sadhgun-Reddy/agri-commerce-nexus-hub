import React from 'react';
import { Shield, Truck, Phone, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

const TrustBar = () => {
  const trustItems = [
    {
      icon: Shield,
      title: "Genuine Products",
      description: "100% authentic farming equipment from verified manufacturers",
      color: "text-brand-primary-500"
    },
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Free shipping on orders above ₹25,000 across India",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      title: "24/7 Support",
      description: "Expert assistance available round the clock",
      color: "text-accent-orange-500"
    },
    {
      icon: Award,
      title: "1 Year Warranty",
      description: "Comprehensive warranty on all major equipment",
      color: "text-purple-500"
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <Card key={index} className="p-6 text-center border-0 bg-grey-50 shadow-level-1">
              <div className="space-y-4">
                <div className={`w-12 h-12 mx-auto rounded-12 bg-white shadow-level-1 flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-grey-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-grey-600">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
