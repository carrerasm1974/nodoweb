// Script para el sitio web de Nodo Reliability

// Variable para almacenar las traducciones
let translations = {};

// Idioma actual
let currentLanguage = 'es';

// Idiomas disponibles
const availableLanguages = ['es', 'en', 'pt'];

// Cargar el archivo de traducciones
async function loadTranslations() {
  try {
    const response = await fetch('js/translations.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    translations = await response.json();
    console.log('Traducciones cargadas correctamente');
    
    // Inicializar la página con las traducciones
    initializeLanguage();
  } catch (error) {
    console.error('Error al cargar las traducciones:', error);
  }
}

// Inicializar el idioma de la página
function initializeLanguage() {
  // Recuperar el idioma guardado o usar el predeterminado
  const savedLanguage = localStorage.getItem('preferredLanguage');
  if (savedLanguage && availableLanguages.includes(savedLanguage)) {
    currentLanguage = savedLanguage;
  }
  
  // Actualizar el selector de idioma
  const languageSelector = document.getElementById('languageSelector');
  if (languageSelector) {
    languageSelector.value = currentLanguage;
  }
  
  // Actualizar el contenido de la página
  updatePageContent();
}

// Función para cambiar el idioma
function changeLanguage(lang) {
  if (availableLanguages.includes(lang)) {
    currentLanguage = lang;
    updatePageContent();
    
    // Guardar preferencia de idioma en localStorage
    localStorage.setItem('preferredLanguage', lang);
  }
}

// Función para obtener una traducción por clave anidada
function getTranslation(key) {
  // Dividir la clave en partes (por ejemplo, "nav.home" -> ["nav", "home"])
  const parts = key.split('.');
  
  // Comenzar desde el objeto de traducciones del idioma actual
  let value = translations[currentLanguage];
  
  // Navegar a través de las partes de la clave
  for (const part of parts) {
    if (value && value[part] !== undefined) {
      value = value[part];
    } else {
      console.warn(`Traducción no encontrada para la clave: ${key} en idioma: ${currentLanguage}`);
      return key; // Devolver la clave como fallback
    }
  }
  
  return value;
}

// Función para actualizar el contenido de la página
function updatePageContent() {
  // Actualizar elementos con atributo data-i18n
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key);
    
    if (translation) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // Actualizar elementos con atributo data-i18n-attr (para atributos como title, alt, etc.)
  const attrElements = document.querySelectorAll('[data-i18n-attr]');
  
  attrElements.forEach(element => {
    const attrData = element.getAttribute('data-i18n-attr').split(':');
    if (attrData.length === 2) {
      const attr = attrData[0];
      const key = attrData[1];
      const translation = getTranslation(key);
      
      if (translation) {
        element.setAttribute(attr, translation);
      }
    }
  });
  
  // Actualizar el submenú de soluciones
  updateSolutionsSubmenu();
}

// Función para actualizar el submenú de soluciones
function updateSolutionsSubmenu() {
  const submenu = document.querySelector('.submenu');
  if (submenu) {
    const items = submenu.querySelectorAll('a');
    items.forEach(item => {
      const key = item.getAttribute('data-i18n');
      if (key) {
        const translation = getTranslation(key);
        if (translation) {
          item.textContent = translation;
        }
      }
    });
  }
}

// Inicializar el selector de idioma
function initLanguageSelector() {
  const languageSelector = document.getElementById('languageSelector');
  if (languageSelector) {
    languageSelector.addEventListener('change', function() {
      changeLanguage(this.value);
    });
  }
}

// Función para mostrar/ocultar el submenú de soluciones
function toggleSolutionsSubmenu() {
  const submenu = document.querySelector('.submenu');
  if (submenu) {
    submenu.classList.toggle('show');
  }
}

// Inicializar el sitio cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar traducciones
    loadTranslations();
    
    // Toggle mobile navigation
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }
    
    // Configurar enlaces de descarga
    setupDownloadLinks();
    
    // Inicializar selector de idioma
    initLanguageSelector();
    
    // Configurar el submenú de soluciones
    setupSolutionsSubmenu();
});

// Función para configurar el submenú de soluciones
function setupSolutionsSubmenu() {
    const solutionsLinks = document.querySelectorAll('nav ul li a.has-submenu');
    
    solutionsLinks.forEach(link => {
        const parentLi = link.parentNode;
        const submenu = parentLi.querySelector('.submenu');
        
        if (submenu) {
            // Añadir evento para mostrar/ocultar el submenú
            parentLi.addEventListener('mouseenter', function() {
                submenu.classList.add('show');
            });
            
            parentLi.addEventListener('mouseleave', function() {
                submenu.classList.remove('show');
            });
            
            // Para dispositivos táctiles
            link.addEventListener('click', function(e) {
                // Si el submenú no está visible, prevenir la navegación y mostrar el submenú
                if (!submenu.classList.contains('show') && window.innerWidth <= 768) {
                    e.preventDefault();
                    submenu.classList.add('show');
                }
            });
        }
    });
}

// Función para configurar los enlaces de descarga
function setupDownloadLinks() {
    // Monitoreo de Transformadores
    const monitoreoGasesLink = document.querySelector('a[href="#"][class="download-btn"]:nth-of-type(1)');
    if (monitoreoGasesLink) {
        monitoreoGasesLink.href = "downloads/ficha_tecnica_monitoreo_gases.pdf";
        monitoreoGasesLink.setAttribute('download', '');
    }
    
    const monitoreoTemperaturaLink = document.querySelector('a[href="#"][class="download-btn"]:nth-of-type(2)');
    if (monitoreoTemperaturaLink) {
        monitoreoTemperaturaLink.href = "downloads/ficha_tecnica_monitoreo_temperatura.pdf";
        monitoreoTemperaturaLink.setAttribute('download', '');
    }
    
    const monitoreoBushingsLink = document.querySelector('a[href="#"][class="download-btn"]:nth-of-type(3)');
    if (monitoreoBushingsLink) {
        monitoreoBushingsLink.href = "downloads/ficha_tecnica_monitoreo_bushings.pdf";
        monitoreoBushingsLink.setAttribute('download', '');
    }
}
