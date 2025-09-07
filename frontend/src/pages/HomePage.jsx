import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Star, 
  Download, 
  Shield, 
  Zap,
  Package,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';
import { productService, formatPrice } from '../lib/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar productos destacados
        const productsResponse = await productService.getAll({ limit: 6 });
        setFeaturedProducts(productsResponse.data.data.products);

        // Cargar categorías
        const categoriesResponse = await productService.getCategories();
        setCategories(categoriesResponse.data.data.categories);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!isAuthenticated) {
      // Redirigir a login si no está autenticado
      window.location.href = '/login';
      return;
    }

    try {
      await addItem(productId, 1);
    } catch (error) {
      console.error('Error agregando al carrito:', error);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Software Verificado',
      description: 'Todos nuestros productos son verificados y libres de malware'
    },
    {
      icon: Zap,
      title: 'Descarga Instantánea',
      description: 'Acceso inmediato a tus compras después del pago'
    },
    {
      icon: Users,
      title: 'Soporte 24/7',
      description: 'Nuestro equipo está disponible para ayudarte cuando lo necesites'
    },
    {
      icon: Award,
      title: 'Garantía de Calidad',
      description: 'Garantía de devolución de dinero si no estás satisfecho'
    }
  ];

  const stats = [
    { icon: Package, value: '1000+', label: 'Productos' },
    { icon: Users, value: '50K+', label: 'Usuarios' },
    { icon: Download, value: '100K+', label: 'Descargas' },
    { icon: TrendingUp, value: '99%', label: 'Satisfacción' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              El mejor software para
              <span className="text-primary"> profesionales</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre una amplia selección de software profesional para productividad, 
              diseño, desarrollo y más. Herramientas de calidad para impulsar tu trabajo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="text-lg px-8">
                  Explorar Productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products?isFree=true">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Software Gratuito
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <stat.icon className="h-8 w-8 mx-auto text-primary" />
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Productos Destacados</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre los productos más populares y mejor valorados por nuestra comunidad
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
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
                      {product.isFree ? 'Descargar' : 'Agregar al Carrito'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Explora por Categorías</h2>
            <p className="text-muted-foreground">
              Encuentra el software perfecto para tus necesidades específicas
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link 
                key={category} 
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <Card className="text-center p-6 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="space-y-2">
                    <Package className="h-8 w-8 mx-auto text-primary group-hover:scale-110 transition-transform" />
                    <h3 className="font-semibold">{category}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">¿Por qué elegir CISNET?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia de compra de software con garantías y soporte completo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6 space-y-4">
                  <feature.icon className="h-12 w-12 mx-auto text-primary" />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl font-bold">¿Listo para comenzar?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Únete a miles de profesionales que confían en nosotros para sus herramientas de software
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Crear Cuenta Gratis
              </Button>
            </Link>
            <Link to="/products">
              <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

