# Un poquito de miel

Una PWA de regalo con un osito ilustrado original, notitas sorpresa y un frasquito local para guardar recuerdos bonitos. No requiere cuenta ni servidor; los recuerdos se guardan en el dispositivo y la app puede abrirse sin conexión después de la primera visita.

## Probar localmente

Desde esta carpeta, inicia un servidor web local (por ejemplo, la extensión Live Server de VS Code) y abre su dirección `localhost`. El service worker no funciona si se abre el HTML directamente como `file://`.

## Publicar en GitHub Pages

Sube el contenido de esta carpeta a un repositorio y activa **Settings → Pages → Deploy from a branch**, usando `main` y `/(root)`. Pages sirve por HTTPS, necesario para instalar y usar el modo sin conexión.

Los recuerdos son privados de ese navegador/dispositivo; esta versión no los sincroniza entre teléfonos.
