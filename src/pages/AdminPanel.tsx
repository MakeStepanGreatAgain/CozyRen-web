import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Trash2, 
  Plus, 
  Edit, 
  Save, 
  X, 
  Shield, 
  Package, 
  Tag, 
  Building2,
  Search,
  Filter,
  Eye,
  EyeOff,
  LogOut,
  Cog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import AdminLogin from '@/components/AdminLogin';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id?: number;
  brand_id?: number;
  specifications: any;
  image_url?: string;
  is_active: boolean;
  category_name?: string;
  brand_name?: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  products_count: number;
}

interface Brand {
  id: number;
  name: string;
  description: string;
  logo_url?: string;
  products_count: number;
}

export default function AdminPanel() {
  console.log('AdminPanel component rendered');
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  
  // 1C Sync states
  const [lastSyncTime, setLastSyncTime] = useState<string>('Никогда');
  const [syncSchedule, setSyncSchedule] = useState<string>('manual');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Product management
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category_id: undefined,
    brand_id: undefined,
    specifications: {},
    image_url: '',
    is_active: true
  });

  // Category management
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: ''
  });

  // Brand management
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrand, setNewBrand] = useState<Partial<Brand>>({
    name: '',
    description: '',
    logo_url: ''
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/brands')
      ]);
      
      setProducts(productsRes.products || []);
      setCategories(categoriesRes || []);
      setBrands(brandsRes || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };



  // Product management functions
  const createProduct = async () => {
    try {
      await api.post('/admin/products', newProduct);
      toast.success('Товар создан');
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category_id: undefined,
        brand_id: undefined,
        specifications: {},
        image_url: '',
        is_active: true
      });
      loadData();
    } catch (error) {
      toast.error('Ошибка создания товара');
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      await api.put(`/admin/products/${product.id}`, product);
      toast.success('Товар обновлен');
      setEditingProduct(null);
      loadData();
    } catch (error) {
      toast.error('Ошибка обновления товара');
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/admin/products/${id}`);
      toast.success('Товар удален');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления товара');
    }
  };

  // Category management functions
  const createCategory = async () => {
    try {
      await api.post('/admin/categories', newCategory);
      toast.success('Категория создана');
      setNewCategory({ name: '', description: '' });
      loadData();
    } catch (error) {
      toast.error('Ошибка создания категории');
    }
  };

  // Brand management functions
  const createBrand = async () => {
    try {
      await api.post('/admin/brands', newBrand);
      toast.success('Бренд создан');
      setNewBrand({ name: '', description: '', logo_url: '' });
      loadData();
    } catch (error) {
      toast.error('Ошибка создания бренда');
    }
  };

  // Category CRUD operations
  const updateCategory = async () => {
    if (!editingCategory) return;
    try {
      await api.put(`/admin/categories/${editingCategory.id}`, editingCategory);
      toast.success('Категория обновлена');
      setEditingCategory(null);
      loadData();
    } catch (error) {
      toast.error('Ошибка обновления категории');
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Категория удалена');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления категории');
    }
  };

  // Brand CRUD operations
  const updateBrand = async () => {
    if (!editingBrand) return;
    try {
      await api.put(`/admin/brands/${editingBrand.id}`, editingBrand);
      toast.success('Бренд обновлен');
      setEditingBrand(null);
      loadData();
    } catch (error) {
      toast.error('Ошибка обновления бренда');
    }
  };

  const deleteBrand = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот бренд?')) return;
    try {
      await api.delete(`/admin/brands/${id}`);
      toast.success('Бренд удален');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления бренда');
    }
  };

  // 1C Sync functions
  const handleSyncNow = () => {
    toast.info('Синхронизация с 1С запущена...');
    // Имитация синхронизации
    setTimeout(() => {
      const now = new Date();
      const formattedTime = now.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      setLastSyncTime(formattedTime);
      toast.success('Синхронизация с 1С завершена');
    }, 2000);
  };

  const handleScheduleChange = (schedule: string) => {
    setSyncSchedule(schedule);
    if (schedule === 'manual') {
      toast.info('Синхронизация переведена в ручной режим');
    } else {
      toast.info(`Синхронизация запланирована на ${schedule}`);
    }
  };

  const handleLogin = (token: string) => {
    setIsAuthenticated(true);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  console.log('AdminPanel render - isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('Rendering AdminLogin component');
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  console.log('Rendering main AdminPanel content');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold">Админ панель - Управление каталогом</h1>
          <Button variant="outline" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="brands">Бренды</TabsTrigger>
            <TabsTrigger value="sync">Синхронизация</TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Управление товарами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Input placeholder="Поиск товаров..." className="w-64" />
                    <Button variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить товар
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Добавить новый товар</DialogTitle>
                      </DialogHeader>
                      <ProductForm
                        product={newProduct}
                        onChange={setNewProduct}
                        onSubmit={createProduct}
                        categories={categories}
                        brands={brands}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">Загрузка...</div>
                  ) : (
                    products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onEdit={setEditingProduct}
                        onDelete={deleteProduct}
                        onUpdate={updateProduct}
                        categories={categories}
                        brands={brands}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Управление категориями
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Input placeholder="Поиск категорий..." className="w-64" />
                    <Button variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить категорию
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить новую категорию</DialogTitle>
                      </DialogHeader>
                      <CategoryForm
                        category={newCategory}
                        onChange={setNewCategory}
                        onSubmit={createCategory}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {categories.map((category) => (
                    <CategoryCard 
                      key={category.id} 
                      category={category} 
                      onEdit={setEditingCategory}
                      onDelete={deleteCategory}
                    />
                  ))}
                </div>

                {/* Edit Category Dialog */}
                {editingCategory && (
                  <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать категорию</DialogTitle>
                      </DialogHeader>
                      <CategoryForm
                        category={editingCategory}
                        onChange={setEditingCategory}
                        onSubmit={updateCategory}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Управление брендами
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2">
                    <Input placeholder="Поиск брендов..." className="w-64" />
                    <Button variant="outline">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить бренд
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить новый бренд</DialogTitle>
                      </DialogHeader>
                      <BrandForm
                        brand={newBrand}
                        onChange={setNewBrand}
                        onSubmit={createBrand}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-4">
                  {brands.map((brand) => (
                    <BrandCard 
                      key={brand.id} 
                      brand={brand} 
                      onEdit={setEditingBrand}
                      onDelete={deleteBrand}
                    />
                  ))}
                </div>

                {/* Edit Brand Dialog */}
                {editingBrand && (
                  <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать бренд</DialogTitle>
                      </DialogHeader>
                      <BrandForm
                        brand={editingBrand}
                        onChange={setEditingBrand}
                        onSubmit={updateBrand}
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Tab */}
          <TabsContent value="sync" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cog className="h-5 w-5" />
                  Синхронизация с 1С
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Кнопка синхронизации */}
                <div className="flex flex-col items-center space-y-4">
                  <Button 
                    onClick={handleSyncNow}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                  >
                    <Cog className="h-5 w-5 mr-2" />
                    Синхронизировать с 1С
                  </Button>
                  
                  <h4 className="text-sm text-muted-foreground">
                    Последнее обновление: {lastSyncTime}
                  </h4>
                </div>

                {/* Настройки расписания */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Настройки синхронизации</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="sync-schedule">Режим синхронизации</Label>
                      <Select value={syncSchedule} onValueChange={handleScheduleChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите режим синхронизации" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Ручная синхронизация</SelectItem>
                          <SelectItem value="hourly">Каждый час</SelectItem>
                          <SelectItem value="daily">Ежедневно в 09:00</SelectItem>
                          <SelectItem value="weekly">Еженедельно (понедельник 09:00)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Информация о синхронизации</h4>
                      <p className="text-sm text-muted-foreground">
                        Синхронизация с 1С позволяет автоматически обновлять данные о товарах, 
                        ценах и остатках. Выберите подходящий режим синхронизации или используйте 
                        ручную синхронизацию по требованию.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Product Form Component
function ProductForm({ product, onChange, onSubmit, categories, brands }: {
  product: Partial<Product>;
  onChange: (product: Partial<Product>) => void;
  onSubmit: () => void;
  categories: Category[];
  brands: Brand[];
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={product.name || ''}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            placeholder="Название товара"
          />
        </div>
        <div>
          <Label htmlFor="price">Цена</Label>
          <Input
            id="price"
            type="number"
            value={product.price || 0}
            onChange={(e) => onChange({ ...product, price: Number(e.target.value) })}
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={product.description || ''}
          onChange={(e) => onChange({ ...product, description: e.target.value })}
          placeholder="Описание товара"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select
            value={product.category_id?.toString() || ''}
            onValueChange={(value) => onChange({ ...product, category_id: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="brand">Бренд</Label>
          <Select
            value={product.brand_id?.toString() || ''}
            onValueChange={(value) => onChange({ ...product, brand_id: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите бренд" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">URL изображения</Label>
        <Input
          id="image_url"
          value={product.image_url || ''}
          onChange={(e) => onChange({ ...product, image_url: e.target.value })}
          placeholder="/images/product.jpg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={product.is_active || false}
          onCheckedChange={(checked) => onChange({ ...product, is_active: checked })}
        />
        <Label htmlFor="is_active">Активен</Label>
      </div>

      <Button onClick={onSubmit} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Сохранить
      </Button>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, onEdit, onDelete, onUpdate, categories, brands }: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onUpdate: (product: Product) => void;
  categories: Category[];
  brands: Brand[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleSave = () => {
    onUpdate(editedProduct);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4">
          <ProductForm
            product={editedProduct}
            onChange={setEditedProduct}
            onSubmit={handleSave}
            categories={categories}
            brands={brands}
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} size="sm">
              <Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{product.name}</h3>
              <Badge variant={product.is_active ? "default" : "secondary"}>
                {product.is_active ? "Активен" : "Неактивен"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium">{product.price} ₽</span>
              <span className="text-muted-foreground">
                {product.category_name || 'Без категории'}
              </span>
              <span className="text-muted-foreground">
                {product.brand_name || 'Без бренда'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(product.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Category Card Component
function CategoryCard({ category, onEdit, onDelete }: { 
  category: Category; 
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.description}</p>
            <Badge variant="secondary" className="mt-2">
              {category.products_count} товаров
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(category.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Brand Card Component
function BrandCard({ brand, onEdit, onDelete }: { 
  brand: Brand; 
  onEdit: (brand: Brand) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{brand.name}</h3>
            <p className="text-sm text-muted-foreground">{brand.description}</p>
            <Badge variant="secondary" className="mt-2">
              {brand.products_count} товаров
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(brand)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(brand.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Category Form Component
function CategoryForm({ category, onChange, onSubmit }: {
  category: Partial<Category>;
  onChange: (category: Partial<Category>) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category_name">Название</Label>
        <Input
          id="category_name"
          value={category.name || ''}
          onChange={(e) => onChange({ ...category, name: e.target.value })}
          placeholder="Название категории"
        />
      </div>
      <div>
        <Label htmlFor="category_description">Описание</Label>
        <Textarea
          id="category_description"
          value={category.description || ''}
          onChange={(e) => onChange({ ...category, description: e.target.value })}
          placeholder="Описание категории"
        />
      </div>
      <Button onClick={onSubmit} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Сохранить
      </Button>
    </div>
  );
}

// Brand Form Component
function BrandForm({ brand, onChange, onSubmit }: {
  brand: Partial<Brand>;
  onChange: (brand: Partial<Brand>) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="brand_name">Название</Label>
        <Input
          id="brand_name"
          value={brand.name || ''}
          onChange={(e) => onChange({ ...brand, name: e.target.value })}
          placeholder="Название бренда"
        />
      </div>
      <div>
        <Label htmlFor="brand_description">Описание</Label>
        <Textarea
          id="brand_description"
          value={brand.description || ''}
          onChange={(e) => onChange({ ...brand, description: e.target.value })}
          placeholder="Описание бренда"
        />
      </div>
      <div>
        <Label htmlFor="brand_logo">URL логотипа</Label>
        <Input
          id="brand_logo"
          value={brand.logo_url || ''}
          onChange={(e) => onChange({ ...brand, logo_url: e.target.value })}
          placeholder="/images/brand-logo.png"
        />
      </div>
      <Button onClick={onSubmit} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        Сохранить
      </Button>
    </div>
  );
}