import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-24 bg-primary text-center px-4">
        <div className="absolute inset-0 z-0 overflow-hidden">
             <div className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-accent opacity-10 blur-[100px]"></div>
             <div className="absolute bottom-0 left-0 w-[50%] h-[100%] rounded-full bg-[#27AE60] opacity-10 blur-[100px]"></div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-white/80 font-semibold tracking-wider text-sm mb-4 inline-block uppercase">Our Story</span>
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6">Rooted in Tradition. <br/> Delivered in Purity.</h1>
          <p className="text-lg text-white/80">
            Shresta Organics was born from a simple belief: that nature provides exactly what our bodies need to thrive, without the intervention of synthetic chemicals.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="prose prose-lg text-gray-600 mx-auto">
          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-6 text-center">The Journey Back to Nature</h2>
          
          <p className="mb-6 leading-relaxed">
            In today's fast-paced world, convenience often takes precedence over quality. Processed foods, artificial preservatives, and synthetic farming methods have slowly replaced the wholesome, nutrient-dense foods our ancestors enjoyed. 
          </p>
          
          <p className="mb-10 leading-relaxed">
            At <strong>Shresta Organics</strong>, we decided to take a step back. We journeyed across the fertile lands of India to partner directly with generational farmers who still employ ancient, ethical, and organic agricultural practices. 
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-16">
            <div className="bg-[#F9F5EF] p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-4">Wood Pressed Excellence</h3>
              <p className="text-sm">We use traditional Chekku/Ghani methods to extract our oils. By pressing seeds slowly at room temperature without generating heat, we ensure 100% of the natural nutrients, antioxidants, and authentic flavors remain intact.</p>
            </div>
            <div className="bg-[#F9F5EF] p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-4">Zero Chemical Policy</h3>
              <p className="text-sm">From the soil to the shelf, our products are rigorously tested to be absolutely free of pesticides, synthetic fertilizers, GMOs, and artificial colors. What you see is precisely what nature grew.</p>
            </div>
          </div>

          <h2 className="text-3xl font-playfair font-bold text-gray-900 mb-6 text-center">Our Commitment to You</h2>
          <p className="mb-6 leading-relaxed text-center">
            Purity isn't just a marketing term for us—it's our core operating principle. Every jar of honey, every drop of oil, and every grain of spice delivered to your doorstep carries our unwavering promise of authenticity.
          </p>

          <div className="mt-16 text-center">
            <Link href="/products" className="inline-block px-10 py-5 bg-accent hover:bg-[#D68910] text-white rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl">
              Explore Our Pure Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
