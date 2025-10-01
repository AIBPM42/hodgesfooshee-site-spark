import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Edit, Sparkles, Loader2, Eye, EyeOff } from "lucide-react";

export default function AIHotProperties() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    county: '',
    price_low: '',
    price_high: '',
    beds: '',
    baths: '',
    sqft: '',
    score: '',
    summary: '',
    verified: false,
    hidden: false
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ['ai-hot-properties'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('ai-hot-properties', {
        method: 'GET'
      });
      if (error) throw error;
      return data.items || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.functions.invoke('ai-hot-properties', {
        method: 'POST',
        body: { items: [payload] }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Property saved successfully');
      queryClient.invalidateQueries({ queryKey: ['ai-hot-properties'] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Failed to save property: ' + error.message);
    }
  });

  const resetForm = () => {
    setFormData({
      address: '',
      city: '',
      county: '',
      price_low: '',
      price_high: '',
      beds: '',
      baths: '',
      sqft: '',
      score: '',
      summary: '',
      verified: false,
      hidden: false
    });
    setEditingProperty(null);
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setFormData({
      address: property.address,
      city: property.city || '',
      county: property.county || '',
      price_low: property.price_low || '',
      price_high: property.price_high || '',
      beds: property.beds || '',
      baths: property.baths || '',
      sqft: property.sqft || '',
      score: property.score || '',
      summary: property.summary || '',
      verified: property.verified || false,
      hidden: property.hidden || false
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      price_low: formData.price_low ? parseFloat(formData.price_low) : null,
      price_high: formData.price_high ? parseFloat(formData.price_high) : null,
      beds: formData.beds ? parseInt(formData.beds) : null,
      baths: formData.baths ? parseFloat(formData.baths) : null,
      sqft: formData.sqft ? parseInt(formData.sqft) : null,
      score: formData.score ? parseFloat(formData.score) : null
    };
    saveMutation.mutate(payload);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Hot Properties
          </h2>
          <p className="text-muted-foreground">AI-scouted investment opportunities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProperty ? 'Edit Property' : 'Add Hot Property'}</DialogTitle>
              <DialogDescription>
                Add or edit an AI-identified investment opportunity
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county">County</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_low">Price Low</Label>
                  <Input
                    id="price_low"
                    type="number"
                    value={formData.price_low}
                    onChange={(e) => setFormData({ ...formData, price_low: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_high">Price High</Label>
                  <Input
                    id="price_high"
                    type="number"
                    value={formData.price_high}
                    onChange={(e) => setFormData({ ...formData, price_high: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beds">Beds</Label>
                  <Input
                    id="beds"
                    type="number"
                    value={formData.beds}
                    onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baths">Baths</Label>
                  <Input
                    id="baths"
                    type="number"
                    step="0.5"
                    value={formData.baths}
                    onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sqft">Sq Ft</Label>
                  <Input
                    id="sqft"
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="score">AI Score (0-1)</Label>
                <Input
                  id="score"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="verified">Verified</Label>
                <Switch
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="hidden">Hidden from public</Label>
                <Switch
                  id="hidden"
                  checked={formData.hidden}
                  onCheckedChange={(checked) => setFormData({ ...formData, hidden: checked })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Property'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {properties?.map((property: any) => (
          <Card key={property.id} className={property.hidden ? "opacity-60" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    {property.address}
                    {property.verified && (
                      <Badge variant="default" className="bg-green-500">Verified</Badge>
                    )}
                    {property.hidden && (
                      <Badge variant="secondary"><EyeOff className="h-3 w-3 mr-1" />Hidden</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {property.city}, {property.county} • Score: {(property.score * 100).toFixed(0)}%
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(property)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                <div>
                  <span className="text-muted-foreground">Price:</span> ${property.price_low?.toLocaleString()} - ${property.price_high?.toLocaleString()}
                </div>
                <div>
                  <span className="text-muted-foreground">Beds:</span> {property.beds}
                </div>
                <div>
                  <span className="text-muted-foreground">Baths:</span> {property.baths}
                </div>
                <div>
                  <span className="text-muted-foreground">Sq Ft:</span> {property.sqft?.toLocaleString()}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{property.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
