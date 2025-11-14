import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function BuyAHomePage() {
  return (
    <div className="bg-porcelain min-h-screen">
      <Nav />

      <main className="bg-transparent">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-charcoal-900 mb-6">
              Buy A Home
            </h1>
            <p className="text-xl text-charcoal-700 mb-8">
              Find your dream home in Nashville & Middle Tennessee with expert guidance every step of the way
            </p>
            <Link
              href="/search/properties"
              className="inline-flex items-center gap-2 rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-[0_10px_30px_rgba(242,87,45,0.45)] hover:shadow-[0_14px_40px_rgba(242,87,45,0.55)] transition font-semibold"
            >
              Start Your Property Search
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Why Buy With Us */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                Why Buy With Hodges & Fooshee?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Local Market Expertise</h3>
                    <p className="text-charcoal-700">
                      Deep knowledge of Nashville neighborhoods, schools, and market trends to help you make informed decisions.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Personalized Home Search</h3>
                    <p className="text-charcoal-700">
                      Customized property searches based on your specific needs, preferences, and budget.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">First-Time Buyer Support</h3>
                    <p className="text-charcoal-700">
                      Patient guidance through every step of the home buying process, perfect for first-time buyers.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Strong Negotiation</h3>
                    <p className="text-charcoal-700">
                      Skilled negotiators who work to get you the best deal on your new home.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Buying Process */}
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                Your Home Buying Journey
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Initial Consultation</h3>
                    <p className="text-charcoal-700">
                      Discuss your needs, preferences, budget, and timeline to understand what you're looking for.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Get Pre-Approved</h3>
                    <p className="text-charcoal-700">
                      We'll connect you with trusted lenders to get pre-approved and understand your buying power.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Search for Your Home</h3>
                    <p className="text-charcoal-700">
                      Access our comprehensive MLS listings and schedule tours of properties that match your criteria.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Make an Offer</h3>
                    <p className="text-charcoal-700">
                      When you find the right home, we'll craft a competitive offer and handle all negotiations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Inspections & Due Diligence</h3>
                    <p className="text-charcoal-700">
                      Coordinate home inspections and guide you through any issues that may arise.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    6
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Closing Day</h3>
                    <p className="text-charcoal-700">
                      Review all documents, sign paperwork, and receive the keys to your new home!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buyer Resources */}
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                Helpful Buyer Resources
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Mortgage Calculator</h3>
                  <p className="text-charcoal-700">
                    Estimate your monthly payments and understand financing options.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Home Buying Checklist</h3>
                  <p className="text-charcoal-700">
                    Stay organized with our comprehensive buyer's checklist.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Neighborhood Guides</h3>
                  <p className="text-charcoal-700">
                    Explore Nashville neighborhoods and find your perfect community.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="glass rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-xl text-charcoal-700 mb-8">
                Let's start your home search today and find the perfect property for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search/properties"
                  className="rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-[0_10px_30px_rgba(242,87,45,0.45)] hover:shadow-[0_14px_40px_rgba(242,87,45,0.55)] transition font-semibold"
                >
                  Search Properties
                </Link>
                <Link
                  href="/#contact"
                  className="rounded-full border-2 border-copper-600 text-copper-600 px-8 py-3 text-lg hover:bg-copper-50 transition font-semibold"
                >
                  Schedule a Consultation
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
