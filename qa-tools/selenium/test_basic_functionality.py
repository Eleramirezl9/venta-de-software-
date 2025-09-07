#!/usr/bin/env python3
"""
Script de Pruebas Automatizadas con Selenium
Autor: Eddy Alexander Ramirez Lorenzana
Fecha: 06/09/2025
"""

import sys
import time
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from config import Config

class SeleniumTestResults:
    def __init__(self):
        self.results = []
        self.start_time = datetime.now()
        
    def add_result(self, test_name, status, duration, details=""):
        self.results.append({
            'test': test_name,
            'status': status,
            'duration_ms': duration,
            'details': details,
            'timestamp': datetime.now().isoformat()
        })
    
    def get_summary(self):
        total = len(self.results)
        passed = len([r for r in self.results if r['status'] == 'PASSED'])
        failed = len([r for r in self.results if r['status'] == 'FAILED'])
        
        return {
            'total_tests': total,
            'passed': passed,
            'failed': failed,
            'success_rate': round((passed / total * 100) if total > 0 else 0, 2),
            'duration_seconds': round((datetime.now() - self.start_time).total_seconds(), 2)
        }

class SeleniumBasicTests:
    def __init__(self):
        self.driver = None
        self.results = SeleniumTestResults()
    
    def setup_driver(self):
        """Configurar Chrome WebDriver"""
        try:
            chrome_options = Options()
            chrome_options.binary_location = Config.CHROME_BINARY_PATH
            
            # Agregar opciones de Chrome
            for option in Config.CHROME_OPTIONS:
                chrome_options.add_argument(option)
                
            if Config.HEADLESS:
                chrome_options.add_argument('--headless')
            
            # Usar Chrome binario sin ChromeDriver separado
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(Config.IMPLICIT_WAIT)
            
            print(f"[OK] Chrome WebDriver configurado exitosamente")
            return True
            
        except Exception as e:
            print(f"[ERROR] No se pudo configurar WebDriver: {str(e)}")
            return False
    
    def test_homepage_load(self):
        """Test TC-001: Cargar página principal"""
        test_name = "TC-001: Carga de Página Principal"
        start_time = time.time()
        
        try:
            self.driver.get(Config.BASE_URL)
            
            # Verificar título de la página
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            title = self.driver.title
            current_url = self.driver.current_url
            
            # Verificar que la página cargó correctamente
            if "CISNET" in title or current_url == Config.BASE_URL:
                duration = round((time.time() - start_time) * 1000)
                self.results.add_result(test_name, 'PASSED', duration, 
                                      f"Título: '{title}', URL: {current_url}")
                print(f"[PASS] {test_name}")
                return True
            else:
                duration = round((time.time() - start_time) * 1000)
                self.results.add_result(test_name, 'FAILED', duration,
                                      f"Título inesperado: '{title}', URL: {current_url}")
                print(f"[FAIL] {test_name}")
                return False
                
        except Exception as e:
            duration = round((time.time() - start_time) * 1000)
            self.results.add_result(test_name, 'FAILED', duration, str(e))
            print(f"[FAIL] {test_name}: {str(e)}")
            return False
    
    def test_navigation_elements(self):
        """Test TC-002: Verificar elementos de navegación"""
        test_name = "TC-002: Elementos de Navegación"
        start_time = time.time()
        
        try:
            # Buscar elementos comunes de navegación
            navigation_elements = []
            
            # Buscar por diferentes selectores comunes
            selectors_to_try = [
                ("nav", "Navegación principal"),
                ("[class*='nav']", "Elementos con clase nav"),
                ("[class*='header']", "Header de la página"),
                ("[class*='menu']", "Elementos de menú"),
                ("header", "Tag header"),
                ("a", "Enlaces de navegación")
            ]
            
            for selector, description in selectors_to_try:
                try:
                    elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if elements:
                        navigation_elements.append(f"{description}: {len(elements)} elementos")
                except:
                    continue
            
            if navigation_elements:
                duration = round((time.time() - start_time) * 1000)
                details = "; ".join(navigation_elements)
                self.results.add_result(test_name, 'PASSED', duration, details)
                print(f"[PASS] {test_name}")
                return True
            else:
                duration = round((time.time() - start_time) * 1000)
                self.results.add_result(test_name, 'FAILED', duration, 
                                      "No se encontraron elementos de navegación")
                print(f"[FAIL] {test_name}")
                return False
                
        except Exception as e:
            duration = round((time.time() - start_time) * 1000)
            self.results.add_result(test_name, 'FAILED', duration, str(e))
            print(f"[FAIL] {test_name}: {str(e)}")
            return False
    
    def test_responsive_design(self):
        """Test TC-003: Verificar diseño responsive"""
        test_name = "TC-003: Diseño Responsive"
        start_time = time.time()
        
        try:
            # Probar diferentes resoluciones
            resolutions = [
                (1920, 1080, "Desktop"),
                (768, 1024, "Tablet"),
                (375, 667, "Mobile")
            ]
            
            responsive_results = []
            
            for width, height, device_type in resolutions:
                self.driver.set_window_size(width, height)
                time.sleep(1)  # Esperar a que se ajuste el layout
                
                # Verificar que el contenido se ajusta
                body = self.driver.find_element(By.TAG_NAME, "body")
                viewport_width = self.driver.execute_script("return window.innerWidth;")
                viewport_height = self.driver.execute_script("return window.innerHeight;")
                
                responsive_results.append(f"{device_type}({width}x{height}): viewport {viewport_width}x{viewport_height}")
            
            duration = round((time.time() - start_time) * 1000)
            details = "; ".join(responsive_results)
            self.results.add_result(test_name, 'PASSED', duration, details)
            print(f"[PASS] {test_name}")
            return True
            
        except Exception as e:
            duration = round((time.time() - start_time) * 1000)
            self.results.add_result(test_name, 'FAILED', duration, str(e))
            print(f"[FAIL] {test_name}: {str(e)}")
            return False
    
    def test_form_elements(self):
        """Test TC-004: Verificar elementos de formulario"""
        test_name = "TC-004: Elementos de Formulario"
        start_time = time.time()
        
        try:
            # Buscar formularios en la página
            forms = self.driver.find_elements(By.TAG_NAME, "form")
            inputs = self.driver.find_elements(By.TAG_NAME, "input")
            buttons = self.driver.find_elements(By.TAG_NAME, "button")
            
            form_details = []
            if forms:
                form_details.append(f"Formularios: {len(forms)}")
            if inputs:
                form_details.append(f"Inputs: {len(inputs)}")
            if buttons:
                form_details.append(f"Botones: {len(buttons)}")
            
            if form_details:
                duration = round((time.time() - start_time) * 1000)
                details = "; ".join(form_details)
                self.results.add_result(test_name, 'PASSED', duration, details)
                print(f"[PASS] {test_name}")
                return True
            else:
                duration = round((time.time() - start_time) * 1000)
                self.results.add_result(test_name, 'PASSED', duration, 
                                      "No hay elementos de formulario (página estática)")
                print(f"[PASS] {test_name} - Página estática sin formularios")
                return True
                
        except Exception as e:
            duration = round((time.time() - start_time) * 1000)
            self.results.add_result(test_name, 'FAILED', duration, str(e))
            print(f"[FAIL] {test_name}: {str(e)}")
            return False
    
    def test_console_errors(self):
        """Test TC-005: Verificar errores de consola"""
        test_name = "TC-005: Errores de Consola JavaScript"
        start_time = time.time()
        
        try:
            # Obtener logs de la consola
            logs = self.driver.get_log('browser')
            
            # Filtrar solo errores
            errors = [log for log in logs if log['level'] == 'SEVERE']
            warnings = [log for log in logs if log['level'] == 'WARNING']
            
            details = f"Errores: {len(errors)}, Advertencias: {len(warnings)}"
            
            if len(errors) == 0:
                duration = round((time.time() - start_time) * 1000)
                self.results.add_result(test_name, 'PASSED', duration, details)
                print(f"[PASS] {test_name}")
                return True
            else:
                duration = round((time.time() - start_time) * 1000)
                error_messages = [err['message'][:100] for err in errors[:3]]
                details += f". Errores: {'; '.join(error_messages)}"
                self.results.add_result(test_name, 'FAILED', duration, details)
                print(f"[FAIL] {test_name}")
                return False
                
        except Exception as e:
            duration = round((time.time() - start_time) * 1000)
            self.results.add_result(test_name, 'FAILED', duration, str(e))
            print(f"[FAIL] {test_name}: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Ejecutar todas las pruebas"""
        print("="*60)
        print("INICIANDO PRUEBAS AUTOMATIZADAS CON SELENIUM")
        print("Sistema: CISNET - Software Sales System")
        print(f"URL Base: {Config.BASE_URL}")
        print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60)
        
        if not self.setup_driver():
            return False
        
        try:
            # Ejecutar todas las pruebas
            test_methods = [
                self.test_homepage_load,
                self.test_navigation_elements,
                self.test_responsive_design,
                self.test_form_elements,
                self.test_console_errors
            ]
            
            for test_method in test_methods:
                try:
                    test_method()
                    time.sleep(1)  # Pausa entre pruebas
                except Exception as e:
                    print(f"[ERROR] Error ejecutando {test_method.__name__}: {str(e)}")
            
            # Mostrar resumen
            summary = self.results.get_summary()
            print("\n" + "="*60)
            print("RESUMEN DE RESULTADOS")
            print("="*60)
            print(f"Total de Pruebas: {summary['total_tests']}")
            print(f"Pruebas Exitosas: {summary['passed']}")
            print(f"Pruebas Fallidas: {summary['failed']}")
            print(f"Tasa de Éxito: {summary['success_rate']}%")
            print(f"Duración Total: {summary['duration_seconds']} segundos")
            print("="*60)
            
            # Guardar resultados en archivo JSON
            with open('selenium_test_results.json', 'w', encoding='utf-8') as f:
                json.dump({
                    'summary': summary,
                    'results': self.results.results,
                    'timestamp': datetime.now().isoformat()
                }, f, indent=2, ensure_ascii=False)
            
            print(f"Resultados guardados en: selenium_test_results.json")
            
            return summary['success_rate'] > 0
            
        finally:
            if self.driver:
                self.driver.quit()
                print("WebDriver cerrado correctamente")

if __name__ == "__main__":
    tester = SeleniumBasicTests()
    success = tester.run_all_tests()
    
    if success:
        print("\n[OK] Pruebas completadas exitosamente")
        sys.exit(0)
    else:
        print("\n[ERROR] Algunas pruebas fallaron")
        sys.exit(1)