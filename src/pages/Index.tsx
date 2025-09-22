import ProfessionalHeader from "@/components/ProfessionalHeader";
import PropertySearchHero from "@/components/PropertySearchHero";
import FeaturedProperties from "@/components/FeaturedProperties";
import NashvilleInsiderAccess from "@/components/NashvilleInsiderAccess";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ProfessionalHeader />
      <PropertySearchHero />
      <FeaturedProperties />
      <NashvilleInsiderAccess />
      <Footer />
    </div>
  );
};

export default Index;
