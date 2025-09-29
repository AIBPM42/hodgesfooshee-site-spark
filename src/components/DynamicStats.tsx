import { useMarketStats } from "@/hooks/useMarketStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, DollarSign, Calendar, MapPin } from "lucide-react";

const DynamicStats = () => {
  const { data: stats, isLoading, error } = useMarketStats();

  if (error) {
    // Fallback to static numbers if there's an error
    return (
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        <StatCard icon={Home} value="500+" label="Homes Sold" />
        <StatCard icon={Calendar} value="25+" label="Years Experience" />
        <StatCard icon={MapPin} value="9" label="Counties Served" />
        <StatCard icon={DollarSign} value="98%" label="Client Satisfaction" />
      </div>
    );
  }

  return (
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      {isLoading ? (
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      ) : (
        <>
          <StatCard 
            icon={Home} 
            value={stats?.activeListings.toLocaleString() || "0"} 
            label="Active Listings" 
          />
          <StatCard 
            icon={DollarSign} 
            value={stats?.averagePrice ? `$${Math.round(stats.averagePrice / 1000)}K` : "$0"} 
            label="Avg List Price" 
          />
          <StatCard 
            icon={Calendar} 
            value={stats?.recentSales.toLocaleString() || "0"} 
            label="Recent Sales" 
          />
          <StatCard 
            icon={MapPin} 
            value={stats?.openHouses.toLocaleString() || "0"} 
            label="Open Houses" 
          />
        </>
      )}
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<any>;
  value: string;
  label: string;
}

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
  <div className="text-center group">
    <div className="card-glass p-6 mb-4 hover:shadow-glass-glow transition-all duration-300 group-hover:scale-105">
      <Icon className="h-10 w-10 text-luxury-gold mx-auto mb-2" />
      <div className="text-3xl font-bold text-luxury-gold mb-1">{value}</div>
      <div className="text-white/90 text-sm font-medium">{label}</div>
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="text-center">
    <div className="card-glass p-6 mb-4">
      <Skeleton className="h-10 w-10 mx-auto mb-2 bg-white/20" />
      <Skeleton className="h-8 w-16 mx-auto mb-1 bg-white/20" />
      <Skeleton className="h-4 w-20 mx-auto bg-white/20" />
    </div>
  </div>
);

export default DynamicStats;