"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bed, Bath, Square, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  status: string;
  listingType: string;
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: propertiesData, isLoading, error } = useQuery({
    queryKey: ['properties', searchParams.toString()],
    queryFn: async () => {
      const response = await fetch(`https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/mls-search?${searchParams}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Realtyna API Error:', errorData);
        throw new Error(errorData.error || `API Error: ${response.status}`);
      }

      const data = await response.json();

      // Transform Realtyna RESO data to Property format
      const properties = data.properties?.map((p: any) => ({
        id: p.ListingKey || p.ListingId,
        title: `${p.BedroomsTotal || 0}BR/${p.BathroomsTotalInteger || 0}BA ${p.City || 'Property'}`,
        address: `${p.UnparsedAddress || p.City || ''}, ${p.StateOrProvince || 'TN'}`,
        price: p.ListPrice || 0,
        beds: p.BedroomsTotal || 0,
        baths: p.BathroomsTotalInteger || 0,
        sqft: p.LivingArea || 0,
        image: p.Media?.[0]?.MediaURL || '/placeholder.svg',
        status: p.StandardStatus || 'Active',
        listingType: 'For Sale'
      })) || [];

      return { properties, total: data.total || 0 };
    },
    retry: 1
  });

  const properties = propertiesData?.properties || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="glass mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass-card animate-pulse">
                <div className="h-48 bg-gray-700 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero pt-24 flex items-center justify-center">
        <Card className="glass-card max-w-md p-8">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Search Error</h2>
          <p className="text-white/80 mb-4">{(error as Error).message}</p>
          <Link href="/">
            <Button className="btn w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="glass mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Property Search Results
          </h1>
          <p className="text-white/80">
            Found {propertiesData?.total || 0} properties matching your search
          </p>
        </div>

        {properties.length === 0 ? (
          <Card className="glass-card p-12 text-center">
            <h3 className="text-2xl font-semibold text-white mb-4">No properties found</h3>
            <p className="text-white/60 mb-6">Try adjusting your search criteria</p>
            <Link href="/">
              <Button className="btn">New Search</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Link key={property.id} href={`/property/${property.id}`}>
                <Card className="glass-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-48">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-hf-orange text-white">
                      {property.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-hf-orange mb-2">
                      {formatPrice(property.price)}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-white/60 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.address}
                    </div>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        {property.beds} beds
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        {property.baths} baths
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        {property.sqft.toLocaleString()} sqft
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertySearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-hero pt-24 flex items-center justify-center"><div className="text-white text-xl">Loading search results...</div></div>}>
      <SearchResults />
    </Suspense>
  );
}
