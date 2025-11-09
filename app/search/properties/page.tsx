"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { ListingCard } from '@/components/ListingCard';

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
        title: `${p.BedroomsTotal || 0}BR/${p.BathroomsTotalInteger || 0}BA ${p.PropertyType || 'Home'} in ${p.City || 'Nashville'}`,
        address: `${p.UnparsedAddress || p.City || ''}, ${p.StateOrProvince || 'TN'} ${p.PostalCode || ''}`,
        price: p.ListPrice || 0,
        beds: p.BedroomsTotal || 0,
        baths: p.BathroomsTotalInteger || 0,
        sqft: p.LivingArea || 0,
        image: p.Media?.[0]?.MediaURL || '/placeholder.svg',
        status: p.StandardStatus || 'Active',
        listingType: p.PropertyType || 'For Sale'
      })) || [];

      console.log('📊 Transformed properties:', properties.length, properties[0]);
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
      <>
        <Nav />
        <div className="min-h-screen bg-[#FAF5EC] pt-24">
          <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4 text-neutral-700 hover:text-neutral-900 hover:bg-white/60">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white rounded-2xl shadow-[0_12px_32px_rgba(20,20,20,0.08)] border border-black/5 animate-pulse overflow-hidden">
                <div className="h-48 bg-neutral-200"></div>
                <CardContent className="p-5">
                  <div className="h-6 bg-neutral-200 rounded w-2/3 mb-3"></div>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  }

  if (error) {
    console.error('🚨 Search page error:', error);
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-[#FAF5EC] pt-24 flex items-center justify-center px-4">
        <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.12)] border border-black/5 max-w-md p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Search Error</h2>
          <p className="text-neutral-700 mb-4">{(error as Error).message}</p>
          <p className="text-neutral-500 text-sm mb-6">
            Search parameters: {searchParams.toString()}
          </p>
          <Link href="/">
            <Button className="w-full px-6 py-3 bg-gradient-to-r from-[#E4552E] to-[#F39C57] text-white font-semibold rounded-xl shadow-[0_8px_28px_rgba(228,85,46,0.35)] hover:shadow-[0_12px_36px_rgba(228,85,46,0.4)] hover:-translate-y-0.5 transition-all">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[#FAF5EC] pt-24 pb-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header with improved hierarchy */}
        <div className="mb-10">
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-neutral-700 hover:text-neutral-900 hover:bg-white/60 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>

          {/* Title with strong contrast */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#111827] mb-3 tracking-tight" style={{letterSpacing: '-0.01em'}}>
            Property Search Results
          </h1>

          {/* Count with meta styling */}
          <p className="text-sm text-[#6B7280]">
            Found {propertiesData?.total || 0} properties matching your search
          </p>
        </div>

        {properties.length === 0 ? (
          <Card className="bg-white rounded-2xl shadow-[0_12px_36px_rgba(20,20,20,0.08)] border border-black/5 p-12 text-center">
            <h3 className="text-2xl font-bold text-[#111827] mb-4">No properties found</h3>
            <p className="text-[#6B7280] mb-6">Try adjusting your search criteria</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-[#E4552E] to-[#F39C57] text-white font-semibold px-6 py-3 rounded-xl shadow-[0_8px_28px_rgba(228,85,46,0.35)] hover:shadow-[0_12px_36px_rgba(228,85,46,0.4)] hover:-translate-y-0.5 transition-all">
                New Search
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <ListingCard
                key={property.id}
                photo={property.image}
                price={formatPrice(property.price)}
                title={property.title}
                city={property.address}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                status={property.status}
                type={property.listingType}
                href={`/property/${property.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default function PropertySearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF5EC] pt-24 flex items-center justify-center">
        <div className="text-[#374151] text-xl font-medium">Loading search results...</div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
