
import React from 'react';
import { Wrench, Drill, Sprout, Droplets, SprayCanIcon, Scissors, Package, Milk, Square, Wind, Hammer, Zap, Settings, Building2, Tractor, Cog } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const CategoryRail = () => {
  const { categories = [] } = useApp();

  // Icon mapping for categories - we'll use a default icon if not found
  const categoryIcons: { [key: string]: any } = {
    'Intercultivators/Power weeders': Wrench,
    'Earth Augers': Drill,
    'Seeders/planters': Sprout,
    'Waterpumps & Engines': Droplets,
    'Sprayers': SprayCanIcon,
    'Brush cutters': Scissors,
    'Chaff cutters': Package,
    'Milking machines': Milk,
    'Cow mats': Square,
    'Foggers': Wind,
    'Power tools': Hammer,
    'Chain Saw': Zap,
    'Agriculture Shredders': Settings,
    'Harvesting Machines': Tractor,
    'Threashers': Building2,
    'Pillet making machines': Cog,
    'Pulverizers': Hammer,
    'Lawn/Stubble Movers': Tractor,
  };

  // Color mapping for categories
  const categoryColors = [
    'bg-blue-500',
    'bg-amber-500', 
    'bg-brand-primary-500',
    'bg-cyan-500',
    'bg-purple-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-green-600',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-600',
    'bg-slate-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-rose-500',
  ];

  // If no categories from API, show loading or empty state
  if (!categories || categories.length === 0) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-grey-800 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-grey-600 max-w-2xl mx-auto">
              Loading categories...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-grey-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-grey-600 max-w-2xl mx-auto">
            Find everything you need for modern farming, from cultivation tools to harvesting equipment
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 12).map((category, index) => {
            const IconComponent = categoryIcons[category.name] || Settings;
            const colorClass = categoryColors[index % categoryColors.length];
            
            return (
              <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`}>
                <Card className="p-6 text-center hover:shadow-level-2 transition-all duration-200 animate-card-hover border-0 bg-grey-50 group">
                  <div className="space-y-4">
                    <div className={`w-16 h-16 mx-auto rounded-16 ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-grey-800 mb-1 text-sm">
                        {category?.name || 'Unknown Category'}
                      </h3>
                      <p className="text-xs text-grey-600">
                        {category?.description || 'No description available'}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link to="/products">
            <button className="px-8 py-3 bg-brand-primary-500 text-white rounded-12 hover:bg-brand-primary-600 transition-colors">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryRail;
