# Configuración para Selenium
import os

class Config:
    # URLs del sistema
    BASE_URL = "http://localhost:5176"
    API_BASE_URL = "http://localhost:3000"
    
    # Paths
    CHROME_BINARY_PATH = r"C:\Users\eddyr\OneDrive\Escritorio\chrome-win64\chrome.exe"
    CHROMEDRIVER_PATH = r"C:\Users\eddyr\OneDrive\Escritorio\software-sales-system\qa-tools\selenium\chromedriver.exe"
    
    # Timeouts
    IMPLICIT_WAIT = 10
    EXPLICIT_WAIT = 15
    PAGE_LOAD_TIMEOUT = 30
    
    # Usuario de prueba
    TEST_USER = {
        "email": "demo@example.com",
        "password": "123456",
        "name": "Usuario Demo"
    }
    
    # Nuevo usuario para registro
    NEW_USER = {
        "email": "test@selenium.com",
        "password": "123456",
        "name": "Usuario Selenium Test"
    }
    
    # Chrome options
    CHROME_OPTIONS = [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--window-size=1920,1080",
        "--start-maximized"
    ]
    
    # Para ejecutar en modo headless (sin interfaz gráfica)
    HEADLESS = False  # Cambiar a True para ejecutar sin interfaz