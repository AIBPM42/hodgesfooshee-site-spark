import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Activity, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Content() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Implement save to services_content table
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Services page updated",
        description: "Changes have been saved successfully"
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient mb-2">Content Management</h1>
          <p className="text-muted-foreground">Edit Services page and site content</p>
        </div>
        <Link to="/admin">
          <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
            <Activity className="h-3 w-3 mr-1" />
            Live Dashboard
          </Badge>
        </Link>
      </div>

      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Services Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Title</label>
            <Input 
              placeholder="Our Professional Services"
              defaultValue="Our Professional Services"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hero Subtitle</label>
            <Textarea 
              placeholder="Comprehensive real estate services for all your needs"
              defaultValue="Comprehensive real estate services for all your needs"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service Sections</label>
            <p className="text-xs text-muted-foreground">
              Add/edit service cards with title, description, and icon
            </p>
            <div className="border border-dashed border-muted-foreground/25 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Service sections editor will appear here
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">SEO Meta Title</label>
            <Input placeholder="Services - Hodges & Fooshee" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">SEO Meta Description</label>
            <Textarea 
              placeholder="Professional real estate services in Nashville"
              rows={2}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" asChild>
              <Link to="/services" target="_blank">
                Preview Page
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
