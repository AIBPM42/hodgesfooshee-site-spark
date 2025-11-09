import Header from "@/components/Header";
import OpenHousesSection from "@/components/OpenHousesSection";
import Footer from "@/components/Footer";

export default function OpenHousesPage() {
  return (
    <>
      <Header />

      <main className="bg-transparent min-h-screen">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Upcoming Open Houses
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore available properties in Nashville & Middle Tennessee
            </p>
          </div>

          <OpenHousesSection />
        </div>
      </main>

      <Footer />
    </>
  );
}
