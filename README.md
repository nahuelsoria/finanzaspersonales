# Aplicación de Gestión de Finanzas Personales

## Descripción
Esta aplicación web de gestión de finanzas personales permite a los usuarios llevar un registro detallado de sus ingresos y gastos. Ofrece una interfaz intuitiva para añadir, editar y eliminar transacciones, así como visualizar resúmenes y gráficos de la situación financiera personal.

## Características principales
- Registro de ingresos y gastos
- Categorización de transacciones
- Visualización de balance actual
- Gráficos de distribución de gastos e ingresos
- Modo oscuro para mejor visibilidad en diferentes condiciones de luz
- Interfaz responsiva adaptable a diferentes dispositivos

## Tecnologías utilizadas
- **React**: Biblioteca de JavaScript para construir la interfaz de usuario.
- **Firebase**:
  - Firestore para la base de datos en tiempo real.
  - Autenticación para el manejo de usuarios.
- **Tailwind CSS**: Framework de CSS para el diseño y estilos.
- **Lucide React**: Biblioteca de iconos.
- **Recharts**: Biblioteca para crear gráficos interactivos.
- **Framer Motion**: Biblioteca para animaciones en React.

## Instalación y configuración
1. Clona el repositorio:
   ```
   git clone https://github.com/nahuelsoria/finanzaspersonales.git
   ```
2. Instala las dependencias:
   ```
   npm install
   ```
3. Configura las variables de entorno para Firebase en un archivo `.env`:
   ```
   REACT_APP_FIREBASE_API_KEY=tu_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=tu_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=tu_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=tu_app_id
   ```
4. Inicia la aplicación en modo de desarrollo:
   ```
   npm start
   ```

## Uso
1. Regístrate o inicia sesión en la aplicación.
2. Utiliza el formulario para añadir nuevas transacciones, especificando descripción, monto y categoría.
3. Visualiza tus transacciones recientes y el balance actual en la página principal.
4. Explora los gráficos de distribución para obtener insights sobre tus patrones de gasto e ingreso.
5. Edita o elimina transacciones según sea necesario.
6. Utiliza el botón de cambio de tema para alternar entre modo claro y oscuro.

## Licencia
Este proyecto es de libre uso y está disponible bajo la licencia MIT. Puedes utilizar, modificar y distribuir este software sin restricciones, siempre y cuando se incluya el aviso de copyright original y la declaración de permisos en todas las copias o partes sustanciales del software.

## Contacto
Jorge Nahuel Soria
E-mail:jorgenahuelsoria@gmail.com
[GitHub](https://github.com/nahuelsoria/)

# Mejoras a desarrollar

- [X] Modo oscuro
- [X] Añadir categorías
- [X] Añadir balance
- [X] Paginación de transacciones: Implementa paginación para la lista de transacciones, especialmente si el usuario tiene muchas entradas. Esto mejorará el rendimiento y la usabilidad en dispositivos móviles.
- [X] Añadir iconos
- [ ] Añadir gráficos de ingresos y gastos
- [ ] Añadir gráficos de ingresos y gastos por categorías
- [ ] Añadir gráficos de ingresos y gastos por subcategorías
- [ ] Filtros y búsqueda: Agrega la capacidad de filtrar transacciones por fecha, categoría o tipo (ingreso/gasto). Implementa una función de búsqueda para encontrar transacciones específicas.
- [ ] Exportar datos: Permite a los usuarios exportar sus datos a un archivo CSV o PDF para su uso en herramientas externas o para su almacenamiento en la nube.
- [ ] Añadir alertas: Permite a los usuarios añadir alertas para sus gastos e ingresos, para que sepan cuando han gastado una cantidad de dinero o han ganado una cantidad de dinero.
- [ ] Añadir meta de ahorro: Permite a los usuarios añadir metas de ahorro para sus gastos e ingresos, para que sepan cuando han ahorrado una cantidad de dinero o han ganado una cantidad de dinero.
- [ ] Añadir presupuesto: Permite a los usuarios añadir presupuestos para sus gastos e ingresos, para que sepan cuando han gastado una cantidad de dinero o han ganado una cantidad de dinero.
- [ ] Añadir proyecciones de gastos e ingresos: Permite a los usuarios añadir proyecciones de gastos e ingresos, para que sepan cuando van a gastar una cantidad de dinero o van a ganar una cantidad de dinero.
- [ ] Añadir recomendaciones de ahorro e inversión: Permite a los usuarios añadir recomendaciones de ahorro e inversión, para que sepan cuando van a ahorrar una cantidad de dinero o van a invertir una cantidad de dinero.
- [ ] Añadir consejos de ahorro e inversión: Permite a los usuarios añadir consejos de ahorro e inversión, para que sepan cuando van a ahorrar una cantidad de dinero o van a invertir una cantidad de dinero.
- [ ] Mejoras en la autenticación: Implementa autenticación con redes sociales.
- [ ] Mejoras en la interfaz de usuario: Implementa una interfaz de usuario más intuitiva y amigable.
- [ ] Mejoras en la usabilidad: Implementa una usabilidad más sencilla y eficiente.
- [ ] Mejoras en la seguridad: Implementa una seguridad más robusta.
- [ ] Mejoras en la performance: Implementa una performance más eficiente.
- [ ] Mejoras en la accesibilidad: Implementa una accesibilidad más sencilla.
- [ ] Temas personalizables: Permite a los usuarios personalizar los colores o elegir entre varios temas predefinidos.
- [ ] Modo offline: Implementa funcionalidad offline utilizando Service Workers y almacenamiento local.
- [ ] Internacionalización (i18n): Agrega soporte para múltiples idiomas. Implementa formatos de moneda y fecha locales.
- [ ] Progressive Web App (PWA): Convierte la aplicación en una PWA para permitir la instalación en dispositivos móviles.
- [ ] Optimización de SEO: Mejora el SEO para la página de inicio pública de tu aplicación.
- [ ] Accesibilidad: Asegúrate de que la aplicación sea accesible, siguiendo las pautas WCAG.