import { Nav } from "@/components/Nav";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PropertyManagementPage() {
  return (
    <div className="bg-porcelain min-h-screen">
      <Nav />

      <main className="bg-transparent">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-charcoal-900 mb-6">
              Property Management
            </h1>
            <p className="text-xl text-charcoal-700 mb-8">
              Hodges and Fooshee Realty offers first class property management.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-6">
                What Do Most Successful Landlords Have In Common?
              </h2>
              <p className="text-xl text-charcoal-700 mb-8">
                They always hire a professional property manager.
              </p>

              <h3 className="text-2xl font-bold text-charcoal-900 mb-6">What Are The Benefits?</h3>
              <ul className="space-y-3 text-lg text-charcoal-700 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Getting Top Market Rent
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Avoiding Bad Tenants
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Property Preservation and maintenance on a regimented basis
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Accurate Financial Reporting
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  And the list goes on.
                </li>
              </ul>

              <p className="text-lg text-charcoal-700 mb-6">
                We have all heard the horror stories from the do it yourself landlord. It only takes one mistake to lose months of rent or worse.
              </p>

              <p className="text-lg text-charcoal-700 mb-6">
                Hodges and Fooshee Realty offers professional management at competitive prices. We have all the tools needed to check potential tenants out and make sure that your investment is in good hands.
              </p>
            </div>

            {/* About Jody Hodges */}
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-6">Professional Property Management</h2>
              <p className="text-lg text-charcoal-700 mb-6">
                <strong>Jody Hodges, P.I.</strong> has been managing properties for over 20 years. Jody Hodges is a Managing Broker licensed by the state of Tennessee, insured with both commercial and residential properties. Jody has been licensed as a private investigator since 1999 and strives to help his owners avoid trouble.
              </p>
              <p className="text-lg text-charcoal-700 mb-8">
                Jody manages properties that are within 20 miles of 37212.
              </p>

              <div className="bg-white/50 rounded-xl p-6 border-l-4 border-copper-600">
                <h3 className="text-xl font-bold text-charcoal-900 mb-4">Contact Information</h3>
                <div className="space-y-2 text-lg">
                  <p className="text-charcoal-700">
                    <strong>Phone:</strong> <a href="tel:6155221724" className="text-copper-600 hover:text-copper-700">615-522-1724</a>
                  </p>
                  <p className="text-charcoal-700">
                    <strong>Email:</strong> <a href="mailto:jody@jodyhodges.com" className="text-copper-600 hover:text-copper-700">jody@jodyhodges.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#FBF3E7] border border-black/5 shadow-md rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-4">
                Ready to Protect Your Investment?
              </h2>
              <p className="text-xl text-charcoal-700 mb-8">
                Contact Jody Hodges today to discuss your property management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:6155221724"
                  className="rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-sm hover:bg-copper-700 hover:text-white transition-all font-semibold"
                >
                  Call 615-522-1724
                </a>
                <a
                  href="mailto:jody@jodyhodges.com"
                  className="rounded-full border-2 border-copper-600 text-copper-600 bg-white px-8 py-3 text-lg hover:bg-[#FBF3E7] transition-all font-semibold"
                >
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
