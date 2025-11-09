import { CleanAnimatedCard } from "@/components/CleanAnimatedCard";
import { CleanKPICard } from "@/components/CleanKPICard";

export default function DemoCleanPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <CleanAnimatedCard>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Clean Micro-Interactions
            </h1>
            <p className="text-white/60">
              Subtle, professional animations without going overboard
            </p>
          </div>
        </CleanAnimatedCard>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <CleanKPICard
            title="Total Agents"
            value={127}
            change={8.4}
            subtitle="vs last month"
            delay={0}
          />
          <CleanKPICard
            title="Active Listings"
            value={342}
            change={12.3}
            subtitle="vs last month"
            delay={0.05}
          />
          <CleanKPICard
            title="Pending Deals"
            value={89}
            change={-2.1}
            subtitle="vs last month"
            delay={0.1}
          />
          <CleanKPICard
            title="Monthly Revenue"
            value="$2.84M"
            change={15.7}
            subtitle="vs last month"
            delay={0.15}
          />
        </div>

        {/* Explanation */}
        <CleanAnimatedCard delay={0.2}>
          <div className="glass p-8">
            <h2 className="text-2xl font-semibold mb-4">What's Different?</h2>

            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="font-semibold text-white mb-2">✓ Subtle Entrance</h3>
                <p className="text-sm">
                  Cards fade in and slide up just <strong>8px</strong> (not 20px).
                  Duration is <strong>0.3s</strong> (not 0.5s). Quick and smooth.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">✓ Minimal Hover</h3>
                <p className="text-sm">
                  Hover over a card - it just gets slightly transparent (opacity: 90%).
                  No lift, no scale, no glow, no sparkles.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">✓ Clean Counter</h3>
                <p className="text-sm">
                  Numbers still count up (because it's cool), but at a steady pace.
                  No dramatic effects.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">✓ Stagger (Very Short)</h3>
                <p className="text-sm">
                  Cards appear with <strong>0.05s</strong> delay between each (not 0.1s).
                  Almost simultaneous, but not jarring.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <p className="text-sm text-emerald-400 font-semibold">
                🎯 Result: Professional, clean, not distracting
              </p>
            </div>
          </div>
        </CleanAnimatedCard>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CleanAnimatedCard delay={0.25}>
            <div className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">❌ What We Removed</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✗ Bounce effects (too playful)</li>
                <li>✗ Scale animations (too much movement)</li>
                <li>✗ Rotating icons (distracting)</li>
                <li>✗ Sparkle particles (over-the-top)</li>
                <li>✗ Background glows (too flashy)</li>
                <li>✗ Lift on hover (too dramatic)</li>
              </ul>
            </div>
          </CleanAnimatedCard>

          <CleanAnimatedCard delay={0.3}>
            <div className="glass p-6">
              <h3 className="text-lg font-semibold mb-4">✓ What We Kept</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>✓ Smooth fade in (professional)</li>
                <li>✓ Gentle slide up (guides eye)</li>
                <li>✓ Number counter (engaging)</li>
                <li>✓ Stagger effect (organized)</li>
                <li>✓ Subtle hover (interactive)</li>
                <li>✓ Fast timing (responsive)</li>
              </ul>
            </div>
          </CleanAnimatedCard>
        </div>

        {/* How to Use */}
        <CleanAnimatedCard delay={0.35}>
          <div className="glass p-8">
            <h2 className="text-2xl font-semibold mb-4">How to Use</h2>

            <div className="bg-black/40 p-6 rounded-xl overflow-x-auto mb-4">
              <pre className="text-sm text-emerald-400">
                <code>{`import { CleanAnimatedCard } from "@/components/CleanAnimatedCard";
import { CleanKPICard } from "@/components/CleanKPICard";

// Wrap any card
<CleanAnimatedCard delay={0.1}>
  <div className="glass p-5">
    Your content
  </div>
</CleanAnimatedCard>

// Or use the KPI card
<CleanKPICard
  title="Total Agents"
  value={127}
  change={8.4}
  subtitle="vs last month"
  delay={0.1}
/>`}</code>
              </pre>
            </div>

            <p className="text-sm text-white/70">
              That's it! No sparkles, no confetti, no over-the-top effects.
              Just clean, professional motion that adds polish without distraction.
            </p>
          </div>
        </CleanAnimatedCard>
      </div>
    </main>
  );
}
