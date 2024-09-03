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
   git clone [URL_DEL_REPOSITORIO]
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
- [ ] Añadir iconos
- [ ] Añadir gráficos de ingresos y gastos
- [ ] Añadir gráficos de ingresos y gastos por categorías
- [ ] Añadir gráficos de ingresos y gastos por subcategorías