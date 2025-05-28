
import React from 'react';
import { Tractor, Wrench, Sprout, Droplets, Shield, Truck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const CategoryRail = () => {
  const categories = [
    {
      id: 1,
      name: 'Tractors',
      icon: Tractor,
      description: 'Heavy-duty farming tractors',
      href: '/category/tractors',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Tools',
      icon: Wrench,
      description: 'Essential farming tools',
      href: '/category/tools',
      color: 'bg-accent-orange-500',
    },
    {
      id: 3,
      name: 'Seeds',
      icon: Sprout,
      description: 'Quality seeds & saplings',
      href: '/category/seeds',
      color: 'bg-brand-primary-500',
    },
    {
      id: 4,
      name: 'Irrigation',
      icon: Droplets,
      description: 'Water management systems',
      href: '/category/irrigation',
      color: 'bg-cyan-500',
    },
    {
      id: 5,
      name: 'Protection',
      icon: Shield,
      description: 'Crop protection products',
      href: '/category/protection',
      color: 'bg-purple-500',
    },
    {
      id: 6,
      name: 'Transport',
      icon: Truck,
      description: 'Agricultural vehicles',
      href: '/category/transport',
      color: 'bg-red-500',
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-grey-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-grey-600 max-w-2xl mx-auto">
            Find everything you need for modern farming, from heavy machinery to essential tools
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={category.href}>
              <Card className="p-6 text-center hover:shadow-level-2 transition-all duration-200 animate-card-hover border-0 bg-grey-50 group">
                <div className="space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-16 ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-grey-800 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-grey-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryRail;
