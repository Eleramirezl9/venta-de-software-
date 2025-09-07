import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import CisnetIcon from '../ui/CisnetIcon';

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <CisnetIcon simple className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary">CISNET</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Tu tienda de confianza para software profesional. 
              Encuentra las mejores herramientas para tu trabajo y creatividad.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Todos los Productos
                </Link>
              </li>
              <li>
                <Link to="/products?category=Productividad" className="text-muted-foreground hover:text-primary transition-colors">
                  Productividad
                </Link>
              </li>
              <li>
                <Link to="/products?category=Diseño" className="text-muted-foreground hover:text-primary transition-colors">
                  Diseño
                </Link>
              </li>
              <li>
                <Link to="/products?category=Desarrollo" className="text-muted-foreground hover:text-primary transition-colors">
                  Desarrollo
                </Link>
              </li>
              <li>
                <Link to="/products?isFree=true" className="text-muted-foreground hover:text-primary transition-colors">
                  Software Gratuito
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@softwaresales.com</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Ciudad de Guatemala, Guatemala</span>
              </li>
            </ul>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                Horario de atención:<br />
                Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                Sábados: 10:00 AM - 2:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-muted-foreground">
              © 2024 CISNET. Todos los derechos reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Desarrollado por Eddy Alexander Ramirez Lorenzana - Proyecto de QA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

