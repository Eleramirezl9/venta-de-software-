"""
Test de Login - Selenium WebDriver
TC-002: Login de Usuario Válido
Autor: Eddy Alexander Ramirez Lorenzana
"""

import sys
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from base_test import BaseTest
from config import Config

class TestLogin(BaseTest):
    def __init__(self):
        super().__init__()
        self.test_results = {
            "test_name": "TC-002: Login de Usuario Válido",
            "status": "PENDING",
            "details": [],
            "screenshots": []
        }
    
    def run_test(self):
        """Ejecutar el test completo"""
        print("Iniciando TC-002: Login de Usuario Válido")
        print("="*50)
        
        try:
            # Setup
            if not self.setup_driver():
                self.test_results["status"] = "FAILED"
                self.test_results["details"].append("Error configurando WebDriver")
                return self.test_results
            
            # Ejecutar pasos del test
            success = self._execute_test_steps()
            
            if success:
                self.test_results["status"] = "PASSED"
                self.test_results["details"].append("✅ Todos los pasos completados exitosamente")
            else:
                self.test_results["status"] = "FAILED"
            
        except Exception as e:
            self.test_results["status"] = "ERROR"
            self.test_results["details"].append(f"❌ Error inesperado: {str(e)}")
            self.take_screenshot("error_login")
        
        finally:
            # Cleanup
            self.teardown_driver()
            
        # Mostrar resultados
        self._print_results()
        return self.test_results
    
    def _execute_test_steps(self):
        """Ejecutar los pasos específicos del test"""
        
        # Paso 1: Navegar a la página de login
        print("📝 Paso 1: Navegando a la página de login")
        if not self.navigate_to("/login"):
            self.test_results["details"].append("❌ Fallo navegando a /login")
            return False
        
        time.sleep(2)
        screenshot = self.take_screenshot("step1_login_page")
        if screenshot:
            self.test_results["screenshots"].append(screenshot)
        
        # Verificar que estamos en la página correcta
        if "/login" not in self.driver.current_url:
            self.test_results["details"].append("❌ No se cargó la página de login correctamente")
            return False
        
        self.test_results["details"].append("✅ Página de login cargada correctamente")
        
        # Paso 2: Ingresar email
        print("📝 Paso 2: Ingresando email")
        email_field = self.wait_for_element(By.CSS_SELECTOR, "input[type='email'], input[name='email']")
        if not email_field:
            self.test_results["details"].append("❌ Campo de email no encontrado")
            return False
        
        email_field.clear()
        email_field.send_keys(Config.TEST_USER["email"])
        self.test_results["details"].append(f"✅ Email ingresado: {Config.TEST_USER['email']}")
        
        # Paso 3: Ingresar contraseña
        print("📝 Paso 3: Ingresando contraseña")
        password_field = self.find_element_safe(By.CSS_SELECTOR, "input[type='password'], input[name='password']")
        if not password_field:
            self.test_results["details"].append("❌ Campo de contraseña no encontrado")
            return False
        
        password_field.clear()
        password_field.send_keys(Config.TEST_USER["password"])
        self.test_results["details"].append("✅ Contraseña ingresada")
        
        # Paso 4: Hacer clic en "Iniciar Sesión"
        print("📝 Paso 4: Haciendo clic en 'Iniciar Sesión'")
        submit_button = self.wait_for_clickable(By.CSS_SELECTOR, "button[type='submit'], .login-button, [data-testid='login-button']")
        if not submit_button:
            self.test_results["details"].append("❌ Botón de login no encontrado")
            return False
        
        submit_button.click()
        self.test_results["details"].append("✅ Botón de login clickeado")
        
        # Esperar redirección
        time.sleep(3)
        
        # Paso 5: Verificar redirección exitosa
        print("📝 Paso 5: Verificando redirección")
        current_url = self.driver.current_url
        
        # Debería redirigir a la página principal o dashboard
        if "/login" in current_url:
            self.test_results["details"].append("❌ No hubo redirección, permanece en login")
            self.take_screenshot("step5_still_in_login")
            return False
        
        self.test_results["details"].append(f"✅ Redirección exitosa a: {current_url}")
        
        # Paso 6: Verificar elementos de usuario autenticado
        print("📝 Paso 6: Verificando elementos de usuario autenticado")
        
        # Buscar menú de usuario o avatar
        user_indicators = [
            "button[data-testid='user-menu']",
            ".user-menu",
            ".avatar",
            "[aria-label*='usuario']",
            "button:contains('Usuario')",
            ".dropdown-toggle"
        ]
        
        user_element = None
        for selector in user_indicators:
            user_element = self.find_element_safe(By.CSS_SELECTOR, selector)
            if user_element:
                break
        
        if user_element:
            self.test_results["details"].append("✅ Indicador de usuario autenticado encontrado")
        else:
            # Alternativa: verificar que no aparece el botón de login
            login_button = self.find_element_safe(By.CSS_SELECTOR, "a[href='/login'], .login-link")
            if not login_button:
                self.test_results["details"].append("✅ Botón de login ya no visible (usuario autenticado)")
            else:
                self.test_results["details"].append("⚠️  No se encontraron indicadores claros de autenticación")
        
        # Screenshot final
        final_screenshot = self.take_screenshot("step6_authenticated_state")
        if final_screenshot:
            self.test_results["screenshots"].append(final_screenshot)
        
        print("✅ Test completado exitosamente")
        return True
    
    def _print_results(self):
        """Mostrar resultados del test"""
        print("\n" + "="*50)
        print("📊 RESULTADOS DEL TEST")
        print("="*50)
        print(f"Test: {self.test_results['test_name']}")
        print(f"Estado: {self.test_results['status']}")
        print("\n📝 Detalles:")
        for detail in self.test_results['details']:
            print(f"  {detail}")
        
        if self.test_results['screenshots']:
            print("\n📸 Screenshots capturadas:")
            for screenshot in self.test_results['screenshots']:
                print(f"  {screenshot}")
        
        print("="*50)

def main():
    """Función principal"""
    print("SELENIUM TEST - LOGIN FUNCTIONALITY")
    print(f"Sistema bajo prueba: {Config.BASE_URL}")
    print(f"Usuario de prueba: {Config.TEST_USER['email']}")
    print()
    
    # Ejecutar test
    test = TestLogin()
    results = test.run_test()
    
    # Return code para CI/CD
    return 0 if results["status"] == "PASSED" else 1

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)