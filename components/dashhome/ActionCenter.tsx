"use client";

import { Card, CardHeader, CardBody } from "@/lib/ui/card";
import { leadsCluster, priorityMatrix, pricePositioning } from "@/lib/mock/dashHomeData";

// Hot Leads (score >= 75, recent activity)
function HotLeads() {
  const hot = leadsCluster
    .filter(l => l.score >= 75 && l.recent)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="text-base font-semibold">🔥 Hot Leads (5)</CardHeader>
      <CardBody>
        <div className="space-y-2">
          {hot.map(l => (
            <div key={l.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 transition cursor-pointer">
              <div>
                <div className="font-medium text-sm">Lead #{l.id}</div>
                <div className="text-xs text-zinc-500">Last contact: {l.daysSinceContact}d ago</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">{l.score} score</span>
                <span className="text-xs text-zinc-500">${(l.potential / 1000).toFixed(0)}K</span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Price Review Queue (listings with DOM > 21)
function PriceReviewQueue() {
  const needsReview = pricePositioning.your
    .filter(p => p.dom > 21)
    .sort((a, b) => b.dom - a.dom)
    .slice(0, 4);

  return (
    <Card>
      <CardHeader className="text-base font-semibold">💰 Price Review Queue ({needsReview.length})</CardHeader>
      <CardBody>
        <div className="space-y-2">
          {needsReview.map(p => (
            <div key={p.label} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 transition cursor-pointer">
              <div>
                <div className="font-medium text-sm">{p.label}</div>
                <div className="text-xs text-zinc-500">{p.sf.toLocaleString()} sqft • ${p.ppsf}/sqft</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-red-600 dark:text-red-400">{p.dom} DOM</div>
                <div className="text-xs text-zinc-500">Review pricing</div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Follow-Ups Due (high urgency + impact from priority matrix)
function FollowUpsDue() {
  const urgent = priorityMatrix
    .filter(t => t.urgency > 60 && t.impact > 50)
    .sort((a, b) => (b.urgency * b.impact) - (a.urgency * a.impact))
    .slice(0, 6);

  return (
    <Card>
      <CardHeader className="text-base font-semibold">⚡ Follow-Ups Due ({urgent.length})</CardHeader>
      <CardBody>
        <div className="space-y-2">
          {urgent.map(t => (
            <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 transition cursor-pointer">
              <div>
                <div className="font-medium text-sm">{t.label}</div>
                <div className="text-xs text-zinc-500">Impact: {t.impact.toFixed(0)} • Urgency: {t.urgency.toFixed(0)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {(t.urgency * t.impact / 100).toFixed(0)} priority
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default function ActionCenter() {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <HotLeads />
      <PriceReviewQueue />
      <FollowUpsDue />
    </div>
  );
}
