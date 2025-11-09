import { AnimatedDashboardRow } from "@/components/AnimatedDashboardRow";

export default function DemoMotionPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            🎬 Micro-Interactions Demo
          </h1>
          <p className="text-white/60">
            Watch how motion transforms a static dashboard into something alive
          </p>
        </div>

        {/* Animated Row */}
        <AnimatedDashboardRow />

        {/* Instructions */}
        <div className="glass p-8 mt-12">
          <h2 className="text-2xl font-semibold mb-4">What You're Seeing:</h2>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-3">
              <span className="text-hodges-orange">1.</span>
              <div>
                <strong>Card Entrance</strong> - Cards fade in, slide up, and scale from 95% → 100% with a bounce effect
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-hodges-green">2.</span>
              <div>
                <strong>Number Counter</strong> - Numbers count from 0 to their target value over 1.5 seconds
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-hodges-purple">3.</span>
              <div>
                <strong>Staggered Animation</strong> - Each card delays by 0.1s, creating a cascading effect
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-hodges-crimson">4.</span>
              <div>
                <strong>Hover Effect</strong> - Hover over any card to see:
                <ul className="ml-4 mt-2 space-y-1 text-sm text-white/60">
                  <li>• Card lifts 4px and grows 2%</li>
                  <li>• Icon rotates 360° and scales 110%</li>
                  <li>• Background glow appears</li>
                  <li>• Sparkle particles float up</li>
                </ul>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-400">5.</span>
              <div>
                <strong>Arrow Animation</strong> - Trend arrows bounce continuously (up = up, down = down)
              </div>
            </li>
          </ul>

          <div className="mt-8 p-4 bg-hodges-orange/10 border border-hodges-orange/30 rounded-xl">
            <h3 className="text-sm font-semibold text-hodges-orange mb-2">
              🔥 Pro Tip
            </h3>
            <p className="text-sm text-white/70">
              Refresh the page to see the entrance animations again. Try hovering over different cards to feel the interactivity.
            </p>
          </div>
        </div>

        {/* Code Example */}
        <div className="glass p-8">
          <h2 className="text-2xl font-semibold mb-4">The Code:</h2>
          <div className="bg-black/40 p-6 rounded-xl overflow-x-auto">
            <pre className="text-sm text-emerald-400">
              <code>{`<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  transition={{ duration: 0.5, delay: 0.1 }}
  whileHover={{ scale: 1.02, y: -4 }}
  className="glass p-6"
>
  <NumberCounter value={127} duration={1500} />
</motion.div>`}</code>
            </pre>
          </div>
          <p className="text-sm text-white/60 mt-4">
            This is all it takes to transform a boring static card into an engaging, animated component.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Feels Fast</h3>
            <p className="text-sm text-white/70">
              Animations mask loading times and make the dashboard feel snappier
            </p>
          </div>
          <div className="glass p-6">
            <div className="text-3xl mb-3">💎</div>
            <h3 className="text-lg font-semibold mb-2">Looks Premium</h3>
            <p className="text-sm text-white/70">
              Motion separates your dashboard from every boring competitor
            </p>
          </div>
          <div className="glass p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Directs Attention</h3>
            <p className="text-sm text-white/70">
              Animations guide users to important metrics and changes
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
