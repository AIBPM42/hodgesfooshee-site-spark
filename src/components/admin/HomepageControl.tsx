import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function HomepageControl() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('site-settings', {
        method: 'GET'
      });
      if (error) throw error;
      setFormData(data);
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.functions.invoke('site-settings', {
        method: 'POST',
        body: payload
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Homepage settings saved successfully');
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
    onError: (error) => {
      toast.error('Failed to save settings: ' + error.message);
    }
  });

  const handleSave = () => {
    if (formData) {
      saveMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur shadow-xl hover:shadow-2xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Hero Section</CardTitle>
          <CardDescription>Control the main hero banner on your homepage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={formData?.headline || ''}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Textarea
              id="subheadline"
              value={formData?.subheadline || ''}
              onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="default_city">Default City</Label>
            <Input
              id="default_city"
              value={formData?.default_city || ''}
              onChange={(e) => setFormData({ ...formData, default_city: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur shadow-xl hover:shadow-2xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Search Defaults</CardTitle>
          <CardDescription>Set default search parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_min">Min Price</Label>
              <Input
                id="price_min"
                type="number"
                value={formData?.price_min || ''}
                onChange={(e) => setFormData({ ...formData, price_min: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_max">Max Price</Label>
              <Input
                id="price_max"
                type="number"
                value={formData?.price_max || ''}
                onChange={(e) => setFormData({ ...formData, price_max: parseFloat(e.target.value) })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur shadow-xl hover:shadow-2xl transition-shadow">
        <CardHeader>
          <CardTitle className="text-2xl">Section Visibility</CardTitle>
          <CardDescription>Toggle homepage sections on/off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show_new">Show "New This Week"</Label>
            <Switch
              id="show_new"
              checked={formData?.show_new_this_week ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, show_new_this_week: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show_open">Show "Open Houses"</Label>
            <Switch
              id="show_open"
              checked={formData?.show_open_houses ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, show_open_houses: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show_cities">Show "Explore Cities"</Label>
            <Switch
              id="show_cities"
              checked={formData?.show_explore_cities ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, show_explore_cities: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="show_ai">Show "AI Hot Properties"</Label>
            <Switch
              id="show_ai"
              checked={formData?.show_hot_ai ?? true}
              onCheckedChange={(checked) => setFormData({ ...formData, show_hot_ai: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saveMutation.isPending}
        size="lg"
        className="w-full"
      >
        {saveMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
}
