"use client";

import React, { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bed, Bath, Square, MapPin, Calendar, Heart, Share2, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

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
  };
}

function PropertyDetailContent() {
  const params = useParams();
  const id = params.id as string;

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

      // Fetch media separately - THIS IS THE KEY FIX FOR YOUR IMAGE ISSUE
      const mediaResponse = await fetch(
        `https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-media?listingKey=${id}`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
          }
        }
      );
      const mediaData = await mediaResponse.json();
      const media = mediaData.media || [];

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
        agent: {
          name: prop.ListAgentFullName || 'Agent',
          phone: prop.ListAgentDirectPhone || '',
          email: prop.ListAgentEmail || '',
          image: '/placeholder.svg'
        }
      };
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24 flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-white">Loading property details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24 flex items-center justify-center">
        <Card className="glass-card max-w-md p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Property</h2>
          <p className="text-white/80 mb-4">{(error as Error)?.message || 'Property not found'}</p>
          <Link href="/search/properties">
            <Button className="btn w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/search/properties">
            <Button variant="ghost" className="glass mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="glass-card mb-6">
              <div className="relative">
                <img
                  src={property.images[0] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-hf-orange">{property.status}</Badge>
                  <Badge variant="outline" className="bg-white/10 backdrop-blur">{property.propertyType}</Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="outline" className="glass-light">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="glass-light">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              {/* Additional Images */}
              {property.images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-2">
                  {property.images.slice(1, 5).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Property ${idx + 2}`}
                      className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75"
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Property Details */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-display text-gradient">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                    }).format(property.price)}
                  </CardTitle>
                </div>
                <h1 className="text-2xl font-display font-semibold text-white">{property.title}</h1>
                <div className="flex items-center text-white/70">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.address}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold text-white">{property.beds}</div>
                    <div className="text-sm text-white/60">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold text-white">{property.baths}</div>
                    <div className="text-sm text-white/60">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold text-white">{property.sqft.toLocaleString()}</div>
                    <div className="text-sm text-white/60">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold text-white">{property.yearBuilt}</div>
                    <div className="text-sm text-white/60">Year Built</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-display font-semibold mb-3 text-white">Description</h3>
                  <p className="text-white/70 leading-relaxed">{property.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="font-display text-white">Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="font-semibold text-white">{property.agent.name}</div>
                    <div className="text-sm text-white/60">Real Estate Agent</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {property.agent.phone && (
                    <Button variant="outline" className="w-full btn-glass" asChild>
                      <a href={`tel:${property.agent.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        {property.agent.phone}
                      </a>
                    </Button>
                  )}
                  {property.agent.email && (
                    <Button variant="outline" className="w-full btn-glass" asChild>
                      <a href={`mailto:${property.agent.email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Email
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Info */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display text-white">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-white">
                  <span className="text-white/60">Property Type</span>
                  <span>{property.propertyType}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-white/60">Lot Size</span>
                  <span>{property.lotSize}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-white/60">Listed</span>
                  <span>{new Date(property.listingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span className="text-white/60">MLS ID</span>
                  <span>#{property.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-hero pt-24 flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>}>
      <PropertyDetailContent />
    </Suspense>
  );
}
