import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <div className="bg-porcelain min-h-screen">
      <Nav />

      <main className="bg-transparent">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="mx-auto max-w-4xl">
            <h1 className="text-5xl font-bold text-charcoal-900 mb-6 text-center">
              About Hodges & Fooshee Realty
            </h1>
            <p className="text-2xl text-charcoal-700 text-center mb-8 font-semibold">
              Your Source for Nashville, Tennessee Real Estate!
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 mb-12">
              <p className="text-lg text-charcoal-700 mb-6">
                Hodges & Fooshee Realty offers unparalleled service to ALL clients in the Nashville, Tennessee real estate market. Your complete satisfaction with our service and representation is our number one priority.
              </p>
              <p className="text-lg text-charcoal-700 mb-6">
                Whether you are considering buying a home, selling a home or both, we know the area inside and out.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8">
                <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">Featured Property for Sale</h3>
                <p className="text-charcoal-700">
                  Some of the best properties for sale are displayed right here. As experts in the Nashville, Tennessee real estate market, we can provide you detailed information on these homes, or any others!
                </p>
              </div>

              <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8">
                <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">Market Trends</h3>
                <p className="text-charcoal-700">
                  Find out what's going on in today's real estate market. Our Nashville, Tennessee real estate blog provides fresh perspective on our market activity. Be sure to check these out!
                </p>
              </div>

              <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8">
                <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">Email Listing Alerts</h3>
                <p className="text-charcoal-700">
                  Be the first to know what's coming up for sale in the Nashville, Tennessee real estate market with our New Property Listing Alerts! Just tell us what you're looking for and we'll email a daily update of all homes listed for sale since your last update. You can unsubscribe at any time.
                </p>
              </div>

              <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8">
                <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-charcoal-900 mb-3">What's Your Home Worth?</h3>
                <p className="text-charcoal-700">
                  Receive a complimentary analysis of your home's approximate present value on the market today.
                </p>
              </div>
            </div>

            {/* Services Overview */}
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">Our Services</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">Sell Your Home</h3>
                  <p className="text-charcoal-700 mb-4">
                    Trust the sale of your home to a trusted partner. We're here to help guide you through every step of the process with expert advice and representation.
                  </p>
                  <Link href="/services/sell-your-home" className="text-copper-600 hover:text-copper-700 font-semibold">
                    Learn More →
                  </Link>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">Buy A Home</h3>
                  <p className="text-charcoal-700 mb-4">
                    Let us work with you to find and purchase the home of your dreams. We know the area and opportunities for buyers in today's market.
                  </p>
                  <Link href="/services/buy-a-home" className="text-copper-600 hover:text-copper-700 font-semibold">
                    Learn More →
                  </Link>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">Property Management</h3>
                  <p className="text-charcoal-700 mb-4">
                    Professional property management services to maximize your investment and minimize your stress.
                  </p>
                  <Link href="/services/property-management" className="text-copper-600 hover:text-copper-700 font-semibold">
                    Learn More →
                  </Link>
                </div>
              </div>
            </div>

            {/* Closing Message */}
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 mb-12">
              <p className="text-lg text-charcoal-700 text-center">
                Let us know if there is something specific you are looking for and we'll find what you need. Enjoy your visit and please contact us if there is anything we can do to make your next home buying or home selling experience the best it can be!
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 text-center" id="contact">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Get In Touch</h2>
              <p className="text-xl text-charcoal-700 mb-8">
                Ready to start your real estate journey? We're here to help.
              </p>

              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto text-left">
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-3">Office Location</h3>
                  <p className="text-charcoal-700">
                    123 Main Street, Suite 100<br />
                    Nashville, TN
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-3">Contact Info</h3>
                  <p className="text-charcoal-700">
                    Phone: <a href="tel:15551234567" className="text-copper-600 hover:text-copper-700">(555) 123-4567</a><br />
                    Email: <a href="mailto:info@hodgesfooshee.com" className="text-copper-600 hover:text-copper-700">info@hodgesfooshee.com</a>
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/search/properties"
                  className="inline-flex items-center gap-2 rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-sm hover:bg-copper-700 hover:text-white transition-all font-semibold"
                >
                  Start Your Property Search
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
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
