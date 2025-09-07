import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Download, 
  ShoppingCart, 
  ArrowLeft,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  Package,
  Shield,
  Award,
  Users
} from 'lucide-react';
import { productService, formatPrice } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { addItem, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getById(id);
      setProduct(response.data.data.product);
    } catch (error) {
      console.error('Error cargando producto:', error);
      setError('Producto no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    try {
      setAddingToCart(true);
      const result = await addItem(product.id, 1);
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error agregando al carrito:', error);
      setError('Error al agregar el producto al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  const getCompatibilityIcons = (compatibility) => {
    const icons = [];
    if (compatibility?.includes('Windows')) icons.push({ icon: Monitor, label: 'Windows' });
    if (compatibility?.includes('macOS')) icons.push({ icon: Monitor, label: 'macOS' });
    if (compatibility?.includes('Linux')) icons.push({ icon: Monitor, label: 'Linux' });
    if (compatibility?.includes('Android')) icons.push({ icon: Smartphone, label: 'Android' });
    if (compatibility?.includes('iOS')) icons.push({ icon: Tablet, label: 'iOS' });
    return icons;
  };

  const features = [
    {
      icon: Shield,
      title: 'Software Verificado',
      description: 'Garantizado libre de malware y virus'
    },
    {
      icon: Download,
      title: 'Descarga Inmediata',
      description: 'Acceso instantáneo después de la compra'
    },
    {
      icon: Award,
      title: 'Garantía de Calidad',
      description: 'Devolución de dinero si no estás satisfecho'
    },
    {
      icon: Users,
      title: 'Soporte Técnico',
      description: 'Ayuda profesional cuando la necesites'
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Producto no encontrado</h2>
            <p className="text-muted-foreground mb-4">
              El producto que buscas no existe o ha sido eliminado.
            </p>
            <div className="space-x-2">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
              <Link to="/products">
                <Button>Ver Todos los Productos</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const compatibilityIcons = getCompatibilityIcons(product.compatibility);
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-primary">Inicio</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary">Productos</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagen del producto */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-8">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                <Package className="h-24 w-24 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          {/* Características destacadas */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-4 text-center">
                  <feature.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  {product.version && (
                    <Badge variant="outline">v{product.version}</Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">
                  {product.isFree ? 'Gratis' : formatPrice(product.price)}
                </div>
                {!product.isFree && (
                  <p className="text-sm text-muted-foreground">Licencia única</p>
                )}
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="h-5 w-5 fill-yellow-400 text-yellow-400" 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8) • 1,234 reseñas</span>
            </div>
          </div>

          <Separator />

          {/* Descripción */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Compatibilidad */}
          {product.compatibility && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Compatibilidad</h3>
              <div className="flex items-center space-x-4">
                {compatibilityIcons.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Especificaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Especificaciones</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Categoría:</span>
                <span className="ml-2 text-muted-foreground">{product.category}</span>
              </div>
              {product.version && (
                <div>
                  <span className="font-medium">Versión:</span>
                  <span className="ml-2 text-muted-foreground">{product.version}</span>
                </div>
              )}
              <div>
                <span className="font-medium">Tipo:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.isFree ? 'Software Gratuito' : 'Software Premium'}
                </span>
              </div>
              <div>
                <span className="font-medium">Licencia:</span>
                <span className="ml-2 text-muted-foreground">
                  {product.isFree ? 'Gratuita' : 'Comercial'}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Acciones */}
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {inCart && (
              <Alert>
                <Check className="h-4 w-4" />
                <AlertDescription>
                  Este producto ya está en tu carrito ({cartQuantity} unidad{cartQuantity > 1 ? 'es' : ''})
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1"
                size="lg"
              >
                {addingToCart ? (
                  'Agregando...'
                ) : product.isFree ? (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Descargar Gratis
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {inCart ? 'Agregar Más' : 'Agregar al Carrito'}
                  </>
                )}
              </Button>
              
              {!product.isFree && (
                <Button variant="outline" size="lg">
                  Comprar Ahora
                </Button>
              )}
            </div>

            {/* Información adicional */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ Descarga inmediata después de la compra</p>
              <p>✓ Soporte técnico incluido</p>
              <p>✓ Actualizaciones gratuitas por 1 año</p>
              {!product.isFree && <p>✓ Garantía de devolución de 30 días</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Productos Relacionados</h2>
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4" />
          <p>Los productos relacionados se mostrarán aquí</p>
          <Link to="/products" className="inline-block mt-4">
            <Button variant="outline">Ver Todos los Productos</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

