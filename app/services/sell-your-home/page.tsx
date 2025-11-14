import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function SellYourHomePage() {
  return (
    <div className="bg-porcelain min-h-screen">
      <Nav />

      <main className="bg-transparent">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-charcoal-900 mb-6">
              Sell Your Home
            </h1>
            <p className="text-xl text-charcoal-700 mb-8">
              Trust the sale of your home to a trusted partner. We're here to help guide you through every step of the process with expert advice and representation.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-sm hover:bg-copper-700 hover:text-white transition-all font-semibold"
            >
              Get Your Free Home Valuation
            </Link>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                Why Sell With Hodges & Fooshee?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Expert Market Analysis</h3>
                    <p className="text-charcoal-700">
                      We provide comprehensive market analysis to price your home competitively and attract serious buyers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Professional Marketing</h3>
                    <p className="text-charcoal-700">
                      Professional photography, virtual tours, and strategic online marketing to showcase your home.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Extensive Network</h3>
                    <p className="text-charcoal-700">
                      Access to a vast network of qualified buyers and real estate professionals throughout Middle Tennessee.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Skilled Negotiation</h3>
                    <p className="text-charcoal-700">
                      Expert negotiation to get you the best possible price and terms for your home sale.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Selling Process */}
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                Our Selling Process
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Initial Consultation</h3>
                    <p className="text-charcoal-700">
                      We meet to discuss your goals, timeline, and what makes your home unique.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Home Valuation & Pricing Strategy</h3>
                    <p className="text-charcoal-700">
                      Comprehensive market analysis to determine the optimal listing price for your property.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Home Preparation & Staging</h3>
                    <p className="text-charcoal-700">
                      Expert advice on preparing your home to make the best impression on potential buyers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Professional Marketing</h3>
                    <p className="text-charcoal-700">
                      Launch a comprehensive marketing campaign including photography, online listings, and open houses.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Showings & Negotiations</h3>
                    <p className="text-charcoal-700">
                      Coordinate showings and handle all negotiations to get you the best offer.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    6
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Closing</h3>
                    <p className="text-charcoal-700">
                      Guide you through inspections, appraisals, and paperwork to a successful closing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-4">
                Ready to Sell Your Home?
              </h2>
              <p className="text-xl text-charcoal-700 mb-8">
                Let's discuss how we can help you achieve your real estate goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-sm hover:bg-copper-700 hover:text-white transition-all font-semibold"
                >
                  Contact Us Today
                </Link>
                <Link
                  href="/search/properties"
                  className="rounded-full border-2 border-copper-600 text-copper-600 bg-white px-8 py-3 text-lg hover:bg-[#FBF3E7] transition-all font-semibold"
                >
                  View Our Listings
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
