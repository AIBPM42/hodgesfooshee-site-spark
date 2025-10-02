import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { Home, TrendingUp, BarChart } from "lucide-react";

export default function Services() {
  const { data: content, isLoading } = useQuery({
    queryKey: ['services-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services_content')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const iconMap = {
    Home,
    TrendingUp,
    BarChart
  };

  const sections = Array.isArray(content?.sections) ? content.sections : [];

  return (
    <>
      <Helmet>
        <title>{content?.seo_title || 'Our Services'}</title>
        <meta name="description" content={content?.seo_description || ''} />
      </Helmet>
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-4">
              {content?.hero_title || 'Our Services'}
            </h1>
            {content?.hero_subtitle && (
              <p className="text-xl text-muted-foreground mb-12">
                {content.hero_subtitle}
              </p>
            )}
            
            <div className="grid gap-8">
              {sections.map((section: any, index: number) => {
                const Icon = iconMap[section.icon as keyof typeof iconMap] || Home;
                return (
                  <div key={index} className="card-glass p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-display font-bold mb-2">
                          {section.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {section.copy}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
