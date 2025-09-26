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
  <div className="bg-glass rounded-2xl p-6 shadow-glass animate-fade-in">
    <div className="flex items-center gap-3 mb-3">
      <Icon className="w-6 h-6 text-primary" />
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
    <div className="text-white/80 font-medium">{label}</div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-glass rounded-2xl p-6 shadow-glass">
    <div className="flex items-center gap-3 mb-3">
      <Skeleton className="w-6 h-6 rounded bg-white/20" />
      <Skeleton className="h-10 w-16 rounded bg-white/20" />
    </div>
    <Skeleton className="h-5 w-24 rounded bg-white/20" />
  </div>
);

export default DynamicStats;