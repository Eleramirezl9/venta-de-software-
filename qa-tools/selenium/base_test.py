"""
Base test class para Selenium WebDriver
Autor: Eddy Alexander Ramirez Lorenzana
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time
import os
from config import Config

class BaseTest:
    def __init__(self):
        self.driver = None
        self.wait = None
        
    def setup_driver(self):
        """Configurar el driver de Chrome"""
        try:
            # Configurar opciones de Chrome
            chrome_options = Options()
            
            # Especificar la ruta al ejecutable de Chrome
            chrome_options.binary_location = Config.CHROME_BINARY_PATH
            
            # Agregar opciones adicionales
            for option in Config.CHROME_OPTIONS:
                chrome_options.add_argument(option)
                
            if Config.HEADLESS:
                chrome_options.add_argument("--headless")
            
            # Usar webdriver-manager para descargar automáticamente la versión correcta
            from webdriver_manager.chrome import ChromeDriverManager
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Configurar timeouts
            self.driver.implicitly_wait(Config.IMPLICIT_WAIT)
            self.driver.set_page_load_timeout(Config.PAGE_LOAD_TIMEOUT)
            
            # Configurar WebDriverWait
            self.wait = WebDriverWait(self.driver, Config.EXPLICIT_WAIT)
            
            print("✅ Driver de Chrome configurado exitosamente")
            return True
            
        except Exception as e:
            print(f"❌ Error configurando driver: {e}")
            return False
    
    def teardown_driver(self):
        """Cerrar el driver"""
        if self.driver:
            self.driver.quit()
            print("🔌 Driver cerrado")
    
    def navigate_to(self, url):
        """Navegar a una URL"""
        try:
            full_url = f"{Config.BASE_URL}{url}" if not url.startswith('http') else url
            self.driver.get(full_url)
            print(f"🌐 Navegando a: {full_url}")
            return True
        except Exception as e:
            print(f"❌ Error navegando a {url}: {e}")
            return False
    
    def wait_for_element(self, by, value, timeout=None):
        """Esperar a que aparezca un elemento"""
        try:
            timeout = timeout or Config.EXPLICIT_WAIT
            wait = WebDriverWait(self.driver, timeout)
            element = wait.until(EC.presence_of_element_located((by, value)))
            return element
        except TimeoutException:
            print(f"⏰ Timeout esperando elemento: {by}={value}")
            return None
    
    def wait_for_clickable(self, by, value, timeout=None):
        """Esperar a que un elemento sea clickeable"""
        try:
            timeout = timeout or Config.EXPLICIT_WAIT
            wait = WebDriverWait(self.driver, timeout)
            element = wait.until(EC.element_to_be_clickable((by, value)))
            return element
        except TimeoutException:
            print(f"⏰ Timeout esperando elemento clickeable: {by}={value}")
            return None
    
    def find_element_safe(self, by, value):
        """Buscar elemento de forma segura"""
        try:
            element = self.driver.find_element(by, value)
            return element
        except NoSuchElementException:
            print(f"❌ Elemento no encontrado: {by}={value}")
            return None
    
    def take_screenshot(self, name):
        """Tomar captura de pantalla"""
        try:
            screenshot_dir = "screenshots"
            if not os.path.exists(screenshot_dir):
                os.makedirs(screenshot_dir)
            
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            filename = f"{screenshot_dir}/{name}_{timestamp}.png"
            
            self.driver.save_screenshot(filename)
            print(f"📸 Screenshot guardada: {filename}")
            return filename
        except Exception as e:
            print(f"❌ Error tomando screenshot: {e}")
            return None
    
    def login(self, email=None, password=None):
        """Login automático"""
        try:
            email = email or Config.TEST_USER["email"]
            password = password or Config.TEST_USER["password"]
            
            # Navegar a login
            self.navigate_to("/login")
            time.sleep(2)
            
            # Llenar formulario
            email_field = self.wait_for_element(By.NAME, "email")
            if email_field:
                email_field.clear()
                email_field.send_keys(email)
            
            password_field = self.find_element_safe(By.NAME, "password")
            if password_field:
                password_field.clear()
                password_field.send_keys(password)
            
            # Submit
            submit_button = self.wait_for_clickable(By.CSS_SELECTOR, "button[type='submit']")
            if submit_button:
                submit_button.click()
                time.sleep(3)
                return True
            
            return False
            
        except Exception as e:
            print(f"❌ Error en login: {e}")
            return False
    
    def is_logged_in(self):
        """Verificar si el usuario está logueado"""
        try:
            # Buscar elemento que solo aparece cuando está logueado
            user_menu = self.find_element_safe(By.CSS_SELECTOR, "[data-testid='user-menu'], .user-menu")
            return user_menu is not None
        except:
            return False