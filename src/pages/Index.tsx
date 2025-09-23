import SearchHub from "@/components/SearchHub";
import ProfessionalHeader from "@/components/ProfessionalHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <ProfessionalHeader />
      
      {/* Hero Section with SearchHub */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gradient mb-6">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Search Nashville's premier MLS database with real-time listings, open houses, and market insights
          </p>
          
          {/* SearchHub Component - No Results, Just Navigation */}
          <SearchHub />
        </div>
      </section>
    </div>
  );
};

export default Index;
