"""
Test simple de Selenium para verificar configuración
Autor: Eddy Alexander Ramirez Lorenzana
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

def test_selenium_basic():
    """Test básico para verificar que Selenium funciona"""
    driver = None
    
    try:
        print("Configurando Chrome...")
        
        # Opciones de Chrome
        chrome_options = Options()
        chrome_options.binary_location = r"C:\Users\eddyr\OneDrive\Escritorio\chrome-win64\chrome.exe"
        chrome_options.add_argument("--window-size=1920,1080")
        
        # Usar webdriver-manager
        print("Descargando ChromeDriver compatible...")
        service = Service(ChromeDriverManager().install())
        
        print("Iniciando Chrome...")
        driver = webdriver.Chrome(service=service, options=chrome_options)
        
        print("Navegando al sistema...")
        driver.get("http://localhost:5176")
        time.sleep(3)
        
        print(f"Titulo de la pagina: {driver.title}")
        print(f"URL actual: {driver.current_url}")
        
        # Buscar algún elemento
        try:
            header = driver.find_element(By.TAG_NAME, "header")
            print("Header encontrado correctamente")
        except:
            print("Header no encontrado")
        
        print("TEST EXITOSO: Selenium funcionando correctamente")
        return True
        
    except Exception as e:
        print(f"ERROR: {e}")
        return False
        
    finally:
        if driver:
            driver.quit()
            print("Driver cerrado")

if __name__ == "__main__":
    print("=== TEST DE CONFIGURACION SELENIUM ===")
    success = test_selenium_basic()
    exit(0 if success else 1)