import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, User } from "lucide-react";

const BlogSection = () => {
  const articles = [
    {
      title: "Nashville Home Prices: What to Expect in 2024",
      excerpt: "Market analysis and predictions for Nashville's real estate market in the coming year.",
      author: "Sarah Hodges",
      date: "March 15, 2024",
      category: "Market Analysis",
      readTime: "5 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "First-Time Homebuyer's Guide to Nashville",
      excerpt: "Everything you need to know about buying your first home in Music City.",
      author: "Mike Fooshee",
      date: "March 12, 2024",
      category: "Buyer's Guide",
      readTime: "8 min read",
      image: "/api/placeholder/400/250"
    },
    {
      title: "Best Nashville Neighborhoods for Young Professionals",
      excerpt: "Discover the most popular areas for Nashville's growing professional community.",
      author: "Sarah Hodges",
      date: "March 8, 2024",
      category: "Neighborhoods",
      readTime: "6 min read",
      image: "/api/placeholder/400/250"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Nashville Real Estate Insights
          </h2>
          <p className="text-xl text-muted-foreground">
            Stay informed with the latest market trends and expert advice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.map((article, index) => (
            <Card key={index} className="hover:shadow-luxury transition-all duration-300 group">
              <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  {article.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{article.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {article.readTime}
                  </span>
                  <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;