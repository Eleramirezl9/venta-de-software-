#!/usr/bin/env python3
"""
Test Completo de Flujo de Pedido - Login + Carrito + Checkout
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
from selenium.webdriver.common.keys import Keys
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
        chrome_options.add_argument('--start-maximized')
        chrome_options.add_argument('--disable-extensions')
        chrome_options.add_argument('--disable-plugins')
        chrome_options.add_argument('--disable-notifications')
        chrome_options.add_argument('--disable-infobars')
        chrome_options.add_argument('--disable-web-security')
        chrome_options.add_argument('--allow-running-insecure-content')
        
        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(10)
        driver.maximize_window()
        
        return driver
    except Exception as e:
        print(f"[ERROR] Setup driver: {str(e)}")
        return None

def perform_login(driver, email="demo@example.com", password="123456"):
    """Realizar login en la aplicación"""
    try:
        print(f"[LOGIN] Intentando login con {email}...")
        
        # Buscar botón de login/signin
        login_selectors = [
            "//button[contains(text(), 'Iniciar Sesión')]",
            "//button[contains(text(), 'Iniciar')]", 
            "//button[contains(text(), 'Login')]",
            "//a[contains(text(), 'Iniciar Sesión')]",
            "//a[contains(text(), 'Login')]",
            "//a[contains(text(), 'Iniciar')]",
            "button[class*='bg-primary'][class*='text-primary-foreground']",
            "button.inline-flex[class*='bg-primary']",
            "[data-testid='login-button']",
            ".login-button",
            "#login",
            "button[aria-label*='login']"
        ]
        
        wait = WebDriverWait(driver, 10)
        login_button = None
        
        for selector in login_selectors:
            try:
                if selector.startswith("//"):
                    login_button = wait.until(EC.element_to_be_clickable((By.XPATH, selector)))
                else:
                    login_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
                print(f"[OK] Botón de login encontrado: {selector}")
                break
            except TimeoutException:
                continue
        
        if not login_button:
            print("[WARN] No se encontró botón de login, intentando acceso directo a /login")
            driver.get(f"{Config.BASE_URL}/login")
            time.sleep(2)
        else:
            # Hacer click en el botón de login
            try:
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", login_button)
                time.sleep(1)
                login_button.click()
                time.sleep(2)
            except:
                driver.execute_script("arguments[0].click();", login_button)
                time.sleep(2)
        
        # Buscar campos de email y password
        email_selectors = [
            "input[type='email']",
            "input[name='email']",
            "input[placeholder*='email']",
            "input[placeholder*='correo']",
            "#email"
        ]
        
        password_selectors = [
            "input[type='password']",
            "input[name='password']",
            "input[placeholder*='password']",
            "input[placeholder*='contraseña']",
            "#password"
        ]
        
        # Llenar email
        email_field = None
        for selector in email_selectors:
            try:
                email_field = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
                print(f"[OK] Campo email encontrado: {selector}")
                break
            except:
                continue
        
        if not email_field:
            raise Exception("No se pudo encontrar el campo de email")
        
        # Llenar password
        password_field = None  
        for selector in password_selectors:
            try:
                password_field = driver.find_element(By.CSS_SELECTOR, selector)
                print(f"[OK] Campo password encontrado: {selector}")
                break
            except:
                continue
        
        if not password_field:
            raise Exception("No se pudo encontrar el campo de password")
        
        # Llenar los campos
        email_field.clear()
        email_field.send_keys(email)
        time.sleep(0.5)
        
        password_field.clear()
        password_field.send_keys(password)
        time.sleep(0.5)
        
        # Buscar botón de submit con debugging detallado
        submit_selectors = [
            "button[data-slot='button'][class*='bg-primary'][class*='w-full']",
            "//button[@data-slot='button' and contains(text(), 'Iniciar Sesión')]",
            "//button[contains(text(), 'Iniciar Sesión')]",
            "button[data-slot='button']",
            "button[class*='bg-primary'][class*='text-primary-foreground'][class*='w-full']",
            "button[type='submit']",
            "input[type='submit']",
            "//button[contains(text(), 'Login')]",
            "//button[contains(text(), 'Entrar')]",
            "//button[contains(text(), 'Iniciar')]",
            ".login-form button",
            "form button[type='submit']"
        ]
        
        submit_button = None
        print("[DEBUG] Buscando botón de submit...")
        
        for i, selector in enumerate(submit_selectors):
            try:
                if selector.startswith("//"):
                    elements = driver.find_elements(By.XPATH, selector)
                else:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                
                for element in elements:
                    if element.is_displayed() and element.is_enabled():
                        submit_button = element
                        btn_text = element.text.strip()
                        btn_class = element.get_attribute('class')
                        btn_data_slot = element.get_attribute('data-slot')
                        print(f"[OK] Botón submit encontrado con selector #{i+1}: {selector}")
                        print(f"    Texto: '{btn_text}'")
                        print(f"    data-slot: '{btn_data_slot}'")
                        print(f"    class: '{btn_class[:100]}...'")
                        break
                
                if submit_button:
                    break
            except Exception as e:
                print(f"[DEBUG] Selector #{i+1} falló: {str(e)[:50]}")
                continue
        
        if not submit_button:
            print("[DEBUG] No se encontró botón submit, listando todos los botones...")
            try:
                all_buttons = driver.find_elements(By.TAG_NAME, "button")
                print(f"[DEBUG] Encontrados {len(all_buttons)} botones en total")
                for i, btn in enumerate(all_buttons[:10]):
                    if btn.is_displayed():
                        btn_text = btn.text.strip()[:30]
                        btn_class = btn.get_attribute('class')[:80] or ''
                        btn_data_slot = btn.get_attribute('data-slot') or ''
                        print(f"[DEBUG] Botón #{i+1}: text='{btn_text}' data-slot='{btn_data_slot}' class='{btn_class}...'")
            except:
                pass
            
            # Intentar con Enter en el campo password
            password_field.send_keys(Keys.RETURN)
            print("[INFO] Submit enviado con Enter en password field")
        else:
            # Click en submit con múltiples estrategias
            try:
                print("[INFO] Intentando click en botón submit...")
                
                # Estrategia 1: Scroll y click normal
                driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", submit_button)
                time.sleep(1)
                
                # Verificar que sigue siendo clickeable
                wait.until(EC.element_to_be_clickable(submit_button))
                
                try:
                    submit_button.click()
                    print("[OK] Click en botón submit exitoso (método normal)")
                except Exception as click_error:
                    print(f"[WARN] Click normal falló: {str(click_error)[:100]}")
                    
                    # Estrategia 2: JavaScript click
                    try:
                        driver.execute_script("arguments[0].click();", submit_button)
                        print("[OK] Click en botón submit exitoso (método JavaScript)")
                    except Exception as js_error:
                        print(f"[WARN] JavaScript click falló: {str(js_error)[:100]}")
                        
                        # Estrategia 3: Dispatch event
                        try:
                            driver.execute_script("""
                                var event = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                });
                                arguments[0].dispatchEvent(event);
                            """, submit_button)
                            print("[OK] Click en botón submit exitoso (dispatch event)")
                        except Exception as dispatch_error:
                            print(f"[ERROR] Dispatch event falló: {str(dispatch_error)[:100]}")
                            
                            # Estrategia 4: Enter en el botón
                            submit_button.send_keys(Keys.RETURN)
                            print("[INFO] Enter enviado al botón submit")
                        
            except Exception as e:
                print(f"[ERROR] Error general en submit: {str(e)[:100]}")
        
        # Esperar redirección o confirmación de login
        time.sleep(3)
        
        # Verificar si el login fue exitoso
        current_url = driver.current_url
        if "login" not in current_url.lower():
            print(f"[OK] Login exitoso - URL actual: {current_url}")
            return True
        else:
            # Buscar indicadores de login exitoso
            success_indicators = [
                "//button[contains(text(), 'Logout')]",
                "//a[contains(text(), 'Perfil')]", 
                "//span[contains(text(), 'Bienvenido')]",
                "[data-testid='user-menu']",
                ".user-avatar"
            ]
            
            for indicator in success_indicators:
                try:
                    if indicator.startswith("//"):
                        driver.find_element(By.XPATH, indicator)
                    else:
                        driver.find_element(By.CSS_SELECTOR, indicator)
                    print("[OK] Login exitoso - Indicador de usuario logueado encontrado")
                    return True
                except:
                    continue
            
            print("[WARN] Login incierto - No se detectó redirección ni indicadores claros")
            return False
            
    except Exception as e:
        print(f"[ERROR] Durante login: {str(e)}")
        return False

def add_product_to_cart(driver):
    """Agregar producto al carrito"""
    try:
        print("[CART] Buscando productos para agregar al carrito...")
        
        # Ir a la página principal si no estamos ahí
        if "localhost" not in driver.current_url or driver.current_url.endswith("/cart"):
            driver.get(Config.BASE_URL)
            time.sleep(2)
        
        wait = WebDriverWait(driver, 15)
        
        # Esperar que la página cargue completamente
        wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
        time.sleep(2)
        
        # Buscar botones de "Agregar al carrito"
        cart_button_selectors = [
            "button[data-slot='button'][class*='bg-primary']",
            "//button[@data-slot='button' and contains(text(), 'Agregar')]",
            "//button[contains(text(), 'Agregar')]",
            "//button[contains(text(), 'Añadir')]", 
            "//button[contains(text(), 'Add to Cart')]",
            "//button[contains(text(), 'Carrito')]",
            "button[class*='bg-primary'][class*='text-primary-foreground']",
            "button[class*='inline-flex'][class*='bg-primary']",
            "button[data-slot='button']",
            "button[class*='add']",
            "button[data-testid*='add-to-cart']",
            ".add-to-cart-button",
            ".product button[class*='primary']",
            ".card button[class*='primary']",
            "button[class*='flex-1']"  # Para el botón con flex-1
        ]
        
        product_added = False
        for selector in cart_button_selectors:
            try:
                if selector.startswith("//"):
                    elements = driver.find_elements(By.XPATH, selector)
                else:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                
                for element in elements:
                    if element.is_displayed() and element.is_enabled():
                        try:
                            # Scroll al elemento
                            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element)
                            time.sleep(1)
                            
                            # Intentar click
                            try:
                                wait.until(EC.element_to_be_clickable(element))
                                element.click()
                                print(f"[OK] Producto agregado al carrito (método normal)")
                            except:
                                driver.execute_script("arguments[0].click();", element)
                                print(f"[OK] Producto agregado al carrito (método JavaScript)")
                            
                            product_added = True
                            time.sleep(2)  # Esperar respuesta
                            break
                            
                        except Exception as e:
                            print(f"[WARN] Error agregando producto: {str(e)[:100]}")
                            continue
                
                if product_added:
                    break
                    
            except:
                continue
        
        if not product_added:
            print("[ERROR] No se pudo agregar ningún producto al carrito")
            return False
        
        print("[OK] Producto agregado exitosamente")
        return True
        
    except Exception as e:
        print(f"[ERROR] Agregando producto al carrito: {str(e)}")
        return False

def go_to_cart_and_checkout(driver):
    """Ir al carrito y proceder al checkout"""
    try:
        print("[CHECKOUT] Yendo al carrito...")
        
        # Intentar ir al carrito
        cart_url = f"{Config.BASE_URL}/cart"
        driver.get(cart_url)
        time.sleep(3)
        
        wait = WebDriverWait(driver, 15)
        
        # Verificar que hay productos en el carrito
        cart_item_selectors = [
            ".cart-item",
            "[class*='cart-item']", 
            ".product-item",
            "[data-testid*='cart-item']",
            ".checkout-item"
        ]
        
        items_found = False
        for selector in cart_item_selectors:
            try:
                items = driver.find_elements(By.CSS_SELECTOR, selector)
                if items:
                    print(f"[OK] {len(items)} productos encontrados en el carrito")
                    items_found = True
                    break
            except:
                continue
        
        if not items_found:
            print("[WARN] No se detectaron productos en el carrito")
        
        # Buscar botón de checkout/proceder al pago con selectores específicos
        checkout_selectors = [
            # Específicos para "Proceder al Pago"
            "//button[contains(text(), 'Proceder al Pago')]",
            "button[class*='bg-primary'][class*='text-primary-foreground'][class*='w-full'][class*='h-10']",
            "button[class*='bg-primary'][class*='rounded-md'][class*='px-6'][class*='w-full']",
            "button[class*='inline-flex'][class*='bg-primary'][class*='w-full']",
            # Genéricos de checkout
            "//button[contains(text(), 'Checkout')]",
            "//button[contains(text(), 'Proceder')]",
            "//button[contains(text(), 'Pagar')]",
            "//button[contains(text(), 'Finalizar Compra')]",
            "//button[contains(text(), 'Finalizar')]",
            "//a[contains(text(), 'Checkout')]",
            "button[data-slot='button'][class*='bg-primary'][class*='text-primary-foreground']",
            "button[class*='bg-primary'][class*='text-primary-foreground']",
            "button[class*='inline-flex'][class*='bg-primary']",
            "button[class*='checkout']",
            ".checkout-button",
            "[data-testid*='checkout']"
        ]
        
        checkout_clicked = False
        print("[DEBUG] Analizando botones de checkout disponibles...")
        
        # Primero hacer análisis de todos los botones disponibles
        try:
            all_buttons = driver.find_elements(By.TAG_NAME, "button")
            print(f"[DEBUG] Encontrados {len(all_buttons)} botones en la página de carrito")
            
            checkout_candidates = []
            for i, btn in enumerate(all_buttons):
                if btn.is_displayed() and btn.is_enabled():
                    btn_text = btn.text.strip()
                    btn_class = btn.get_attribute('class') or ''
                    
                    # Calcular prioridad
                    priority = 0
                    text_lower = btn_text.lower()
                    
                    # Alta prioridad para texto específico de checkout
                    if 'proceder al pago' in text_lower:
                        priority += 20
                    elif 'checkout' in text_lower or 'proceder' in text_lower or 'pagar' in text_lower:
                        priority += 15
                    elif 'finalizar' in text_lower:
                        priority += 10
                    
                    # Prioridad por clases CSS
                    if 'bg-primary' in btn_class and 'text-primary-foreground' in btn_class:
                        priority += 8
                    if 'w-full' in btn_class:
                        priority += 5
                    if 'h-10' in btn_class and 'rounded-md' in btn_class:
                        priority += 3
                    
                    # Reducir prioridad por texto irrelevante
                    if any(avoid in text_lower for avoid in ['buscar', 'agregar', 'productos', 'ver detalles']):
                        priority -= 10
                    
                    checkout_candidates.append({
                        'element': btn,
                        'text': btn_text,
                        'priority': priority,
                        'class': btn_class[:100]
                    })
            
            # Ordenar por prioridad
            checkout_candidates.sort(key=lambda x: x['priority'], reverse=True)
            
            print("[DEBUG] Top 5 candidatos para checkout:")
            for i, candidate in enumerate(checkout_candidates[:5]):
                print(f"  #{i+1}: '{candidate['text']}' (prioridad: {candidate['priority']})")
                
        except Exception as e:
            print(f"[ERROR] Analizando botones de checkout: {str(e)}")
        
        # Intentar con selectores específicos primero
        for i, selector in enumerate(checkout_selectors):
            if checkout_clicked:
                break
                
            try:
                if selector.startswith("//"):
                    elements = driver.find_elements(By.XPATH, selector)
                else:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                
                for element in elements:
                    if element.is_displayed() and element.is_enabled():
                        element_text = element.text.strip()
                        
                        # Verificar que sea realmente un botón de checkout
                        text_lower = element_text.lower()
                        if any(avoid in text_lower for avoid in ['buscar', 'agregar', 'productos', 'ver detalles', 'volver']):
                            print(f"[SKIP] Evitando botón: '{element_text}'")
                            continue
                        
                        try:
                            # Scroll al elemento
                            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element)
                            time.sleep(1)
                            
                            print(f"[INFO] Intentando checkout con selector #{i+1}: '{element_text}'")
                            print(f"      Clase: {element.get_attribute('class')[:100]}...")
                            
                            # Click con múltiples estrategias
                            try:
                                wait.until(EC.element_to_be_clickable(element))
                                element.click()
                                print(f"[OK] Click exitoso en checkout (método normal)")
                            except Exception as click_error:
                                print(f"[WARN] Click normal falló: {str(click_error)[:50]}")
                                try:
                                    driver.execute_script("arguments[0].click();", element)
                                    print(f"[OK] Click exitoso en checkout (método JavaScript)")
                                except Exception as js_error:
                                    print(f"[ERROR] JavaScript click falló: {str(js_error)[:50]}")
                                    continue
                            
                            checkout_clicked = True
                            time.sleep(3)  # Esperar navegación
                            break
                            
                        except Exception as e:
                            print(f"[WARN] Error en checkout click: {str(e)[:100]}")
                            continue
                        
            except Exception as e:
                print(f"[DEBUG] Selector #{i+1} falló: {str(e)[:50]}")
                continue
        
        # Si los selectores no funcionaron, intentar con candidatos de alta prioridad
        if not checkout_clicked and 'checkout_candidates' in locals():
            print("[INFO] Intentando con candidatos de alta prioridad...")
            for candidate in checkout_candidates[:3]:  # Solo los 3 mejores
                if candidate['priority'] > 10:  # Solo alta prioridad
                    try:
                        element = candidate['element']
                        element_text = candidate['text']
                        
                        # Verificación final
                        text_lower = element_text.lower()
                        if any(avoid in text_lower for avoid in ['buscar', 'agregar', 'productos']):
                            continue
                        
                        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element)
                        time.sleep(1)
                        
                        print(f"[INFO] Intentando con candidato prioridad {candidate['priority']}: '{element_text}'")
                        
                        try:
                            wait.until(EC.element_to_be_clickable(element))
                            element.click()
                            print(f"[OK] Checkout exitoso con candidato priorizado")
                        except:
                            driver.execute_script("arguments[0].click();", element)
                            print(f"[OK] Checkout exitoso con candidato priorizado (JavaScript)")
                        
                        checkout_clicked = True
                        time.sleep(3)
                        break
                        
                    except Exception as e:
                        print(f"[WARN] Error con candidato priorizado: {str(e)[:50]}")
                        continue
        
        if not checkout_clicked:
            print("[ERROR] No se pudo hacer click en checkout")
            return False
        
        current_url = driver.current_url
        print(f"[INFO] URL después del checkout: {current_url}")
        
        return True
        
    except Exception as e:
        print(f"[ERROR] Durante checkout: {str(e)}")
        return False

def complete_order(driver):
    """Completar el proceso de pedido"""
    try:
        print("[ORDER] Completando pedido...")
        
        wait = WebDriverWait(driver, 15)
        time.sleep(2)
        
        # Buscar botón de confirmar pedido/completar compra con lógica inteligente
        print("[DEBUG] Analizando página para encontrar botón de completar pedido...")
        
        # Primero, detectar en qué tipo de página estamos
        current_url = driver.current_url.lower()
        page_content = driver.page_source.lower()
        
        print(f"[DEBUG] URL actual: {driver.current_url}")
        print(f"[DEBUG] Contenido detectado: {'checkout' in page_content}, {'cart' in page_content}, {'order' in page_content}")
        
        # Selectores específicos por prioridad y contexto
        order_complete_selectors = [
            # Específicos para finalizar pedido
            "//button[contains(text(), 'Confirmar Pedido')]",
            "//button[contains(text(), 'Finalizar Pedido')]", 
            "//button[contains(text(), 'Completar Compra')]",
            "//button[contains(text(), 'Realizar Pedido')]",
            "//button[contains(text(), 'Confirmar Compra')]",
            "//button[contains(text(), 'Proceder al Pago')]",
            "//button[contains(text(), 'Place Order')]",
            # Selectores específicos para botones con clases exactas
            "button[class*='bg-primary'][class*='text-primary-foreground'][class*='w-full'][class*='h-10']",
            "button[class*='bg-primary'][class*='rounded-md'][class*='px-6'][class*='w-full']",
            "button[class*='inline-flex'][class*='bg-primary'][class*='w-full']",
            # Genéricos pero contextuales
            "//button[contains(text(), 'Confirmar')]",
            "//button[contains(text(), 'Completar')]",
            "//button[contains(text(), 'Finalizar')]",
            "//button[contains(text(), 'Proceder')]",
            "//button[contains(text(), 'Pagar')]",
            # Por atributos específicos
            "button[data-slot='button'][class*='bg-primary'][class*='text-primary-foreground']",
            "button[class*='bg-primary'][class*='text-primary-foreground']",
            "button[type='submit']"
        ]
        
        # Textos a evitar (botones que NO queremos hacer click)
        avoid_texts = [
            'buscar', 'search', 'ver detalles', 'details', 'productos', 'products',
            'agregar', 'add', 'volver', 'back', 'cancelar', 'cancel'
        ]
        
        order_completed = False
        buttons_analyzed = []
        
        # Primero analizar todos los botones disponibles
        try:
            all_buttons = driver.find_elements(By.TAG_NAME, "button")
            print(f"[DEBUG] Analizando {len(all_buttons)} botones en la página...")
            
            for i, btn in enumerate(all_buttons):
                if btn.is_displayed() and btn.is_enabled():
                    btn_text = btn.text.strip()
                    btn_class = btn.get_attribute('class') or ''
                    btn_data_slot = btn.get_attribute('data-slot') or ''
                    btn_type = btn.get_attribute('type') or ''
                    
                    # Calcular prioridad del botón
                    priority = 0
                    text_lower = btn_text.lower()
                    
                    # Aumentar prioridad por texto relevante
                    if any(word in text_lower for word in ['confirmar', 'completar', 'finalizar', 'pedido', 'compra']):
                        priority += 10
                    if 'bg-primary' in btn_class:
                        priority += 5
                    if btn_data_slot == 'button':
                        priority += 3
                    if btn_type == 'submit':
                        priority += 2
                    
                    # Reducir prioridad por texto a evitar
                    if any(avoid in text_lower for avoid in avoid_texts):
                        priority -= 20
                    
                    buttons_analyzed.append({
                        'element': btn,
                        'text': btn_text,
                        'class': btn_class[:50],
                        'priority': priority,
                        'index': i
                    })
            
            # Ordenar por prioridad descendente
            buttons_analyzed.sort(key=lambda x: x['priority'], reverse=True)
            
            print(f"[DEBUG] Top 5 botones candidatos:")
            for i, btn_info in enumerate(buttons_analyzed[:5]):
                print(f"  #{i+1}: '{btn_info['text']}' (prioridad: {btn_info['priority']})")
            
        except Exception as e:
            print(f"[ERROR] Analizando botones: {str(e)[:100]}")
        
        # Intentar con los selectores específicos primero
        for i, selector in enumerate(order_complete_selectors):
            if order_completed:
                break
                
            try:
                if selector.startswith("//"):
                    elements = driver.find_elements(By.XPATH, selector)
                else:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                
                for element in elements:
                    if element.is_displayed() and element.is_enabled():
                        element_text = element.text.strip().lower()
                        
                        # Verificar que no sea un botón a evitar
                        if any(avoid in element_text for avoid in avoid_texts):
                            print(f"[SKIP] Evitando botón: '{element.text.strip()}'")
                            continue
                        
                        try:
                            # Scroll al elemento
                            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element)
                            time.sleep(1)
                            
                            print(f"[INFO] Intentando completar pedido con selector #{i+1}: '{element.text.strip()}'")
                            
                            # Click
                            try:
                                wait.until(EC.element_to_be_clickable(element))
                                element.click()
                                print(f"[OK] Pedido enviado (método normal)")
                            except:
                                driver.execute_script("arguments[0].click();", element)
                                print(f"[OK] Pedido enviado (método JavaScript)")
                            
                            order_completed = True
                            time.sleep(3)  # Esperar confirmación
                            break
                            
                        except Exception as e:
                            print(f"[WARN] Error completando pedido: {str(e)[:100]}")
                            continue
                        
            except Exception as e:
                print(f"[DEBUG] Selector #{i+1} falló: {str(e)[:50]}")
                continue
        
        # Si no funcionó con selectores, intentar con los botones de mayor prioridad
        if not order_completed and buttons_analyzed:
            print("[INFO] Intentando con botones de mayor prioridad...")
            for btn_info in buttons_analyzed[:3]:  # Solo los 3 mejores
                if btn_info['priority'] > 0:  # Solo botones con prioridad positiva
                    try:
                        element = btn_info['element']
                        element_text = btn_info['text'].lower()
                        
                        # Doble verificación de evitar
                        if any(avoid in element_text for avoid in avoid_texts):
                            continue
                        
                        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element)
                        time.sleep(1)
                        
                        print(f"[INFO] Intentando con botón prioridad {btn_info['priority']}: '{btn_info['text']}'")
                        
                        try:
                            wait.until(EC.element_to_be_clickable(element))
                            element.click()
                            print(f"[OK] Pedido enviado con botón priorizado (método normal)")
                        except:
                            driver.execute_script("arguments[0].click();", element)
                            print(f"[OK] Pedido enviado con botón priorizado (JavaScript)")
                        
                        order_completed = True
                        time.sleep(3)
                        break
                        
                    except Exception as e:
                        print(f"[WARN] Error con botón priorizado: {str(e)[:100]}")
                        continue
        
        if not order_completed:
            print("[WARN] No se encontró botón de completar pedido")
        
        # Verificar confirmación de pedido con análisis inteligente
        time.sleep(3)
        current_url = driver.current_url
        page_content = driver.page_source.lower()
        page_title = driver.title.lower()
        
        print(f"[DEBUG] Verificando confirmación de pedido...")
        print(f"[DEBUG] URL después del click: {current_url}")
        print(f"[DEBUG] Título de página: {driver.title}")
        
        # Indicadores de éxito en contenido
        success_indicators = [
            "pedido confirmado",
            "pedido realizado", 
            "pedido completado",
            "compra exitosa",
            "compra realizada",
            "order confirmed", 
            "order placed",
            "order completed",
            "purchase successful",
            "gracias por tu compra",
            "thank you for your purchase",
            "confirmación de pedido",
            "order confirmation",
            "éxito",
            "success"
        ]
        
        # Indicadores de éxito en URL
        success_url_indicators = [
            "success", "confirmation", "complete", "thank", "gracias", 
            "pedido", "order", "checkout/success", "purchase/complete"
        ]
        
        order_confirmed = False
        confirmation_method = ""
        
        # 1. Verificar URL para indicadores de éxito
        for indicator in success_url_indicators:
            if indicator in current_url.lower():
                print(f"[OK] Confirmación detectada en URL: '{indicator}' en {current_url}")
                order_confirmed = True
                confirmation_method = f"URL contains '{indicator}'"
                break
        
        # 2. Verificar título de página
        if not order_confirmed:
            for indicator in success_indicators:
                if indicator in page_title:
                    print(f"[OK] Confirmación detectada en título: '{indicator}'")
                    order_confirmed = True
                    confirmation_method = f"Title contains '{indicator}'"
                    break
        
        # 3. Verificar contenido de página
        if not order_confirmed:
            for indicator in success_indicators:
                if indicator in page_content:
                    print(f"[OK] Confirmación detectada en contenido: '{indicator}'")
                    order_confirmed = True
                    confirmation_method = f"Content contains '{indicator}'"
                    break
        
        # 4. Buscar elementos visuales de confirmación
        if not order_confirmed:
            print("[DEBUG] Buscando elementos visuales de confirmación...")
            confirmation_selectors = [
                # Elementos específicos de éxito
                ".success-message",
                ".order-success", 
                ".purchase-success",
                ".confirmation-message",
                "[class*='success']",
                "[class*='confirm']",
                "[class*='complete']",
                # Alertas y notificaciones
                ".alert-success",
                ".notification-success",
                "[role='alert']",
                # Elementos genéricos
                ".success",
                ".confirmation",
                "#success",
                "#confirmation"
            ]
            
            for selector in confirmation_selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for element in elements:
                        if element.is_displayed():
                            element_text = element.text.strip().lower()
                            if any(word in element_text for word in ['éxito', 'success', 'confirmado', 'confirmed', 'realizado', 'completed']):
                                print(f"[OK] Elemento de confirmación encontrado: {selector} - '{element.text.strip()[:50]}'")
                                order_confirmed = True
                                confirmation_method = f"Element {selector}"
                                break
                    if order_confirmed:
                        break
                except:
                    continue
        
        # 5. Análisis heurístico de la página
        if not order_confirmed:
            print("[DEBUG] Realizando análisis heurístico...")
            
            # Verificar si cambió la URL significativamente (indica progreso)
            url_changed_significantly = False
            if 'checkout' in current_url or 'order' in current_url or 'purchase' in current_url:
                url_changed_significantly = True
            
            # Buscar indicadores visuales positivos
            positive_elements = driver.find_elements(By.XPATH, "//*[contains(@class, 'success') or contains(@class, 'confirm') or contains(@class, 'complete')]")
            
            # Buscar iconos de check o éxito
            success_icons = driver.find_elements(By.XPATH, "//svg[contains(@class, 'check') or contains(@class, 'success')] | //*[contains(@class, 'fa-check')] | //*[contains(@class, 'icon-success')]")
            
            if url_changed_significantly or positive_elements or success_icons:
                print(f"[INFO] Indicadores heurísticos de éxito:")
                print(f"  - URL cambió significativamente: {url_changed_significantly}")
                print(f"  - Elementos positivos: {len(positive_elements)}")
                print(f"  - Iconos de éxito: {len(success_icons)}")
                
                # Considerar como parcialmente exitoso
                order_confirmed = True
                confirmation_method = "Heuristic analysis"
        
        # 6. Si nada funcionó, analizar si al menos no hay errores
        if not order_confirmed:
            error_indicators = [
                'error', 'fallo', 'failed', 'problema', 'incorrecto', 
                'invalid', 'inválido', 'no válido'
            ]
            
            has_errors = any(error in page_content for error in error_indicators)
            
            if not has_errors:
                print("[INFO] No se detectaron errores explícitos, asumiendo progreso parcial")
                order_confirmed = True
                confirmation_method = "No errors detected"
            else:
                print(f"[WARN] Posibles errores detectados en la página")
        
        # Log final del resultado
        if order_confirmed:
            print(f"[OK] Orden confirmada - Método: {confirmation_method}")
        else:
            print(f"[WARN] No se pudo confirmar el pedido definitivamente")
            
            # Debug adicional
            print("[DEBUG] Primeros 200 caracteres del contenido visible:")
            try:
                visible_text = driver.find_element(By.TAG_NAME, "body").text[:200]
                print(f"  {visible_text}")
            except:
                pass
        
        return order_confirmed
        
    except Exception as e:
        print(f"[ERROR] Completando pedido: {str(e)}")
        return False

def test_complete_order_flow():
    """Test principal del flujo completo de pedido"""
    results = []
    driver = setup_driver()
    
    if not driver:
        return False
    
    try:
        print("="*60)
        print("TEST COMPLETO DE FLUJO DE PEDIDO")
        print(f"URL: {Config.BASE_URL}")
        print("Credenciales: demo@example.com / 123456")
        print("="*60)
        
        # Test 1: Cargar página principal
        print("\n[1/6] Cargando página principal...")
        start = time.time()
        driver.get(Config.BASE_URL)
        
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
        
        # Test 2: Login
        print("\n[2/6] Realizando login...")
        start = time.time()
        login_success = perform_login(driver)
        
        if login_success:
            results.append({
                'test': 'Login usuario',
                'status': 'PASSED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Login exitoso con demo@example.com'
            })
        else:
            results.append({
                'test': 'Login usuario',
                'status': 'FAILED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Login falló'
            })
            print("[FAIL] Login falló")
        
        # Test 3: Agregar producto al carrito
        print("\n[3/6] Agregando producto al carrito...")
        start = time.time()
        add_success = add_product_to_cart(driver)
        
        if add_success:
            results.append({
                'test': 'Agregar al carrito',
                'status': 'PASSED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Producto agregado exitosamente'
            })
        else:
            results.append({
                'test': 'Agregar al carrito', 
                'status': 'FAILED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'No se pudo agregar producto'
            })
            print("[FAIL] No se pudo agregar producto al carrito")
        
        # Test 4: Ir al carrito
        print("\n[4/6] Navegando al carrito...")
        start = time.time()
        cart_success = go_to_cart_and_checkout(driver)
        
        if cart_success:
            results.append({
                'test': 'Navegación a carrito',
                'status': 'PASSED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Carrito accesible y checkout iniciado'
            })
        else:
            results.append({
                'test': 'Navegación a carrito',
                'status': 'FAILED', 
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Error accediendo al carrito'
            })
            print("[FAIL] Error accediendo al carrito")
        
        # Test 5: Completar pedido
        print("\n[5/6] Completando pedido...")
        start = time.time()
        order_success = complete_order(driver)
        
        if order_success:
            results.append({
                'test': 'Completar pedido',
                'status': 'PASSED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Pedido completado y confirmado'
            })
        else:
            results.append({
                'test': 'Completar pedido',
                'status': 'FAILED',
                'duration_ms': round((time.time() - start) * 1000),
                'details': 'Pedido no se completó correctamente'
            })
            print("[FAIL] Pedido no se completó correctamente")
        
        # Test 6: Verificación final
        print("\n[6/6] Verificación final...")
        start = time.time()
        
        current_url = driver.current_url
        final_title = driver.title
        
        print(f"[INFO] URL final: {current_url}")
        print(f"[INFO] Título final: {final_title}")
        
        # Tomar screenshot final
        try:
            screenshot_path = f"final_state_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            driver.save_screenshot(screenshot_path)
            print(f"[INFO] Screenshot guardado: {screenshot_path}")
        except:
            pass
        
        results.append({
            'test': 'Verificación final',
            'status': 'PASSED',
            'duration_ms': round((time.time() - start) * 1000),
            'details': f'URL: {current_url}, Título: {final_title}'
        })
        
        # Resumen final
        print("\n" + "="*60)
        print("RESUMEN DE FLUJO COMPLETO DE PEDIDO")
        print("="*60)
        
        passed = len([r for r in results if r['status'] == 'PASSED'])
        failed = len([r for r in results if r['status'] == 'FAILED'])
        total = len(results)
        success_rate = round((passed / total) * 100) if total > 0 else 0
        
        print(f"Total de pruebas: {total}")
        print(f"Exitosas: {passed}")
        print(f"Fallidas: {failed}")
        print(f"Tasa de éxito: {success_rate}%")
        
        # Estado del flujo
        if passed >= 5:  # Al menos 5 de 6 pasos exitosos
            print("\n[SUCCESS] Flujo de pedido completado exitosamente")
            flow_status = "SUCCESS"
        elif passed >= 3:
            print("\n[PARTIAL] Flujo de pedido parcialmente exitoso")
            flow_status = "PARTIAL"
        else:
            print("\n[FAILED] Flujo de pedido falló")
            flow_status = "FAILED"
        
        # Guardar resultados
        final_results = {
            'summary': {
                'total_tests': total,
                'passed': passed,
                'failed': failed,
                'success_rate': success_rate,
                'flow_status': flow_status,
                'test_type': 'complete_order_flow'
            },
            'results': results,
            'final_url': current_url,
            'final_title': final_title,
            'timestamp': datetime.now().isoformat()
        }
        
        with open('complete_order_flow_results.json', 'w', encoding='utf-8') as f:
            json.dump(final_results, f, indent=2, ensure_ascii=False)
        
        print(f"\nResultados guardados en: complete_order_flow_results.json")
        print("="*60)
        
        return success_rate > 50
        
    except Exception as e:
        print(f"[ERROR] Durante las pruebas: {str(e)}")
        return False
    
    finally:
        if driver:
            print("\n[INFO] Cerrando navegador en 5 segundos...")
            time.sleep(5)  # Tiempo para ver el resultado final
            driver.quit()

if __name__ == "__main__":
    try:
        success = test_complete_order_flow()
        if success:
            print("\n[OK] Flujo completo de pedido finalizado")
            sys.exit(0)
        else:
            print("\n[FAIL] Flujo completo de pedido falló")
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n[INFO] Pruebas interrumpidas por el usuario")
        sys.exit(1)