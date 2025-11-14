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
            <p className="text-xl text-charcoal-700 text-center mb-8">
              Your trusted partners in Middle Tennessee real estate for over 25 years
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-charcoal-700 mb-4">
                  At Hodges & Fooshee Realty, we believe that buying or selling a home is more than just a transaction—it's a significant milestone in your life. With over 25 years of combined experience in the Nashville and Middle Tennessee real estate market, we've built our reputation on trust, expertise, and exceptional service.
                </p>
                <p className="text-charcoal-700 mb-4">
                  Our team is dedicated to providing personalized attention to each client, ensuring that your unique needs and goals are met every step of the way. Whether you're a first-time homebuyer, looking to upgrade, or ready to sell your property, we're here to guide you through the process with confidence and care.
                </p>
              </div>
            </div>

            {/* Mission & Values */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Our Mission</h3>
                <p className="text-charcoal-700">
                  To provide exceptional real estate services that exceed our clients' expectations, built on a foundation of integrity, local expertise, and unwavering commitment to your success.
                </p>
              </div>
              <div className="glass rounded-3xl p-8">
                <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Our Values</h3>
                <ul className="space-y-2 text-charcoal-700">
                  <li>✓ Integrity in every interaction</li>
                  <li>✓ Expert local market knowledge</li>
                  <li>✓ Personalized client service</li>
                  <li>✓ Transparent communication</li>
                </ul>
              </div>
            </div>

            {/* Services Overview */}
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">What We Do</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-copper-sweep rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">Sell Your Home</h3>
                  <p className="text-charcoal-700 mb-4">
                    Get top dollar for your property with our proven marketing strategies and expert negotiation skills.
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
                    Find your dream home with personalized search assistance and expert guidance throughout the buying process.
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

            {/* Contact Section */}
            <div className="glass rounded-3xl p-8 md:p-12 text-center" id="contact">
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
                  className="inline-flex items-center gap-2 rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-[0_10px_30px_rgba(242,87,45,0.45)] hover:shadow-[0_14px_40px_rgba(242,87,45,0.55)] transition font-semibold"
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
