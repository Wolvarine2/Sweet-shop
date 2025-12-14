import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useSweets } from '@/contexts/SweetsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { categories, Sweet } from '@/data/mockData';
import { Edit, Package, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Admin() {
  const { isAdmin } = useAuth();
  const { sweets, addSweet, updateSweet, deleteSweet, restockSweet } = useSweets();
  const { toast } = useToast();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [restockAmount, setRestockAmount] = useState(10);
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image: '🍬',
    imageUrl: '',
    imageFile: null as File | null,
    imagePreview: '' as string | null,
  });

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
      image: '🍬',
      imageUrl: '',
      imageFile: null,
      imagePreview: null,
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setFormData({ ...formData, imageFile: file, imageUrl: '' });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAdd = async () => {
    try {
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a sweet name.',
          variant: 'destructive',
        });
        return;
      }
      
      if (!formData.category) {
        toast({
          title: 'Validation Error',
          description: 'Please select a category.',
          variant: 'destructive',
        });
        return;
      }
      
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid price greater than 0.',
          variant: 'destructive',
        });
        return;
      }
      
      const quantity = parseInt(formData.quantity);
      if (isNaN(quantity) || quantity < 0) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid quantity (0 or greater).',
          variant: 'destructive',
        });
        return;
      }
      
      let finalImageUrl = formData.imageUrl?.trim() || '';
      
      // If file is uploaded, convert to base64 data URL (takes priority)
      if (formData.imageFile) {
        finalImageUrl = await convertImageToDataUrl(formData.imageFile);
      }
      // If URL is provided, use it (but validate it's not empty after trim)
      else if (finalImageUrl) {
        // URL is already set, just ensure it's valid
        if (!finalImageUrl.startsWith('http://') && !finalImageUrl.startsWith('https://') && !finalImageUrl.startsWith('data:image/')) {
          toast({
            title: 'Invalid Image URL',
            description: 'Please enter a valid image URL (http://, https://) or base64 data URL (data:image/...)',
            variant: 'destructive',
          });
          return;
        }
      }
      // If no image provided, use default placeholder
      else {
        finalImageUrl = 'https://placehold.co/200x200?text=Sweet';
      }
      
      await addSweet({
        name: formData.name.trim(),
        category: formData.category,
        price: price,
        quantity: quantity,
        description: formData.description,
        image: formData.image,
        imageUrl: finalImageUrl,
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error is handled by context toast
    }
  };

  const handleEdit = async () => {
    if (selectedSweet) {
      try {
        let finalImageUrl = formData.imageUrl;
        
        // If file is uploaded, convert to base64 data URL
        if (formData.imageFile) {
          finalImageUrl = await convertImageToDataUrl(formData.imageFile);
        }
        
        await updateSweet(selectedSweet.id, {
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          description: formData.description,
          image: formData.image,
          imageUrl: finalImageUrl,
        });
        setIsEditDialogOpen(false);
        setSelectedSweet(null);
        resetForm();
      } catch (error) {
        // Error is handled by context toast
      }
    }
  };

  const openEditDialog = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    const imageUrl = sweet.imageUrl || '';
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      description: sweet.description,
      image: sweet.image,
      imageUrl: imageUrl,
      imageFile: null,
      imagePreview: imageUrl || null, // Show existing image as preview
    });
    setIsEditDialogOpen(true);
  };

  const openRestockDialog = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setRestockAmount(10);
    setIsRestockDialogOpen(true);
  };

  const handleRestock = async () => {
    if (selectedSweet) {
      try {
        const newQuantity = selectedSweet.quantity + restockAmount;
        await restockSweet(selectedSweet.id, newQuantity);
        setIsRestockDialogOpen(false);
        setSelectedSweet(null);
      } catch (error) {
        // Error is handled by context toast
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-2">
              🛠️ Admin Panel
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your sweet inventory and view orders
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Sweet
            </Button>
          </div>
        </div>

        <div className="mt-6">
            <div className="rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sweet</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sweets.map((sweet) => (
                    <TableRow key={sweet.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {sweet.imageUrl ? (
                            <img 
                              src={sweet.imageUrl} 
                              alt={sweet.name}
                              className="w-12 h-12 object-cover rounded-md border"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.classList.remove('hidden');
                              }}
                            />
                          ) : null}
                          <span className={`text-2xl ${sweet.imageUrl ? 'hidden' : ''}`}>{sweet.image}</span>
                          <span className="font-medium">{sweet.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sweet.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-primary">
                        ₹{sweet.price}
                      </TableCell>
                      <TableCell>
                        <Badge variant={sweet.quantity > 0 ? 'secondary' : 'destructive'}>
                          {sweet.quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openRestockDialog(sweet)}
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(sweet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete ${sweet.name}?`)) {
                                try {
                                  await deleteSweet(sweet.id);
                                } catch (error) {
                                  // Error is handled by context toast
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
        </div>
      </main>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Add New Sweet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="name" className="text-sm">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="category" className="text-sm">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="price" className="text-sm">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="quantity" className="text-sm">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm">Image (Optional)</Label>
              <div className="grid gap-2">
                <div className="flex gap-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="h-9 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({ ...formData, imageFile: null, imagePreview: null });
                      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="h-9"
                  >
                    Clear
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">OR</div>
                <Input
                  id="imageUrl"
                  type="text"
                  placeholder="https://example.com/image.jpg or data:image/..."
                  value={formData.imageUrl}
                  onChange={(e) => {
                    const url = e.target.value;
                    setFormData({ 
                      ...formData, 
                      imageUrl: url, 
                      imageFile: null, 
                      imagePreview: url.trim() ? url : null 
                    });
                    // Clear file input when URL is entered
                    const fileInput = document.getElementById('imageFile') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }}
                  onBlur={(e) => {
                    // Validate URL format when user leaves the field
                    const url = e.target.value.trim();
                    if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
                      toast({
                        title: 'Invalid URL',
                        description: 'Please enter a valid image URL (http://, https://) or base64 data URL (data:image/...)',
                        variant: 'destructive',
                      });
                    }
                  }}
                  className="h-9"
                />
              </div>
              {formData.imagePreview && (
                <div className="mt-2">
                  <div className="relative">
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 object-cover rounded-md border"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const errorMsg = target.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'block';
                      }}
                      onLoad={(e) => {
                        const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                        if (errorMsg) errorMsg.style.display = 'none';
                      }}
                    />
                    <div className="hidden text-xs text-destructive mt-1">Failed to load image. Please check the URL.</div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="description" className="text-sm">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} size="sm">Cancel</Button>
            <Button onClick={handleAdd} size="sm">Add Sweet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Sweet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edit-name" className="text-sm">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit-category" className="text-sm">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edit-price" className="text-sm">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="h-9"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit-quantity" className="text-sm">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm">Image (Optional)</Label>
              <div className="grid gap-2">
                <div className="flex gap-2">
                  <Input
                    id="edit-imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="h-9 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData({ ...formData, imageFile: null, imagePreview: formData.imageUrl || null });
                      const fileInput = document.getElementById('edit-imageFile') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="h-9"
                  >
                    Clear
                  </Button>
                </div>
                    <div className="text-xs text-muted-foreground">OR</div>
                    <Input
                      id="edit-imageUrl"
                      type="text"
                      placeholder="https://example.com/image.jpg or data:image/..."
                      value={formData.imageUrl}
                      onChange={(e) => {
                        const url = e.target.value;
                        setFormData({ 
                          ...formData, 
                          imageUrl: url, 
                          imageFile: null, 
                          imagePreview: url.trim() ? url : null 
                        });
                        // Clear file input when URL is entered
                        const fileInput = document.getElementById('edit-imageFile') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      onBlur={(e) => {
                        // Validate URL format when user leaves the field
                        const url = e.target.value.trim();
                        if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image/')) {
                          toast({
                            title: 'Invalid URL',
                            description: 'Please enter a valid image URL (http://, https://) or base64 data URL (data:image/...)',
                            variant: 'destructive',
                          });
                        }
                      }}
                      className="h-9"
                    />
                  </div>
                  {formData.imagePreview && (
                    <div className="mt-2">
                      <div className="relative">
                        <img 
                          src={formData.imagePreview} 
                          alt="Preview" 
                          className="w-20 h-20 object-cover rounded-md border"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const errorMsg = target.nextElementSibling as HTMLElement;
                            if (errorMsg) errorMsg.style.display = 'block';
                          }}
                          onLoad={(e) => {
                            const errorMsg = e.currentTarget.nextElementSibling as HTMLElement;
                            if (errorMsg) errorMsg.style.display = 'none';
                          }}
                        />
                        <div className="hidden text-xs text-destructive mt-1">Failed to load image. Please check the URL.</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="edit-description" className="text-sm">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-[60px] resize-none"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} size="sm">Cancel</Button>
            <Button onClick={handleEdit} size="sm">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              Restock {selectedSweet?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <Label htmlFor="restock-amount">Amount to Add</Label>
              <Input
                id="restock-amount"
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Current stock: {selectedSweet?.quantity} → New stock: {(selectedSweet?.quantity || 0) + restockAmount}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestockDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleRestock}>Restock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
