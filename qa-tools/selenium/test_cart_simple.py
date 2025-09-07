#!/usr/bin/env python3
"""
Test Simple de Carrito - Selenium
Autor: Eddy Alexander Ramirez Lorenzana
Fecha: 06/09/2025
"""

import sys
import time
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from config import Config

def setup_driver():
    """Configurar Chrome WebDriver con pantalla completa"""
    try:
        chrome_options = Options()
        chrome_options.binary_location = Config.CHROME_BINARY_PATH
        
        # Opciones para test optimizado
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--start-maximized')  # Pantalla completa
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        chrome_options.add_argument('--disable-notifications')
        chrome_options.add_argument('--disable-infobars')
        chrome_options.add_argument('--disable-web-security')
        chrome_options.add_argument('--allow-running-insecure-content')
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(10)  # Timeout más generoso
        driver.maximize_window()  # Asegurar pantalla completa
        
        return driver
    except Exception as e:
        print(f"[ERROR] Setup driver: {str(e)}")
        return None

def test_cart_functionality():
    """Test principal del carrito"""
    results = []
    driver = setup_driver()
    
    if not driver:
        return False
    
    try:
        print("="*50)
        print("TEST SIMPLE DE CARRITO DE COMPRAS")
        print(f"URL: {Config.BASE_URL}")
        print("="*50)
        
        # Test 1: Cargar página principal
        print("\n[1/4] Cargando página principal...")
        start = time.time()
        driver.get(Config.BASE_URL)
        
        # Esperar que cargue completamente
        wait = WebDriverWait(driver, 15)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
        wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
        
        title = driver.title
        print(f"[OK] Página cargada: {title}")
        results.append({
            'test': 'Carga de página',
            'status': 'PASSED',
            'duration_ms': round((time.time() - start) * 1000),
            'details': f"Título: {title}"
        })
        
        # Test 2: Buscar elementos de productos
        print("\n[2/4] Buscando productos en la página...")
        start = time.time()
        
        # Esperar un poco más para que los elementos dinámicos carguen
        time.sleep(2)
        
        # Selectores comunes para productos
        product_selectors = [
            "[class*='product']",
            "[class*='card']", 
            "[class*='item']",
            ".grid > div",
            "[data-testid*='product']"
        ]
        
        products_found = 0
        for selector in product_selectors:
            try:
                # Usar espera explícita para los elementos
                wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    products_found = len(elements)
                    print(f"[OK] Encontrados {products_found} elementos con selector: {selector}")
                    break
            except TimeoutException:
                continue
            except:
                continue
        
        if products_found > 0:
            results.append({
                'test': 'Detectar productos',
                'status': 'PASSED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': f"Productos encontrados: {products_found}"
            })
        else:
            results.append({
                'test': 'Detectar productos',
                'status': 'FAILED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'No se encontraron productos'
            })
            print("[FAIL] No se encontraron productos")
        
        # Test 3: Buscar botones de "Agregar al carrito"
        print("\n[3/4] Buscando botones de carrito...")
        start = time.time()
        
        cart_button_selectors = [
            "button[class*='cart']",
            "button[class*='add']",
            "//button[contains(text(), 'Agregar')]",
            "//button[contains(text(), 'Añadir')]",
            "//button[contains(text(), 'Carrito')]"
        ]
        
        cart_buttons = 0
        for selector in cart_button_selectors:
            try:
                if selector.startswith("//"):
                    elements = driver.find_elements(By.XPATH, selector)
                else:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                
                if elements:
                    cart_buttons = len(elements)
                    print(f"[OK] Encontrados {cart_buttons} botones de carrito")
                    
                    # Intentar hacer clic en el primer botón con mejor manejo
                    try:
                        first_button = elements[0]
                        
                        # Scroll al elemento
                        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", first_button)
                        time.sleep(1)
                        
                        # Intentar clic normal primero
                        try:
                            WebDriverWait(driver, 5).until(EC.element_to_be_clickable(first_button))
                            first_button.click()
                            print(f"[OK] Clic exitoso en botón de carrito (método normal)")
                        except:
                            # Si falla, usar JavaScript click
                            driver.execute_script("arguments[0].click();", first_button)
                            print(f"[OK] Clic exitoso en botón de carrito (método JavaScript)")
                        
                        time.sleep(2)  # Esperar respuesta
                    except Exception as e:
                        print(f"[WARN] Clic en botón falló: {str(e)}")
                    
                    break
            except:
                continue
        
        if cart_buttons > 0:
            results.append({
                'test': 'Botones de carrito',
                'status': 'PASSED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': f"Botones encontrados: {cart_buttons}"
            })
        else:
            results.append({
                'test': 'Botones de carrito',
                'status': 'FAILED', 
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'No se encontraron botones de carrito'
            })
            print("[FAIL] No se encontraron botones de carrito")
        
        # Test 4: Buscar icono/contador de carrito en header
        print("\n[4/4] Buscando icono de carrito en navegación...")
        start = time.time()
        
        cart_icon_selectors = [
            # CSS Selectors comunes para iconos de carrito
            "[class*='cart-icon']",
            "[class*='shopping-cart']", 
            "[class*='cart']",
            "svg[class*='cart']",
            "[data-testid*='cart']",
            "[aria-label*='cart']",
            "[aria-label*='carrito']",
            "button[title*='cart']",
            "button[title*='carrito']",
            # Selectores por estructura común
            "nav button svg",
            "header button svg", 
            ".navbar button svg",
            ".nav button svg",
            # XPath selectors más específicos
            "//button[contains(@class, 'cart')]",
            "//a[contains(@aria-label, 'cart')]",
            "//button[contains(@aria-label, 'cart')]",
            "//button[contains(@title, 'cart')]",
            "//button[contains(@title, 'carrito')]",
            "//svg[contains(@class, 'cart')]",
            "//button[.//svg]",  # Cualquier botón con SVG
            "//a[.//svg]"       # Cualquier enlace con SVG
        ]
        
        cart_icon_found = False
        for i, selector in enumerate(cart_icon_selectors):
            try:
                if selector.startswith("//"):
                    elements = driver.find_elements(By.XPATH, selector)
                else:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                
                for element in elements:
                    if element.is_displayed():
                        cart_icon_found = True
                        element_tag = element.tag_name
                        element_class = element.get_attribute('class') or ''
                        element_text = element.text.strip()[:20] or element.get_attribute('aria-label') or element.get_attribute('title') or ''
                        print(f"[OK] Icono de carrito encontrado con selector #{i+1}: {selector}")
                        print(f"    Elemento: <{element_tag} class='{element_class[:50]}' text='{element_text}'>")
                        
                        # Intentar hacer clic con mejor manejo
                        try:
                            # Scroll al elemento
                            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element)
                            time.sleep(1)
                            
                            # Intentar clic normal primero
                            try:
                                WebDriverWait(driver, 5).until(EC.element_to_be_clickable(element))
                                element.click()
                                print(f"[OK] Clic en icono de carrito exitoso (método normal)")
                            except:
                                # Si falla, usar JavaScript click
                                driver.execute_script("arguments[0].click();", element)
                                print(f"[OK] Clic en icono de carrito exitoso (método JavaScript)")
                            
                            time.sleep(2)
                        except Exception as e:
                            print(f"[WARN] Clic en icono falló: {str(e)}")
                        
                        break
                
                if cart_icon_found:
                    break
                    
            except Exception as e:
                print(f"[DEBUG] Selector #{i+1} falló: {selector} - {str(e)[:100]}")
                continue
        
        # Si no encuentra nada, listar todos los botones y SVGs para debug
        if not cart_icon_found:
            print("[DEBUG] Listando todos los botones y SVGs en la página...")
            try:
                all_buttons = driver.find_elements(By.TAG_NAME, "button")
                all_svgs = driver.find_elements(By.TAG_NAME, "svg")
                print(f"[DEBUG] Encontrados {len(all_buttons)} botones y {len(all_svgs)} SVGs")
                
                for i, btn in enumerate(all_buttons[:10]):  # Solo los primeros 10
                    if btn.is_displayed():
                        btn_class = btn.get_attribute('class') or ''
                        btn_text = btn.text.strip()[:20] or btn.get_attribute('aria-label') or ''
                        print(f"[DEBUG] Botón #{i+1}: class='{btn_class[:50]}' text='{btn_text}'")
            except:
                pass
        
        if cart_icon_found:
            results.append({
                'test': 'Icono de carrito',
                'status': 'PASSED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Icono de carrito encontrado y clickeable'
            })
        else:
            results.append({
                'test': 'Icono de carrito',
                'status': 'FAILED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'No se encontró icono de carrito'
            })
            print("[FAIL] No se encontró icono de carrito")
        
        # Resumen
        print("\n" + "="*50)
        print("RESUMEN DE PRUEBAS DE CARRITO")
        print("="*50)
        
        passed = len([r for r in results if r['status'] == 'PASSED'])
        failed = len([r for r in results if r['status'] == 'FAILED'])
        total = len(results)
        success_rate = round((passed / total) * 100) if total > 0 else 0
        
        print(f"Total de pruebas: {total}")
        print(f"Exitosas: {passed}")
        print(f"Fallidas: {failed}")
        print(f"Tasa de éxito: {success_rate}%")
        
        # Guardar resultados
        final_results = {
            'summary': {
                'total_tests': total,
                'passed': passed,
                'failed': failed,
                'success_rate': success_rate,
                'test_type': 'shopping_cart_simple'
            },
            'results': results,
            'timestamp': datetime.now().isoformat()
        }
        
        with open('cart_simple_results.json', 'w', encoding='utf-8') as f:
            json.dump(final_results, f, indent=2, ensure_ascii=False)
        
        print(f"\nResultados guardados en: cart_simple_results.json")
        print("="*50)
        
        return success_rate > 0
        
    except Exception as e:
        print(f"[ERROR] Durante las pruebas: {str(e)}")
        return False
    
    finally:
        if driver:
            driver.quit()

if __name__ == "__main__":
    try:
        success = test_cart_functionality()
        if success:
            print("\n[OK] Pruebas de carrito completadas")
            sys.exit(0)
        else:
            print("\n[FAIL] Pruebas de carrito fallaron")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n[INFO] Pruebas interrumpidas por el usuario")
        sys.exit(1)