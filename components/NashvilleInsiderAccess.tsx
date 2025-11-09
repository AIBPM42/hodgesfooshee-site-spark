'use client';

import { InsiderGrid } from "@/components/InsiderGrid";
import { CountyCard } from "@/components/CountyCard";
import { Suspense, useState } from "react";
import InsiderSignupModal from "@/components/InsiderSignupModal";

const NashvilleInsiderAccess = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
            Nashville Insider Access
          </h2>
          <p className="text-zinc-600 text-lg max-w-3xl mx-auto leading-relaxed">
            Exclusive opportunities before they hit the market. Get first access to off-market properties and investment opportunities.
          </p>
        </div>

        {/* Exclusive Properties - Dynamic from Manus API */}
        <Suspense
          fallback={
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-black/5 shadow-md min-h-[180px] animate-pulse"
                />
              ))}
            </div>
          }
        >
          <div className="mb-12">
            <InsiderGrid />
          </div>
        </Suspense>

        {/* CTA Section */}
        <div className="text-center rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-10 transition-all duration-300 hover:shadow-elev-2 mb-16">
          <h3 className="text-xl font-semibold tracking-tight text-neutral-900 mb-3">
            Join Our Insider Network
          </h3>
          <p className="text-neutral-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get exclusive access to Nashville's hidden gems before they hit the public market. Gain the competitive edge you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="rounded-xl px-7 py-3 text-white font-medium bg-brand-500 hover:bg-brand-600 shadow-md transition-colors"
            >
              Get Instant Access
            </button>
            <a
              href="mailto:contact@hodgesfoosheeteam.com?subject=Schedule Consultation"
              className="rounded-xl px-7 py-3 font-medium bg-white border border-black/10 text-neutral-900 hover:bg-slate-50 shadow-sm transition-colors text-center"
            >
              Schedule Consultation
            </a>
          </div>
        </div>

        {/* Market Intelligence Section */}
        <div>
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
              Middle Tennessee Market Intelligence
            </h2>
            <p className="text-zinc-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Real-time insights across the region from Nashville's most trusted experts
            </p>
          </div>

          {/* County Cards */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-7">
            <CountyCard
              name="Davidson County"
              status="HOT"
              growth="+4.2%"
              medianPrice="$425,000"
              dom="18 days"
              trend="📈 +8.1%"
              href="/counties/davidson-county"
            />

            <CountyCard
              name="Williamson County"
              status="RISING"
              growth="+3.8%"
              medianPrice="$650,000"
              dom="22 days"
              trend="📈 +6.3%"
              href="/counties/williamson-county"
            />

            <CountyCard
              name="Rutherford County"
              status="STABLE"
              growth="+5.1%"
              medianPrice="$385,000"
              dom="25 days"
              trend="📈 +7.2%"
              href="/counties/rutherford-county"
            />
          </div>
        </div>
      </div>

      {/* Insider Signup Modal */}
      {showModal && (
        <InsiderSignupModal
          openByDefault={true}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default NashvilleInsiderAccess;
