# 🌱 VeggieBudino — App Vegana de Planificación de Comidas

## Contexto del proyecto

Estoy creando una **aplicación web progresiva (PWA)** como regalo personal para mi novia, que es vegana. Ella se queda sin ideas a la hora de cocinar, no sabe elaborar recetas nutricionalmente equilibradas y le cuesta organizarse para hacer la compra semanal.

## Objetivo

Una app móvil bonita, práctica y fácil de usar que le permita:

1. **Planificar menús semanales** equilibrados (desayuno, comida, cena, snacks)
2. **Consultar recetas veganas probadas** por profesionales de la nutrición
3. **Generar listas de la compra automáticas** basadas en los menús planificados
4. **Saber cuándo ir al supermercado** y qué comprar cada vez
5. **Asegurar el equilibrio nutricional**: proteínas completas, hierro, B12, omega-3, calcio, zinc, vitamina D
6. **Descubrir recetas nuevas** por categorías: rápidas (<30 min), batch cooking, para invitados, económicas, de temporada

## Requisitos técnicos obligatorios

- **PWA (Progressive Web App)**: debe poder instalarse en el móvil desde el navegador ("Añadir a pantalla de inicio")
- **Icono personalizado**: un icono bonito y reconocible para la pantalla de inicio
- **Hosting en GitHub Pages**: el código vive en un repositorio de GitHub y se sirve desde ahí (gratis)
- **QR de acceso**: generar un código QR que apunte a la URL de la app para que ella lo escanee y la instale
- **Mobile-first**: diseñada primero para móvil, que se vea perfecta en su teléfono
- **Sin backend propio**: todo funciona en el cliente o con APIs externas (como la API de Anthropic para generar contenido dinámico si se decide más adelante)
- **Offline-capable**: las recetas y menús guardados deben ser accesibles sin conexión

## Fuentes de información para las recetas

Las recetas y la información nutricional deben venir de fuentes fiables y contrastadas. Algunas referencias a considerar (discutir conmigo antes de decidir):

- Guías oficiales de nutrición vegana (Academy of Nutrition and Dietetics, Harvard T.H. Chan School of Public Health)
- Libros de referencia como "Vegan for Life" de Jack Norris y Virginia Messina
- Bases de datos nutricionales abiertas (USDA FoodData Central, Open Food Facts)
- Blogs y webs de nutricionistas veganos titulados

**IMPORTANTE**: No incluir recetas inventadas ni información nutricional no verificada. Todo debe estar respaldado por fuentes profesionales.

## Diseño y estética

- Estética **fresca, natural y moderna** (inspiración en apps como Mealime, Forks Over Knives, o Yummly)
- Paleta de colores: tonos verdes, terrosos y cálidos. Nada agresivo.
- Tipografía legible y bonita en móvil
- Iconografía clara y minimalista
- Interfaz intuitiva: mi novia no es técnica, tiene que ser facilísima de usar
- **Quiero participar en las decisiones de diseño**: enséñame opciones antes de implementar

## ⚠️ REGLA FUNDAMENTAL DE TRABAJO ⚠️

**NO empieces a generar código ni a crear archivos sin consultarme antes.**

Tu forma de trabajar en este proyecto debe ser:

1. **Pregúntame antes de actuar**: antes de crear cualquier archivo, estructura, o escribir código, explícame qué vas a hacer y por qué, y espera mi aprobación.
2. **Propón opciones**: cuando haya decisiones de diseño, tecnología, estructura o contenido, dame 2-3 opciones con pros y contras para que yo elija.
3. **Avanza paso a paso**: no hagas todo de golpe. Vamos fase por fase:
   - Fase 1: Definir juntos la estructura del proyecto y las funcionalidades exactas
   - Fase 2: Diseño visual (paleta, tipografía, layout) — enséñame mockups o bocetos
   - Fase 3: Estructura técnica del código
   - Fase 4: Desarrollo feature por feature, siempre consultándome
   - Fase 5: Testing, QR, despliegue en GitHub Pages
4. **Explícame las cosas**: si propones algo técnico, explícamelo de forma sencilla. No soy un experto total.
5. **Valida conmigo las recetas y contenido**: antes de incluir recetas o información nutricional, enséñamelas para que las revise.

## Stack tecnológico sugerido (a confirmar contigo)

- **Framework**: React con Vite (rápido, moderno, ideal para PWA) — o alternativas a discutir
- **Estilos**: Tailwind CSS (o lo que decidamos juntos)
- **PWA**: Service Worker + manifest.json para instalación y offline
- **Datos**: JSON local con las recetas y datos nutricionales (escalable a API en el futuro)
- **Despliegue**: GitHub Pages (con GitHub Actions para deploy automático)

## Ubicación del proyecto

📁 La carpeta del proyecto está en el escritorio: `~/Desktop/veggiebudino`

(Ajustar esta ruta si es diferente en tu sistema)

---

## Primera tarea

Antes de escribir una sola línea de código, quiero que me hagas las siguientes preguntas para entender mejor lo que necesito:

1. **Funcionalidades**: ¿Cuáles de las features que he descrito son prioritarias para la primera versión? ¿Hay alguna que quiera añadir o quitar?
2. **Diseño**: ¿Tengo alguna referencia visual o app que me guste como inspiración?
3. **Recetas**: ¿Quiero empezar con un número concreto de recetas? ¿De qué tipo de cocina principalmente?
4. **Idioma**: ¿La app será solo en español o también en inglés?
5. **Stack técnico**: ¿Tengo preferencia por algún framework o quiero que le recomiende el mejor para este caso?
6. **Nombre de la app**: Ya decidido: **VeggieBudino** (juego de palabras entre Veggie, Buddy y budino —postre en italiano—). No cambiar.

Empieza SIEMPRE preguntando. No asumas nada.
