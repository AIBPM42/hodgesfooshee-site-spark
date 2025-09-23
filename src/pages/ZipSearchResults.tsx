import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, TrendingUp, Home, DollarSign } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://your-backend-domain.com';

interface ZipData {
  id: string;
  zipCode: string;
  city: string;
  state: string;
  medianPrice: number;
  averagePrice: number;
  totalListings: number;
  soldLastMonth: number;
  priceChange: number;
  marketTrend: 'up' | 'down' | 'stable';
}

const ZipSearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const { data: zipData, isLoading, error } = useQuery({
    queryKey: ['zip', searchParams.toString()],
    queryFn: async (): Promise<ZipData[]> => {
      const response = await fetch(`${API_BASE}/api/search/zip?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch ZIP data');
      return response.json();
    },
  });

  // Mock data fallback
  const mockZipData: ZipData[] = [
    {
      id: '1',
      zipCode: '37205',
      city: 'Nashville',
      state: 'TN',
      medianPrice: 850000,
      averagePrice: 1250000,
      totalListings: 45,
      soldLastMonth: 12,
      priceChange: 5.2,
      marketTrend: 'up'
    },
    {
      id: '2',
      zipCode: '37203',
      city: 'Nashville',
      state: 'TN',
      medianPrice: 650000,
      averagePrice: 750000,
      totalListings: 62,
      soldLastMonth: 18,
      priceChange: -2.1,
      marketTrend: 'down'
    }
  ];

  const displayZipData = zipData || mockZipData;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="glass mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          
          <h1 className="text-4xl font-display font-bold text-gradient mb-2">
            ZIP Code Market Data
          </h1>
          <p className="text-muted-foreground">
            Market insights for {displayZipData.length} ZIP code areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayZipData.map((zip) => (
            <Card key={zip.id} className="result-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-display">
                    {zip.zipCode}
                  </CardTitle>
                  <Badge 
                    variant={zip.marketTrend === 'up' ? 'default' : zip.marketTrend === 'down' ? 'destructive' : 'secondary'}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {zip.marketTrend === 'up' ? 'Rising' : zip.marketTrend === 'down' ? 'Declining' : 'Stable'}
                  </Badge>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  {zip.city}, {zip.state}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 glass-light rounded-lg">
                    <div className="text-2xl font-bold text-gradient">
                      ${(zip.medianPrice / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground">Median Price</div>
                  </div>
                  
                  <div className="text-center p-4 glass-light rounded-lg">
                    <div className="text-2xl font-bold text-gradient">
                      ${(zip.averagePrice / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-muted-foreground">Average Price</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 glass-light rounded-lg">
                    <div className="text-xl font-semibold">{zip.totalListings}</div>
                    <div className="text-sm text-muted-foreground">Active Listings</div>
                  </div>
                  
                  <div className="text-center p-4 glass-light rounded-lg">
                    <div className="text-xl font-semibold">{zip.soldLastMonth}</div>
                    <div className="text-sm text-muted-foreground">Sold Last Month</div>
                  </div>
                </div>
                
                <div className="p-4 glass-light rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Price Change (30 days)</span>
                    <span className={`font-semibold ${zip.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {zip.priceChange > 0 ? '+' : ''}{zip.priceChange}%
                    </span>
                  </div>
                </div>
                
                <Link to={`/search/properties?location=${zip.zipCode}`}>
                  <Button className="w-full btn-glass">
                    <Home className="w-4 h-4 mr-2" />
                    View Properties in {zip.zipCode}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZipSearchResults;