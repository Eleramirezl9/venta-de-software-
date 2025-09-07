import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Grid3X3,
  List,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { productService, formatPrice } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados de filtros
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: parseFloat(searchParams.get('minPrice')) || 0,
    maxPrice: parseFloat(searchParams.get('maxPrice')) || 1000,
    isFree: searchParams.get('isFree') === 'true',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  });

  // Estados de paginación
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Cargar categorías
        const categoriesResponse = await productService.getCategories();
        setCategories(categoriesResponse.data.data.categories);

        // Cargar rango de precios
        const priceRangeResponse = await productService.getPriceRange();
        const range = priceRangeResponse.data.data.priceRange;
        setPriceRange(range);
        
        // Actualizar filtros si no se han establecido precios
        if (!searchParams.get('maxPrice')) {
          setFilters(prev => ({ ...prev, maxPrice: range.max }));
        }
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    };

    loadInitialData();
  }, []);

  // Cargar productos cuando cambien los filtros
  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.search && { q: filters.search }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.minPrice > 0 && { minPrice: filters.minPrice }),
        ...(filters.maxPrice < priceRange.max && { maxPrice: filters.maxPrice }),
        ...(filters.isFree && { isFree: filters.isFree })
      };

      const response = await productService.search(params);
      const data = response.data.data;
      
      setProducts(data.products);
      setPagination({
        total: data.total,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage
      });

      // Actualizar URL
      updateURL(params);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== '' && key !== 'limit') {
        newSearchParams.set(key, value.toString());
      }
    });
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Resetear a la primera página cuando cambien los filtros
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: 0,
      maxPrice: priceRange.max,
      isFree: false,
      page: 1,
      limit: 12
    });
    setSearchParams(new URLSearchParams());
  };

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      await addItem(productId, 1);
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    }
  };

  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.minPrice > 0,
    filters.maxPrice < priceRange.max,
    filters.isFree
  ].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Catálogo de Software</h1>
        
        {/* Barra de búsqueda y controles */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar software..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Controles */}
          <div className="flex items-center space-x-2">
            {/* Botón de filtros móvil */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Modo de vista */}
            <div className="hidden sm:flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filtros</CardTitle>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Categorías */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Categoría</Label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Rango de precios */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Rango de Precio</Label>
                <div className="px-2">
                  <Slider
                    value={[filters.minPrice, filters.maxPrice]}
                    onValueChange={([min, max]) => {
                      handleFilterChange('minPrice', min);
                      handleFilterChange('maxPrice', max);
                    }}
                    max={priceRange.max}
                    min={priceRange.min}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>{formatPrice(filters.minPrice)}</span>
                    <span>{formatPrice(filters.maxPrice)}</span>
                  </div>
                </div>
              </div>

              {/* Software gratuito */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free"
                  checked={filters.isFree}
                  onCheckedChange={(checked) => handleFilterChange('isFree', checked)}
                />
                <Label htmlFor="free" className="text-sm">
                  Solo software gratuito
                </Label>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1">
          {/* Resultados y ordenamiento */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {loading ? 'Cargando...' : `${pagination.total} productos encontrados`}
            </p>
          </div>

          {/* Grid/Lista de productos */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar los filtros o términos de búsqueda
                </p>
                <Button onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {product.isFree ? 'Gratis' : formatPrice(product.price)}
                        </div>
                        {product.version && (
                          <div className="text-sm text-muted-foreground">v{product.version}</div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                    
                    {product.compatibility && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Compatibilidad:</strong> {product.compatibility}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="h-4 w-4 fill-yellow-400 text-yellow-400" 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">(4.8)</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Link to={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Ver Detalles
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => handleAddToCart(product.id)}
                        className="flex-1"
                      >
                        {product.isFree ? 'Descargar' : 'Agregar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-8">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, pagination.currentPage - 2) + i;
                  if (pageNum > pagination.totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;

