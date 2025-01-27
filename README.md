
# Frontend de Notas

## Descripción

Este es el frontend para la aplicación de gestión de notas. Proporciona funcionalidades para manejar notas, etiquetas y usuarios, con opciones como archivar nota, desarchivar nota, y búsqueda avanzada.

----------

## Cómo probar la aplicación

### 1. Configuración del Proyecto

#### Clonar el repositorio:

Primero, clona el repositorio del proyecto en tu máquina local:

```
git clone https://github.com/GutberBG/FENotes.git
cd FENotes
```

#### Instalar las dependencias:

Ejecuta el siguiente comando para instalar las dependencias necesarias del proyecto:

```
npm install
```

#### Configurar las variables de entorno:

Asegúrate de configurar correctamente el archivo `src/environments/environment.ts` para que apunte al backend correspondiente. Ejemplo:

```
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api', // Cambia esta URL según tu configuración
};
```

### 2. Ejecutar la aplicación

Para iniciar el proyecto en tu entorno local, ejecuta:

```
ng serve
```

Esto iniciará el frontend en: http://localhost:4200.

----------

## Funcionalidades

### Gestión de Usuarios

1.  **Autenticación de usuario:**
    
    -   Permite al usuario iniciar sesión para acceder a sus notas.
        
    -   Integrado con JWT para autenticación segura.
    -   Permite crear un usuario para usar la aplicación
        
 

### Gestión de Notas

1.  **Crear, editar y eliminar notas:**
    
    -   Administra el contenido de manera sencilla e intuitiva.
        
2.  **Archivo y desarchivo de notas:**
    
    -   Mantiene las notas organizadas moviéndolas a una sección de archivadas.
        
3.  **Búsqueda avanzada:**
    
    -   Filtra notas por título, contenido o etiquetas para una gestión eficiente.
        
4.  **Sincronización con el backend:**
    
    -   Todos los cambios realizados se sincronizan con la API.
        

### Etiquetas

        
1.  **Listado de etiquetas disponibles:**
    
    -   Muestra las etiquetas creadas por el usuario.
        
        

----------

## Notas Importantes

1.  **Backend:**
    
    -   Asegúrate de que el backend esté configurado correctamente y corriendo en la dirección especificada por `apiUrl` en el archivo de entornos.
        
2.  **Dependencias:**
    
    -   Revisa y actualiza las dependencias regularmente usando:
        
        ```
        npm update
        ```
        
3.  **Ambientes de Producción:**
    
    -   Usa el archivo `src/environments/environment.prod.ts` para especificar la configuración de producción.
        

----------

## Tecnologías Utilizadas

-   Angular 15+
    
-   Tailwind CSS
    
-   TypeScript
    