
import React from 'react';
import { Wrench, Drill, Sprout, Droplets, Spray, Scissors, Package, Milk, Square, Wind, Hammer, Zap, Recycle, Wheat, Cog, Factory, Zap as ZapIcon, Tractor } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const CategoryRail = () => {
  const categories = [
    {
      id: 1,
      name: 'Intercultivators/Power weeders',
      icon: Wrench,
      description: 'Cultivation & weeding tools',
      href: '/category/intercultivators',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Earth Augers',
      icon: Drill,
      description: 'Drilling & boring equipment',
      href: '/category/earth-augers',
      color: 'bg-amber-500',
    },
    {
      id: 3,
      name: 'Seeders/planters',
      icon: Sprout,
      description: 'Planting & seeding machines',
      href: '/category/seeders-planters',
      color: 'bg-brand-primary-500',
    },
    {
      id: 4,
      name: 'Waterpumps & Engines',
      icon: Droplets,
      description: 'Water pumping systems',
      href: '/category/waterpumps-engines',
      color: 'bg-cyan-500',
    },
    {
      id: 5,
      name: 'Sprayers',
      icon: Spray,
      description: 'Crop spraying equipment',
      href: '/category/sprayers',
      color: 'bg-purple-500',
    },
    {
      id: 6,
      name: 'Brush cutters',
      icon: Scissors,
      description: 'Cutting & trimming tools',
      href: '/category/brush-cutters',
      color: 'bg-red-500',
    },
    {
      id: 7,
      name: 'Chaff cutters',
      icon: Package,
      description: 'Feed preparation machines',
      href: '/category/chaff-cutters',
      color: 'bg-orange-500',
    },
    {
      id: 8,
      name: 'Milking machines',
      icon: Milk,
      description: 'Dairy automation equipment',
      href: '/category/milking-machines',
      color: 'bg-pink-500',
    },
    {
      id: 9,
      name: 'Cow mats',
      icon: Square,
      description: 'Livestock comfort products',
      href: '/category/cow-mats',
      color: 'bg-green-600',
    },
    {
      id: 10,
      name: 'Foggers',
      icon: Wind,
      description: 'Fogging & misting systems',
      href: '/category/foggers',
      color: 'bg-indigo-500',
    },
    {
      id: 11,
      name: 'Power tools',
      icon: Hammer,
      description: 'Electric & pneumatic tools',
      href: '/category/power-tools',
      color: 'bg-yellow-500',
    },
    {
      id: 12,
      name: 'Chain Saw',
      icon: Zap,
      description: 'Cutting & pruning saws',
      href: '/category/chain-saw',
      color: 'bg-red-600',
    },
    {
      id: 13,
      name: 'Agriculture Shredders',
      icon: Recycle,
      description: 'Crop residue management',
      href: '/category/agriculture-shredders',
      color: 'bg-teal-500',
    },
    {
      id: 14,
      name: 'Harvesting Machines',
      icon: Wheat,
      description: 'Crop harvesting equipment',
      href: '/category/harvesting-machines',
      color: 'bg-amber-600',
    },
    {
      id: 15,
      name: 'Threashers',
      icon: Cog,
      description: 'Grain separation machines',
      href: '/category/threashers',
      color: 'bg-slate-500',
    },
    {
      id: 16,
      name: 'Pillet making machines',
      icon: Factory,
      description: 'Feed pellet production',
      href: '/category/pellet-making-machines',
      color: 'bg-emerald-500',
    },
    {
      id: 17,
      name: 'Pulverizers',
      icon: ZapIcon,
      description: 'Grinding & crushing equipment',
      href: '/category/pulverizers',
      color: 'bg-violet-500',
    },
    {
      id: 18,
      name: 'Lawn/Stubble Movers',
      icon: Tractor,
      description: 'Field cleaning equipment',
      href: '/category/lawn-stubble-movers',
      color: 'bg-lime-500',
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
            Find everything you need for modern farming, from cultivation tools to harvesting equipment
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 12).map((category) => (
            <Link key={category.id} to={category.href}>
              <Card className="p-6 text-center hover:shadow-level-2 transition-all duration-200 animate-card-hover border-0 bg-grey-50 group">
                <div className="space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-16 ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-grey-800 mb-1 text-sm">
                      {category.name}
                    </h3>
                    <p className="text-xs text-grey-600">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/categories">
            <button className="px-8 py-3 bg-brand-primary-500 text-white rounded-12 hover:bg-brand-primary-600 transition-colors">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryRail;
