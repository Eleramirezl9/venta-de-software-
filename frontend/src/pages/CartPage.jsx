import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Package,
  ArrowLeft,
  CreditCard,
  Shield,
  Truck
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../lib/api';

const CartPage = () => {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [processingItem, setProcessingItem] = useState(null);

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Inicia sesión para ver tu carrito</h2>
            <p className="text-muted-foreground mb-4">
              Necesitas una cuenta para agregar productos al carrito
            </p>
            <div className="space-x-2">
              <Link to="/login">
                <Button>Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Crear Cuenta</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setProcessingItem(itemId);
    try {
      await updateItem(itemId, newQuantity);
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setProcessingItem(itemId);
    try {
      await removeItem(itemId);
    } catch (error) {
      console.error('Error eliminando item:', error);
    } finally {
      setProcessingItem(null);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        await clearCart();
      } catch (error) {
        console.error('Error vaciando carrito:', error);
      }
    }
  };

  const handleCheckout = () => {
    // Aquí iría la lógica de checkout
    alert('Funcionalidad de checkout en desarrollo');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Carrito de Compras</h1>
          <p className="text-muted-foreground mt-2">
            {cart.isEmpty ? 'Tu carrito está vacío' : `${cart.totalItems} producto${cart.totalItems > 1 ? 's' : ''} en tu carrito`}
          </p>
        </div>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Seguir Comprando
          </Button>
        </Link>
      </div>

      {cart.isEmpty ? (
        /* Carrito vacío */
        <Card>
          <CardContent className="pt-6 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">
              Descubre nuestro catálogo de software y encuentra las herramientas perfectas para ti
            </p>
            <div className="space-x-2">
              <Link to="/products">
                <Button size="lg">
                  <Package className="mr-2 h-5 w-5" />
                  Explorar Productos
                </Button>
              </Link>
              <Link to="/products?isFree=true">
                <Button variant="outline" size="lg">
                  Software Gratuito
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header de la lista */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Productos ({cart.items.length})</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearCart}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Vaciar Carrito
              </Button>
            </div>

            {/* Items del carrito */}
            {cart.items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Imagen del producto */}
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-primary" />
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Link 
                            to={`/products/${item.productId}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{item.product.category}</Badge>
                            {item.product.version && (
                              <Badge variant="outline">v{item.product.version}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.product.description}
                          </p>
                        </div>

                        {/* Precio */}
                        <div className="text-right ml-4">
                          <div className="font-semibold">
                            {item.product.isFree ? 'Gratis' : formatPrice(item.product.price)}
                          </div>
                          {!item.product.isFree && item.quantity > 1 && (
                            <div className="text-sm text-muted-foreground">
                              {formatPrice(item.product.price)} c/u
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Controles de cantidad y acciones */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Cantidad:</span>
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || processingItem === item.id}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= 99 || processingItem === item.id}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Subtotal */}
                          <div className="text-right">
                            <div className="font-semibold">
                              {item.product.isFree ? 'Gratis' : formatPrice(item.subtotal)}
                            </div>
                          </div>

                          {/* Botón eliminar */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={processingItem === item.id}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Productos ({cart.totalItems})</span>
                    <span>{formatPrice(cart.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis (Digital)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Impuestos</span>
                    <span>Incluidos</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(cart.total)}</span>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full" 
                  size="lg"
                  disabled={cart.total === 0}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceder al Pago
                </Button>

                {/* Información de seguridad */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Descarga inmediata</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cupón de descuento */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Código de Descuento</CardTitle>
                <CardDescription>
                  ¿Tienes un cupón? Ingrésalo aquí
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Código de cupón"
                    className="flex-1 px-3 py-2 border border-input rounded-md text-sm"
                  />
                  <Button variant="outline">Aplicar</Button>
                </div>
              </CardContent>
            </Card>

            {/* Garantías */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Garantía de devolución 30 días</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-blue-600" />
                    <span>Software verificado y seguro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                    <span>Pago seguro con SSL</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

