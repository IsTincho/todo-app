# ToDo App 📝✨

¡Bienvenido a la ToDo App! Esta App es una herramienta para gestionar tus tareas de manera sencilla y eficiente, permitiéndote agregar, editar y eliminar tareas rápidamente. Además, cuenta con autenticación de usuario para una experiencia personalizada.

## 🚀 Tecnologías Usadas

- **React**: Librería para la construcción de interfaces de usuario.
- **Tailwind CSS**: Framework de CSS para un diseño rápido y personalizado.
- **Axios**: Cliente HTTP para hacer peticiones a la API.
- **Node.js**: Entorno de ejecución para el backend.
- **Express**: Framework para la creación del servidor backend.
- **MongoDB**: Base de datos NoSQL utilizada para almacenar las tareas y usuarios.
- **JWT (JSON Web Tokens)**: Autenticación basada en tokens para asegurar el acceso a la app.

## 🎯 Funcionalidades

- **Registro e inicio de sesión**: Los usuarios pueden crear una cuenta y acceder a la aplicación de manera segura.
- **Gestión de tareas**: Agrega, edita y elimina tareas fácilmente.
- **Marcar tareas como completadas**: Lleva un seguimiento visual del progreso de tus tareas.
- **Autenticación segura**: Solo los usuarios autenticados pueden acceder a sus tareas personales.
- **Responsive**: Optimizado para ser utilizado en dispositivos móviles y de escritorio.

## 🛠 USO O INSTALACION

### Usar la App Web

Para utilizar la App Web, simplemente visita el deploy del frontend en:  
[Deploy Firebase](https://todo-app-b1d40.web.app/).

Todo debería funcionar correctamente y puedes empezar a gestionar tus tareas de inmediato.

### Configurar en tu local

Si deseas configurar la app en tu entorno local, sigue estos pasos después de clonar el repositorio:

1. **Clona el repositorio**:

   git clone <URL DEL REPOSITORIO>

2. **Instala las dependencias**:

   - En el directorio raíz del proyecto, corre:

     npm install

3. **Configura el backend**:

   - Crea un archivo `.env` en la raíz del backend y agrega las siguientes variables de entorno:

     MONGO_URI=<URL DE TU MONGO DB>
     JWT_SECRET=<TU SECRETO PARA JWT>
     PORT=5000
     API_CLIENT=<API CLIENT>
     API_SECRET=<API SECRET>

4. **Corre el servidor backend**:

   - Entra al directorio del backend:

     cd backend

   - Inicia el servidor:

     npm run start

   - Esto levantará el servidor en el puerto 5000 (por defecto).

5. **Configura el frontend**:

   - Crea un archivo `.env` en la raíz del frontend y agrega las siguientes variables de entorno:

     REACT_APP_API_URL=<direccion-del-deploy>
     REACT_APP_API_URL_DEV= http://localhost:5000
     REACT_APP_API_CLIENT=<API CLIENT>
     REACT_APP_API_SECRET=<API SECRET>

6. **Corre el frontend**:

   - Entra al directorio del frontend:

     cd frontend

   - Inicia la aplicación de React:

     npm run start

   Esto abrirá la aplicación en tu navegador local en `http://localhost:3000`.

¡Y listo! Ahora puedes usar la ToDo App en tu máquina local.

## 🧑‍💻 Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar la app o agregar nuevas funcionalidades, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/tu-nueva-caracteristica`).
3. Realiza los cambios y haz un commit (`git commit -m 'Añadí nueva característica'`).
4. Empuja tu rama al repositorio de tu fork (`git push origin feature/tu-nueva-caracteristica`).
5. Abre un Pull Request desde tu fork al repositorio principal.

Recuerda que las contribuciones deben seguir las mejores prácticas de código y asegurarse de que los tests estén pasando correctamente.
