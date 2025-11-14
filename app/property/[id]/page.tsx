"use client";

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bed, Bath, Square, MapPin, Calendar, Heart, Share2, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import PropertyDescription from '@/components/PropertyDescription';
import { Nav } from '@/components/Nav';
import { PropertyInquiryForm } from '@/components/PropertyInquiryForm';
import { MLSComplianceFooter } from '@/components/MLSComplianceFooter';

interface PropertyDetails {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  propertyType: string;
  status: string;
  listingDate: string;
  description: string;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    email: string;
    image: string;
    license?: string;
    designation?: string;
    office?: string;
    officePhone?: string;
  };
  // MLS Listing Agent (original - for compliance footer)
  mlsListingAgent?: {
    name: string;
    officeName: string;
    mlsSource?: string;
    lastUpdated?: string;
  };
  postalCode?: string;
}

function PropertyDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  const { data: property, isLoading, error } = useQuery({
    queryKey: ['property', id],
    queryFn: async (): Promise<PropertyDetails> => {
      // Fetch property detail
      const detailResponse = await fetch(
        `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-detail?listingKey=${id}`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
          }
        }
      );
      if (!detailResponse.ok) throw new Error('Failed to fetch property');
      const detailData = await detailResponse.json();
      const prop = detailData.property;

      // FIXED: Images are already in the detail response under Media array
      const media = prop.Media || [];
      console.log('🖼️ Property images:', media.map((m: any) => m.MediaURL));

      // Store MLS listing agent for compliance footer
      let mlsListingAgentInfo = {
        name: prop.ListAgentFullName || 'Unknown Agent',
        officeName: prop.ListOfficeName || 'Unknown Brokerage',
        mlsSource: prop.OriginatingSystemName || 'MLS',
        lastUpdated: prop.ModificationTimestamp || prop.ListingContractDate,
      };

      // Fetch MLS agent details if available (for compliance)
      if (prop.ListAgentKey || prop.ListAgentMlsId) {
        try {
          const memberKey = prop.ListAgentKey || prop.ListAgentMlsId;
          const memberResponse = await fetch(
            `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-members?memberKey=${memberKey}`,
            {
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
              }
            }
          );
          if (memberResponse.ok) {
            const memberData = await memberResponse.json();
            const member = memberData.members?.[0];
            if (member) {
              mlsListingAgentInfo.name = member.MemberFullName || mlsListingAgentInfo.name;
              mlsListingAgentInfo.officeName = member.OfficeName || mlsListingAgentInfo.officeName;
            }
          }
        } catch (err) {
          console.warn('Could not fetch MLS agent details:', err);
        }
      }

      // FEATURED AGENT: Leslie Alison from Hodges & Fooshee Realty
      // This is who will be displayed prominently and receive leads
      const featuredAgent = {
        name: 'Leslie Alison',
        phone: '615-601-0862', // Mobile
        email: 'leslie@hodgesfooshee.com', // TODO: Get actual email
        image: '/placeholder.svg', // TODO: Add actual photo to /public/agents/leslie-alison.jpg
        license: undefined as string | undefined, // TODO: Get license number
        designation: undefined as string | undefined,
        office: 'Hodges & Fooshee Realty',
        officePhone: '615-538-1100',
      };

      // Transform to PropertyDetails format
      return {
        id: prop.ListingKey,
        title: `${prop.BedroomsTotal || 0}BR/${prop.BathroomsTotalInteger || 0}BA in ${prop.City}`,
        address: `${prop.UnparsedAddress || prop.City}, ${prop.StateOrProvince || 'TN'} ${prop.PostalCode || ''}`,
        price: prop.ListPrice || 0,
        beds: prop.BedroomsTotal || 0,
        baths: prop.BathroomsTotalInteger || 0,
        sqft: prop.LivingArea || 0,
        lotSize: prop.LotSizeArea ? `${prop.LotSizeArea} sq ft` : 'N/A',
        yearBuilt: prop.YearBuilt || 0,
        propertyType: prop.PropertyType || 'Residential',
        status: prop.StandardStatus || 'Active',
        listingDate: prop.ListingContractDate || new Date().toISOString(),
        description: prop.PublicRemarks || 'No description available',
        features: [],
        images: media.map((m: any) => m.MediaURL).filter(Boolean),
        postalCode: prop.PostalCode,
        agent: featuredAgent, // Show Leslie Alison prominently
        mlsListingAgent: mlsListingAgentInfo // Original agent for compliance footer
      };
    },
  });

  if (isLoading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-[#FAF5EC] pt-24 pb-16">
          <div className="container mx-auto px-4 py-8">
            {/* Skeleton Header */}
            <div className="mb-8">
              <div className="h-10 w-40 bg-neutral-200 rounded-lg animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image Skeleton */}
                <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.08)] border border-black/5 overflow-hidden">
                  <div className="w-full h-96 bg-neutral-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-24 h-20 bg-neutral-200 rounded-lg animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Details Skeleton */}
                <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.08)] border border-black/5">
                  <CardHeader className="space-y-4">
                    <div className="h-12 w-48 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-8 w-64 bg-neutral-200 rounded animate-pulse"></div>
                    <div className="h-6 w-80 bg-neutral-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="p-4 bg-neutral-50 rounded-xl border border-black/5">
                          <div className="h-6 w-6 mx-auto mb-2 bg-neutral-200 rounded animate-pulse"></div>
                          <div className="h-8 w-12 mx-auto mb-2 bg-neutral-200 rounded animate-pulse"></div>
                          <div className="h-4 w-16 mx-auto bg-neutral-200 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                    {/* Description Skeleton */}
                    <div className="space-y-3">
                      <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-neutral-200 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-neutral-200 rounded animate-pulse"></div>
                      <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1 space-y-6">
                {/* Agent Card Skeleton */}
                <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.08)] border border-black/5">
                  <CardHeader>
                    <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-neutral-200 animate-pulse mr-3"></div>
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse"></div>
                        <div className="h-4 w-24 bg-neutral-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-10 w-full bg-neutral-200 rounded animate-pulse"></div>
                      <div className="h-10 w-full bg-neutral-200 rounded animate-pulse"></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Property Info Skeleton */}
                <Card className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(20,20,20,0.05)] border border-black/5">
                  <CardHeader>
                    <div className="h-6 w-32 bg-neutral-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-neutral-100">
                        <div className="h-5 w-24 bg-neutral-200 rounded animate-pulse"></div>
                        <div className="h-5 w-32 bg-neutral-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-[#FAF5EC] pt-24 flex items-center justify-center px-4">
        <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.12)] border border-black/5 max-w-md p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Property</h2>
          <p className="text-[#374151] mb-4">{(error as Error)?.message || 'Property not found'}</p>
          <Link href="/search/properties">
            <Button className="w-full bg-gradient-to-r from-[#E4552E] to-[#F39C57] text-white font-semibold px-6 py-3 rounded-xl shadow-[0_8px_28px_rgba(228,85,46,0.35)] hover:shadow-[0_12px_36px_rgba(228,85,46,0.4)] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#FAF5EC] pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/search/properties">
            <Button variant="ghost" className="mb-4 text-neutral-700 hover:text-neutral-900 hover:bg-white/60 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.08)] border border-black/5 overflow-hidden">
              <div className="relative">
                <img
                  src={property.images[selectedImageIndex] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-96 object-cover transition-transform duration-300 hover:scale-[1.015]"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-emerald-500 text-white font-bold text-xs uppercase tracking-wide px-3 py-1.5 rounded-full shadow-lg">
                    {property.status}
                  </Badge>
                  <Badge className="bg-white/90 backdrop-blur text-[#374151] font-semibold text-xs px-3 py-1.5 rounded-full shadow-lg">
                    {property.propertyType}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" className="bg-white/90 backdrop-blur hover:bg-white text-[#374151] shadow-lg">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-white/90 backdrop-blur hover:bg-white text-[#374151] shadow-lg">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Previous/Next Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur transition-all shadow-lg"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur transition-all shadow-lg"
                    >
                      <ArrowLeft className="w-6 h-6 rotate-180" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {property.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    {selectedImageIndex + 1} / {property.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Carousel */}
              {property.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-300 scrollbar-track-transparent">
                    {property.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Property ${idx + 1}`}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`flex-shrink-0 w-24 h-20 object-cover rounded-lg cursor-pointer transition-all ${
                          selectedImageIndex === idx
                            ? 'ring-4 ring-[#E4552E] opacity-100 scale-105'
                            : 'opacity-60 hover:opacity-100 hover:scale-105'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Property Details */}
            <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.08)] border border-black/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  {/* Price - bold, high contrast */}
                  <CardTitle className="text-4xl font-extrabold text-[#111827] tracking-tight" style={{letterSpacing: '-0.01em'}}>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                    }).format(property.price)}
                    {property.propertyType.toLowerCase().includes('lease') && (
                      <span className="text-xl text-neutral-600 font-normal ml-1">/month</span>
                    )}
                  </CardTitle>
                </div>

                {/* Title - strong hierarchy */}
                <h1 className="text-2xl font-bold text-[#374151] mt-2">{property.title}</h1>

                {/* Address - meta text with icon */}
                <div className="flex items-center text-[#6B7280] mt-2">
                  <MapPin className="w-4 h-4 mr-1.5" />
                  {property.address}
                </div>

                {/* Copper accent line */}
                <div className="mt-4 h-0.5 w-24 bg-gradient-to-r from-[#E4552E] to-[#F39C57] rounded-full"></div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-neutral-50 rounded-xl border border-black/5">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-[#E4552E]" />
                    <div className="text-2xl font-bold text-[#111827]">{property.beds}</div>
                    <div className="text-sm text-[#6B7280] font-medium">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-xl border border-black/5">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-[#E4552E]" />
                    <div className="text-2xl font-bold text-[#111827]">{property.baths}</div>
                    <div className="text-sm text-[#6B7280] font-medium">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-xl border border-black/5">
                    <Square className="w-6 h-6 mx-auto mb-2 text-[#E4552E]" />
                    <div className="text-2xl font-bold text-[#111827]">{property.sqft.toLocaleString()}</div>
                    <div className="text-sm text-[#6B7280] font-medium">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-xl border border-black/5">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-[#E4552E]" />
                    <div className="text-2xl font-bold text-[#111827]">{property.yearBuilt}</div>
                    <div className="text-sm text-[#6B7280] font-medium">Year Built</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-[#111827] mb-4">Description</h3>
                  <PropertyDescription description={property.description} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Our Team Card */}
            <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.08)] border border-black/5">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#111827]">Contact Our Team</CardTitle>
                <p className="text-sm text-[#6B7280] mt-1">
                  Get expert guidance from Hodges & Fooshee Realty
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Featured Agent - Leslie Alison */}
                <div className="flex items-start gap-3 pb-4 border-b border-neutral-100">
                  {/* Agent initials if no image */}
                  {property.agent.image === '/placeholder.svg' ? (
                    <div className="w-16 h-16 flex-shrink-0 rounded-full bg-gradient-to-br from-[#E4552E] to-[#F39C57] flex items-center justify-center text-white font-bold shadow-lg">
                      {property.agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  ) : (
                    <img
                      src={property.agent.image}
                      alt={property.agent.name}
                      className="w-16 h-16 flex-shrink-0 rounded-full object-cover shadow-lg ring-2 ring-white"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#111827]">{property.agent.name}</div>
                    <div className="text-sm text-[#6B7280]">Real Estate Agent</div>
                    {property.agent.office && (
                      <div className="text-xs text-[#6B7280] mt-1">{property.agent.office}</div>
                    )}
                  </div>
                </div>

                {/* Property Inquiry Form */}
                <PropertyInquiryForm
                  propertyId={property.id}
                  propertyAddress={property.address}
                  agentPhone={property.agent.phone}
                  agentEmail={property.agent.email}
                />
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(20,20,20,0.05)] border border-black/5">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-[#111827]">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-3 border-b border-neutral-100">
                  <span className="text-[#6B7280] font-medium">Property Type</span>
                  <span className="text-[#111827] font-semibold">{property.propertyType}</span>
                </div>
                {property.postalCode && (
                  <div className="flex justify-between py-3 border-b border-neutral-100">
                    <span className="text-[#6B7280] font-medium">ZIP Code</span>
                    <Link
                      href={`/search/properties?postalCode=${property.postalCode}`}
                      className="text-[#E4552E] font-semibold hover:underline transition-colors"
                    >
                      {property.postalCode}
                    </Link>
                  </div>
                )}
                <div className="flex justify-between py-3 border-b border-neutral-100">
                  <span className="text-[#6B7280] font-medium">Lot Size</span>
                  <span className="text-[#111827] font-semibold">{property.lotSize}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-neutral-100">
                  <span className="text-[#6B7280] font-medium">Listed</span>
                  <span className="text-[#111827] font-semibold">{new Date(property.listingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-[#6B7280] font-medium">MLS ID</span>
                  <span className="text-[#111827] font-semibold">#{property.id}</span>
                </div>

                {/* MLS Compliance Footer */}
                {property.mlsListingAgent && (
                  <MLSComplianceFooter
                    listingAgent={property.mlsListingAgent.name}
                    listingOfficeName={property.mlsListingAgent.officeName}
                    mlsSource={property.mlsListingAgent.mlsSource}
                    mlsId={property.id}
                    lastUpdated={property.mlsListingAgent.lastUpdated}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function PropertyDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF5EC] pt-24 flex items-center justify-center">
        <div className="text-[#374151] text-xl font-medium">Loading...</div>
      </div>
    }>
      <PropertyDetailContent />
    </Suspense>
  );
}
