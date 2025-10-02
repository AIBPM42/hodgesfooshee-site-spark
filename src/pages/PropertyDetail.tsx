import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Bed, Bath, Square, MapPin, Calendar, Heart, Share2, Phone, Mail } from 'lucide-react';
import { logPageView, logListingView } from '@/lib/analytics';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://your-backend-domain.com';

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

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Track page view and listing view
  React.useEffect(() => {
    logPageView(`/property/${id}`);
    if (id) {
      logListingView(id);
    }
  }, [id]);
  
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

      // Fetch media
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

  // Mock data fallback
  const mockProperty: PropertyDetails = {
    id: '1',
    title: 'Modern Luxury Home in Belle Meade',
    address: '1234 Belle Meade Blvd, Nashville, TN 37205',
    price: 1250000,
    beds: 4,
    baths: 3,
    sqft: 3200,
    lotSize: '0.5 acres',
    yearBuilt: 2020,
    propertyType: 'Single Family',
    status: 'Active',
    listingDate: '2024-01-15',
    description: 'Stunning modern luxury home featuring an open floor plan, high-end finishes, and premium appliances. Located in the prestigious Belle Meade neighborhood with easy access to downtown Nashville.',
    features: [
      'Hardwood Floors',
      'Granite Countertops',
      'Stainless Steel Appliances',
      'Master Suite',
      'Walk-in Closets',
      'Two-Car Garage',
      'Landscaped Yard',
      'Security System'
    ],
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    agent: {
      name: 'Sarah Johnson',
      phone: '(615) 555-0123',
      email: 'sarah.johnson@hfrealty.com',
      image: '/placeholder.svg'
    }
  };

  const displayProperty = property || mockProperty;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="glass max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading property details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/search/properties">
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
            <Card className="glass mb-6">
              <div className="relative">
                <img 
                  src={displayProperty.images[0]}
                  alt={displayProperty.title}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="default">{displayProperty.status}</Badge>
                  <Badge variant="outline">{displayProperty.propertyType}</Badge>
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
            </Card>

            {/* Property Details */}
            <Card className="glass mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-display text-gradient">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                    }).format(displayProperty.price)}
                  </CardTitle>
                </div>
                <h1 className="text-2xl font-display font-semibold">{displayProperty.title}</h1>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {displayProperty.address}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold">{displayProperty.beds}</div>
                    <div className="text-sm text-muted-foreground">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold">{displayProperty.baths}</div>
                    <div className="text-sm text-muted-foreground">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Square className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold">{displayProperty.sqft.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 glass-light rounded-lg">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-xl font-semibold">{displayProperty.yearBuilt}</div>
                    <div className="text-sm text-muted-foreground">Year Built</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-display font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{displayProperty.description}</p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-display font-semibold mb-3">Features & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {displayProperty.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-2 glass-light rounded">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Card */}
            <Card className="glass mb-6">
              <CardHeader>
                <CardTitle className="font-display">Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <img 
                    src={displayProperty.agent.image}
                    alt={displayProperty.agent.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <div className="font-semibold">{displayProperty.agent.name}</div>
                    <div className="text-sm text-muted-foreground">Real Estate Agent</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full btn-glass" asChild>
                    <a href={`tel:${displayProperty.agent.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {displayProperty.agent.phone}
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full btn-glass" asChild>
                    <a href={`mailto:${displayProperty.agent.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="font-display">Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span>{displayProperty.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lot Size</span>
                  <span>{displayProperty.lotSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listed</span>
                  <span>{new Date(displayProperty.listingDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">MLS ID</span>
                  <span>#{displayProperty.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;