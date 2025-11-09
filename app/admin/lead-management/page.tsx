"use client";

import { useState } from "react";
import PremiumCard from '@/components/ui/PremiumCard';
import { KpiTile } from '@/components/ui/KpiTile';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DistressedPropertyLead {
  id: string;
  ownerName: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  propertyType: 'Pre-Foreclosure' | 'Tax Lien' | 'Notice of Default';
  score: 'HIGH' | 'MEDIUM' | 'LOW';
  filedDate: Date;
  estimatedEquity: number;
  status: 'New' | 'Assigned' | 'Contacted';
  assignedTo?: string;
}

// Sample Nashville distressed property leads
const sampleLeads: DistressedPropertyLead[] = [
  {
    id: '1',
    ownerName: 'Robert Johnson',
    phone: '(615) 555-2847',
    email: 'r.johnson@email.com',
    address: { street: '1234 Maple Ave', city: 'Nashville', state: 'TN', zip: '37215' },
    propertyType: 'Pre-Foreclosure',
    score: 'HIGH',
    filedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    estimatedEquity: 275000,
    status: 'New',
  },
  {
    id: '2',
    ownerName: 'Sarah Mitchell',
    phone: '(615) 555-8291',
    email: 's.mitchell@email.com',
    address: { street: '567 Oak Drive', city: 'Franklin', state: 'TN', zip: '37064' },
    propertyType: 'Tax Lien',
    score: 'HIGH',
    filedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    estimatedEquity: 325000,
    status: 'Assigned',
    assignedTo: 'Agent Smith',
  },
  {
    id: '3',
    ownerName: 'Michael Chen',
    phone: '(629) 555-4102',
    email: 'm.chen@email.com',
    address: { street: '892 Elm Street', city: 'Brentwood', state: 'TN', zip: '37027' },
    propertyType: 'Notice of Default',
    score: 'MEDIUM',
    filedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    estimatedEquity: 185000,
    status: 'New',
  },
  {
    id: '4',
    ownerName: 'Jennifer Williams',
    phone: '(615) 555-7364',
    email: 'j.williams@email.com',
    address: { street: '2341 Pine Ridge Rd', city: 'Murfreesboro', state: 'TN', zip: '37129' },
    propertyType: 'Pre-Foreclosure',
    score: 'HIGH',
    filedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
    estimatedEquity: 295000,
    status: 'Contacted',
  },
  {
    id: '5',
    ownerName: 'David Thompson',
    phone: '(615) 555-9182',
    email: 'd.thompson@email.com',
    address: { street: '4567 Hickory Lane', city: 'Hendersonville', state: 'TN', zip: '37075' },
    propertyType: 'Tax Lien',
    score: 'MEDIUM',
    filedDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    estimatedEquity: 165000,
    status: 'Assigned',
    assignedTo: 'Agent Davis',
  },
  {
    id: '6',
    ownerName: 'Lisa Anderson',
    phone: '(629) 555-3047',
    email: 'l.anderson@email.com',
    address: { street: '789 Cedar Court', city: 'Mount Juliet', state: 'TN', zip: '37122' },
    propertyType: 'Pre-Foreclosure',
    score: 'LOW',
    filedDate: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000),
    estimatedEquity: 125000,
    status: 'New',
  },
  {
    id: '7',
    ownerName: 'James Martinez',
    phone: '(615) 555-6728',
    email: 'j.martinez@email.com',
    address: { street: '3210 Willow Way', city: 'Spring Hill', state: 'TN', zip: '37174' },
    propertyType: 'Notice of Default',
    score: 'MEDIUM',
    filedDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000),
    estimatedEquity: 210000,
    status: 'Contacted',
  },
  {
    id: '8',
    ownerName: 'Patricia Brown',
    phone: '(615) 555-1947',
    email: 'p.brown@email.com',
    address: { street: '1567 Birch Boulevard', city: 'Smyrna', state: 'TN', zip: '37167' },
    propertyType: 'Tax Lien',
    score: 'HIGH',
    filedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    estimatedEquity: 340000,
    status: 'New',
  },
  {
    id: '9',
    ownerName: 'Christopher Lee',
    phone: '(629) 555-5821',
    email: 'c.lee@email.com',
    address: { street: '4892 Magnolia Drive', city: 'Gallatin', state: 'TN', zip: '37066' },
    propertyType: 'Pre-Foreclosure',
    score: 'MEDIUM',
    filedDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
    estimatedEquity: 195000,
    status: 'Assigned',
    assignedTo: 'Agent Wilson',
  },
  {
    id: '10',
    ownerName: 'Amanda Garcia',
    phone: '(615) 555-4038',
    email: 'a.garcia@email.com',
    address: { street: '678 Sycamore Street', city: 'Lebanon', state: 'TN', zip: '37090' },
    propertyType: 'Tax Lien',
    score: 'LOW',
    filedDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
    estimatedEquity: 145000,
    status: 'Contacted',
  },
  {
    id: '11',
    ownerName: 'Daniel White',
    phone: '(615) 555-7294',
    email: 'd.white@email.com',
    address: { street: '2134 Ashwood Ave', city: 'Nashville', state: 'TN', zip: '37212' },
    propertyType: 'Notice of Default',
    score: 'MEDIUM',
    filedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
    estimatedEquity: 225000,
    status: 'New',
  },
  {
    id: '12',
    ownerName: 'Emily Rodriguez',
    phone: '(629) 555-8563',
    email: 'e.rodriguez@email.com',
    address: { street: '5678 Dogwood Trail', city: 'Franklin', state: 'TN', zip: '37067' },
    propertyType: 'Pre-Foreclosure',
    score: 'HIGH',
    filedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    estimatedEquity: 385000,
    status: 'Assigned',
    assignedTo: 'Agent Taylor',
  },
  {
    id: '13',
    ownerName: 'Kevin Harris',
    phone: '(615) 555-3692',
    email: 'k.harris@email.com',
    address: { street: '3456 Poplar Place', city: 'Brentwood', state: 'TN', zip: '37027' },
    propertyType: 'Tax Lien',
    score: 'LOW',
    filedDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
    estimatedEquity: 155000,
    status: 'New',
  },
  {
    id: '14',
    ownerName: 'Michelle Clark',
    phone: '(615) 555-9047',
    email: 'm.clark@email.com',
    address: { street: '987 Walnut Way', city: 'Nashville', state: 'TN', zip: '37214' },
    propertyType: 'Pre-Foreclosure',
    score: 'MEDIUM',
    filedDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000),
    estimatedEquity: 240000,
    status: 'Contacted',
  },
  {
    id: '15',
    ownerName: 'Ryan Turner',
    phone: '(629) 555-2184',
    email: 'r.turner@email.com',
    address: { street: '4321 Chestnut Circle', city: 'Murfreesboro', state: 'TN', zip: '37130' },
    propertyType: 'Notice of Default',
    score: 'LOW',
    filedDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
    estimatedEquity: 175000,
    status: 'Assigned',
    assignedTo: 'Agent Moore',
  },
];

export default function LeadManagementPage() {
  const [leads] = useState<DistressedPropertyLead[]>(sampleLeads);

  // Calculate stats
  const newLeads = leads.filter(l => l.status === 'New').length;
  const highPriority = leads.filter(l => l.score === 'HIGH').length;
  const assigned = leads.filter(l => l.status === 'Assigned').length;
  const closedThisWeek = 3; // Static for now

  const handleClaim = (leadId: string) => {
    alert(`Lead ${leadId} claimed successfully!`);
    // Future: API call to assign to current user
  };

  const handleAssign = (leadId: string) => {
    alert(`Assignment feature coming soon for lead ${leadId}`);
    // Future: Modal with agent selector
  };

  const handleMarkContacted = (leadId: string) => {
    alert(`Lead ${leadId} marked as contacted!`);
    // Future: API call to update status
  };

  const formatDaysAgo = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (24 * 60 * 60 * 1000));
    return `${days} days ago`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getScoreBadgeVariant = (score: string) => {
    if (score === 'HIGH') return 'destructive';
    if (score === 'MEDIUM') return 'default';
    return 'secondary';
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'New') return 'default';
    if (status === 'Assigned') return 'outline';
    return 'secondary';
  };

  const getTypeBadgeVariant = (type: string) => {
    if (type === 'Pre-Foreclosure') return 'destructive';
    if (type === 'Tax Lien') return 'default';
    return 'outline';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-[34px] font-extrabold tracking-tight text-[var(--text-strong)]">
          Lead Management
        </h1>
        <p className="mt-1 text-[15px] text-[var(--text-muted)]">
          Distressed properties found automatically with owner contact details
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiTile
          label="New Leads"
          value={newLeads.toString()}
          hint="Today"
          strong
        />
        <KpiTile
          label="High Priority"
          value={highPriority.toString()}
          badge="Urgent"
          hint="Requires attention"
          strong
        />
        <KpiTile
          label="Assigned"
          value={assigned.toString()}
          hint="Active"
          strong
        />
        <KpiTile
          label="Closed This Week"
          value={closedThisWeek.toString()}
          hint="Conversions"
          strong
        />
      </div>

      {/* Leads Table */}
      <PremiumCard
        title="Active Distressed Property Leads"
        subtitle="Owner contact information included for direct outreach"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--ring)]">
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Owner Name</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Phone</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Email</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Address</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Type</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Score</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Days Filed</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Equity</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Status</th>
                <th className="text-left py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={`border-b border-[var(--ring)] hover:bg-[color-mix(in_oklab,var(--panel)_30%,transparent)] transition-colors ${
                    index % 2 === 0 ? 'bg-[color-mix(in_oklab,var(--panel)_10%,transparent)]' : ''
                  }`}
                >
                  <td className="py-3 px-2 text-sm font-medium text-[var(--text-strong)]">
                    {lead.ownerName}
                  </td>
                  <td className="py-3 px-2 text-sm">
                    <a
                      href={`tel:${lead.phone.replace(/\D/g, '')}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td className="py-3 px-2 text-sm">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </td>
                  <td className="py-3 px-2 text-sm text-[var(--text-muted)]">
                    <div className="font-medium text-[var(--text-strong)]">{lead.address.street}</div>
                    <div className="text-xs">{lead.address.city}, {lead.address.state} {lead.address.zip}</div>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={getTypeBadgeVariant(lead.propertyType)}>
                      {lead.propertyType}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={getScoreBadgeVariant(lead.score)}>
                      {lead.score}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-sm text-[var(--text-muted)]">
                    {formatDaysAgo(lead.filedDate)}
                  </td>
                  <td className="py-3 px-2 text-sm font-semibold text-[var(--text-strong)]">
                    {formatCurrency(lead.estimatedEquity)}
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={getStatusBadgeVariant(lead.status)}>
                      {lead.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-col gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleClaim(lead.id)}
                        className="whitespace-nowrap text-xs"
                      >
                        Claim
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleAssign(lead.id)}
                        className="whitespace-nowrap text-xs"
                      >
                        Assign
                      </Button>
                      {lead.status === 'New' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkContacted(lead.id)}
                          className="whitespace-nowrap text-xs"
                        >
                          Contacted
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </div>
  );
}
