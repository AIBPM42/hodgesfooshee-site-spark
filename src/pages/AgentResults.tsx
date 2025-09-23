import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, Mail, Star, Award } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://your-backend-domain.com';

interface Agent {
  id: string;
  name: string;
  title: string;
  office: string;
  phone: string;
  email: string;
  image: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  salesVolume: number;
  yearsExperience: number;
}

const AgentResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents', searchParams.toString()],
    queryFn: async (): Promise<Agent[]> => {
      const response = await fetch(`${API_BASE}/api/search/agents?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch agents');
      return response.json();
    },
  });

  // Mock data fallback
  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      title: 'Senior Real Estate Agent',
      office: 'Hodges & Fooshee Realty',
      phone: '(615) 555-0123',
      email: 'sarah.johnson@hfrealty.com',
      image: '/placeholder.svg',
      rating: 4.9,
      reviewCount: 127,
      specialties: ['Luxury Homes', 'First-Time Buyers', 'Investment Properties'],
      salesVolume: 15600000,
      yearsExperience: 8
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Real Estate Specialist',
      office: 'Hodges & Fooshee Realty',
      phone: '(615) 555-0124',
      email: 'michael.chen@hfrealty.com',
      image: '/placeholder.svg',
      rating: 4.8,
      reviewCount: 89,
      specialties: ['Commercial Real Estate', 'New Construction'],
      salesVolume: 12400000,
      yearsExperience: 6
    }
  ];

  const displayAgents = agents || mockAgents;

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
            Real Estate Agents
          </h1>
          <p className="text-muted-foreground">
            Found {displayAgents.length} experienced agents to help you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAgents.map((agent) => (
            <Card key={agent.id} className="result-card">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={agent.image}
                    alt={agent.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-display font-semibold text-lg">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.title}</p>
                    <p className="text-sm text-muted-foreground">{agent.office}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-semibold">{agent.rating}</span>
                    <span className="text-muted-foreground text-sm ml-1">
                      ({agent.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Experience</span>
                    <span>{agent.yearsExperience} years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sales Volume</span>
                    <span>${(agent.salesVolume / 1000000).toFixed(1)}M</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Specialties</div>
                  <div className="flex flex-wrap gap-1">
                    {agent.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full btn-glass" asChild>
                    <a href={`tel:${agent.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      {agent.phone}
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full btn-glass" asChild>
                    <a href={`mailto:${agent.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentResults;