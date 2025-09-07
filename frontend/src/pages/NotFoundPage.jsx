import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, Package } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center space-y-6">
          {/* Icono y número 404 */}
          <div className="space-y-4">
            <Package className="h-20 w-20 text-muted-foreground mx-auto" />
            <h1 className="text-6xl font-bold text-primary">404</h1>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Página no encontrada</h2>
            <p className="text-muted-foreground">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Link to="/" className="w-full">
              <Button className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Volver al Inicio
              </Button>
            </Link>
            <Link to="/products" className="w-full">
              <Button variant="outline" className="w-full">
                <Search className="mr-2 h-4 w-4" />
                Explorar Productos
              </Button>
            </Link>
          </div>

          {/* Enlaces útiles */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Enlaces útiles:
            </p>
            <div className="space-y-1">
              <Link 
                to="/products" 
                className="block text-sm text-primary hover:underline"
              >
                Catálogo de Productos
              </Link>
              <Link 
                to="/contact" 
                className="block text-sm text-primary hover:underline"
              >
                Contacto
              </Link>
              <Link 
                to="/help" 
                className="block text-sm text-primary hover:underline"
              >
                Centro de Ayuda
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;

