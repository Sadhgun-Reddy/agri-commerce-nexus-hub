import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const CategoryRail = () => {
  const categories = [
    {
      id: 1,
      name: "Intercultivators/Power weeders",
      img: "/category/Intercultivators_Power_weeders.png",
      description: "Cultivation & weeding tools",
    },
    {
      id: 2,
      name: "Earth Augers",
      img: "/category/Earth_Augers.png",
      description: "Drilling & boring equipment",
    },
    {
      id: 3,
      name: "Seeders/planters",
      img: "/category/Seeders_planters.png",
      description: "Planting & seeding machines",
    },
    {
      id: 4,
      name: "Waterpumps & Engines",
      img: "/category/Waterpumps & Engines.png",
      description: "Water pumping systems",
    },
    {
      id: 5,
      name: "Sprayers",
      img: "/category/Sprayers.png",
      description: "Crop spraying equipment",
    },
    {
      id: 6,
      name: "Brush cutters",
      img: "/category/Brush_cutters.png",
      description: "Cutting & trimming tools",
    },
    {
      id: 7,
      name: "Chaff cutters",
      img: "/category/Chaff_cutters.png",
      description: "Feed preparation machines",
    },
    {
      id: 8,
      name: "Milking machines",
      img: "/category/Milking_Machines.png",
      description: "Dairy automation equipment",
    },
    {
      id: 9,
      name: "Cow mats",
      img: "/category/Cow_Mats.png",
      description: "Livestock comfort products",
    },
    {
      id: 10,
      name: "Foggers",
      img: "/category/Foggers.png",
      description: "Fogging & misting systems",
    },
    {
      id: 11,
      name: "Power tools",
      img: "/category/Power tools.png",
      description: "Electric & pneumatic tools",
    },
    {
      id: 12,
      name: "Chain Saw",
      img: "/category/Chain_Saw.png",
      description: "Cutting & pruning saws",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-grey-900">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
          {categories.map((category) => (
            <Link key={category.id} to={`/products?category=${encodeURIComponent(category.name)}`}>

              <div
                className="
                  p-6 
                  rounded-xl 
                  bg-white 
                  shadow-lg 
                  hover:shadow-2xl 
                  hover:-translate-y-1 
                  transition-all 
                  duration-300 
                  text-center
                  flex 
                  flex-col 
                  justify-between
                  h-60          /* << FIXED HEIGHT */
                "
              >

                {/* IMAGE BOX */}
                <div className="w-38 h-38 mx-auto mb-4 flex items-center justify-center rounded-xl bg-gray-50 shadow overflow-hidden">
                  <img src={category.img} className="w-30 h-30 object-contain" />
                </div>

                {/* TEXT */}
                <div>
                  <h3 className="font-semibold text-grey-800 text-md">{category.name}</h3>
                  <p className="text-sm text-grey-500 mt-1">{category.description}</p>
                </div>

              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CategoryRail;
