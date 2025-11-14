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
              Professional property management services to maximize your investment and minimize your stress
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-[0_10px_30px_rgba(242,87,45,0.45)] hover:shadow-[0_14px_40px_rgba(242,87,45,0.55)] transition font-semibold"
            >
              Get a Free Management Quote
            </Link>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-12 px-4">
          <div className="mx-auto max-w-4xl">
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                Comprehensive Property Management Services
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Tenant Screening</h3>
                    <p className="text-charcoal-700">
                      Thorough background checks, credit reports, and rental history verification to find quality tenants.
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
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Rent Collection</h3>
                    <p className="text-charcoal-700">
                      Efficient online rent collection and consistent enforcement of payment policies.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Maintenance & Repairs</h3>
                    <p className="text-charcoal-700">
                      24/7 maintenance coordination with vetted contractors to keep your property in top condition.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Legal Compliance</h3>
                    <p className="text-charcoal-700">
                      Stay compliant with all local, state, and federal regulations including fair housing laws.
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
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Marketing & Leasing</h3>
                    <p className="text-charcoal-700">
                      Professional marketing, showings, and lease negotiations to minimize vacancy periods.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-copper-sweep rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Financial Reporting</h3>
                    <p className="text-charcoal-700">
                      Detailed monthly statements and year-end tax reporting for simplified accounting.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                Why Choose Our Property Management?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-1">Maximize Your ROI</h3>
                    <p className="text-charcoal-700">
                      Our expert pricing strategies and tenant retention programs help you achieve the best return on your investment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-1">Save Time & Reduce Stress</h3>
                    <p className="text-charcoal-700">
                      We handle all the day-to-day responsibilities so you can enjoy passive income without the hassle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-1">Protect Your Investment</h3>
                    <p className="text-charcoal-700">
                      Regular property inspections, proactive maintenance, and quality tenants help preserve your property value.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-copper-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-1">Local Expertise</h3>
                    <p className="text-charcoal-700">
                      With over 25 years in the Nashville market, we understand local trends and regulations inside and out.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process */}
            <div className="glass rounded-3xl p-8 md:p-12 mb-12">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-8 text-center">
                How It Works
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Property Evaluation</h3>
                    <p className="text-charcoal-700">
                      We assess your property and provide a customized management plan with rental rate analysis.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Marketing & Tenant Placement</h3>
                    <p className="text-charcoal-700">
                      Professional marketing, showings, screening, and lease execution to find quality tenants quickly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Ongoing Management</h3>
                    <p className="text-charcoal-700">
                      Rent collection, maintenance coordination, inspections, and tenant communication handled for you.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-copper-sweep text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">Regular Reporting</h3>
                    <p className="text-charcoal-700">
                      Receive monthly financial statements and annual tax documents to track your investment performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="glass rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-charcoal-900 mb-4">
                Ready to Simplify Your Rental Property Management?
              </h2>
              <p className="text-xl text-charcoal-700 mb-8">
                Let us handle the details while you enjoy the returns. Contact us for a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/#contact"
                  className="rounded-full bg-copper-sweep text-white px-8 py-3 text-lg shadow-[0_10px_30px_rgba(242,87,45,0.45)] hover:shadow-[0_14px_40px_rgba(242,87,45,0.55)] transition font-semibold"
                >
                  Get Started Today
                </Link>
                <Link
                  href="/about-us"
                  className="rounded-full border-2 border-copper-600 text-copper-600 px-8 py-3 text-lg hover:bg-copper-50 transition font-semibold"
                >
                  Learn More About Us
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
